import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles = {
    primary: 'bg-pink-400 text-white hover:bg-pink-500 focus:ring-pink-500',
    outline: 'border border-pink-300 text-pink-500 bg-white hover:bg-pink-50 focus:ring-pink-300',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

