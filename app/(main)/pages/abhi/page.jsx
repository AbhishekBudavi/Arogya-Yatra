"use client";
import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-800">{question}</span>
        <span className="text-blue-600 text-xl font-bold">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white text-gray-600">{answer}</div>
      )}
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="text-4xl mb-4 text-blue-600">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const RegistrationMethod = ({ title, steps }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
      {title}
    </h3>
    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
      {steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ol>
  </div>
);

const AbhaHealthIdPage = () => {
  const faqs = [
    {
      question: "Is ABHA ID free?",
      answer: "Yes, registration is completely free of cost."
    },
    {
      question: "Can I link old medical records to ABHA?",
      answer: "Yes, you can scan and upload past records via the ABHA app."
    },
    {
      question: "Is Aadhaar mandatory for ABHA?",
      answer: "No, you can also use a driving license or mobile number for registration."
    },
    {
      question: "How to download ABHA card?",
      answer: "Login to ABHA portal/app and download from your profile section."
    }
  ];

  const benefits = [
    {
      icon: "📱",
      title: "Digital Health Records",
      description: "Store lab reports, prescriptions, and medical history securely"
    },
    {
      icon: "⚡",
      title: "Quick Access",
      description: "Share records instantly via QR code or ABHA number"
    },
    {
      icon: "💰",
      title: "Cashless Treatment",
      description: "Avail benefits under government health schemes"
    },
    {
      icon: "🔒",
      title: "Privacy Control",
      description: "You decide who can access your health information"
    }
  ];

  const onlineSteps = [
    "Visit ABHA Portal (https://abha.abdm.gov.in)",
    "Click on 'Create ABHA Number'",
    "Enter your Aadhaar or mobile number",
    "Verify via OTP",
    "Fill basic details",
    "Get your 14-digit ABHA ID"
  ];

  const offlineSteps = [
    "Visit an Ayushman Bharat-empanelled hospital",
    "Provide your Aadhaar and mobile number",
    "The staff will help generate your ABHA ID"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ABHA Health ID Card – Registration & Benefits
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Your unique digital health identity for seamless healthcare services
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* What is ABHA Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
              What is ABHA Health ID?
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-6">
                ABHA (Ayushman Bharat Health Account) is a 14-digit unique identification number that enables you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Securely store and access your health records digitally</li>
                <li>Share medical history with healthcare providers easily</li>
                <li>Access benefits under Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)</li>
                <li>Manage your health data in one place</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
              Benefits of ABHA Health ID
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Registration Guide */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
              How to Register for ABHA Health ID
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <RegistrationMethod
                title="Online Method"
                steps={onlineSteps}
              />
              <RegistrationMethod
                title="Offline Method"
                steps={offlineSteps}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© {new Date().getFullYear()} ABHA Health ID Information Portal. Not an official government site.</p>
          <div className="flex justify-center space-x-6">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Use</a>
            <a href="/contact" className="hover:underline">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AbhaHealthIdPage;