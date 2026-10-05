// 欢呼与反馈音效：全部用 Web Audio 实时合成，不依赖任何外部音频文件。
// 好处是离线可用、首屏无等待、手机上不占流量。

export class SoundFX {
  constructor() {
    this.ctx = null;
  }

  ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  /** 单个音符 */
  tone(freq, start, dur, gain = 0.3, type = 'triangle') {
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    // 指数衰减包络，避免爆音
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(g).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  /** 数字命中：清脆的上行音，音高随进度升高，给正反馈 */
  hit(step) {
    const ctx = this.ensure();
    const t = ctx.currentTime;
    const base = 523.25 * Math.pow(2, Math.min(step, 12) / 12);
    this.tone(base, t, 0.18, 0.26, 'sine');
    this.tone(base * 1.5, t + 0.06, 0.22, 0.18, 'sine');
  }

  /** 报错的低沉短音 */
  miss() {
    const ctx = this.ensure();
    this.tone(196, ctx.currentTime, 0.16, 0.16, 'sawtooth');
  }

  /** 成功的欢呼声：C大调上行琶音 + 和弦铺底，像欢呼人群的感觉 */
  cheer() {
    const ctx = this.ensure();
    const t0 = ctx.currentTime;

    // 上行琶音（快速、密集，制造兴奋感）
    const arp = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    arp.forEach((f, i) => {
      this.tone(f, t0 + i * 0.07, 0.3, 0.24, 'triangle');
      this.tone(f * 2, t0 + i * 0.07, 0.18, 0.08, 'sine');
    });

    // 落地和弦（C-E-G-C 大三和弦）
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => {
      this.tone(f, t0 + 0.42, 1.1, 0.15, 'sine');
    });

    // 高频欢呼噪声感：模拟人群欢呼的"哇"声
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.9, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }
    noise.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1400;
    bp.Q.value = 0.8;

    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, t0 + 0.4);
    ng.gain.linearRampToValueAtTime(0.12, t0 + 0.55);
    ng.gain.exponentialRampToValueAtTime(0.001, t0 + 1.25);

    noise.connect(bp).connect(ng).connect(ctx.destination);
    noise.start(t0 + 0.4);
    noise.stop(t0 + 1.3);
  }
}

/** 撒彩带动画：Canvas 粒子，成功时调用 */
export function celebrate(canvas, duration = 2600) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const colors = ['#E24B4A', '#EF9F27', '#1D9E75', '#378ADD', '#7F77DD', '#D4537E'];
  const parts = [];
  for (let i = 0; i < 150; i++) {
    parts.push({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 2.2,
      vy: 2 + Math.random() * 3.4,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.28,
      color: colors[(Math.random() * colors.length) | 0],
    });
  }

  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);

    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.045; // 重力

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (elapsed < duration) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  }
  requestAnimationFrame(frame);
}