import React from "react"

interface StickerUploadProps {
    handleStickerUpload : React.ChangeEventHandler<HTMLInputElement>   

}

export default function StickerUpload({handleStickerUpload}: StickerUploadProps) {
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
            </div>
}