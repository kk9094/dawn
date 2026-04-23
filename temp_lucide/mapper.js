const fs = require('fs');
const path = require('path');
const lucideDir = path.join(__dirname, 'node_modules', 'lucide-static', 'icons');

// Get all Lucide icons
const lucideIcons = fs.readdirSync(lucideDir)
  .filter(f => f.endsWith('.svg'))
  .map(f => f.replace('.svg', ''));

// Get all Dawn icons from assets
const dawnAssetsDir = path.join(__dirname, '..', 'assets');
const dawnAssetIcons = fs.readdirSync(dawnAssetsDir)
  .filter(f => f.startsWith('icon-') && f.endsWith('.svg'))
  .map(f => f.replace('.svg', '').replace('icon-', ''));

// Get all Dawn icons from snippets
const dawnSnippetsDir = path.join(__dirname, '..', 'snippets');
const dawnSnippetIcons = fs.readdirSync(dawnSnippetsDir)
  .filter(f => f.startsWith('icon-') && f.endsWith('.liquid'))
  .map(f => f.replace('.liquid', '').replace('icon-', ''));

// Levenshtein distance for basic fuzzy matching
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

function findBestMatch(dawnName) {
  let best = '';
  let bestScore = Infinity;
  // some exact replacements
  const customMapping = {
    'cart-empty': 'shopping-cart',
    'cart': 'shopping-cart',
    'account': 'user',
    '3d-model': 'box',
    'hamburger': 'menu',
    'close': 'x',
    'close-small': 'x',
    'caret': 'chevron-down',
    'arrow': 'arrow-right',
    'discount': 'tag',
    'error': 'alert-circle',
    'success': 'check-circle',
    'info': 'info',
    'checkmark': 'check',
    'check-mark': 'check',
    'padlock': 'lock',
    'search': 'search',
    'social-instagram': 'instagram',
    'social-facebook': 'facebook',
    'social-tiktok': 'tiktok',
    'social-youtube': 'youtube',
    'social-twitter': 'twitter',
    'social-pinterest': 'pinterest',
    'social-snapchat': 'ghost',
    'social-tumblr': 'tumblr',
    'social-vimeo': 'vimeo',
    'share': 'share',
    'zoom': 'zoom-in',
    'play': 'play',
    'pause': 'pause',
    'plus': 'plus',
    'minus': 'minus',
    'remove': 'trash',
    'return': 'corner-down-left',
    '3d-model': 'box'
  };

  if (customMapping[dawnName]) {
    if (lucideIcons.includes(customMapping[dawnName])) return customMapping[dawnName];
  }

  for (const lucide of lucideIcons) {
    if (lucide === dawnName) return lucide;
    const score = levenshtein(dawnName, lucide);
    if (score < bestScore) {
      bestScore = score;
      best = lucide;
    }
  }
  return best; // fallback
}

const mapping = {};
for (const icon of dawnAssetIcons) {
  mapping['assets/icon-' + icon + '.svg'] = findBestMatch(icon);
}
for (const icon of dawnSnippetIcons) {
  mapping['snippets/icon-' + icon + '.liquid'] = findBestMatch(icon);
}

fs.writeFileSync('mapping.json', JSON.stringify(mapping, null, 2));
console.log('Mapping generated successfully in mapping.json!');
