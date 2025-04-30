import { Fragment } from 'react';

/**
 * 高亮顯示備註中的關鍵字
 * @param text - 要進行高亮處理的文本
 * @param rawKeyword - 用於搜尋的原始關鍵字
 * @returns - 處理後的 JSX 元素，帶有高亮的文字
 */
export function highlightText(text: string, rawKeyword: string) {
  const keywords = rawKeyword.trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return text;

  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    keywords.some((kw) => part.toLowerCase() === kw.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-200 text-black">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
