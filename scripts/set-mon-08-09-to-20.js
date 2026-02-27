const http = require('http');

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = http.request({ host: 'localhost', port: 3000, path, method, headers: { 'Content-Type': 'application/json', 'Content-Length': data ? data.length : 0 } }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null }); } catch { resolve({ status: res.statusCode, body: raw }); } });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const patch = await req('PATCH', '/time-slots/mon-08-09', { totalVacancies: 20 });
  if (patch.status >= 200 && patch.status < 300) {
    const get = await req('GET', '/time-slots/mon-08-09');
    console.log(get.body);
    if (get.body && get.body.totalVacancies === 20) {
      console.log('OK: mon-08-09 atualizado para 20');
      process.exit(0);
    }
  }
  console.error('Falha ao atualizar', patch.status, patch.body);
  process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });

