import  { useContext, type RefObject, type SetStateAction} from "react"
import { imageContext } from "../Context/ImageContext"
import type { Sticker } from "../hooks/useDownloadCollage"
import { onStickerSelect, onResizeHandleDown } from "../utils/stickerHelpFunction"

interface CanvasProp {
    containerRef:  RefObject<HTMLDivElement>
    canvasRef : RefObject<HTMLCanvasElement>
    bgColor : string
    stickers : Sticker[]
    isMoving : boolean
   selectedStickerId : string | null
   activeSticker : { id: string; offsetX: number; offsetY: number } | null
   setResizeData : (d : {
    id: string;
    pos: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;} | null ) => null
   setSelectedStickerId: React.Dispatch<SetStateAction<string | null>>
   setResizeStickerId : React.Dispatch<SetStateAction<string | null>>
    setActiveSticker : (d :{ id: string; offsetX: number; offsetY: number } | null) => void
    setIsMoving : (b : boolean) => void
   

}
export default function Canvas({containerRef, bgColor, stickers,canvasRef,
   selectedStickerId, isMoving, setIsMoving,
    activeSticker, setSelectedStickerId, setActiveSticker, 
    setResizeStickerId,setResizeData }:CanvasProp) {
    const context = useContext(imageContext)
    if (!context) throw Error("No Image")
    
    const {data} = context
    
    return <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row justify-center items-start mt-5 gap-8">
        {/* Canvas container with relative positioning to overlay stickers */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <div ref={containerRef} className="relative border border-gray-300 rounded-xl shadow-lg bg-white overflow-hidden max-w-2xl">
            {data && (
              <>
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-xl"
                  style={{ backgroundColor: bgColor }}
                />
                {/* Draggable stickers overlay */}
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onMouseDown={(e) => onStickerSelect(e, sticker.id, setSelectedStickerId,setResizeStickerId,setActiveSticker,setIsMoving,)}
                    onTouchStart={(e) => onStickerSelect(e, sticker.id,setSelectedStickerId,setResizeStickerId,setActiveSticker,setIsMoving,)}
                    style={{
                      position: "absolute",
                      top: sticker.y,
                      left: sticker.x,
                      width: sticker.width,
                      height: sticker.height,
                      cursor: isMoving && activeSticker?.id === sticker.id ? "grabbing" : "grab",
                      userSelect: "none",
                      zIndex: 10,
                      border: selectedStickerId === sticker.id ? "2px solid #ec4899" : "none",
                      borderRadius: 8,
                      willChange: "transform",
                      transform: "translateZ(0)",
                    }}
                  >
                    <img
                      src={sticker.imgSrc}
                      alt="sticker"
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onDragStart={(e) => e.preventDefault()}
                    />

                    {/* Resizing handles */}
                    {selectedStickerId === sticker.id && (
                      <>
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                          <div
                            key={pos}
                            data-pos={pos}
                            className={`absolute w-3 h-3 bg-white border border-gray-500 rounded-full hover:scale-110 transition-transform`}
                            style={{
                              cursor: pos.includes("left")
                                ? pos.includes("top")
                                  ? "nwse-resize"
                                  : "nesw-resize"
                                : pos.includes("top")
                                ? "nesw-resize"
                                : "nwse-resize",
                              ...(pos === "top-left" && { top: -6, left: -6 }),
                              ...(pos === "top-right" && { top: -6, right: -6 }),
                              ...(pos === "bottom-left" && { bottom: -6, left: -6 }),
                              ...(pos === "bottom-right" && { bottom: -6, right: -6 }),
                              zIndex: 15,
                            }}
                            onMouseDown={(e) => onResizeHandleDown(e, sticker, pos,setSelectedStickerId,setResizeStickerId,setResizeData,)}
                            onTouchStart={(e) => onResizeHandleDown(e, sticker, pos,setSelectedStickerId,setResizeStickerId, setResizeData)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
            {!data && (
              <div className="w-full h-80 flex items-center justify-center text-center rounded-xl shadow-lg border border-gray-300">
                No Image Taken
              </div>
            )}
          </div>
          </div>
          </div>
       
}