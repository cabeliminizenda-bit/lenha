const fs = require('fs');
const path = require('path');

const files = [
  'src/app/product/[slug]/page.tsx',
  'src/lib/site.ts',
  'src/actions/checkout.ts',
  'src/actions/admin.ts',
  'src/actions/chat.ts',
  'src/app/api/cron/review-requests/route.ts',
  'src/app/api/newsletter/confirm/route.ts',
  'src/app/api/paypal/capture/route.ts',
  'src/lib/orderFinalizer.ts'
];

for (const rel of files) {
  const p = path.join(__dirname, '..', rel);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('https://www.gamingbm.com')) {
      c = c.replace(/https:\/\/www\.gamingbm\.com/g, 'https://lenhaecarvaosilvadias.com');
      fs.writeFileSync(p, c, 'utf8');
      console.log('Updated domain in:', rel);
    }
  }
}

