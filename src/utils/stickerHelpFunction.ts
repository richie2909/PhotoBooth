import type { Sticker } from "../hooks/useDownloadCollage";
export const onStickerSelect = (e: React.MouseEvent | React.TouchEvent,
   stickerId: string 
   ,setSelectedStickerId : (selectedSticker : string | null) => void ,
    setResizeStickerId : (r :string | null) => void,
    setActiveSticker : (data : {id : string, offsetX : number, offsetY: number}) => void,
    setIsMoving : (value : boolean) => void
  ) => {
e.stopPropagation();
setSelectedStickerId(stickerId);
setResizeStickerId(null);
// Only start move if not on a handle
if ('button' in e && e.button !== 0) return;
if (e.target && (e.target as HTMLElement).classList.contains('resize-handle')) return;
// For move
if ('clientX' in e) {
  const target = e.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  setActiveSticker({ id: stickerId, offsetX, offsetY });
  setIsMoving(true);
} else if ('touches' in e && e.touches.length === 1) {
  const touch = e.touches[0];
  const target = e.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left;
  const offsetY = touch.clientY - rect.top;
  setActiveSticker({ id: stickerId, offsetX, offsetY });
  setIsMoving(true);
}
};

export  const onResizeHandleDown = (e: React.MouseEvent | React.TouchEvent,
   sticker: Sticker, pos: string,
   setSelectedStickerId : (selectedSticker : string | null) => void ,
    setResizeStickerId : (r : string | null) => void,
    setResizeData : (data :{
    id: string;
    pos: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null) => void
  ) => {
    e.stopPropagation();
    setSelectedStickerId(sticker.id);
    setResizeStickerId(sticker.id);
    if ('clientX' in e) {
      setResizeData({
        id: sticker.id,
        pos,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: sticker.width,
        startHeight: sticker.height,
      });
    } else if ('touches' in e && e.touches.length === 1) {
      const touch = e.touches[0];
      setResizeData({
        id: sticker.id, 
        pos,
        startX: touch.clientX,
        startY: touch.clientY,
        startWidth: sticker.width,
        startHeight: sticker.height,
      });
    }
  };

 
  



export const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>
     ,setSelectedStickerId : (selectedSticker : string | null) => void ,
    setResizeStickerId : (r :string | null) => void,
    setStickers : React.Dispatch<React.SetStateAction<Sticker[]>>
  

) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgSrc = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Calculate initial size maintaining aspect ratio
        const maxSize = 150;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        const newStickerId = Math.random().toString(36).substring(2, 9);
        setStickers((prev) => [
          ...prev,
          {
            id: newStickerId,
            imgSrc,
            x: 50,
            y: 50,
            width,
            height,
          },
        ]);
        setSelectedStickerId(newStickerId);
        setResizeStickerId(null);
      };
      img.src = imgSrc;
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

