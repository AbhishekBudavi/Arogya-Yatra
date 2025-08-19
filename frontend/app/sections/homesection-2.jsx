import Image from "next/image";
import Link from "next/link";
import Transform from "../assest/icons/transform-your-healthcare-icon (1).svg";

import Abhaid from "../assest/icons/abha-id.webp";
export default function Section2(){
    return(
        <>
        <section className="my-0">
        <div className=" bg-gradient-to-b from-blue-50 to-white min-h-screen">
          {/* Header */}
          <header className="container mx-auto px-6 py-4">
            <div className="flex flex-col items-center">
              {/* Icon only logo - replace with your actual icon component or SVG */}

              <div className="w-16 h-16 ">
                {" "}
                {/* Adjust size here */}
                <Image
                  src={Transform}
                  alt="Healthcare Icon"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </header>

          {/* Hero Section */}
          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-extrabold leading-tight text-gray-800 mb-6 sm:mb-8">
                Transform Your Healthcare Experience,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 animate-gradient-shine">
                  Create Your ABHA ID Today!
                </span>
              </h1>
            </div>
            <div className="text-gray-800 font-dmsans text-[20px] sm:text-lg text-center mx-auto max-w-2xl">
              <p>
                The Indian healthcare system is going digital. Join us in our
                mission to bridge the gap between you and the healthcare that
                you truly deserve.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center mt-12 md:mt-20 gap-10 md:gap-0">
              {/* Right Side Image Now on the Left */}
              <div className="w-full md:w-1/2 relative mb-8 md:mb-0 md:pr-10 flex justify-center">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <div className="absolute -inset-8 opacity-10 blur-lg"></div>
                  <div className="relative bg-gradient-to-b from-blue-50 to-white rounded-xl">
                    <div className="bg-sky-50 overflow-hidden rounded-xl">
                      <Image
                        src={Abhaid}
                        alt="Healthcare App Interface"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        ABDM Approved
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Content Now on the Right */}
              <div className="w-full md:w-1/2 md:pl-10">
                <p className="text-gray-800 font-dmsans text-base sm:text-lg mb-6 leading-relaxed">
                  In line with the Government of India’s Ayushman Bharat Digital
                  Mission, Health-e is an ABDM approved PHR app that enables you
                  to:
                </p>

                <ul className="space-y-6 sm:space-y-8 mb-8">
                  {[
                    "easily create your ABHA or Health ID and link it to all your medical records on Health-e.",
                    "share your medical data easily with doctors, insurers and medical institutions across India.",
                    "get better health outcomes through a detailed medical history on a single, secure platform.",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start leading-relaxed p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22.438 22.438"
                        className="text-violet-600 flex-shrink-0 mt-1"
                      >
                        <path
                          d="M23,11.781A11.219,11.219,0,1,1,11.781.563,11.219,11.219,0,0,1,23,11.781Zm-12.516,5.94L18.807,9.4a.724.724,0,0,0,0-1.024L17.784,7.351a.724.724,0,0,0-1.024,0L9.972,14.139,6.8,10.97a.724.724,0,0,0-1.024,0L4.755,11.993a.724.724,0,0,0,0,1.024l4.7,4.7A.724.724,0,0,0,10.484,17.721Z"
                          transform="translate(-0.563 -0.563)"
                          fill="#7c5bcf"
                        />
                      </svg>
                      <span className="text-gray-700 font-dmsans text-base sm:text-lg ml-3">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center md:justify-start">
                  <Link href="/auth/register/patient">
                    <button className="bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
                      Create ABHA ID For patient
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
        </>
    )
}