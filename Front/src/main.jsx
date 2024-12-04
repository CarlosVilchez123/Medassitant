import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { UserProvider } from "../src/userContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> {/* Envolver App con el UserProvider */}
      <App />
    </UserProvider>
  </StrictMode>
)
