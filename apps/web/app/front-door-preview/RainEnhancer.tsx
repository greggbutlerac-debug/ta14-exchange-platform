'use client';

import { useEffect } from 'react';

const streams = [
  'REALITY · RECORD · CONTINUITY · ADMISSIBILITY · BINDING · COMMIT · EXECUTION · OUTCOME · ALLOW · HOLD · DENY · ESCALATE',
  '现实 · 记录 · 连续性 · 可采纳性 · 绑定 · 提交 · 执行 · 结果 · 允许 · 暂停 · 拒绝 · 升级',
  'الواقع · السجل · الاستمرارية · المقبولية · الإلزام · الالتزام · التنفيذ · النتيجة · السماح · التعليق · الرفض · التصعيد',
  'מציאות · רשומה · המשכיות · קבילות · כריכה · התחייבות · ביצוע · תוצאה · אפשר · החזק · דחה · הסלם',
  'REALIDAD · REGISTRO · CONTINUIDAD · ADMISIBILIDAD · VINCULACIÓN · COMPROMISO · EJECUCIÓN · RESULTADO · PERMITIR · RETENER · DENEGAR · ESCALAR',
  'РЕАЛЬНОСТЬ · ЗАПИСЬ · НЕПРЕРЫВНОСТЬ · ДОПУСТИМОСТЬ · СВЯЗЫВАНИЕ · ФИКСАЦИЯ · ИСПОЛНЕНИЕ · РЕЗУЛЬТАТ · РАЗРЕШИТЬ · УДЕРЖАТЬ · ОТКАЗАТЬ · ЭСКАЛИРОВАТЬ',
];

export default function RainEnhancer() {
  useEffect(() => {
    const cols = Array.from(document.querySelectorAll<HTMLElement>('.codeRain .rainCol'));
    cols.forEach((col, i) => {
      const text = streams[i % streams.length];
      col.querySelectorAll<HTMLElement>('span').forEach(span => { span.textContent = text; });
      col.dataset.language = ['en','zh','ar','he','es','ru'][i % 6];
    });
  }, []);
  return null;
}
