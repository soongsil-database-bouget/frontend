import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles = {
    primary: 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all',
    outline: 'border-2 border-rose-300 text-rose-600 bg-white hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 focus:ring-rose-300',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

