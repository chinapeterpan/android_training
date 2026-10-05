// 主逻辑：把识别引擎、界面、欢呼反馈串起来
import { CounterEngine } from './engine.js';
import { SoundFX, celebrate } from './fx.js';
import { numberToChinese } from './numbers.js';

const MAX = 10;

const el = {
  counter: document.getElementById('counter'),
  expect: document.getElementById('expect'),
  dots: document.getElementById('dots'),
  status: document.getElementById('status'),
  toggle: document.getElementById('toggle'),
  success: document.getElementById('success'),
  times: document.getElementById('times'),
  again: document.getElementById('again'),
  confetti: document.getElementById('confetti'),
  loadBar: document.getElementById('loadbar'),
};

const fx = new SoundFX();
let times = 0;
let current = 0;
let running = false;

// 进度圆点
function renderDots() {
  el.dots.innerHTML = '';
  for (let i = 1; i <= MAX; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    if (i <= current) d.classList.add('on');
    if (i === current + 1) d.classList.add('next');
    el.dots.appendChild(d);
  }
}

function setExpect(n) {
  if (n > MAX) return;
  el.expect.innerHTML = `请说出 <b>${numberToChinese(n)}</b>（${n}）`;
}

const engine = new CounterEngine({
maxCount: MAX,

  onProgress: (text, ratio) => {
    if (ratio >= 1) return;
    el.status.textContent = `${text} ${Math.round(ratio * 100)}%`;
    el.loadBar.style.width = `${ratio * 100}%`;
  },

  onState: (n) => {
    if (typeof n !== 'number') return; // 忽略 'loading' 这类状态标记
    if (n > MAX) n = 1;
    setExpect(n);
    renderDots();
  },

  onHit: (n, finished) => {
    if (finished) {
      celebrate(el.confetti);
      fx.cheer();
      times += 1;
      el.times.textContent = `累计完成 ${times} 次`;
      el.success.classList.add('show');
      return;
    }
    current = n;
    el.counter.textContent = current;
    el.counter.classList.add('pop');
    setTimeout(() => el.counter.classList.remove('pop'), 200);
    fx.hit(current);
    renderDots();
  },

  onMiss: (heard) => {
    fx.miss();
    el.status.textContent = `听到「${heard}」，下一句请报 ${engine.expected}`;
    setTimeout(() => {
      if (running) el.status.textContent = '正在听…请清晰报出下一个数字';
    }, 1600);
  },

  onPartial: (p) => {
    if (running) el.status.textContent = p ? `听到：${p}` : '正在听…请清晰报出下一个数字';
  },

  onReady: () => {
    el.loadBar.style.width = '100%';
    el.status.textContent = '模型已就绪，点击「开始报数」';
  },

  onError: (e) => {
    console.error(e);
    el.status.textContent = '出错了：' + (e && e.message ? e.message : e);
  },
});

async function boot() {
  if (typeof Vosk === 'undefined') {
    el.status.textContent = '加载识别库失败，请检查网络后刷新';
    return;
  }
  el.status.textContent = '正在加载识别模型（约 43MB，仅首次）…';
  try {
    await engine.load();
  } catch (e) {
    el.status.textContent = '模型加载失败：' + (e && e.message ? e.message : e);
  }
}

el.toggle.addEventListener('click', async () => {
  fx.ensure(); // 在用户手势里解锁音频

  if (running) {
    engine.stop();
    running = false;
    el.toggle.textContent = '开始报数';
    el.toggle.classList.remove('stop');
    el.status.textContent = '已停止';
    return;
  }

  try {
    await engine.start();
    running = true;
    current = 0;
    el.counter.textContent = '0';
    renderDots();
    setExpect(1);
    el.toggle.textContent = '停止';
    el.toggle.classList.add('stop');
    el.status.textContent = '正在听…请清晰报出下一个数字';
  } catch (e) {
    el.status.textContent = '无法访问麦克风：' + (e && e.message ? e.message : e);
  }
});

el.again.addEventListener('click', () => {
  el.success.classList.remove('show');
  engine.reset();
  current = 0;
  el.counter.textContent = '0';
  renderDots();
  setExpect(1);
  el.status.textContent = running ? '继续！从「一」重新开始' : '点击下方按钮开始';
});

renderDots();
setExpect(1);
boot();