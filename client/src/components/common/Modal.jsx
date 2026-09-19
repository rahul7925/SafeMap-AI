import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${maxWidth} max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl`}
            style={{
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b shrink-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <h3 className="text-[18px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--text-2)' }}>
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-3)]"
                style={{ color: 'var(--text-3)' }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
