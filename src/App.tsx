import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'sonner'
import MainPage from "./pages/main-page";
import "react";
import {DashboardPage} from "@/pages/dashboard-page.tsx";
import {ErrorPage} from "@/pages/error-page.tsx";
import {FormPage} from "@/pages/form-page.tsx";
import {TablePage} from "@/pages/table-page.tsx";

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
                  <Route path="/" element={<MainPage />}>
                      <Route index element={<ErrorPage />} />
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="form" element={<FormPage />} />
                      <Route path="table" element={<TablePage />} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App