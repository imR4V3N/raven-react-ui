import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "./pages/main-page";
import "react";
import {DashboardPage} from "@/pages/dashboard-page.tsx";
import {ErrorPage} from "@/pages/error-page.tsx";
import {FormPage} from "@/pages/form-page.tsx";
import {TablePage} from "@/pages/table-page.tsx";
import {Toaster} from "@/components/ui/toaster/toaster.tsx";
import {ToasterPage} from "@/pages/toaster-page.tsx";

function App() {

  return (
      <>
          <Toaster>
              <BrowserRouter>

                  <Routes>
                      <Route path="/" element={<MainPage />}>
                          <Route index element={<ErrorPage />} />
                          <Route path="dashboard" element={<DashboardPage />} />
                          <Route path="form" element={<FormPage />} />
                          <Route path="table" element={<TablePage />} />
                          <Route path="toaster" element={<ToasterPage />} />
                      </Route>
                  </Routes>
              </BrowserRouter>
          </Toaster>
      </>
  )
}

export default App