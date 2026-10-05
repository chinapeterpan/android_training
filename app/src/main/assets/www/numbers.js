// 数字 1~20 的多写法归一化
// 用户可能说「一」「幺」「两」「二」「十」「什」等，都映射到同一个数值。

export const CN_DIGITS = {
  '零': 0, '〇': 0, '洞': 0,
  '一': 1, '幺': 1, '壹': 1, '依': 1, '衣': 1, '医': 1, '伊': 1, '揖': 1,
  '二': 2, '两': 2, '俩': 2, '贰': 2, '二': 2, '两': 2,
  '三': 3, '叁': 3, '仨': 3, '散': 3, '伞': 3,
  '四': 4, '肆': 4, '是': 4, '死': 4, '寺': 4,
  '五': 5, '伍': 5, '我': 5, '无': 5, '午': 5,
  '六': 6, '陆': 6, '流': 6, '留': 6, '溜': 6,
  '七': 7, '柒': 7, '妻': 7, '漆': 7, '期': 7,
  '八': 8, '捌': 8, '爸': 8, '吧': 8, '巴': 8,
  '九': 9, '玖': 9, '酒': 9, '就': 9, '久': 9,
  '十': 10, '拾': 10, '什': 10, '时': 10, '十': 10,
};

// 标准中文读法：1 -> 一，10 -> 十，11 -> 十一，20 -> 二十
export function numberToChinese(n) {
  if (n <= 10) return CN_DIGITS_KEY[n];
  if (n < 20) return '十' + CN_DIGITS_KEY[n - 10];
  return '二十';
}
const CN_DIGITS_KEY = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
};

/**
 * 给grammar 用：某个数字的所有可能读法。
 * Vosk grammar 格式为 ["一", "幺", "[illegible]", ...]（字符串数组，或 ["数字", "1", "3"] 表示同组同义词）
 */
export function spellingsFor(n) {
  const out = new Set();
  const std = numberToChinese(n);
  out.add(std);
  if (n === 10) { out.add('拾'); out.add('什'); }
  if (n === 2) { out.add('两'); }
  if (n === 1) { out.add('幺'); }
  // 阿拉伯数字形式（部分模型会直接输出数字）
  out.add(String(n));
  return [...out];
}

/**
 * 把识别文本解析成 1~20 的整数。
 * 处理「十」「十一」「二十」「一十五」以及夹杂标点/前后缀的情况。
 * @returns {number|null}
 */
export function parseChineseNumber(text) {
  if (!text) return null;
  const clean = text.replace(/[\s，。！？、,.!?：:；;"'「」]/g, '');
  if (!clean) return null;

  // 阿拉伯数字：允许「第10」「10个」这类前后缀残留
  const digits = clean.match(/\d+/);
  if (digits) {
    const n = parseInt(digits[0], 10);
    return n >= 1 && n <= 20 ? n : null;
  }

  // 「二零」「二五」这类简写是20/25，超出1~20范围，直接判为无效
  if (/[〇零]/.test(clean)) return null;

  // 纯汉字时，剔除会改变含义的干扰字（如「百」「千」「点」出现即判为无效）
  if (/[百千万点]/.test(clean)) return null;

  // 逐字解析：支持「十X」与「X十」两种写法
  let total = 0;
  let current = 0;
  let seen = false;

  for (const ch of clean) {
    const v = CN_DIGITS[ch];
    if (v === undefined) continue;
    seen = true;

    if (v === 10) {
      // 「十」本身=> 10；「十五」=> 15
      if (current === 0) current = 1;
      total += current * 10;
      current = 0;
    } else if (v === 0) {
      continue;
    } else {
      if (total > 0) {
        // 已出现「十」，后面的字只能是个位零头
        total += v;
        current = 0;
      } else {
        current = v;
      }
    }
  }

  if (!seen) return null;
  const result = total + current;
  return result >= 1 && result <= 20 ? result : null;
}