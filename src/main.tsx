import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ImageContextProvider } from './Context/ImageContextProvider.tsx'
import SnapCharmText from "./components/SnapCharmText.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<SnapCharmText />}>
    <ImageContextProvider>
    <App />
    </ImageContextProvider>
    </Suspense>
   
  </StrictMode>,
)
