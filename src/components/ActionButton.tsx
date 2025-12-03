import type { MouseEventHandler } from "react"
import { Link } from "react-router-dom"

interface ActionButtonProp {
    handleDownload: MouseEventHandler<HTMLButtonElement>
}

export default function ActionButton({handleDownload}: ActionButtonProp) {
    
    return <div className="flex gap-4 pt-4">
            <Link
              to="/booth"
              className="flex-1 bg-pink-500 hover:bg-pink-600 transition text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg text-center font-semibold"
            >
              Take Photos Again
            </Link>
            <button
              onClick={handleDownload}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg font-semibold"
            >
              Download Collage
            </button>
          </div>
}

