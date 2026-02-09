import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityPanel = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  const togglePanel = () => setIsOpen(!isOpen);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 left-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
          />
        </svg>
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Accessibility Settings"
          aria-modal="true"
          className="fixed bottom-20 left-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
          onKeyDown={handleKeyDown}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="a11y-title">
                Accessibility Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:ring-2 focus:ring-primary-500 rounded"
                aria-label="Close accessibility settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduce-motion" className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Reduce Motion
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Minimize animations
                </span>
              </label>
              <button
                id="reduce-motion"
                role="switch"
                aria-checked={settings.reduceMotion}
                onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.reduceMotion ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle reduce motion</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  High Contrast
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Increase color contrast
                </span>
              </label>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.highContrast ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle high contrast</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <label htmlFor="large-text" className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Large Text
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Increase font size
                </span>
              </label>
              <button
                id="large-text"
                role="switch"
                aria-checked={settings.largeText}
                onClick={() => updateSetting('largeText', !settings.largeText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.largeText ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle large text</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.largeText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Screen Reader Mode */}
            <div className="flex items-center justify-between">
              <label htmlFor="screen-reader" className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Screen Reader Optimized
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Enhanced screen reader support
                </span>
              </label>
              <button
                id="screen-reader"
                role="switch"
                aria-checked={settings.screenReaderMode}
                onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.screenReaderMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className="sr-only">Toggle screen reader mode</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AccessibilityPanel;
