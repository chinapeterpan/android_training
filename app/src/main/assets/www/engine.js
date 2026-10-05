// 语音识别引擎：Vosk WASM + 动态 grammar 约束
//
// 设计要点：每进入下一步就重建 recognizer，把 grammar 收窄到「下一个期望数字」，
// 并把多种读法（数字、汉字、同音字）都作为同义词加入。束搜索只在这些词里选，
// 因此误触发率远低于「识别全部数字再比对」的思路。

import { spellingsFor, parseChineseNumber } from './numbers.js';

const TARGET_SR = 16000;

export class CounterEngine {
  constructor(opts = {}) {
    this.recognizer = null;
    this.model = null;
    this.stream = null;
    this.audioCtx = null;
    this.sourceNode = null;
    this.procNode = null;
    this.workletNode = null;
    this.silentGain = null;
    this.mediaStream = null;
    this.sampleRate = TARGET_SR;
    this.listening = false;

    this.expected = 1;      // 当前期望的数字
    this.maxCount = opts.maxCount ?? 10;
    this.onHit = opts.onHit || (() => {});
    this.onMiss = opts.onMiss || (() => {});
    this.onState = opts.onState || (() => {});
    this.onError = opts.onError || (() => {});
    this.onPartial = opts.onPartial || (() => {});
    this.onReady = opts.onReady || (() => {});
    this.onProgress = opts.onProgress || (() => {});
  }

  /**
   * 加载模型。
   *优先用分片（build_for_netlify.py 生成），因为 Netlify 对单个大文件
   * 可能卡住部署；分片后每个文件都很小，部署稳妥。
   * 没有分片时回退到单个 model.tar.gz。
   */
  async load() {
    this.onState('loading');
    const url = await this.resolveModelUrl();
    this.model = await Vosk.createModel(url);
    this.onReady();
    return this.model;
  }

  /** 拼装分片为一个 Blob URL；不存在分片则返回 null */
  async resolveModelUrl() {
    const manifestUrl = 'model.manifest.json';

    let manifest;
    try {
      const resp = await fetch(manifestUrl + '?t=' + Date.now(), { cache: 'no-store' });
      if (!resp.ok) return null;
      manifest = await resp.json();
    } catch (_) {
      return null; // 本地未生成清单，走单包模式
    }

    if (!manifest || !manifest.parts || !manifest.parts.length) return null;

    this.onProgress('正在下载模型', 0);
    const buffers = [];
    let received = 0;

    for (let i = 0; i < manifest.parts.length; i++) {
      const part = manifest.parts[i];
      const resp = await fetch(part.file);
      if (!resp.ok) throw new Error('分片下载失败：' + part.file);
      const buf = await resp.arrayBuffer();
      buffers.push(buf);
      received += buf.byteLength;
      this.onProgress('正在下载模型', received / manifest.totalSize);
    }

    this.onProgress('正在初始化模型', 1);
    return URL.createObjectURL(new Blob(buffers, { type: 'application/gzip' }));
  }

  /**
   * 为当前期望值构建 grammar。
   * Vosk grammar 支持同义组：[ "词A", "词B" ] 表示这几个词等价，任一命中即可。
   * 这样「幺」和「一」共用一个槽位。
   */
  buildGrammar() {
    const spellings = spellingsFor(this.expected);
    return JSON.stringify([spellings, '[illegible]']);
  }

  /** 重建底层 recognizer 以应用新的 grammar */
  rebuildRecognizer() {
    if (!this.model) return;
    if (this.recognizer) {
      // 注意：API 是 remove()，不是 free()。用错会导致每步都泄漏内存。
      try { this.recognizer.remove(); } catch (_) {}
    }
    this.recognizer = new this.model.KaldiRecognizer(TARGET_SR, this.buildGrammar());
    this.recognizer.setWords(false);
    this.bindRecognizerEvents();
  }

  bindRecognizerEvents() {
    this.recognizer.on('result', (msg) => {
      const text = (msg.result && msg.result.text || '').trim();
      if (!text) return;
      this.onPartial('');
      this.handleResult(text);
    });

    this.recognizer.on('partialresult', (msg) => {
      const p = (msg.result && msg.result.partial || '').trim();
      this.onPartial(p);
    });
  }

  handleResult(text) {
    const n = parseChineseNumber(text);

    if (n === null) return;

    if (n === this.expected) {
      this.onHit(n);
      this.advance();
    } else {
      // 听到了别的数字：忽略，不扣分（避免用户连报时误判）
      this.onMiss(n);
    }
  }

  advance() {
    if (this.expected >= this.maxCount) {
      this.onHit(null, true); // 通知完成
      this.expected = 1;
    } else {
      this.expected += 1;
    }
    this.onState(this.expected);
    this.rebuildRecognizer();
  }

  reset() {
    this.expected = 1;
    this.onState(1);
    // 重建 recognizer 即可清空解码状态（API 没有 reset() 方法）
    if (this.model) this.rebuildRecognizer();
  }

  /** 开始录音 */
  async start() {
    if (this.listening) return;
    this.rebuildRecognizer();

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 浏览器实际采样率通常是 44.1k/48k。recognizer 构造时已按16k 建立，
    // 这里把真实采样率一并告知，由库内部做重采样，比自己插值更可靠。
    this.sampleRate = this.audioCtx.sampleRate;

    this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);

    const feed = (pcm) => {
      try {
        // 注意：必须用 acceptWaveformFloat 并传真实采样率，
        // acceptWaveform 只接受 AudioBuffer，且不会告诉你采样率。
        this.recognizer.acceptWaveformFloat(pcm, this.sampleRate);
      } catch (e) {
        this.onError(e);
      }
    };

    // 优先用 AudioWorklet（延迟低、更稳），不支持时降级到 ScriptProcessor
    if (this.audioCtx.audioWorklet) {
      await this.audioCtx.audioWorklet.addModule('capture-worklet.js');
      this.workletNode = new AudioWorkletNode(this.audioCtx, 'capture-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        channelCount: 1,
        processorOptions: { frameSize: 2048 },
      });
      this.workletNode.port.onmessage = (e) => {
        if (this.listening) feed(e.data);
      };
      this.sourceNode.connect(this.workletNode);
      // Worklet 必须连到destination 才会被调度，但不接扬声器避免回声
      const silent = this.audioCtx.createGain();
      silent.gain.value = 0;
      this.workletNode.connect(silent).connect(this.audioCtx.destination);
      this.silentGain = silent;
    } else {
      this.procNode = this.audioCtx.createScriptProcessor(4096, 1, 1);
      this.procNode.onaudioprocess = (event) => {
        if (this.listening) feed(event.inputBuffer.getChannelData(0));
      };
      this.sourceNode.connect(this.procNode);
      this.procNode.connect(this.audioCtx.destination);
    }

    this.listening = true;
    this.onState(this.expected);
  }

  stop() {
    this.listening = false;
    try { this.procNode && this.procNode.disconnect(); } catch (_) {}
    try { this.workletNode && this.workletNode.disconnect(); } catch (_) {}
    try { this.silentGain && this.silentGain.disconnect(); } catch (_) {}
    try { this.sourceNode && this.sourceNode.disconnect(); } catch (_) {}
    try { this.audioCtx && this.audioCtx.close(); } catch (_) {}
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
    }
    this.procNode = this.workletNode = this.silentGain = null;
    this.sourceNode = this.audioCtx = null;
  }
}