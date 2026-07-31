// Single source of truth for attribution and licensing strings, so the credit reads
// identically across Markdown exports, the PDF, the app footer, the welcome screen, and
// the in-app licence notice. CSS `content:` strings cannot import JS, so print.css
// repeats CREDIT_LINE and CREDIT_HOST literally — keep those two in sync.

export const AUTHOR = 'Pedro Brito (BRITX)';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/pedrobritx/';
export const GITHUB_URL = 'https://github.com/pedrobritx';

export const CREDIT_LINE = `Created with EFL Lesson Framework — by ${AUTHOR}`;
export const CREDIT_URL = 'https://lessonframework.britx.me';
export const CREDIT_HOST = CREDIT_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

export const COMMERCIAL_CONTACT = 'pedrobritx@gmail.com';
export const SUPPORT_URL = 'https://buymeacoffee.com/pedrobritx';

// Markdown footer used by the lesson-plan and handout exports.
export const CREDIT_MARKDOWN = `*${CREDIT_LINE} (${CREDIT_URL})*`;
