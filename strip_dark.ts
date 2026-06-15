import * as fs from 'fs';
import * as path from 'path';

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        // remove dark: classes
        content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]#]+/g, '');
        // cleanup double spaces created by removal
        content = content.replace(/ +"/g, '"');
        content = content.replace(/" +/g, '"');
        content = content.replace(/ +`/g, '`');
        content = content.replace(/ +'/g, "'");
      }

      if (fullPath.endsWith('.css')) {
        // remove dark media query
        content = content.replace(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\n\s*\}/g, '');
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory('./src');
