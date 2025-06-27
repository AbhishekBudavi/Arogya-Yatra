'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Home, User, Briefcase, Mail, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { id: 'home', label: 'Home', href: '#home', icon: Home },
    { id: 'about', label: 'About', href: '#about', icon: User },
    { 
      id: 'services', 
      label: 'Services', 
      href: '#services', 
      icon: Briefcase,
      dropdown: [
        { label: 'Web Development', href: '#web-dev' },
        { label: 'Mobile Apps', href: '#mobile' },
        { label: 'Consulting', href: '#consulting' }
      ]
    },
    { id: 'contact', label: 'Contact', href: '#contact', icon: Mail }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (linkId) => {
    setActiveLink(linkId);
    setIsOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl">
              BrandLogo
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigationLinks.map((link) => (
                <div key={link.id} className="relative group">
                  {link.dropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeLink === link.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-white/50 hover:text-blue-600 hover:shadow-md'
                        }`}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                      >
                        <link.icon className="w-4 h-4 mr-2" />
                        {link.label}
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/20 py-2 z-50">
                          {link.dropdown.map((item, index) => (
                            <a
                              key={index}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => handleLinkClick(link.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeLink === link.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white/50 hover:text-blue-600 hover:shadow-md'
                      }`}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md border-t border-gray-200/20">
          {navigationLinks.map((link) => (
            <div key={link.id}>
              {link.dropdown ? (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.label}
                    <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {dropdownOpen && (
                    <div className="pl-6 space-y-1">
                      {link.dropdown.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-150"
                          onClick={() => {
                            setDropdownOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={link.href}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors duration-150 ${
                    activeLink === link.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </a>
              )}
            </div>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 pb-2">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Modern Navigation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A professional, responsive navigation bar with glassmorphism effects and smooth animations.
          </p>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Glassmorphism design with backdrop blur</li>
                <li>• Smooth scroll-triggered transparency changes</li>
                <li>• Mobile hamburger menu with animations</li>
                <li>• Dropdown menus with hover effects</li>
                <li>• Active page highlighting</li>
                <li>• Accessibility features (ARIA labels, keyboard navigation)</li>
                <li>• Gradient CTA button with hover scaling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;