const fs = require('fs');
let text = fs.readFileSync('adminStore.ts', 'utf8');

text = text.replace(/apiClient\.patch\(\/client\/admin\/users\/role\/, \{ role \}\);/g, 'apiClient.patch(/client/admin/users/role/, { role });');

text = text.replace(/apiClient\.patch\(\/client\/admin\/users\/, \{ status \}\);/g, 'apiClient.patch(/client/admin/users/, { status });');

text = text.replace(/apiClient\.patch\(\/client\/admin\/users\/, data\);/g, 'apiClient.patch(/client/admin/users/, data);');

text = text.replace(/apiClient\.patch\(\/client\/centers\/update\/, data\);/g, 'apiClient.patch(/client/centers/update/, data);');

text = text.replace(/apiClient\.delete\(\/client\/centers\/delete\/\);/g, 'apiClient.delete(/client/centers/delete/);');

fs.writeFileSync('adminStore.ts', text, 'utf8');

let text2 = fs.readFileSync('myCenterStore.ts', 'utf8');

text2 = text2.replace(/apiClient\.patch\(\/client\/centers\/update\/, data\);/g, 'apiClient.patch(/client/centers/update/, data);');
text2 = text2.replace(/apiClient\.delete\(\/client\/centers\/delete\/\);/g, 'apiClient.delete(/client/centers/delete/);');

text2 = text2.replace(/apiClient\.patch\(\/client\/workshops\/update\/, data\);/g, 'apiClient.patch(/client/workshops/update/, data);');
text2 = text2.replace(/apiClient\.delete\(\/client\/workshops\/delete\/\);/g, 'apiClient.delete(/client/workshops/delete/);');

text2 = text2.replace(/apiClient\.patch\(\/api\/activities\/update\/, data\);/g, 'apiClient.patch(/api/activities/update/, data);');
text2 = text2.replace(/apiClient\.delete\(\/api\/activities\/delete\/\);/g, 'apiClient.delete(/api/activities/delete/);');

fs.writeFileSync('myCenterStore.ts', text2, 'utf8');
