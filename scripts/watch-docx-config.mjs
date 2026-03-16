import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const workspaceRoot = process.cwd();
const blogsDir = path.join(workspaceRoot, 'src', 'assets', 'blogs');
const generateScript = path.join(workspaceRoot, 'scripts', 'generate-docx-config.mjs');

let timer = null;
let isRunning = false;
let rerunRequested = false;

function runGenerator() {
  if (isRunning) {
    rerunRequested = true;
    return;
  }

  isRunning = true;
  const child = spawn(process.execPath, [generateScript], { stdio: 'inherit' });
  child.on('close', () => {
    isRunning = false;
    if (rerunRequested) {
      rerunRequested = false;
      runGenerator();
    }
  });
}

function scheduleGenerate() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => runGenerator(), 250);
}

watch(blogsDir, { persistent: true }, (_eventType, fileName) => {
  if (!fileName) return;
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.docx')) {
    scheduleGenerate();
  }
});

console.log('Watching src/assets/blogs for DOCX changes...');
runGenerator();
