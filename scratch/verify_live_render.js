async function checkRender() {
  const slugs = ['privacidade', 'devolucoes', 'politica-de-faturacao', 'termos-e-condicoes'];
  for (const slug of slugs) {
    const res = await fetch(`http://localhost:3000/${slug}`);
    const html = await res.text();
    console.log(`=== Slug: ${slug} ===`);
    console.log('Includes "Faturação & NIF"?:', html.includes('Faturação & NIF') || html.includes('Faturação &amp; NIF'));
    console.log('Includes "Faturação"?:', html.includes('>Faturação</span>'));
    console.log('Includes "Privacidade"?:', html.includes('>Privacidade</span>'));
    console.log('Includes "(RGPD)"?:', html.includes('(RGPD)'));
    
    // Print the legal nav HTML snippet
    const navStart = html.indexOf('LEGAL_NAV') !== -1 ? html.indexOf('LEGAL_NAV') : html.indexOf('href="/politica-de-faturacao"');
    if (navStart !== -1) {
      console.log('Nav snippet around faturacao:', html.slice(navStart - 30, navStart + 150));
    }
  }
}
checkRender().catch(console.error);
