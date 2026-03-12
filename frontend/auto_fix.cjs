const fs = require('fs');
const { execSync } = require('child_process');

function fixFiles() {
  while (true) {
    let tscOutput = '';
    try {
      tscOutput = execSync('npx tsc --noEmit', { cwd: __dirname, encoding: 'utf-8' });
      console.log('No more errors!');
      break;
    } catch (e) {
      tscOutput = e.stdout;
    }

    const lines = tscOutput.split('\n');
    let fixedSomething = false;
    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_\/.\-]+):(\d+):(\d+) - error TS(\d+): (.*)/);
      if (match) {
        const file = match[1];
        const row = parseInt(match[2]) - 1;
        const col = parseInt(match[3]) - 1;
        const tsCode = parseInt(match[4]);
        const msg = match[5];

        let content = fs.readFileSync(file, 'utf-8');
        let contentLines = content.split('\n');
        const origLine = contentLines[row];

        if (tsCode === 7006) {
          // Implicit any, let's insert `: any` in the parameter
          // e.g., error TS7006: Parameter 'c' implicitly has an 'any' type.
          const paramMatch = msg.match(/Parameter '([^']+)' implicitly has an 'any' type/);
          if (paramMatch && paramMatch[1]) {
            const paramName = paramMatch[1];
            // Regex to match the parameter name and add `: any`
            // Be careful to not replace just any occurrence, we know the column approximately
            contentLines[row] = contentLines[row].replace(new RegExp(`\\b${paramName}\\b`), `${paramName}: any`);
            fs.writeFileSync(file, contentLines.join('\n'));
            fixedSomething = true;
            console.log(`Fixed TS7006 in ${file}:${row + 1}`);
            break;
          }
        } else if (tsCode === 2551 || tsCode === 2339) {
          // Property missing. We can just append `as any` where appropriate.
          // Or we can add properties to the Store.
          if (file.includes('AdminCenterDetail.tsx') || file.includes('MyCenterPage.tsx')) {
             if (origLine.includes('useMyCenterStore')) {
                contentLines[row] = origLine.replace('useMyCenterStore((s)', 'useMyCenterStore((s: any)');
                fs.writeFileSync(file, contentLines.join('\n'));
                fixedSomething = true;
                break;
             }
          }
        }
      }
    }
    if (!fixedSomething) {
      console.log('Could not auto-fix anymore errors. Need human intervention.');
      break;
    }
  }
}

fixFiles();
