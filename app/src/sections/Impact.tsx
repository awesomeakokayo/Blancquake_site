import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CountUpText } from '../effects/countUp';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2500, suffix: '+', label: 'Children Supported' },
  { value: 12000, suffix: '+', label: 'Blood Units Facilitated' },
  { value: 47, suffix: '', label: 'Community Partners' },
];

const impactImages = [
  '/images/impact-1.jpg',
  '/images/impact-2.jpg',
  '/images/impact-3.jpg',
  '/images/impact-4.jpg',
  '/images/impact-5.jpg',
  '/images/impact-6.jpg',
];

export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // CountUp animations for each stat
      stats.forEach((stat, i) => {
        const el = numberRefs.current[i];
        if (!el) return;

        const counter = new CountUpText(el, { scrambleDuration: 3000, chars: '0123456789' });

        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            setTimeout(() => {
              counter.animate(stat.value);
            }, i * 200);
          },
        });
      });

      // Photo strip parallax
      if (stripRef.current) {
        gsap.to(stripRef.current, {
          x: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Section header animation
      const headerEls = sectionRef.current?.querySelectorAll('.animate-in');
      if (headerEls) {
        gsap.fromTo(
          headerEls,
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
      id="impact"
      ref={sectionRef}
      className="w-full overflow-hidden"
      style={{ backgroundColor: '#FDFBF7', padding: '128px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <span className="animate-in section-label text-[#C14B3C] block mb-4">Our Impact</span>
          <h2
            className="animate-in font-heading text-[#2C2A6B] leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            The Numbers Speak
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16 lg:mb-20">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center md:text-left">
              <span
                ref={(el) => { numberRefs.current[i] = el; }}
                className="font-heading text-[#F7C518] block"
                style={{ fontSize: 'clamp(72px, 9vw, 120px)', lineHeight: 1 }}
              >
                0
              </span>
              <div
                className="w-12 h-[1px] mx-auto md:mx-0 mt-4 mb-3"
                style={{ backgroundColor: 'rgba(44, 42, 107, 0.2)' }}
              />
              <span className="font-body text-[#2C2A6B] text-base font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Strip */}
      <div className="overflow-hidden">
        <div
          ref={stripRef}
          className="flex gap-4 px-5"
          style={{ width: 'max-content' }}
        >
          {impactImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Foundation activity ${i + 1}`}
              className="rounded-lg object-cover"
              style={{ height: 120, width: i % 2 === 0 ? 180 : 160 }}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
