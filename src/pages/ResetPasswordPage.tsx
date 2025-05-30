// src/pages/ResetPasswordPage.tsx
import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
// You might not want the full Header and Footer on this page for a cleaner UI.
// import { Header } from '../components/Header';
// import Footer from '../components/Footer';

const ResetPasswordPage: React.FC = () => {
  return (
    <>
      {/* <Header /> */} {/* Optional: Consider a minimal header or none */}
      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <ResetPasswordForm />
      </main>
      {/* <Footer /> */} {/* Optional: Consider no footer */}
    </>
  );
};

export default ResetPasswordPage;
