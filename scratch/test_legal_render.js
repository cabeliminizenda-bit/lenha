async function test() {
  const res = await fetch('http://localhost:3000/devolucoes');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Contains max-w-7xl?:', html.includes('max-w-7xl'));
  console.log('Contains flex-wrap?:', html.includes('flex-wrap'));
  console.log('Contains Enviar E-mail with svg?:', html.includes('Enviar E-mail'));
  console.log('Contains Página de Contactos?:', html.includes('Página de Contactos'));
}
test().catch(console.error);

