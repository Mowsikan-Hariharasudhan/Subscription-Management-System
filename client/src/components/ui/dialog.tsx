import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Minimal Fade */}
      <div
        className="fixed inset-0 bg-odoo-dark/60 backdrop-blur-md modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Dialog Panel */}
      <div
        className={cn(
          'relative w-full bg-white/95 backdrop-blur-3xl border-[1.5px] border-black rounded-3xl shadow-[0_20px_60px_-10px_rgba(113,75,103,0.5)] overflow-hidden modal-panel z-10 max-h-[90vh] flex flex-col',
          maxWidths[maxWidth]
        )}
      >
        <div className="px-8 py-5 border-b-[1.5px] border-black flex items-center justify-between bg-white/80 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-odoo-dark tracking-tight">{title}</h3>
            {description && <p className="text-xs text-gray-500 font-medium mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-odoo-dark transition-transform hover:rotate-90 p-1.5 rounded-lg hover:bg-black/5 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
