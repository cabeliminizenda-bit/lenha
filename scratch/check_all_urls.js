async function check() {
  const urls = [
    'http://localhost:3000/faturacao',
    'http://localhost:3000/politica-de-faturacao',
    'http://localhost:3000/expedicao',
    'http://localhost:3000/politica-de-expedicao',
    'http://localhost:3000/envios-e-entregas',
    'http://localhost:3000/devolucoes'
  ];
  for (const url of urls) {
    const res = await fetch(url);
    console.log(url, 'Status:', res.status);
    const html = await res.text();
    if (html.includes('Faturação & NIF') || html.includes('Faturação &amp; NIF')) {
      console.log('  --> FOUND "Faturação & NIF" in', url);
    }
  }
}
check();
