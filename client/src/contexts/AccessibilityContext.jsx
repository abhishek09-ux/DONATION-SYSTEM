import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('a11y-settings');
    return saved ? JSON.parse(saved) : {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      screenReaderMode: false
    };
  });

  useEffect(() => {
    localStorage.setItem('a11y-settings', JSON.stringify(settings));
    
    // Apply settings to document
    const root = document.documentElement;
    
    if (settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      if (e.matches && !settings.reduceMotion) {
        setSettings(prev => ({ ...prev, reduceMotion: true }));
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);
    
    // Check initial value
    if (motionQuery.matches) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = {
    settings,
    updateSetting,
    toggleReduceMotion: () => updateSetting('reduceMotion', !settings.reduceMotion),
    toggleHighContrast: () => updateSetting('highContrast', !settings.highContrast),
    toggleLargeText: () => updateSetting('largeText', !settings.largeText)
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Skip to main content link
export const SkipToMain = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
  >
    Skip to main content
  </a>
);

// Visually hidden but accessible to screen readers
export const VisuallyHidden = ({ children, as: Component = 'span' }) => (
  <Component className="sr-only">{children}</Component>
);

// Focus trap for modals
export const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
};

// Announce to screen readers
export const useAnnounce = () => {
  const announce = (message, priority = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;
    
    document.body.appendChild(el);
    
    setTimeout(() => {
      document.body.removeChild(el);
    }, 1000);
  };

  return announce;
};

export default AccessibilityContext;
