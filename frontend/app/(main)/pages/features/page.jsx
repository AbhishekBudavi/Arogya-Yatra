"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from 'next/link'

// --- Custom SVG Icons
const ICONS = [
  <svg key="stethoscope" width="32" height="32" fill="none"><circle cx="16" cy="16" r="15" stroke="#2EC4B6" strokeWidth="2"/><path d="M16 22c3 0 5-2 5-5V8" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="8" r="2" fill="#2EC4B6"/></svg>,
  <svg key="heart" width="32" height="32" fill="none"><path d="M16 29s-9-7.5-9-13.5A6 6 0 0 1 16 7a6 6 0 0 1 9 8.5C25 21.5 16 29 16 29z" stroke="#3A86FF" strokeWidth="2" fill="#fff"/></svg>,
  <svg key="dna" width="32" height="32" fill="none"><path d="M8 8c8 8 8 16 16 16" stroke="#00B4D8" strokeWidth="2"/><path d="M24 8c-8 8-8 16-16 16" stroke="#00B4D8" strokeWidth="2"/></svg>,
  <svg key="qr" width="32" height="32" fill="none"><rect x="4" y="4" width="8" height="8" stroke="#2EC4B6" strokeWidth="2"/><rect x="20" y="4" width="8" height="8" stroke="#2EC4B6" strokeWidth="2"/><rect x="4" y="20" width="8" height="8" stroke="#2EC4B6" strokeWidth="2"/><rect x="20" y="20" width="8" height="8" stroke="#2EC4B6" strokeWidth="2"/></svg>,
];

// --- Particle Background ---
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: ["#2EC4B6", "#3A86FF", "#00B4D8", "#fff"][Math.floor(Math.random() * 4)],
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
}

// --- Floating Medical Icons ---
function FloatingIcons() {
  return (
    <div className="floating-icons">
      {ICONS.map((icon, i) => (
        <div
          key={i}
          className="floating-icon"
          style={{
            top: `${10 + i * 15}%`,
            left: `${i % 2 === 0 ? 5 : 90}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          {icon}
        </div>
      ))}
      <style jsx>{`
        .floating-icons {
          position: fixed;
          z-index: 2;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
        }
        .floating-icon {
          position: absolute;
          opacity: 0.18;
          animation: float 8s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-30px) scale(1.1);}
        }
      `}</style>
    </div>
  );
}

// --- Hero Section ---
function HeroSection() {
  useEffect(() => {
    // Attempt to play the video on mount (for browsers that block autoplay)
    const video = document.getElementById("hero-video");
    if (video) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // Autoplay might be blocked; ignore error
        });
      }
    }
  }, []);

  return (
    <section className="hero bg-white">
      <div className="hero-content py-15">
        <div>
          <div className="hero-illustration">
            <video
              id="hero-video"
              src="/videos/features1.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "260px",
                height: "320px",
                borderRadius: "1.5rem",
                boxShadow: "0 4px 24px 0 rgba(58,134,255,0.10)",
                objectFit: "cover",
                background: "#e0f7fa"
              }}
              aria-label="Arogyayatra features animation"
              preload="auto"
              controls={false}
            />
          </div>
        </div>
        <div className="hero-text pt-20">
          <h1>
            <span className="leading-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 animate-gradient-shine">
                Arogyayatra</span>:<span className="text-gray-600"> Revolutionizing Healthcare Access Across India</span>
          </h1>
          <p>
            Empowering doctors with instant, secure, and unified patient data—anywhere, anytime. Reduce wait times, improve outcomes, and protect privacy with the future of digital health.
          </p>
          <div className="hero-cta">
            <a href="#doctor-cta" className="btn btn-primary">For Doctors</a>
            <a href="#patient-cta" className="btn btn-secondary">For Patients</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hero {
          position: relative;
          z-index: 3;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem 2rem 1rem;
        }
        .hero-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .hero-illustration {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 220px;
        }
        .hero-text {
          flex: 2;
        }
        .hero-text h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .gradient-text {
          background: linear-gradient(90deg, #3A86FF 0%, #2EC4B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-text p {
          font-size: 1.25rem;
          color: #1a2a3a;
          margin-bottom: 2rem;
          opacity: 0.85;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
        }
        .btn {
          padding: 0.75rem 2rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, color 0.2s;
          box-shadow: 0 2px 12px 0 rgba(58,134,255,0.08);
        }
        .btn-primary {
          background: linear-gradient(90deg, #3A86FF 0%, #2EC4B6 100%);
          color: #fff;
        }
        .btn-primary:hover {
          background: linear-gradient(90deg, #2EC4B6 0%, #3A86FF 100%);
        }
        .btn-secondary {
          background: #fff;
          color: #2EC4B6;
          border: 2px solid #2EC4B6;
        }
        .btn-secondary:hover {
          background: #e0f7fa;
        }
        @media (max-width: 900px) {
          .hero-content {
            flex-direction: column;
            gap: 2rem;
          }
          .hero-illustration {
            min-width: 0;
          }
        }
      `}</style>
    </section>
  );
}

// --- Features Data ---
const FEATURES = [
  {
    title: "QR Code Patient Access",
    icon: ICONS[3],
    description:
      "Instantly retrieve patient records by scanning a QR code—no paperwork, no delays. Doctors can access unified health data in seconds, streamlining consultations and reducing wait times.",
    image: "/images/qr-feature.png",
    color: "#2EC4B6",
  },
  {
    title: "AI-Powered Diagnosis",
    icon: ICONS[1],
    description:
      "Leverage OpenAI-powered summaries for faster, more accurate diagnosis. Our AI analyzes patient data and suggests possible conditions, supporting doctors with intelligent insights.",
    image: "/images/ai-feature.png",
    color: "#3A86FF",
  },
  {
    title: "Central Health Database",
    icon: ICONS[2],
    description:
      "All patient data is securely stored in an encrypted, cloud-based database accessible nationwide. Doctors can view complete medical histories from any participating hospital.",
    image: "/images/database-feature.png",
    color: "#00B4D8",
  },
  {
    title: "E-Prescription System",
    icon: ICONS[0],
    description:
      "Generate digital prescriptions linked to patient IDs. Reduce errors, prevent misuse, and ensure patients always have access to their latest prescriptions.",
    image: "/images/eprescription-feature.png",
    color: "#2EC4B6",
  },
  {
    title: "Smart Appointment Booking",
    icon: ICONS[1],
    description:
      "Book appointments in real-time based on doctor and hospital availability. Patients can avoid queues and doctors can manage their schedules efficiently.",
    image: "/images/appointment-feature.png",
    color: "#3A86FF",
  },
  {
    title: "Voice-to-Text Integration",
    icon: ICONS[2],
    description:
      "Doctors can dictate notes during consultations, which are automatically converted to digital records—saving time and improving accuracy.",
    image: "/images/voice-feature.png",
    color: "#00B4D8",
  },
  {
    title: "Cross-Hospital Compatibility",
    icon: ICONS[0],
    description:
      "Patient data is accessible from any participating hospital across India, ensuring seamless care continuity wherever the patient goes.",
    image: "/images/crosshospital-feature.png",
    color: "#2EC4B6",
  },
  {
    title: "Secure Authentication",
    icon: ICONS[3],
    description:
      "Multi-layered security protocols protect patient privacy and ensure only authorized personnel can access sensitive health data.",
    image: "/images/security-feature.png",
    color: "#3A86FF",
  },
];

// --- Feature Section (Zigzag) ---
function FeatureSection({ feature, reverse }) {
  return (
    <section className={`feature-section${reverse ? " reverse" : ""}`}>
      <div className="feature-image">
        <div className="glass-card">
          <img className=" object-cover rounded-2xl"src={feature.image} alt={feature.title} />
        </div>
      </div>
      <div className="feature-content mx-15">
        <div className="feature-icon" style={{ background: feature.color }}>
          {feature.icon}
        </div>
        <h2>{feature.title}</h2>
        <p>{feature.description}</p>
      </div>
      <style jsx>{`
        .feature-section {
          display: flex;
          align-items: center;
          gap: 3rem;
          margin: 3rem 0;
          position: relative;
          z-index: 3;
        }
        .feature-section.reverse {
          flex-direction: row-reverse;
        }
        .feature-image {
          flex: 1;
          display: flex;
          justify-content: center;
        
        }
        .glass-card {
          background: rgba(255,255,255,0.25);
          box-shadow: 0 8px 32px 0 rgba(58,134,255,0.12);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          padding: 2rem;
          min-width: 220px;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .glass-card:hover {
          transform: scale(1.04) translateY(-6px);
          box-shadow: 0 16px 48px 0 rgba(46,196,182,0.18);
        }
        .glass-card img {
          width: 200px;
          height: 220px;
          object-fit: cover;
        }
        .feature-content {
          flex: 2;
          background: rgba(255,255,255,0.55);
          border-radius: 2rem;
          padding: 2rem 2.5rem;
          box-shadow: 0 2px 16px 0 rgba(58,134,255,0.06);
          position: relative;
          transition: box-shadow 0.3s;
        }
        .feature-content:hover {
          box-shadow: 0 8px 32px 0 rgba(46,196,182,0.12);
        }
        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px 0 rgba(58,134,255,0.10);
        }
        .feature-content h2 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .feature-content p {
          font-size: 1.1rem;
          color: #1a2a3a;
          opacity: 0.85;
        }
        @media (max-width: 900px) {
          .feature-section, .feature-section.reverse {
            flex-direction: column;
            gap: 1.5rem;
          }
          .feature-content, .glass-card {
            padding: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}

// --- Feature Carousel (Mobile) ---
function FeatureCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % FEATURES.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="feature-carousel">
      <FeatureSection feature={FEATURES[index]} reverse={false} />
      <div className="carousel-dots">
        {FEATURES.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Go to feature ${i + 1}`}
          />
        ))}
      </div>
      <style jsx>{`
        .feature-carousel {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 2rem auto;
        }
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .carousel-dots button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #e0f7fa;
          cursor: pointer;
          transition: background 0.2s;
        }
        .carousel-dots button.active {
          background: linear-gradient(90deg, #3A86FF 0%, #2EC4B6 100%);
        }
      `}</style>
    </div>
  );
}

// --- Workflow Diagram ---
function WorkflowDiagram() {
  const steps = [
    { label: "Scan QR", icon: ICONS[3] },
    { label: "Access Data", icon: ICONS[2] },
    { label: "AI Diagnosis", icon: ICONS[1] },
    { label: "E-Prescription", icon: ICONS[0] },
    { label: "Book Appointment", icon: ICONS[1] },
  ];
  return (
    <section className="workflow">
      <h3>How Arogyayatra Works</h3>
      <div className="workflow-steps">
        {steps.map((step, i) => (
          <div className="workflow-step" key={i}>
            <div className="workflow-icon">{step.icon}</div>
            <span>{step.label}</span>
            {i < steps.length - 1 && <div className="workflow-arrow">→</div>}
          </div>
        ))}
      </div>
      <style jsx>{`
        .workflow {
          margin: 4rem 0 2rem 0;
          text-align: center;
        }
        .workflow h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .workflow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .workflow-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 500;
          background: rgba(255,255,255,0.7);
          border-radius: 1.2rem;
          padding: 0.7rem 1.2rem;
          box-shadow: 0 2px 8px 0 rgba(58,134,255,0.08);
          transition: box-shadow 0.2s;
        }
        .workflow-step:hover {
          box-shadow: 0 4px 16px 0 rgba(46,196,182,0.12);
        }
        .workflow-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .workflow-arrow {
          font-size: 1.5rem;
          color: #2EC4B6;
          margin: 0 0.5rem;
        }
        @media (max-width: 700px) {
          .workflow-steps {
            flex-direction: column;
            gap: 1rem;
          }
          .workflow-arrow {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

// --- Statistics Section ---
function StatsSection() {
  const stats = [
    { label: "Hospitals Connected", value: 1200 },
    { label: "Doctors Onboarded", value: 8500 },
    { label: "Patients Served", value: 1200000 },
    { label: "Avg. Wait Time Reduced", value: "40%" },
  ];
  const [displayed, setDisplayed] = useState([0, 0, 0, 0]);
  useEffect(() => {
    let frame;
    let start = Date.now();
    function animate() {
      const now = Date.now();
      const progress = Math.min((now - start) / 1200, 1);
      setDisplayed([
        Math.floor(stats[0].value * progress),
        Math.floor(stats[1].value * progress),
        Math.floor(stats[2].value * progress),
        progress < 1 ? "0%" : stats[3].value,
      ]);
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <section className="stats">
      {stats.map((stat, i) => (
        <div className="stat" key={i}>
          <div className="stat-value">
            {typeof displayed[i] === "number"
              ? displayed[i].toLocaleString()
              : displayed[i]}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
      <style jsx>{`
        .stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 3rem 0;
          flex-wrap: wrap;
        }
        .stat {
          background: rgba(255,255,255,0.7);
          border-radius: 1.5rem;
          padding: 1.5rem 2.5rem;
          box-shadow: 0 2px 12px 0 rgba(58,134,255,0.08);
          text-align: center;
          min-width: 160px;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2EC4B6;
        }
        .stat-label {
          font-size: 1.1rem;
          color: #1a2a3a;
          opacity: 0.7;
        }
        @media (max-width: 700px) {
          .stats {
            flex-direction: column;
            gap: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}

// --- Testimonials ---
function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Cardiologist, Mumbai",
      text: "Arogyayatra has transformed my workflow. I can access patient histories instantly and focus on care, not paperwork.",
      avatar: "/images/doctor1.png",
    },
    {
      name: "Ramesh Kumar",
      role: "Patient, Delhi",
      text: "No more carrying files! My records are always available, and appointments are so much easier to book.",
      avatar: "/images/patient1.png",
    },
    {
      name: "Dr. Anil Gupta",
      role: "General Physician, Lucknow",
      text: "The AI summaries are a game-changer. I save time and make better decisions for my patients.",
      avatar: "/images/doctor2.png",
    },
  ];
  return (
    <section className="testimonials">
      <h3>What Our Users Say</h3>
      <div className="testimonial-list">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-avatar">
              <img src={t.avatar} alt={t.name} />
            </div>
            <div className="testimonial-text">"{t.text}"</div>
            <div className="testimonial-name">{t.name}</div>
            <div className="testimonial-role">{t.role}</div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .testimonials {
          margin: 4rem 0 2rem 0;
          text-align: center;
        }
        .testimonials h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        .testimonial-list {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .testimonial-card {
          background: rgba(255,255,255,0.7);
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          box-shadow: 0 2px 12px 0 rgba(58,134,255,0.08);
          min-width: 220px;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .testimonial-card:hover {
          box-shadow: 0 8px 32px 0 rgba(46,196,182,0.12);
          transform: translateY(-6px) scale(1.03);
        }
        .testimonial-avatar img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
        }
        .testimonial-text {
          font-size: 1.1rem;
          color: #1a2a3a;
          margin-bottom: 1rem;
          opacity: 0.85;
        }
        .testimonial-name {
          font-weight: 700;
          color: #2EC4B6;
        }
        .testimonial-role {
          font-size: 0.95rem;
          color: #3A86FF;
          opacity: 0.7;
        }
        @media (max-width: 900px) {
          .testimonial-list {
            flex-direction: column;
            gap: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}

// --- Call to Action Section ---
function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-card" id="doctor-cta">
        <h3>Are you a Doctor?</h3>
       
        <p>Join Arogyayatra and access unified patient data, AI-powered tools, and seamless workflows. Transform your practice today.</p>
       <Link href="/auth/register/doctor">
        <button className="px-8 py-3 bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                  Get Started
                </button>
                </Link>
      </div>
      <div className="cta-card" id="patient-cta">
        <h3>Are you a Patient?</h3>
        <p>Take control of your health records, book appointments, and experience hassle-free healthcare—anywhere in India.</p>
        <Link href="/auth/register/patient" >
      <button className="px-8 py-3 bg-gradient-to-r from-violet-900 via-violet-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                  Get Started
                </button>
                </Link>
      </div>
      <style jsx>{`
        .cta-section {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin: 4rem 0 2rem 0;
          flex-wrap: wrap;
        }
        .cta-card {
          background: rgba(255,255,255,0.8);
          border-radius: 2rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 2px 16px 0 rgba(58,134,255,0.10);
          min-width: 260px;
          max-width: 340px;
          text-align: center;
        }
        .cta-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .cta-card p {
          font-size: 1.05rem;
          color: #1a2a3a;
          opacity: 0.85;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 700px) {
          .cta-section {
            flex-direction: column;
            gap: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}

// --- Main Page ---
export default function FeaturesPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <main className="features-main">
      <ParticleBackground />
      <FloatingIcons />
      <HeroSection />
      <StatsSection />
      <WorkflowDiagram />
      <div className="features-list">
        {isMobile ? (
          <FeatureCarousel />
        ) : (
          FEATURES.map((feature, i) => (
            <FeatureSection
              key={feature.title}
              feature={feature}
              reverse={i % 2 === 1}
            />
          ))
        )}
      </div>
      <Testimonials />
      <CTASection />
      <style jsx global>{`
        body {
          background: linear-gradient(120deg, #e0f7fa 0%, #f8fbff 100%);
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          color: #1a2a3a;
          margin: 0;
          padding: 0;
        }
        .features-main {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          overflow-x: hidden;
        }
        ::selection {
          background: #2EC4B6;
          color: #fff;
        }
      `}</style>
    </main>
  );
}