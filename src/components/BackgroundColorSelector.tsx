import { ChromePicker } from "react-color";
import { useEffect } from "react";
import { useRef } from "react";

interface backgroundColorSelector {
    setBgColor : (color : string) =>  void
    bgColor : string
    showPicker1 : boolean
    setShowPicker1 : (showPickerShow1 : boolean) => void
    predefinedColors : Array<string>
    fontColor : string
    setFontColor : (fontColor : string) => void
    showPicker :boolean
    setShowPicker : (showPicker : boolean) => void 
    
}


export default function backgroundColorSelector({ setBgColor,setShowPicker,showPicker, setFontColor, bgColor,fontColor, showPicker1, setShowPicker1,predefinedColors}:backgroundColorSelector) {
 
  const div = useRef<HTMLDivElement>(null)
  const LostFocus = (e : MouseEvent) => {
   if(div.current && !div.current.contains(e.target as Node)) {}
    setShowPicker(false) 
    console.log("outsideClick")
    setShowPicker1(false)
    console.log("outsideClick")
   }
  useEffect(() => {
    document.addEventListener("mouseup", LostFocus)
    return () => {
 document.removeEventListener("mouseup", LostFocus)
    } 

  }, [])
    return <div  className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Background Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border transition-all duration-200 hover:scale-110 ${
                      bgColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                    type="button"
                    
                  />
                ))}
                <button
                  onClick={() => setShowPicker1(!showPicker1)}
                  className="w-8 h-8 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 hover:scale-110 transition-transform"
                  type="button"
                />
              </div>
              {showPicker1 && (
                <div  ref={div} className="absolute z-20 mt-2">
                  <ChromePicker color={bgColor} onChange={(c) => setBgColor(c.hex)} disableAlpha />
                </div>
              )}
           
            
           <h4 className="font-semibold text-gray-700 mb-3">Caption Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border transition-all duration-200 hover:scale-110 ${
                      fontColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFontColor(color)}
                    type="button"
                  />
                ))}
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-8 h-8 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 hover:scale-110 transition-transform"
                  type="button"
                />
              </div>
              {showPicker && (
                <div ref={div} className="absolute z-20 mt-2">
                  <ChromePicker color={fontColor} onChange={(c) => setFontColor(c.hex)} disableAlpha />
                </div>
              )} 

            </div>
            </div>

}