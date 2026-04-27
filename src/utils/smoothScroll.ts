export function smoothScrollToElement(element: HTMLElement, duration = 1000) {
  const scrollMarginTop = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const targetY = element.getBoundingClientRect().top + window.scrollY - scrollMarginTop;
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (distance === 0) return;
  const startTime = performance.now();

  const easeInOutQuart = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuart(t));
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
