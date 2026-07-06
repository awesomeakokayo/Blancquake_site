import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7C518" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7C518" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7C518" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.animate-in');
      if (els) {
        gsap.fromTo(
          els,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#2C2A6B', padding: '128px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <div>
            <span className="animate-in section-label text-[#F7C518] block mb-4">Get in Touch</span>
            <h2
              className="animate-in font-heading text-white leading-[1.1] tracking-[-0.02em] mb-10"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Let's Build Something Meaningful
            </h2>

            <div className="space-y-6 mb-10">
              <div className="animate-in flex items-center gap-4">
                <MailIcon />
                <span className="font-body text-white/80 font-light text-base">blancquakefoundation@gmail.com</span>
              </div>
              <div className="animate-in flex items-center gap-4">
                <PhoneIcon />
                <span className="font-body text-white/80 font-light text-base">+234 (0) 800 BLANCQUAKE</span>
              </div>
              <div className="animate-in flex items-center gap-4">
                <LocationIcon />
                <span className="font-body text-white/80 font-light text-base">Lagos, Nigeria</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="animate-in flex gap-2 font-body text-sm font-medium text-[#F7C518]">
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>LinkedIn</a>
              <span className="text-[#F7C518]/50">&middot;</span>
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Instagram</a>
              <span className="text-[#F7C518]/50">&middot;</span>
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Twitter</a>
              <span className="text-[#F7C518]/50">&middot;</span>
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>Facebook</a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-in">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-4 py-3.5 text-white font-body text-sm placeholder:text-white/40 focus:border-[#F7C518] focus:outline-none transition-colors duration-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-4 py-3.5 text-white font-body text-sm placeholder:text-white/40 focus:border-[#F7C518] focus:outline-none transition-colors duration-300"
                />
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-4 py-3.5 text-white font-body text-sm focus:border-[#F7C518] focus:outline-none transition-colors duration-300 appearance-none"
                >
                  <option value="Partnership" className="bg-[#2C2A6B]">Partnership</option>
                  <option value="Volunteer" className="bg-[#2C2A6B]">Volunteer</option>
                  <option value="Donation" className="bg-[#2C2A6B]">Donation</option>
                  <option value="General Inquiry" className="bg-[#2C2A6B]">General Inquiry</option>
                </select>
                <textarea
                  placeholder="Message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/[0.08] border border-white/20 rounded-lg px-4 py-3.5 text-white font-body text-sm placeholder:text-white/40 focus:border-[#F7C518] focus:outline-none transition-colors duration-300 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#F7C518] text-[#2C2A6B] font-body font-medium text-sm uppercase tracking-[0.05em] py-3.5 rounded-lg hover:bg-[#FDE047] transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
                  <circle cx="24" cy="24" r="22" stroke="#F7C518" strokeWidth="2" />
                  <path d="M14 24l7 7 13-13" stroke="#F7C518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-body text-[#F7C518] text-lg font-medium">Thank you. We'll be in touch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
