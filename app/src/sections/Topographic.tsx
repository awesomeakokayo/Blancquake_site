import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TopographyScene } from '../effects/topography';

gsap.registerPlugin(ScrollTrigger);

export default function Topographic() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TopographyScene | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize topography scene
    let sceneInstance: TopographyScene | null = null;
    if (canvasContainerRef.current && !sceneRef.current) {
      sceneInstance = new TopographyScene(canvasContainerRef.current);
      sceneInstance.init();
      sceneRef.current = sceneInstance;
    } else if (sceneRef.current) {
      sceneInstance = sceneRef.current;
    }

    // Set up IntersectionObserver to play/pause rendering based on viewport visibility
    let observer: IntersectionObserver | null = null;
    if (sectionRef.current && sceneInstance) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sceneRef.current?.resume();
          } else {
            sceneRef.current?.pause();
          }
        },
        { threshold: 0.01 } // Trigger immediately when entering/leaving viewport
      );
      observer.observe(sectionRef.current);
    }

    // Text entrance animation
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (observer) {
        observer.disconnect();
      }
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '80vh', backgroundColor: '#2C2A6B' }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={canvasContainerRef}
        id="topography-container"
        className="absolute inset-0"
      />

      {/* Text Overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center"
        style={{ opacity: 0 }}
      >
        <h2
          className="font-heading text-white leading-[1.1] tracking-[-0.02em] mb-6"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          The Terrain of Care
        </h2>
        <p
          className="font-body text-white/85 font-light leading-relaxed max-w-[560px]"
          style={{ fontSize: 18, textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
        >
          Like the contours of the brain we work to protect, our path is complex, layered, and ever-changing. Every ridge represents a life touched, every valley a challenge overcome.
        </p>
      </div>
    </section>
  );
}
