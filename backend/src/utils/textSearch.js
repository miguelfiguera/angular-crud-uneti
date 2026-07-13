/**
 * Convierte texto a un patrón regex insensible a mayúsculas y acentos en español.
 */
function buildSpanishInsensitivePattern(text) {
  const accentMap = {
    a: '[aáàäâãAÁÀÄÂÃ]',
    e: '[eéèêëEÉÈÊË]',
    i: '[iíìîïIÍÌÎÏ]',
    o: '[oóòôöõOÓÒÔÖÕ]',
    u: '[uúùûüUÚÙÛÜ]',
    n: '[nñNÑ]',
    c: '[cçCÇ]',
  };

  let pattern = '';
  for (const char of text) {
    if (/[.*+?^${}()|[\]\\]/.test(char)) {
      pattern += `\\${char}`;
      continue;
    }
    const mapped = accentMap[char.toLowerCase()];
    pattern += mapped ?? char;
  }
  return pattern;
}

function buildSpanishInsensitiveRegex(text) {
  return new RegExp(buildSpanishInsensitivePattern(text), 'i');
}

module.exports = { buildSpanishInsensitivePattern, buildSpanishInsensitiveRegex };
