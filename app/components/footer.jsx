import React from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';
import Image from 'next/image'
import Logo from '../assest/icons/logos/logo.webp'
const quickLinks = [
    {
        href: '#',
        description: "Home"
    },
    {
        href:'#',
        description:"Features"
    },
       {
        href:'#',
        description:" Company"
    },
       {
        href:'#',
        description:"AboutUs"
    }
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-12">
      {/* Top Section */}
      <div className="max-w-7xl mx-7 mt-7 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Social */}
        <div>
          <div className="flex items-center mb-4">
    
              <Image src={Logo}
              alt="Comapny logo with name"
               height={60}
               weight={60} />
            
            <span className="text-[25px] font-medium pl-2 md:text-[20px] sm:text-20px">Arogyayatra</span>
          </div>
          <div className='my-15'>

          
          <p className="mb-2 font-semibold text-[20px]">Follow us on:</p>
          <div className="flex space-x-4">
            <FaInstagram className="hover:text-gray-300 m-2 h-[20] w-[20]" />
            <FaFacebookF className="hover:text-gray-300 m-2 h-[20] w-[20] " />
            <FaLinkedinIn className="hover:text-gray-300 m-2 h-[20] w-[20]" />
            <FaYoutube className="hover:text-gray-300 m-2 h-[20] w-[20]" />
          </div>
        </div>
</div>
   
            <div>
                <h4 className="font-semibold mb-3 text-[20px]">Resources</h4>
                <ul className="space-y-[20px] text-base text-[18px]">
                <li className='my-4'><a href="#" className="hover:underline ">ABDM</a></li>
                <li className='my-4'><a href="#" className="hover:underline ">ABHA Card</a></li>
                <li className='my-4'><a href="#" className="hover:underline">PHR Apps</a></li>
                <li className='my-4'><a href="#" className="hover:underline">Video Library</a></li>
                <li className='my-4'><a href="#" className="hover:underline">Web Stories</a></li>
                </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[20px]">Quick Links</h4>
       
                  <ul className="space-y-[20px] text-base text-[18px]">
                    {
                        quickLinks.map((list, index) => (
                            <li key={index} className="my-4">
                                <a href={list.href} className="hover:underline">{list.description}</a>
                            </li>
                        ))
                    }
               
                </ul>
            
            </div>

            {/* Address */}
        <div>
          <h4 className="font-semibold text-[20px] mb-3">Ananta Solution Pvt Ltd</h4>
          <p className="text-base text-[18px] mb-4">
            Registered Office: Patil galli Alarwad Belagavi 590020
          </p>
          <h5 className="font-semibold text-[20px] pt-5">Office Address</h5>
          <p className="text-base text-[18px] mt-4">
            212, SYMMERS, Opp yellow lime hotel, Between sarkhej circle and
            shantipura circle, Sarkhej–Sanand road, Sarkhej, Ahmedabad – 382210
          </p>
          <p className="text-base text-[18px] mt-10">Ph: +91-8660485626</p>
        </div>
      </div>

      {/* App Store Buttons */}
      {/* 
      <div className="mt-10 flex justify-center space-x-4">
        <img src="/google-play-badge.png" alt="Google Play" className="h-10" />
        <img src="/app-store-badge.png" alt="App Store" className="h-10" />
      </div>
*/}
      {/* Bottom Section */}
      <div className="mt-8 my-0 gap-6 border-t border-white/20 pt-4 text-center text-base space-x-2 flex flex-wrap justify-center">
        <span>© 2025 health-e</span>
        <span>|</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span>|</span>
        <a href="#" className="hover:underline">Terms & Conditions</a>
        <span>|</span>
        <a href="#" className="hover:underline">Refund, Return & Shipping Policy</a>
        <span>|</span>
        <a href="#" className="hover:underline">Subscription Cancellation Policy</a>
      </div>
    </footer>
  );
}
