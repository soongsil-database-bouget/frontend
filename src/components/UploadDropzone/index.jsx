import React, { useCallback, useState } from 'react'

export default function UploadDropzone({ onFileSelected }) {
  const [dragOver, setDragOver] = useState(false)

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) readFile(file)
  }, [])

  const onChange = (e) => {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  const readFile = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      onFileSelected?.(reader.result, file)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className={`rounded-2xl border-2 border-dashed ${dragOver ? 'border-purple-600 bg-purple-200/70 ring-4 ring-purple-300/50' : 'border-purple-300 bg-white'} px-6 py-8 text-center transition`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <div className="mx-auto w-12 h-12 rounded-xl bg-purple-100 text-purple-600 grid place-items-center mb-3">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 13v4H5v-4H3v6h18v-6zM11 7.83V17h2V7.83l3.59 3.58L18 10l-6-6l-6 6l1.41 1.41z"/></svg>
      </div>
      <div className="text-gray-900 font-extrabold">Drag & drop <span className="text-purple-600 underline">images</span>, videos, or any file</div>
      <div className="text-sm text-gray-500 mt-1">or <span className="text-purple-600 underline">browse files</span> on your computer</div>
      <label className="mt-4 inline-flex">
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        <span className="inline-block px-5 h-10 leading-10 rounded-full bg-purple-500 text-white font-semibold mt-4 cursor-pointer">Upload</span>
      </label>
    </div>
  )
}

