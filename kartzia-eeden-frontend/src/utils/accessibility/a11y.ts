// Accessibility utilities for WCAG compliance

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

export const focusElement = (element: HTMLElement, smooth = false) => {
  if (smooth) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  element.focus();
};

export const isKeyboardEvent = (event: React.KeyboardEvent): boolean => {
  return event instanceof KeyboardEvent;
};

export const isEnterOrSpace = (event: React.KeyboardEvent): boolean => {
  return event.key === 'Enter' || event.key === ' ';
};

export const createAriaLabel = (text: string, extra?: string): string => {
  return extra ? `${text} ${extra}` : text;
};
