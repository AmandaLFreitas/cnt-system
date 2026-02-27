const http = require('http');

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const r = http.request({ host: 'localhost', port: 3000, path, method, headers: { 'Content-Type': 'application/json', 'Content-Length': data ? data.length : 0 } }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const reset = await req('POST', '/time-slots/initialize-defaults', {});
  if (reset.status < 200 || reset.status >= 300) {
    console.error('Reset falhou', reset.status, reset.body);
    process.exit(1);
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'];
  for (const d of days) {
    const res = await req('GET', `/time-slots/day/${d}`);
    if (res.status !== 200 || !Array.isArray(res.body)) {
      console.error('GET dia falhou', d, res.status, res.body);
      process.exit(2);
    }
    const bad = res.body.filter(s => s.totalVacancies !== 20);
    if (bad.length) {
      console.error('Slots divergentes', d, bad.map(b => `${b.slotId}:${b.totalVacancies}`));
      process.exit(3);
    }
  }
  console.log('OK: todos os dias com 20 vagas');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(9); });

