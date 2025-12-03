

interface CaptionProps{
    selectedLanguage : 'en' | 'ja' | 'ko'
    setSelectedLanguage :  (selectedLanguage: 'en' | 'ja' | 'ko') => void
}



export default function Caption({selectedLanguage, setSelectedLanguage}: CaptionProps) {


return<div>
 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">Caption Language</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'en'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('ja')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'ja'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                日本語
              </button>
              <button
                onClick={() => setSelectedLanguage('ko')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'ko'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                한국어
              </button>
            </div>
         </div><div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">Caption Language</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'en'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('ja')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'ja'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                日本語
              </button>
              <button
                onClick={() => setSelectedLanguage('ko')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === 'ko'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                type="button"
              >
                한국어
              </button>
            </div>
         </div>

    
   
</div> }

