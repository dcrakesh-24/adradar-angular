import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const blogsDir = path.join(workspaceRoot, 'src', 'assets', 'blogs');
const configPath = path.join(blogsDir, 'docx-config.json');

function toSlug(fileName) {
  const base = fileName.replace(/\.docx$/i, '').trim().toLowerCase();
  return base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'blog';
}

function toTitle(fileName) {
  const base = fileName.replace(/\.docx$/i, '').trim();
  if (!base) return 'Local Blog';
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function main() {
  const files = await readdir(blogsDir);
  const docxFiles = files
    .filter((file) => file.toLowerCase().endsWith('.docx'))
    .sort((a, b) => a.localeCompare(b));

  const config = docxFiles.map((file) => ({
    file,
    title: toTitle(file),
    slug: toSlug(file)
  }));

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8');
  console.log(`Generated ${configPath} with ${config.length} DOCX file(s).`);
}

main().catch((error) => {
  console.error('Failed to generate docx-config.json', error);
  process.exitCode = 1;
});
