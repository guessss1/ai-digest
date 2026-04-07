import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { config } from '../config.js';
import type { Article } from './writer.js';

const execAsync = promisify(exec);

export interface ArticleFile {
  slug: string;
  article: Article;
  imagePath?: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      };
      return map[char.toLowerCase()] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export function createSlug(title: string, date: string): string {
  const baseSlug = generateSlug(title);
  return `${date}-${baseSlug}`;
}

export async function writeArticleFile(file: ArticleFile, date: string): Promise<string> {
  const { slug, article, imagePath } = file;

  // Формируем frontmatter
  const heroImageLine = imagePath
    ? `heroImage: './${relative(config.outputDir, imagePath).replace(/\\/g, '/')}'`
    : '';

  const frontmatter = [
    '---',
    `title: '${article.title.replace(/'/g, "''")}'`,
    `description: '${article.description.replace(/'/g, "''")}'`,
    `pubDate: '${date}'`,
    `tags: [${article.tags.map((t) => `'${t}'`).join(', ')}]`,
    `source: '${article.source}'`,
    heroImageLine,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const content = `${frontmatter}\n\n${article.content}\n`;

  const filepath = join(config.outputDir, `${slug}.md`);
  await mkdir(dirname(filepath), { recursive: true });
  await writeFile(filepath, content);

  return filepath;
}

export async function createBranch(date: string): Promise<string> {
  const branchName = `digest/${date}`;

  // Убедимся что мы на актуальной master
  await execAsync('git fetch origin');
  await execAsync('git checkout master');
  await execAsync('git pull origin master');

  // Создаём новую ветку
  await execAsync(`git checkout -b ${branchName}`);

  return branchName;
}

export async function commitAndPush(
  branch: string,
  files: ArticleFile[],
  date: string
): Promise<void> {
  // Добавляем файлы
  await execAsync(`git add ${config.outputDir} ${config.assetsDir} ${config.dedupFile}`);

  // Коммит
  const articleCount = files.length;
  const message = `feat(digest): add ${articleCount} articles for ${date}`;
  await execAsync(`git commit -m "${message}"`);

  // Пуш
  await execAsync(`git push -u origin ${branch}`);
}

export async function createPR(branch: string, date: string, files: ArticleFile[]): Promise<string> {
  const titles = files.map((f) => `- ${f.article.title}`).join('\n');

  const body = `## AI Digest ${date}

### Статьи
${titles}

---
Автоматически сгенерировано AI Digest pipeline.
`;

  const { stdout } = await execAsync(
    `gh pr create --draft --title "feat(digest): ${date}" --body "${body.replace(/"/g, '\\"')}"`
  );

  // gh pr create выводит URL созданного PR
  return stdout.trim();
}
