import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DonateCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.animate-in');
      if (els) {
        gsap.fromTo(
          els,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
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

  return (
    <section
      id="donate"
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#C14B3C', padding: '96px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 text-center">
        <span className="animate-in section-label text-[#F7C518] block mb-4">Make a Difference</span>
        <h2
          className="animate-in font-heading text-white leading-[1.1] tracking-[-0.02em] mb-6"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
        >
          Your Support Changes Lives
        </h2>
        <p
          className="animate-in font-body text-white/85 font-light text-lg leading-relaxed max-w-[600px] mx-auto mb-10"
        >
          Every donation helps us reach more children and patients. Join our network of supporters making healthcare accessible to those who need it most.
        </p>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="animate-in inline-block bg-[#F7C518] text-[#2C2A6B] font-body font-medium text-sm uppercase tracking-[0.1em] px-12 py-4 rounded-full hover:bg-[#FDE047] hover:scale-[1.02] transition-all duration-300 animate-donate-pulse"
        >
          Donate Now
        </a>
      </div>
    </section>
  );
}
