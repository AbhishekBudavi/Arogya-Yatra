'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StakeholderCards() {
  const pathname = usePathname();

  const isLogin = pathname.includes('/login');
  const isRegister = pathname.includes('/register');

  const basePath = isLogin
    ? '/auth/login'
    : isRegister
    ? '/auth/register'
    : '/';

  const stakeholders = [
    {
      title: 'Patient',
      bgColor: 'bg-green-200',
      hoverBg: 'hover:bg-green-300',
      textColor: 'text-green-800',
      shadowColor: 'hover:shadow-green-200/50',
      route: 'patient',
    },
    {
      title: 'Doctor',
      bgColor: 'bg-blue-200',
      hoverBg: 'hover:bg-blue-300',
      textColor: 'text-blue-800',
      shadowColor: 'hover:shadow-blue-200/50',
      route: 'doctor',
    },
    {
      title: 'Hospital',
      bgColor: 'bg-pink-200',
      hoverBg: 'hover:bg-pink-300',
      textColor: 'text-pink-800',
      shadowColor: 'hover:shadow-pink-200/50',
      route: 'hospital',
    },
  ];

  const cardBaseClasses = `
    w-full max-w-[280px] h-48 sm:w-60 sm:h-40
    rounded-2xl shadow-lg hover:shadow-2xl
    p-6 flex justify-center items-center
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:-translate-y-2
    cursor-pointer border border-white/50
    backdrop-blur-sm
  `;

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="pt-[88px] sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Our Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to get started with our comprehensive healthcare
              management system
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-10">
            {stakeholders.map(({ title, bgColor, hoverBg, textColor, shadowColor, route }) => (
              <Link
                key={title}
                href={`${basePath}/${route}`}
                className={`${cardBaseClasses} ${bgColor} ${hoverBg} ${textColor} ${shadowColor}`}
              >
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
                  <div className="mt-2 w-12 h-1 bg-current rounded-full mx-auto opacity-60" />
                </div>
              </Link>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-16 mb-8 overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-300 rounded-2xl shadow-2xl">
            <div className="animate-scroll-right bg-gradient-to-r from-blue-600 via-purple-600 to-pink-800 bg-clip-text text-transparent">
              <p className="text-lg md:text-xl font-semibold py-4 whitespace-nowrap">
                ✨ Select your role above to begin the {basePath} process • Join
                thousands of healthcare professionals • Experience seamless
                healthcare management •
              </p>
            </div>
          </div>

          {/* Animation CSS */}
          <style jsx>{`
            @keyframes scrollRight {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }

            .animate-scroll-right {
              animation: scrollRight 15s linear infinite;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}