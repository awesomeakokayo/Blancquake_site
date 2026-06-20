import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextCylinderScene } from '../effects/textCylinder';

gsap.registerPlugin(ScrollTrigger);

const program1Tags = ['Autism Support', 'Cerebral Palsy', 'Seizure Care', 'Community Integration'];
const program2Tags = ['Emergency Response', 'Volunteer Network', 'Free Transfusions', 'Rural Outreach'];

function BrainIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-6">
      <path
        d="M32 8C20.954 8 12 16.268 12 26.5c0 6.5 3.2 12.2 8 15.5V52c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2v-10c4.8-3.3 8-9 8-15.5C52 16.268 43.046 8 32 8z"
        stroke="#F7C518"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="8 4"
        style={{ animation: 'brainDash 8s linear infinite' }}
      />
      <path d="M24 30c2-2 4-3 8-3s6 1 8 3" stroke="#F7C518" strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="24" r="1.5" fill="#F7C518" />
      <circle cx="38" cy="24" r="1.5" fill="#F7C518" />
    </svg>
  );
}

function BloodDropIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-6">
      <path d="M32 10C32 10 16 28 16 38c0 8.837 7.163 16 16 16s16-7.163 16-16C48 28 32 10 32 10z" stroke="#F7C518" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="38" r="8" stroke="#F7C518" strokeWidth="1" fill="none" className="origin-center" style={{ animation: 'pulseRing 2s ease-in-out infinite' }} />
    </svg>
  );
}

export default function Programs() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TextCylinderScene | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Text Cylinder background
    if (canvasContainerRef.current && !sceneRef.current) {
      const scene = new TextCylinderScene(canvasContainerRef.current);
      scene.init();
      sceneRef.current = scene;
    }

    // Cards entrance animation
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.program-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#2C2A6B', padding: '128px 0' }}
    >
      {/* Text Cylinder Canvas Background */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <span className="section-label text-[#F7C518] block mb-4">What We Do</span>
          <h2
            className="font-heading text-white leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            Two Pillars of Impact
          </h2>
        </div>

        {/* Program Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1 - Neurological Care */}
          <div
            className="program-card rounded-2xl p-10 lg:p-12"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <BrainIcon />
            <h3 className="font-heading text-white text-[32px] leading-[1.2] mb-4">Neurological Care</h3>
            <p className="font-body text-white/80 font-light text-base leading-relaxed mb-6">
              Empowering children with autism, cerebral palsy, and seizure disorders by improving their health status, social standing, and prospects. We reduce stigmatization and create awareness to build communities where every child belongs.
            </p>
            <div className="flex flex-wrap gap-2">
              {program1Tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-[11px] font-medium px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(247, 197, 24, 0.15)',
                    color: '#F7C518',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2 - Blood Access */}
          <div
            className="program-card rounded-2xl p-10 lg:p-12"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <BloodDropIcon />
            <h3 className="font-heading text-white text-[32px] leading-[1.2] mb-4">Blood Transfusion Access</h3>
            <p className="font-body text-white/80 font-light text-base leading-relaxed mb-6">
              Making it easy for patients to gain access to blood as soon as possible through our network of volunteers and members. We work to ensure no patient is denied a transfusion due to cost or availability.
            </p>
            <div className="flex flex-wrap gap-2">
              {program2Tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-[11px] font-medium px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(247, 197, 24, 0.15)',
                    color: '#F7C518',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
