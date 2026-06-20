import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column content entrance
      const leftEls = leftRef.current?.querySelectorAll('.animate-in');
      if (leftEls) {
        gsap.fromTo(
          leftEls,
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

      // Right column image entrance
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
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
      id="mission"
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#FDFBF7', padding: '128px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <div ref={leftRef} className="lg:w-[55%] order-2 lg:order-1">
            <span className="animate-in section-label text-[#C14B3C] block mb-4">Our Mission</span>
            <h2
              className="animate-in font-heading text-[#2C2A6B] leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
            >
              Every Child Deserves a Chance to Thrive
            </h2>
            <p
              className="animate-in font-body text-[#2C2A6B] font-light mt-6 leading-[1.65]"
              style={{ fontSize: 18, maxWidth: 480 }}
            >
              We envision a society where children with neurological conditions find themselves, are heard, cared for, and become useful to society. We also envision a health system where access to blood for transfusion is readily available to indigent patients, at no cost.
            </p>
            <a
              href="#programs"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-in inline-block mt-6 text-[#1F72A6] font-body font-medium relative group"
            >
              Read Our Story
              <span className="absolute bottom-[-2px] left-0 w-full h-[1px] bg-[#1F72A6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          </div>

          {/* Right Column - Image */}
          <div
            ref={imageRef}
            className="lg:w-[45%] order-1 lg:order-2"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 border-4 border-[#F7C518] rounded-lg"
                style={{ transform: 'translate(8px, 8px)' }}
              />
              <img
                src="/images/mission-photo.jpg"
                alt="Children at a Blancquake Foundation community event"
                className="relative w-full rounded-lg object-cover"
                style={{ aspectRatio: '4/5' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
