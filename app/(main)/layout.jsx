

import Navbar from "../components/navbar";
import Footer from '../components/footer'



export default function RootLayout({ children }) {
  return (
    <>
        <Navbar />
        <main>
        {children}
        </main>
            <Footer />
      </>
  );
}
