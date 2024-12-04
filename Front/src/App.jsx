import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { routes } from "./utils/routes"

function App() {

  return (
    <>
      <Router>
        <Routes>
          {routes.map((r) => {
            return <Route path={r.path} element={r.element} key={r.id} />
          })}
        </Routes>
      </Router>
    </>
  )
}

export default App
