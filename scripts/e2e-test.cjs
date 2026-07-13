const { chromium } = require('playwright');

const API = 'http://localhost:3000';
const APP = 'http://localhost:4200';
const TEST_MOVIE = `Test Película E2E ${Date.now()}`;

async function run() {
  const results = [];
  const pass = (name, detail = '') => results.push({ name, ok: true, detail });
  const fail = (name, detail = '') => results.push({ name, ok: false, detail });

  try {
    const health = await fetch(`${API}/api/health`).then((r) => r.json());
    if (health.status === 'ok') pass('API health check', health.message);
    else fail('API health check', JSON.stringify(health));
  } catch (e) {
    fail('API health check', e.message);
  }

  try {
    const peliculas = await fetch(`${API}/api/peliculas`).then((r) => r.json());
    if (Array.isArray(peliculas) && peliculas.length >= 5) {
      pass('API listar películas', `${peliculas.length} películas en MongoDB`);
    } else {
      fail('API listar películas', `Esperadas >=5, recibidas: ${peliculas?.length}`);
    }
  } catch (e) {
    fail('API listar películas', e.message);
  }

  try {
    const res = await fetch(`${API}/api/peliculas/consulta/genero/Drama`).then((r) => r.json());
    if (res.total >= 1 && Array.isArray(res.peliculas)) {
      pass('API consulta por género', `${res.total} película(s) Drama`);
    } else {
      fail('API consulta por género', JSON.stringify(res));
    }
  } catch (e) {
    fail('API consulta por género', e.message);
  }

  try {
    const created = await fetch(`${API}/api/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: TEST_MOVIE, anio: 2026, genero: 'Drama' }),
    }).then((r) => r.json());
    if (created.titulo === TEST_MOVIE && created._id) {
      pass('API crear película', created._id);
      await fetch(`${API}/api/peliculas/${created._id}`, { method: 'DELETE' });
    } else {
      fail('API crear película', JSON.stringify(created));
    }
  } catch (e) {
    fail('API crear película', e.message);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(APP, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.locator('h1').first().textContent();
    if (title?.includes('Catálogo de Películas')) {
      pass('Frontend carga página principal', title.trim());
    } else {
      fail('Frontend carga página principal', title ?? 'sin título');
    }
  } catch (e) {
    fail('Frontend carga página principal', e.message);
  }

  try {
    const countText = await page.locator('ui-card-description').nth(1).textContent();
    const match = countText?.match(/(\d+) película/);
    if (match && parseInt(match[1], 10) >= 5) {
      pass('Frontend muestra películas seed', countText?.trim());
    } else {
      fail('Frontend muestra películas seed', countText ?? 'sin contador');
    }
  } catch (e) {
    fail('Frontend muestra películas seed', e.message);
  }

  try {
    await page.locator('#titulo input').fill(TEST_MOVIE);
    await page.locator('ui-button[type="submit"]').click();
    await page.waitForTimeout(1500);
    const item = page.locator('li', { hasText: TEST_MOVIE });
    if (await item.count()) {
      pass('Frontend añadir película al formulario', TEST_MOVIE);
      await item.locator('ui-button', { hasText: 'Eliminar' }).click();
      await page.waitForTimeout(1000);
      if ((await page.locator('li', { hasText: TEST_MOVIE }).count()) === 0) {
        pass('Frontend eliminar película', 'eliminada de la lista');
      } else {
        fail('Frontend eliminar película', 'sigue visible tras eliminar');
      }
    } else {
      fail('Frontend añadir película al formulario', 'no apareció en la lista');
    }
  } catch (e) {
    fail('Frontend añadir película al formulario', e.message);
  }

  try {
    await page.locator('#generoConsulta input').fill('Drama');
    await page.locator('ui-button', { hasText: 'Consultar' }).click();
    await page.waitForTimeout(1500);
    const consultaItems = page.locator('ui-card').last().locator('li');
    if ((await consultaItems.count()) >= 1) {
      pass('Frontend consulta por género', `${await consultaItems.count()} resultado(s)`);
    } else {
      fail('Frontend consulta por género', 'sin resultados visibles');
    }
  } catch (e) {
    fail('Frontend consulta por género', e.message);
  }

  await browser.close();

  console.log('\n=== RESULTADOS E2E (Playwright) ===\n');
  for (const r of results) {
    console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} pruebas pasaron\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error('Error fatal:', e);
  process.exit(1);
});
