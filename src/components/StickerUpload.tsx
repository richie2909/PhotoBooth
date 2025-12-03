import React from "react"
import type { Sticker } from "../hooks/useDownloadCollage"

interface StickerUploadProps {
    handleStickerUpload : React.ChangeEventHandler<HTMLInputElement>   
    stickers :Sticker[]
    selectedStickerId : string | null
    setSelectedStickerId: (sticker : string | null) => void
    setStickers :React.Dispatch<React.SetStateAction<Sticker[]>>

}

export default function StickerUpload({handleStickerUpload, stickers, selectedStickerId, setSelectedStickerId, setStickers}: StickerUploadProps) {
    return <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Add Stickers</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStickerUpload}
                        className="hidden"
                        id="sticker-upload"
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-gray-600">Upload Sticker</span>
                      </div>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">Supported formats: PNG, JPG, GIF (max 5MB)</p>
              </div>
            </div>

      {stickers.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Your Stickers</h4>
                <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2">
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className={`relative group aspect-square border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all ${
                        selectedStickerId === sticker.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                    >
                      <img
                        src={sticker.imgSrc}
                        alt="sticker"
                        className="w-full h-full object-contain p-1"
                        onClick={() => setSelectedStickerId(sticker.id)}
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
                            if (selectedStickerId === sticker.id) setSelectedStickerId(null);
                          }}
                          className="p-1 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          type="button"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
              
            </div>
}