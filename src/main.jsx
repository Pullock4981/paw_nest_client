import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// React Router
import { RouterProvider } from 'react-router';
import router from './Routes/router.jsx';

// Firebase Auth
import FirebaseAuthProvider from './Context/FirebaseAuthProvider.jsx';

// ✅ Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// ✅ Your Stripe publishable key (replace this with your real one from Stripe Dashboard)
const stripePromise = loadStripe('pk_test_51RpBug4IB8WYu7WO80bqWXQ7KPk7B2T3YuxJVWdkqvfXSrZpQAiAWm4PqV2ayDjXScguwn9JCe7WLClOHXyag4zR007bRxO7Bu');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <FirebaseAuthProvider>
        <RouterProvider router={router} />
      </FirebaseAuthProvider>
    </Elements>
  </StrictMode>
);
