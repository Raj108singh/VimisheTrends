import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Login from '../../components/pages/login';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Login />
      <Footer />
    </div>
  );
}