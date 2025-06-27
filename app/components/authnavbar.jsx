import Link from 'next/link'
import Image from 'next/image'
import logo1 from "../assest/icons/logos/logo.webp";
import logo from '../assest/icons/logos/Your_paragraph_text-removebg-preview.png'
export default function AuthNav(){
    return(
       
        <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all bg-white"
      >
        <div className="mx-auto max-w-[1126px] px-0 ">
          <div className="flex h-[88px] items-center justify-between space-x-8 py-3">
            <div className="flex items-center space-x-8 ">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  alt="Logo"
                  src={logo}
                  className="object-left h-40  object-contain transition-all duration-500 pl-0.1"
                />
              </Link>
            </div>
            </div>
            </div>
            </nav>
   
    )
}