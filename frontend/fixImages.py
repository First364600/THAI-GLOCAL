import re

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(
    r'images:\s*\[\s*(\"[^\"]+\")\s*\]',
    r'images: [\1, \1, \1]',
    text
)

with open('src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(text)
