// app/(auth)/layout.jsx

import React from "react";
import AuthNav from "../components/authnavbar";
import Footer from "../components/footer";


export default function AuthLayout({ children }) {
  return (
    <div >
      {/* Auth-specific Navbar */}
      <AuthNav />

      {/* Auth page content */}
     <main >

        <div>{children}</div>
      </main>

      {/* Optional Footer */}
      <Footer />
    </div>
  );
}

  