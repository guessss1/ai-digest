import { describe, it, expect } from 'vitest';
import { parseArticle } from './parseArticle';

describe('parseArticle', () => {
  it('извлекает заголовок из первого h1', () => {
    const markdown = '# Заголовок статьи\n\nТекст абзаца.';

    const result = parseArticle(markdown);

    expect(result.title).toBe('Заголовок статьи');
  });

  it('извлекает описание из первого параграфа после h1', () => {
    const markdown =
      '# Заголовок статьи\n\nПервый параграф описания.\n\nВторой параграф.';

    const result = parseArticle(markdown);

    expect(result.description).toBe('Первый параграф описания.');
  });
});
