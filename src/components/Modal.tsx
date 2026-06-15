import React from'react';
import * as Dialog from'@radix-ui/react-dialog';
import { X } from'lucide-react';
import { cn } from'../lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?:'sm' |'md' |'lg';
}

export function Modal({ open, onClose, title, children, size ='md' }: ModalProps) {
  const sizeClass = {
    sm:'max-w-sm',
    md:'max-w-md',
    lg:'max-w-lg'
  }[size];

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"/>
        <Dialog.Content className={cn("fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 bg-white  p-6 shadow-xl sm:rounded-2xl border border-gray-200", sizeClass)}>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-h2 text-gray-900">
              {title}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100 :bg-gray-800 text-gray-500 transition-colors"aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
