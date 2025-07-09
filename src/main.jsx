import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// react router
import {
  RouterProvider,
} from "react-router";
import router from './Routes/router.jsx';
import FirebaseAuthProvider from './Context/FirebaseAuthProvider.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseAuthProvider>
      <RouterProvider router={router} />
    </FirebaseAuthProvider>
  </StrictMode>,
)
