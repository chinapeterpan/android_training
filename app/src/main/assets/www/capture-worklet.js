// 音频采集 worklet：把麦克风数据以 128采样点一批送到主线程。
// 用 AudioWorklet 而非已废弃的 ScriptProcessor，手机上延迟更低、更稳定。

class CaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.frame = options.processorOptions.frameSize || 2048;
    this.buffer = new Float32Array(this.frame);
    this.offset = 0;
  }

  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;

    let read = 0;
    while (read < ch.length) {
      const n = Math.min(this.frame - this.offset, ch.length - read);
      this.buffer.set(ch.subarray(read, read + n), this.offset);
      this.offset += n;
      read += n;

      if (this.offset === this.frame) {
        // 复制一份再转移，避免复用同一块内存导致数据错乱
        const out = this.buffer.slice(0);
        this.port.postMessage(out, [out.buffer]);
        this.offset = 0;
      }
    }
    return true;
  }
}

registerProcessor('capture-processor', CaptureProcessor);