import React from 'react';
import { DM_Sans} from 'next/font/google'
 
const dmsans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-dmsans',
})
import { BriefcaseMedical } from 'lucide-react';
import {
  UserCircleIcon,
  UserPlusIcon,
  QrCodeIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import healthAppImage from '../assest/images/patientdetail.png'; // Replace with your actual image path
import Image from 'next/image';
const AllInformation = () => {
  const features = [
    {
      title: "Medical Health Profile",
      icon: <UserPlusIcon className="h-10 w-10 text-purple-500" />,
      description: "Complete overview of your medical history and current health status."
    },
    {
      title: "QR Scan Access",
      icon: <QrCodeIcon className="h-10 w-10 text-blue-500" />,
      description: " One scan gives doctors secure access to patient records, prescriptions, and reports"
    },
    {
      title: " E-Prescription Vault",
      icon: < BriefcaseMedical className="h-10 w-10 text-purple-500" />,
      description: "Store, access, and manage all your medical prescriptions in one secure place available whenever you need it.."
    },
    {
      title: "Appointment Scheduling",
      icon: <CalendarIcon className="h-10 w-10 text-blue-500" />,
      description: "Book and manage doctor visits with ease."
    },
    {
      title: "AI Diagnosis Summary",
      icon: <ChartBarIcon className="h-6 w-6 text-purple-500" />,
      description: "Enter key symptoms or medical terms our AI builds a complete, editable diagnosis for quick and clear communication."
    },
    {
      title: "Emergency Alerts",
      icon: <BellIcon className="h-6 w-6 text-blue-500" />,
      description: "Quick access to emergency services when you need them."
    }
  ];

  return (
    <>
<div className="px-4 sm:px-6 lg:px-8 font-dmsans">
  <div className="max-w-7xl mx-auto">

    {/* For sm/md screens: Image above cards */}
    <div className="block lg:hidden mb-8 text-center">
      <Image
        src={healthAppImage}
        alt="Health App Screen"
        className="mx-auto w-60 sm:w-72 md:w-80 rounded-3xl shadow-xl border-8 border-gray-200 object-fit"
      />
    </div>

    {/* Tab and Mobile Layout: Cards in 2 columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:hidden w-full">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-6 bg-white my-4 rounded-xl transition-all hover:shadow-md hover:-translate-y-1 w-full max-w-md mx-auto"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
            {feature.icon}
          </div>
          <p className={`mt-2 text-gray-600 ${dmsans.variable}`}>{feature.description}</p>
        </div>
      ))}
    </div>

    {/* Large Screen Layout: Original Flex */}
    <div className="hidden lg:flex items-center justify-center gap-14">
      {/* Left 3 features */}
      <div className="space-y-8 w-full lg:w-auto">
        {features.slice(0, 3).map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white my-8 rounded-2xl transition-all hover:shadow-md hover:-translate-y-1 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              {feature.icon}
            </div>
            <p className={`mt-2 text-gray-600 ${dmsans.variable}`}>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Center Image */}
      <div className="flex-shrink-0 w-64 md:w-70 lg:w-85">
        <Image
          src={healthAppImage}
          alt="Health App Screen"
          className="rounded-3xl shadow-xl/30 border-8 border-gray-200 object-fit"
        />
      </div>

      {/* Right 3 features */}
      <div className="space-y-8 w-full lg:w-auto">
        {features.slice(3, 6).map((feature, index) => (
          <div
            key={index}
            className="p-6 my-8 bg-white rounded-xl transition-all hover:shadow-md hover:-translate-y-1 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              {feature.icon}
            </div>
            <p className={`mt-2 text-gray-600 ${dmsans.variable}`}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


  </>
  );
};

export default AllInformation;