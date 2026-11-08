const fs = require('fs');

async function check() {
  const res = await fetch('http://localhost:3000/product/fogao-a-pellets-canalizavel-lara-10-kw-444');
  const html = await res.text();
  let idx = 0;
  while ((idx = html.indexOf('{count}', idx)) !== -1) {
    console.log('Found {count} at index', idx);
    console.log(html.slice(Math.max(0, idx - 80), Math.min(html.length, idx + 80)));
    idx += 7;
  }
}

check().catch(console.error);

