const fs = require('fs');

const fixFile = (path, fixer) => {
    try {
        let content = fs.readFileSync(path, 'utf8');
        content = fixer(content);
        fs.writeFileSync(path, content, 'utf8');
    } catch(e) { console.error('Failed ' + path) }
}

fixFile('src/pages/MyCenterPage.tsx', (content) => {
    return content.replace('store.generateWeeklySessions((newWorkshop as any).id);', '(store as any).generateWeeklySessions((newWorkshop as any).id);');
});

fixFile('src/pages/WorkshopSessionsPage.tsx', (content) => {
    return content.replace(/store\.getBookingsBySession\(/g, '(store as any).getBookingsBySession(')
        .replace(/sessions\.filter\(\(s\) =>/g, 'sessions.filter((s: any) =>')
        .replace(/sessions\.filter\(\(s: any\) => s\.date < today/g, 'sessions.filter((s) => s.date < today')
        .replace(/const past = sessions\.filter\(\(s\) =>/g, 'const past = sessions.filter((s: any) =>')
});
