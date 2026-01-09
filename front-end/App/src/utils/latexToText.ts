/**
 * Convert LaTeX notation to readable plain text
 * Handles common LaTeX math expressions and formatting
 */
export const convertLatexToText = (text: string): string => {
  if (!text) return text;

  let result = text;

  // Handle nested braces by processing from inside out
  // First, process \text{...}
  result = result.replace(/\\text\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g, '$1');

  // Process \sqrt[n]{x} - nth root
  result = result.replace(/\\sqrt\s*\[\s*([^\]]+)\s*\]\s*\{\s*([^}]+)\s*\}/g, 'ⁿ√($2)');
  
  // Process \sqrt{...} - square root
  result = result.replace(/\\sqrt\s*\{\s*([^}]+)\s*\}/g, '√($1)');

  // Process \frac{a}{b} - fractions
  result = result.replace(/\\frac\s*\{\s*([^}]*(?:\{[^}]*\}[^}]*)*)\s*\}\s*\{\s*([^}]*(?:\{[^}]*\}[^}]*)*)\s*\}/g, '($1)/($2)');

  // Handle superscripts ^{n} and ^n with Unicode superscript numbers
  result = result.replace(/\^\s*\{\s*([^}]+)\s*\}/g, (match, content) => {
    return convertToSuperscript(content);
  });
  
  // Handle simple superscripts like x^2, x^3
  result = result.replace(/\^([0-9])/g, (match, num) => {
    return convertToSuperscript(num);
  });

  // Handle subscripts _{n}
  result = result.replace(/_\s*\{\s*([^}]+)\s*\}/g, (match, content) => {
    return convertToSubscript(content);
  });

  // Replace common operators
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\div/g, '÷');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\le/g, '≤');
  result = result.replace(/\\ge/g, '≥');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\equiv/g, '≡');
  result = result.replace(/\\approx/g, '≈');

  // Replace constants
  result = result.replace(/\\pi/g, 'π');
  result = result.replace(/\\infty/g, '∞');

  // Replace Greek letters
  const greekLetters: { [key: string]: string } = {
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\epsilon': 'ε',
    '\\zeta': 'ζ',
    '\\eta': 'η',
    '\\theta': 'θ',
    '\\iota': 'ι',
    '\\kappa': 'κ',
    '\\lambda': 'λ',
    '\\mu': 'μ',
    '\\nu': 'ν',
    '\\xi': 'ξ',
    '\\omicron': 'ο',
    '\\rho': 'ρ',
    '\\sigma': 'σ',
    '\\tau': 'τ',
    '\\upsilon': 'υ',
    '\\phi': 'φ',
    '\\chi': 'χ',
    '\\psi': 'ψ',
    '\\omega': 'ω',
  };

  for (const [latex, greek] of Object.entries(greekLetters)) {
    result = result.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), greek);
  }

  // Remove remaining \\ and single \
  result = result.replace(/\\\\/g, '');
  result = result.replace(/\\(?=[^a-zA-Z])/g, '');

  // Clean up extra braces and brackets
  result = result.replace(/[\{\}]/g, '');

  // Clean up multiple spaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
};

/**
 * Convert text to superscript using Unicode characters
 */
const convertToSuperscript = (text: string): string => {
  const superscriptMap: { [key: string]: string } = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '+': '⁺',
    '-': '⁻',
    '=': '⁼',
    '(': '⁽',
    ')': '⁾',
    'a': 'ᵃ',
    'b': 'ᵇ',
    'c': 'ᶜ',
    'd': 'ᵈ',
    'e': 'ᵉ',
    'f': 'ᶠ',
    'g': 'ᵍ',
    'h': 'ʰ',
    'i': 'ⁱ',
    'j': 'ʲ',
    'k': 'ᵏ',
    'l': 'ˡ',
    'm': 'ᵐ',
    'n': 'ⁿ',
    'o': 'ᵒ',
    'p': 'ᵖ',
    'q': 'ᵍ',
    'r': 'ʳ',
    's': 'ˢ',
    't': 'ᵗ',
    'u': 'ᵘ',
    'v': 'ᵛ',
    'w': 'ʷ',
    'x': 'ˣ',
    'y': 'ʸ',
    'z': 'ᶻ',
  };

  return text.split('').map(char => superscriptMap[char] || char).join('');
};

/**
 * Convert text to subscript using Unicode characters
 */
const convertToSubscript = (text: string): string => {
  const subscriptMap: { [key: string]: string } = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
    '+': '₊',
    '-': '₋',
    '=': '₌',
    '(': '₍',
    ')': '₎',
    'a': 'ₐ',
    'b': 'ᵦ',
    'e': 'ₑ',
    'h': 'ₕ',
    'i': 'ᵢ',
    'j': 'ⱼ',
    'k': 'ₖ',
    'l': 'ₗ',
    'm': 'ₘ',
    'n': 'ₙ',
    'o': 'ₒ',
    'p': 'ₚ',
    'r': 'ᵣ',
    's': 'ₛ',
    't': 'ₜ',
    'u': 'ᵤ',
    'v': 'ᵥ',
    'x': 'ₓ',
  };

  return text.split('').map(char => subscriptMap[char] || char).join('');
};

/**
 * Check if text contains LaTeX notation
 */
export const hasLatex = (text: string): boolean => {
  if (!text) return false;
  return /\\[a-zA-Z]|\\{.*?\}|\^\{|_\{/.test(text);
};
