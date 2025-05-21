import React, {  useState } from "react";
import { imageContext,  } from "./ImageContext";
import type {ImageContext as ImgCtxType} from "./ImageContext"
import type{ReactNode} from "react"
interface ImageProviderProps {
  children: ReactNode;
}

export const ImageContextProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [image, setImage] = useState<ImgCtxType[]>([]);

  return (
    <imageContext.Provider value={{ data: image, setImage }}>
      {children}
    </imageContext.Provider>
  );
};
