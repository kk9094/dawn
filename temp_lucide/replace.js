const fs = require('fs');
const path = require('path');

const lucideDir = path.join(__dirname, 'node_modules', 'lucide-static', 'icons');
const lucideIcons = fs.readdirSync(lucideDir)
  .filter(f => f.endsWith('.svg'))
  .map(f => f.replace('.svg', ''));

const dawnAssetsDir = path.join(__dirname, '..', 'assets');
const dawnSnippetsDir = path.join(__dirname, '..', 'snippets');

const skipIcons = [
  'icon-facebook', 'icon-instagram', 'icon-pinterest', 'icon-snapchat',
  'icon-tumblr', 'icon-twitter', 'icon-vimeo', 'icon-youtube', 'icon-tiktok'
];

const manualMapping = {
  'icon-3d-model': 'box',
  'icon-account': 'user',
  'icon-apple': 'apple',
  'icon-arrow': 'arrow-right',
  'icon-banana': 'banana',
  'icon-bottle': 'flask-conical',
  'icon-box': 'box',
  'icon-caret': 'chevron-down',
  'icon-carrot': 'carrot',
  'icon-cart-empty': 'shopping-cart',
  'icon-cart': 'shopping-cart',
  'icon-chat-bubble': 'message-circle',
  'icon-check-mark': 'check',
  'icon-checkmark': 'check',
  'icon-clipboard': 'clipboard',
  'icon-close-small': 'x',
  'icon-close': 'x',
  'icon-copy': 'copy',
  'icon-dairy-free': 'milk-off',
  'icon-dairy': 'milk',
  'icon-discount': 'tag',
  'icon-dryer': 'wind',
  'icon-error': 'triangle-alert',
  'icon-eye': 'eye',
  'icon-filter': 'filter',
  'icon-fire': 'flame',
  'icon-gluten-free': 'wheat-off',
  'icon-hamburger': 'menu',
  'icon-heart': 'heart',
  'icon-info': 'info',
  'icon-inventory-status': 'boxes',
  'icon-iron': 'zap',
  'icon-leaf': 'leaf',
  'icon-leather': 'scissors',
  'icon-lightning-bolt': 'zap',
  'icon-lipstick': 'brush',
  'icon-lock': 'lock',
  'icon-map-pin': 'map-pin',
  'icon-minus': 'minus',
  'icon-nut-free': 'nut-off',
  'icon-padlock': 'lock',
  'icon-pants': 'scissors',
  'icon-pause': 'pause',
  'icon-paw-print': 'paw-print',
  'icon-pepper': 'flame',
  'icon-perfume': 'spray-can',
  'icon-plane': 'plane',
  'icon-plant': 'flower-2',
  'icon-play': 'play',
  'icon-plus': 'plus',
  'icon-price-tag': 'tag',
  'icon-question-mark': 'circle-help',
  'icon-recycle': 'recycle',
  'icon-remove': 'trash',
  'icon-reset': 'rotate-ccw',
  'icon-return': 'corner-down-left',
  'icon-ruler': 'ruler',
  'icon-search': 'search',
  'icon-serving-dish': 'utensils',
  'icon-share': 'share',
  'icon-shirt': 'shirt',
  'icon-shoe': 'footprints',
  'icon-shopify': 'shopping-bag',
  'icon-silhouette': 'user',
  'icon-snowflake': 'snowflake',
  'icon-star': 'star',
  'icon-stopwatch': 'timer',
  'icon-success': 'check-circle',
  'icon-tick': 'check',
  'icon-truck': 'truck',
  'icon-unavailable': 'ban',
  'icon-washing': 'droplets',
  'icon-zoom': 'zoom-in',
  'icon-accordion': 'chevron-down',
  'icon-with-text': 'file-text'
};

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[a.length][b.length];
}

function getLucideSvg(lucideName, dawnIconClass) {
  const isAvailable = lucideIcons.includes(lucideName);
  let bestMatch = lucideName;
  if (!isAvailable) {
    console.log(`Lucide icon ${lucideName} not found, falling back to basic matching.`);
    let bestScore = Infinity;
    for (const l of lucideIcons) {
      const score = levenshtein(lucideName, l);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = l;
      }
    }
    console.log(`Fallback for ${lucideName} is ${bestMatch}`);
  }

  const svgContent = fs.readFileSync(path.join(lucideDir, `${bestMatch}.svg`), 'utf-8');
  
  // Dawn usually uses 40x40 or relies on CSS. We should preserve the class, remove width/height so it scales, 
  // but keep viewBox="0 0 24 24" from lucide so paths render correctly.
  
  // Lucide SVG format: 
  // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-xyz"> ... </svg>
  
  // We will replace the open SVG tag with our manipulated version.
  let newSvg = svgContent.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon ${dawnIconClass}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">`);
  
  return newSvg;
}

function processDirectory(dir, isSnippet) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.startsWith('icon-')) continue;
    if (!isSnippet && !file.endsWith('.svg')) continue;
    if (isSnippet && !file.endsWith('.liquid')) continue;
    
    const baseName = file.replace('.svg', '').replace('.liquid', '');
    
    if (skipIcons.includes(baseName)) {
      console.log(`Skipped (Brand): ${file}`);
      continue;
    }
    
    const dawnIconClass = baseName;
    const lucideName = manualMapping[baseName] || baseName.replace('icon-', '');
    
    try {
      const newSvgContent = getLucideSvg(lucideName, dawnIconClass);
      fs.writeFileSync(path.join(dir, file), newSvgContent, 'utf-8');
      console.log(`Replaced: ${file} -> ${lucideName}`);
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }
}

console.log('-- Processing Assets --');
processDirectory(dawnAssetsDir, false);

console.log('\n-- Processing Snippets --');
processDirectory(dawnSnippetsDir, true);

console.log('\nReplacement complete!');
