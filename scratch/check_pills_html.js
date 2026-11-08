async function check() {
  const res = await fetch('http://localhost:3000/privacidade');
  const html = await res.text();
  const searchStr = 'href="/politica-de-faturacao"';
  const pos = html.indexOf(searchStr);
  console.log('Position of /politica-de-faturacao:', pos);
  if (pos !== -1) {
    console.log(html.slice(pos - 100, pos + 250));
  } else {
    console.log('NOT FOUND in HTML!');
  }
}
check();

