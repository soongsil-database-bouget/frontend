import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import Modal from '../Modal'
import UploadDropzone from '../UploadDropzone'
import { addRecentlyViewed } from '../../utils/recentlyViewed'

export default function BouquetDetail({ item, mode = 'others' }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [userImage, setUserImage] = useState(null)

  const applyButtonLabel =
    mode === 'my' ? '내 사진에 부케 적용하기' : '부케 착용해보기'

  useEffect(() => {
    addRecentlyViewed({ imageUrl: item.imageUrl, title: item.title })
    // run once per item
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.imageUrl])

  return (
    <>
      <div className="max-w-screen-lg mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.title} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{item.title}</h1>
            <div className="mt-3 flex gap-2">
              {item.tags?.map((t, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-pink-50 text-pink-600 border border-pink-200">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-700 leading-relaxed">{item.description}</p>

            {item.vendor && (
              <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-6">
                <h2 className="text-base font-semibold text-gray-900">업체 정보</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 grid place-items-center text-gray-400">🏬</div>
                    <div className="text-gray-800">{item.vendor.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 grid place-items-center text-gray-400">📍</div>
                    <div className="text-gray-800">{item.vendor.address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 grid place-items-center text-gray-400">📸</div>
                    <div className="text-gray-800">{item.vendor.instagram}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex gap-3">
              <Button className="h-11 px-5" onClick={() => setOpen(true)}>
                {applyButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
            </div>
            <div className="text-2xl text-gray-400">+</div>
            <div className="flex-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 grid place-items-center h-40 overflow-hidden">
              {userImage ? (
                <img src={userImage} alt="내 사진" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-gray-400 text-sm">내 사진</div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <UploadDropzone onFileSelected={(dataUrl) => setUserImage(dataUrl)} />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" className="h-10 px-4" onClick={() => setOpen(false)}>닫기</Button>
            <Button
              className="h-10 px-5 disabled:opacity-50"
              disabled={!userImage}
              onClick={() => {
                navigate('/apply/result', { state: { userImage, bouquetImage: item.imageUrl } })
              }}
            >
              적용하기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}


