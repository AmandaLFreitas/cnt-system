const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = http.request({ host: 'localhost', port: 3000, path, method, headers: { 'Content-Type': 'application/json', 'Content-Length': data ? data.length : 0 } }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null }); } catch (e) { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const studentsRes = await request('GET', '/students');
  if (studentsRes.status !== 200 || !Array.isArray(studentsRes.body) || studentsRes.body.length === 0) {
    console.error('FAIL: could not list students', studentsRes.status, studentsRes.body);
    process.exit(1);
  }
  const s = studentsRes.body[0];
  const id = s.id;
  const payload = {
    courseStartDate: '2024-04-01T00:00:00Z',
    cep: '01001-000', street: 'Praca da Se', number: '100', neighborhood: 'Se', city: 'Sao Paulo', state: 'SP',
    schedule: JSON.stringify({ monday: ['mon-09-10','mon-10-11'], wednesday: ['wed-14-15'] })
  };
  const patchRes = await request('PATCH', `/students/${id}`, payload);
  if (patchRes.status !== 200) {
    console.error('FAIL: patch failed', patchRes.status, patchRes.body);
    process.exit(1);
  }
  const got = patchRes.body;
  const okDate = got.courseStartDate && String(got.courseStartDate).startsWith('2024-04-01');
  const okAddr = got.cep==='01001-000' && got.city==='Sao Paulo' && got.state==='SP' && got.street==='Praca da Se' && got.number==='100' && got.neighborhood==='Se';
  const okSched = got.schedule && (typeof got.schedule === 'string' ? got.schedule.includes('mon-09-10') : false);
  if (okDate && okAddr && okSched) {
    console.log('PASS: edit student persisted (date, address, schedule).');
    process.exit(0);
  } else {
    console.error('FAIL: verification failed', { okDate, okAddr, okSched, got });
    process.exit(2);
  }
})().catch(e => { console.error('ERROR', e); process.exit(3); });

