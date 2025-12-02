import React, { useEffect } from 'react'

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white w-full max-w-sm rounded-2xl shadow-xl relative z-10 pointer-events-auto"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

