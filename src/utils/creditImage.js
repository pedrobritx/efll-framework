import { CREDIT_LINE, CREDIT_HOST } from '../data/credit.js';

// Renders the required attribution credit onto a canvas and downloads it as a
// PNG, so teachers can drop a tidy credit badge into their own materials. Drawn
// from data/credit.js so it cannot drift from the licence notice. Uses the app's
// paper/wine palette at 2× scale for crisp output on retina screens.
export function downloadCreditImage() {
  if (typeof document === 'undefined') return;

  const scale = 2;
  const padX = 48;
  const padY = 40;
  const lineGap = 16;
  const creditFont = '600 32px "Fraunces", Georgia, serif';
  const urlFont = '400 20px "JetBrains Mono", ui-monospace, monospace';
  const url = CREDIT_HOST;

  // First pass measures the text so the canvas fits it snugly.
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = creditFont;
  const creditWidth = measure.measureText(CREDIT_LINE).width;
  measure.font = urlFont;
  const urlWidth = measure.measureText(url).width;

  const contentWidth = Math.ceil(Math.max(creditWidth, urlWidth));
  const width = contentWidth + padX * 2;
  const height = padY * 2 + 32 + lineGap + 20;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Paper background with a thin wine keyline.
  ctx.fillStyle = '#F2EBDD';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#722F37';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#4F1A1F';
  ctx.font = creditFont;
  ctx.fillText(CREDIT_LINE, padX, padY);

  ctx.fillStyle = '#6B5F52';
  ctx.font = urlFont;
  ctx.fillText(url, padX, padY + 32 + lineGap);

  const trigger = (href) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = 'efl-lesson-framework-credit.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      trigger(objectUrl);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }, 'image/png');
  } else {
    trigger(canvas.toDataURL('image/png'));
  }
}
