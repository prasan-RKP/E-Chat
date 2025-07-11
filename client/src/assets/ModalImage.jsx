import { X } from 'lucide-react'
import React from 'react'

const ModalImage = ({modalImage, setModalImage}) => {
  return (
    <div>
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white bg-gray-700 p-1 rounded-full hover:bg-red-600"
              onClick={() => setModalImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={modalImage}
              alt="Full View"
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ModalImage
