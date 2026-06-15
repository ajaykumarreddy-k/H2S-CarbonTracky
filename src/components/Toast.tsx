import React, { createContext, useContext, useState, useCallback, ReactNode } from'react';
import * as ToastPrimitive from'@radix-ui/react-toast';
import { CheckCircle2, AlertCircle, Info, X } from'lucide-react';
import { cn } from'../lib/utils';

type ToastType ='success' |'error' |'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (payload: { type: ToastType; message: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(({ type, message }: { type: ToastType; message: string }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map(({ id, type, message }) => (
          <ToastItem key={id} type={type} message={message} onOpenChange={(open) => !open && removeToast(id)} />
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]"/>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

function ToastItem({ type, message, onOpenChange }: { key?: string | number; type: ToastType; message: string; onOpenChange: (open: boolean) => void }) {
  const icons = {
    success: <CheckCircle2 size={16} className="text-[#1e8e3e]"/>,
    error: <AlertCircle size={16} className="text-[#d93025]"/>,
    info: <Info size={16} className="text-[#185FA5]"/>
  };

  const bgs = {
    success:'bg-[#e6f4ea] border-[#81c995] text-[#1e8e3e]',
    error:'bg-[#fce8e6] border-[#f28b82] text-[#d93025]',
    info:'bg-[#E6F1FB] border-[#B5D4F4] text-[#185FA5]'
  };

  return (
    <ToastPrimitive.Root
      onOpenChange={onOpenChange}
      className={cn(
"group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-2",
        bgs[type]
      )}
      duration={4000}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <ToastPrimitive.Description className="text-sm font-medium">
          {message}
        </ToastPrimitive.Description>
      </div>
      <ToastPrimitive.Close className="absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100">
        <X size={14} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
