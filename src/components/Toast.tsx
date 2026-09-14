import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastType = 'error' | 'success'
type ToastMessage = { id: number; message: string; type: ToastType }

const ToastContext = createContext<{ showToast: (message: string, type?: ToastType) => void }>({
  showToast: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}