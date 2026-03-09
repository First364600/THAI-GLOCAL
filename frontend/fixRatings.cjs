const fs = require('fs');

// CentersPage.tsx
let centersPage = fs.readFileSync('src/pages/CentersPage.tsx', 'utf8');
centersPage = centersPage.replace(/ *<div className="absolute top-3 right-3 flex items-center[\s\S]*?<\/div>\r?\n/g, '');
centersPage = centersPage.replace(/ *<span className="flex items-center gap-1">\s*<Star[\s\S]*?<\/span>\r?\n/g, '');
fs.writeFileSync('src/pages/CentersPage.tsx', centersPage);

// HomePage.tsx
let homePage = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
homePage = homePage.replace(/ *<div className="absolute top-3 right-3[\s\S]*?<\/div>\r?\n/g, '');
fs.writeFileSync('src/pages/HomePage.tsx', homePage);

// WorkshopDetailPage.tsx
let detailPage = fs.readFileSync('src/pages/WorkshopDetailPage.tsx', 'utf8');
detailPage = detailPage.replace(/ *<div className="flex items-center gap-1">\s*<Star[\s\S]*?<\/div>\r?\n/g, '                        <span className="text-stone-500" style={{ fontSize: "0.7rem" }}>{center.location}</span>\n');
fs.writeFileSync('src/pages/WorkshopDetailPage.tsx', detailPage);

// mockData.ts
let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');
mockData = mockData.replace(/ *rating: number;\r?\n/g, '');
mockData = mockData.replace(/ *rating: [0-9.]+,\s*\r?\n/g, '');
fs.writeFileSync('src/data/mockData.ts', mockData);
