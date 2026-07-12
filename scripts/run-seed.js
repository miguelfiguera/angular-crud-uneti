/**
 * Ejecuta el seed de la base de datos después de yarn install.
 * Detecta el SO y usa el script correspondiente, con fallback a Node.js.
 */
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const isWindows = process.platform === 'win32';

console.log('\n--- Postinstall: poblando base de datos MongoDB ---\n');

if (process.env.SKIP_SEED === '1') {
  console.log('SKIP_SEED=1 — seed omitido.\n');
  process.exit(0);
}

function runNodeSeed() {
  const seedPath = path.join(rootDir, 'backend', 'src', 'seed', 'seed.js');
  const result = spawnSync(process.execPath, [seedPath], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env },
  });
  if (result.status !== 0) {
    console.warn('\nSeed omitido: MongoDB no disponible o error de conexión.');
    console.warn('Ejecuta manualmente: yarn seed\n');
  }
}

if (isWindows) {
  const psScript = path.join(__dirname, 'seed-db.ps1');
  if (fs.existsSync(psScript)) {
    const result = spawnSync(
      'powershell',
      ['-ExecutionPolicy', 'Bypass', '-File', psScript],
      { cwd: rootDir, stdio: 'inherit' }
    );
    if (result.status !== 0) runNodeSeed();
  } else {
    runNodeSeed();
  }
} else {
  const shScript = path.join(__dirname, 'seed-db.sh');
  if (fs.existsSync(shScript)) {
    fs.chmodSync(shScript, '755');
    const result = spawnSync('bash', [shScript], { cwd: rootDir, stdio: 'inherit' });
    if (result.status !== 0) runNodeSeed();
  } else {
    runNodeSeed();
  }
}

console.log('--- Postinstall finalizado ---\n');
