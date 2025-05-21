import { useContext,  } from "react"
import { imageContext } from "../Context/ImageContext"

function PhotoCollection() {
  const context = useContext(imageContext);
 
   if (!context) {
     throw new Error("must be used within provider");
   }
 
   const { data } = context;
  return (
    <div>
        {
          data?.map((img, i) => {
            return <div className="w-90 h-90" key={i}>
              <img className="w-full h-full object-contain" src={img.imgSrc} alt="" />
            </div>
          })
        }
    </div>
  )
}

export default PhotoCollection