import Navigation from "../components/Navigation"

export default function About() {
  return <div className="w-full flex flex-col h-full" >
    <div className="w-full h-20">
<Navigation />  
    </div>
<div className="w-full h-full mx-5 my-3 bg-green ">
  <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">  
    <h1 className="text-3xl font-bold mb-4 text-center text-pink-500">About SnapCharm Online PhotoBooth</h1>
    <p className="text-lg text-gray-700 mb-6">
      SnapCharm Online PhotoBooth is your go-to solution for capturing memorable moments with a touch of magic.
    </p>
  </div>
</div>

  </div>
}