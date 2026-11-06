const fs = require('fs');

const files = ['index.html', 'malla.html', 'intercampus.html', 'convenios.html', 'info.html', 'js/comun.js'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/type="image\/svg\+xml" href="img\/logo-ambiental\.svg"/g, 'type="image/png" href="img/logo-ambiental.png"');
  content = content.replace(/src="img\/logo-ambiental\.svg"/g, 'src="img/logo-ambiental.png"');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Successfully updated logo references in', f);
});
