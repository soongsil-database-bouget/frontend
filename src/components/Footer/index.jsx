import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="w-full px-4 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Bloomfit. All rights reserved.
      </div>
    </footer>
  )
}

