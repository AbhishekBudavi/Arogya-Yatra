'use client'
import { useState, useEffect } from 'react';
import { FaUserMd, FaFileMedical, FaSyringe, FaFlask, FaFileInvoiceDollar, FaXRay, FaPlay, FaHeart, FaShieldAlt, FaRocket, FaUsers, FaAward, FaStar } from 'react-icons/fa';
const stats = [
  { icon: FaUsers, number: "2M+", label: "Active Users" },
  { icon: FaUserMd, number: "10K+", label: "Doctors" },
  { icon: FaHeart, number: "50M+", label: "Consultations" },
  { icon: FaAward, number: "4.8★", label: "App Rating" }
];

const features = [
  {
    icon: FaUserMd,
    title: "AI-Powered Consultations",
    description: "24/7 access to qualified healthcare professionals with intelligent symptom analysis and personalized recommendations"
  },
  {
    icon: FaFileMedical,
    title: "Smart e-Prescriptions",
    description: "Digital prescriptions with drug interaction checks, dosage reminders, and pharmacy integration"
  },
  {
    icon: FaSyringe,
    title: "Vaccination Intelligence",
    description: "AI-driven immunization tracking with personalized schedules and community health insights"
  },
  {
    icon: FaFlask,
    title: "Predictive Lab Analytics",
    description: "Advanced analysis of test results with trend predictions and early warning systems"
  },
  {
    icon: FaXRay,
    title: "Medical Imaging AI",
    description: "AI-enhanced radiology reports with automated analysis and specialist consultations"
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Financial Health Tracking",
    description: "Smart expense tracking with insurance optimization and cost prediction algorithms"
  }
];

const timeline = [
  {
    title: "Sign Up & AI Profile Creation",
    description: "Register with biometric verification and let our AI create a comprehensive health profile tailored to your needs and medical history"
  },
  {
    title: "Instant ABHA ID Generation",
    description: "Get your Ayushman Bharat Health Account instantly with blockchain-secured unified health records across all healthcare providers"
  },
  {
    title: "Access Premium Services",
    description: "Unlock teleconsultations, AI health monitoring, predictive analytics, and personalized wellness programs designed for your lifestyle"
  },
  {
    title: "Continuous Health Optimization",
    description: "Track, analyze, and optimize your health journey with real-time insights, preventive care alerts, and community health challenges"
  }
];

const values = [
  "Patient-first approach",
  "Data privacy & security", 
  "Technological innovation",
  "Inclusivity & accessibility",
  "Transparency in care",
  "Community empowerment",
  "Continuous improvement",
  "Ethical AI practices"
];

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "Chief Medical Officer",
    bio: "MD with 15+ years in public health and digital transformation",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Raj Patel",
    role: "AI & Tech Lead",
    bio: "Health tech specialist and machine learning expert",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Dr. Amit Desai",
    role: "Data Science Director",
    bio: "PhD in biomedical informatics and predictive healthcare",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    name: "Neha Gupta",
    role: "Rural Innovation Lead",
    bio: "Expert in healthcare accessibility and community outreach",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      setIsVisible(false);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="font-sans bg-gray-50 overflow-hidden mt-20">
      {/* Enhanced Hero Section with Floating Elements */}
      <section className={`relative bg-gradient-to-br py-32 px-4 md:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-purple-300 bg-opacity-15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Floating Medical Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FaHeart className="absolute top-20 left-10 text-pink-200 text-2xl animate-bounce opacity-70" style={{animationDelay: '0.5s'}} />
          <FaShieldAlt className="absolute top-32 right-20 text-green-200 text-xl animate-pulse opacity-60" style={{animationDelay: '1s'}} />
          <FaUserMd className="absolute bottom-40 left-1/4 text-blue-200 text-3xl animate-bounce opacity-50" style={{animationDelay: '1.5s'}} />
          <FaSyringe className="absolute bottom-60 right-1/3 text-yellow-200 text-xl animate-pulse opacity-60" style={{animationDelay: '2s'}} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white  border-black bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <FaAward className="text-yellow-300 mr-2" />
              <span className="text-sm font-semibold text-black">India's Trusted Health Platform</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 animate-gradient-shine">
            Your Health, One Journey
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-700">
            Arogya Yatra
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 text-black leading-relaxed">
            Bridging healthcare gaps with innovative digital solutions for all Indians through cutting-edge technology and compassionate care
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25">
              <span className="flex items-center">
                Start Your Journey
                <FaRocket className="ml-2 group-hover:animate-bounce" />
              </span>
            </button>

            <button className="bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 border-2 text-white  border-white hover:bg-whiteshadow-lg hover:shadow-xl  hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
     
      {/* Enhanced About Content */}
      <section className="max-w-6xl mx-auto py-20 px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center ">
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed pt-5">
                To democratize healthcare access across India through cutting-edge digital solutions that are affordable, 
                accessible, and easy to use for both urban and rural populations. We believe healthcare is a fundamental right.
              </p>
            </div>
            
            <div className="space-y-6 pt-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <FaStar className="text-white text-xl" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed pt-5">
                A future where every Indian can manage their complete health journey through a single, trusted platform, 
                regardless of location or economic status. Technology that empowers, not complicates.
              </p>
            </div>
            <div className='pt-15'>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <FaHeart className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-600">Our Values</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center group hover:bg-white hover:shadow-md rounded-xl p-3 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
          <div className="order-2 md:order-2 relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-teal-400 rounded-3xl transform rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl transform -rotate-6 group-hover:-rotate-3 transition-transform duration-500 opacity-20"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group-hover:shadow-3xl transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-teal-100 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <FaPlay className="text-indigo-600 text-3xl ml-2" />
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">See Arogya Yatra in Action</h4>
                  <p className="text-gray-600">Watch how we're transforming healthcare across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 animate-gradient-shine mb-6">
              Comprehensive Health Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for your health journey, integrated into one powerful platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2 cursor-pointer ${activeFeature === index ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-50 to-white' : ''}`}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${activeFeature === index ? 'bg-gradient-to-br from-indigo-500 to-teal-500 shadow-lg' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                    <feature.icon className={`text-2xl transition-colors duration-300 ${activeFeature === index ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  {activeFeature === index && (
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400 to-teal-400 rounded-3xl opacity-20 animate-pulse"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                
                {activeFeature === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center text-indigo-600 font-medium text-sm">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Timeline */}
      <section className="max-w-6xl mx-auto py-20 px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold   leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 mb-6">
            Your Health Journey
          </h2>
          <p className="text-xl text-gray-600">Simple steps to transform your healthcare experience</p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 h-full w-1 bg-gradient-to-b from-indigo-400 via-purple-400 to-teal-400 transform -translate-x-1/2 rounded-full shadow-lg"></div>
          
          <div className="space-y-12 md:space-y-20">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`md:w-1/2 p-4 md:p-8 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                  <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
                    <div className="mt-6 flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Get Started</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-auto p-4 flex justify-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-2xl border-4 border-white animate-pulse">
                    {index + 1}
                  </div>
                </div>
                
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A diverse team of healthcare professionals and technologists committed to revolutionizing healthcare in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform scale-110"></div>
                  <div className="w-40 h-40 mx-auto rounded-full bg-white p-2 shadow-2xl border-4 border-white group-hover:border-indigo-200 transition-all duration-300 transform group-hover:scale-105">
                    <div 
                      className="w-full h-full rounded-full bg-cover bg-center shadow-lg"
                      style={{ backgroundImage: `url(${member.avatar})` }}
                    ></div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <div className="inline-block bg-gradient-to-r from-indigo-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 py-20 px-4 md:px-8 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-300 bg-opacity-20 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-300 bg-opacity-15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <FaHeart className="text-6xl mx-auto mb-6 text-pink-200 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Begin Your <br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Health Journey?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-100 leading-relaxed">
            Join over <span className="font-bold text-yellow-200">2 million Indians</span> who are taking control of their health with Arogya Yatra
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-indigo-600 hover:bg-gray-50 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25">
              <span className="flex items-center">
                <FaRocket className="mr-3 group-hover:animate-bounce" />
                Join the Journey
                <div className="ml-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </span>
            </button>
            
            <button className="group bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <span className="flex items-center">
                <FaShieldAlt className="mr-3 group-hover:text-green-500 transition-colors duration-300" />
                Get Your ABHA ID Now
              </span>
            </button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-200 text-sm mb-4">Trusted by healthcare professionals across India</p>
            <div className="flex justify-center items-center space-x-6 opacity-70">
              <div className="flex items-center">
                <FaStar className="text-yellow-300 mr-1" />
                <span className="text-sm">4.8/5 Rating</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center">
                <FaUsers className="text-blue-200 mr-1" />
                <span className="text-sm">2M+ Users</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center">
                <FaAward className="text-green-200 mr-1" />
                <span className="text-sm">Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Enhanced Data

export default AboutUs;