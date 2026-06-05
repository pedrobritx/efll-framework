// Single source of truth for attribution / licensing strings, so the credit
// line reads identically across Markdown exports, the PDF, the app footer, the
// welcome screen, and the in-app licence notice. (CSS `content:` strings can't
// import JS, so the print stylesheet repeats these literally — keep them in sync.)

export const CREDIT_LINE = 'Created with EFL Lesson Framework — by pedrobritx';
export const CREDIT_URL = 'https://pedrobritx.github.io/EwP/';
export const COMMERCIAL_CONTACT = 'pedrobritx@gmail.com';
export const SUPPORT_URL = 'https://buymeacoffee.com/pedrobritx';

// Markdown footer used by the lesson-plan and handout exports.
export const CREDIT_MARKDOWN = `*${CREDIT_LINE} (${CREDIT_URL})*`;
