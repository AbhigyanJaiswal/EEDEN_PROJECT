// Accessibility utilities for WCAG compliance

export const a11y = {
  // Generate unique IDs for form labels and inputs
  generateId: (prefix: string): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Check if element is visible to screen readers
  isAccessible: (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  },

  // Focus management
  focusElement: (element: HTMLElement | null): void => {
    if (element) {
      element.focus();
      // Announce to screen readers
      element.setAttribute('role', 'alert');
    }
  },

  // Keyboard navigation
  isEnterKey: (event: KeyboardEvent): boolean => event.key === 'Enter',
  isEscapeKey: (event: KeyboardEvent): boolean => event.key === 'Escape',
  isTabKey: (event: KeyboardEvent): boolean => event.key === 'Tab',

  // ARIA attributes
  setAriaLabel: (element: HTMLElement, label: string): void => {
    element.setAttribute('aria-label', label);
  },

  setAriaLive: (element: HTMLElement, polite = true): void => {
    element.setAttribute('aria-live', polite ? 'polite' : 'assertive');
  },

  setAriaInvalid: (element: HTMLElement, invalid: boolean): void => {
    element.setAttribute('aria-invalid', invalid.toString());
  },

  setAriaDescribedBy: (element: HTMLElement, describedById: string): void => {
    element.setAttribute('aria-describedby', describedById);
  },

  // Skip to main content
  createSkipLink: (): HTMLAnchorElement => {
    const link = document.createElement('a');
    link.href = '#main-content';
    link.textContent = 'Skip to main content';
    link.className = 'skip-to-content';
    return link;
  },

  // Announce messages to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcer = document.getElementById('aria-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
    }
  },
};

export default a11y;
