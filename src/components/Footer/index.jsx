import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} bouget. All rights reserved.
      </div>
    </footer>
  )
}

