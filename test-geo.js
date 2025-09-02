// test-geo.js
// Works in CommonJS (no global fetch): uses node-fetch via dynamic import
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function hit(q) {
  try {
    const r = await fetch(
      `http://localhost:3030/geo?q=${encodeURIComponent(q)}`,
      { headers: { 'x-soapbox-key': '99dnfneeekdegnrJJSN3JdenrsdnJ' } }
    );
    console.log('Status', r.status, '-', q);
    console.log(await r.text());
    console.log('---');
  } catch (e) {
    console.error('❌ Request failed:', e);
  }
}

(async () => {
  await hit('orlando fl');
  await hit('los angeles ca');
})();
