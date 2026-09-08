import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'sonner'
import MainPage from "./pages/main-page";
import "react";

function App() {

  return (
      <>
          <BrowserRouter>
              <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  expand={true}
                  visibleToasts={3}
                  duration={5000}
              />

              <Routes>
                  <Route path="/" element={<MainPage />} />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App