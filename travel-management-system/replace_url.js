const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');
const fromString = 'http://localhost:5000';
const toString = 'http://172.29.18.159:5000';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(fromString)) {
        content = content.replace(new RegExp(fromString, 'g'), toString);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    });
}

traverseDirectory(directoryPath);
console.log('Replacement complete.');
