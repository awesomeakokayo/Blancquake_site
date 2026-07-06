import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    // Delay loading the 7.25MB video background to prioritize critical rendering path (fonts, text)
    const timer = setTimeout(() => {
      setVideoSrc('/videos/hero.mp4');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Video fade in
      tl.to('.hero-video', { opacity: 1, duration: 1.2, ease: 'power2.out' });

      // Title words stagger
      const words = titleRef.current?.querySelectorAll('.word');
      if (words) {
        tl.fromTo(
          words,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'cubic-bezier(0.19, 1, 0.22, 1)' },
          '-=0.6'
        );
      }

      // Subtitle
      tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

      // CTA
      tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      // Scroll indicator
      tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.1');
    }, sectionRef);

    return () => ctx.revert();
  }, [videoLoaded]);

  const titleWords = 'Make the difference, One Child at a Time'.split(' ');

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      {/* Video Background */}
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hero-poster.jpg"
        onLoadedData={() => setVideoLoaded(true)}
      >
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
      </video>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0.12) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5))',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 60%, #FDFBF7 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-center h-full px-5 md:px-10 max-w-[1440px] mx-auto"
        style={{ paddingTop: '64px' }}
      >
        <div style={{ maxWidth: 600, marginTop: '-5vh' }}>
          <h1
            ref={titleRef}
            className="font-heading text-[#F7C518] leading-[1.15] tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(36px, 6vw, 80px)',
              textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            }}
          >
            {titleWords.map((word, i) => (
              <span key={i} className="word inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="font-body text-white font-light mt-6 leading-relaxed"
            style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              maxWidth: 520,
              opacity: 0,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            Blancquake Foundation empowers children with neurological conditions and ensures access to blood transfusions for those in need.
          </p>

          <a
            ref={ctaRef}
            href="#mission"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block mt-8 bg-[#F7C518] text-[#2C2A6B] font-body font-medium text-sm uppercase tracking-[0.1em] px-10 py-3.5 rounded-full hover:bg-[#FDE047] transition-colors duration-300"
            style={{ opacity: 0 }}
          >
            Learn Our Story
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <div className="relative w-[1px] h-10 bg-white/60">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-scroll-pulse" />
        </div>
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Scroll</span>
      </div>
    </section>
  );
}
