const fs = require('fs');
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The single URL is bound by quotes. Let's capture the whole array content.
data = data.replace(/images:\s*\[\s*("[^]*?")\s*\]/g, 'images: [, , ]');
fs.writeFileSync('src/data/mockData.ts', data);
