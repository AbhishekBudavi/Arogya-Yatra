"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import logo1 from "../assest/icons/logos/logo.webp";
import logo2 from "../assest/icons/logos/logo2.png";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/pages/features" },
  { name: "About Us", href: "/pages/about" },
  { name: "Company", href: "#" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogo1, setShowLogo1] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginButton, setIsLoginButton]=useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-sky-50 backdrop-blur-md shadow-lg border-b border-gray-200/20"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1126px] px-0 ">
          <div className="flex h-[88px] items-center justify-between space-x-8 py-3">
            <div className="flex items-center space-x-8 ">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  alt="Logo"
                  src={logo1}
                  className="object-left h-16 w-auto object-contain transition-all duration-500 pl-0.1"
                />
              </Link>
            </div>
            <div className="flex lg:hidden ml-auto">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12 ml-15">
              {navigationLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-semibold leading-6 text-gray-700 hover:text-indigo-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Login button */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link href="/auth/login">
                <Button
                  className={`h-[40px] w-30 px-6 text-base font-semibold
                    ${
                      isScrolled
                        ? "bg-gradient-to-bl from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
                        : "bg-transparent text-gray-700 hover:bg-gradient-to-bl from-purple-600 to-blue-500 hover:text-white"
                    }
                    focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
                  `}
                >
                  Log in{" "}
                </Button>
                <span aria-hidden="true"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                alt="Logo"
                src={showLogo1 ? logo1 : logo2}
                className="h-12 w-auto transition-all duration-500"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
