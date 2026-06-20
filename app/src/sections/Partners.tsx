import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const partnerNames = [
  'WHO Nigeria',
  'Red Cross NG',
  'Lagos Health',
  'UNICEF Africa',
  'MedAccess',
  'HealthBridge',
];

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#FDFBF7', padding: '96px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 text-center">
        <span className="animate-in section-label text-[#C14B3C] block mb-4">Our Partners</span>
        <h2
          className="animate-in font-heading text-[#2C2A6B] leading-[1.1] tracking-[-0.02em] mb-12"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          Powered by Collaboration
        </h2>

        {/* Partner Logos */}
        <div className="animate-in flex flex-wrap justify-center items-center gap-8 lg:gap-16 mb-12">
          {partnerNames.map((name) => (
            <div
              key={name}
              className="font-heading text-[#2C2A6B]/50 hover:text-[#2C2A6B] transition-all duration-300 text-lg lg:text-xl cursor-default"
              style={{ filter: 'grayscale(100%)', opacity: 0.5 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(0%)';
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(100%)';
                (e.currentTarget as HTMLElement).style.opacity = '0.5';
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="animate-in inline-block border border-[#2C2A6B] text-[#2C2A6B] font-body font-medium text-sm px-8 py-3 rounded-full hover:bg-[#2C2A6B] hover:text-white transition-all duration-300"
        >
          Become a Partner
        </a>
      </div>
    </section>
  );
}
