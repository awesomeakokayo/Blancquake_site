import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  { name: 'Dr. Amara Okafor', role: 'Founder & CEO', bio: 'Leading the foundation with over 15 years of experience in pediatric neurology and public health.', image: '/images/team-1.jpg' },
  { name: 'David Nwosu', role: 'Director of Operations', bio: 'Overseeing daily operations and ensuring efficient delivery of programs across all communities.', image: '/images/team-2.jpg' },
  { name: 'Chioma Adebayo', role: 'Head of Neurological Care', bio: 'Designing and implementing therapeutic programs for children with neurological conditions.', image: '/images/team-3.jpg' },
  { name: 'Dr. Grace Mbeki', role: 'Medical Advisor', bio: 'Providing expert medical guidance and overseeing clinical partnerships and blood access programs.', image: '/images/team-4.jpg' },
  { name: 'Emmanuel Okonkwo', role: 'Community Outreach Lead', bio: 'Building relationships with communities and coordinating volunteer networks across regions.', image: '/images/team-5.jpg' },
  { name: 'Dr. James Adeyemi', role: 'Research Director', bio: 'Leading research initiatives to improve care outcomes and expand evidence-based practices.', image: '/images/team-6.jpg' },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll('.team-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
      id="team"
      ref={sectionRef}
      className="w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '128px 0' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <span className="animate-in section-label text-[#C14B3C] block mb-4">The People</span>
          <h2
            className="animate-in font-heading text-[#2C2A6B] leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            Meet the Team
          </h2>
          <p className="animate-in font-body text-[#2C2A6B] font-light text-lg leading-relaxed max-w-xl">
            Dedicated professionals and volunteers committed to making a difference.
          </p>
        </div>

        {/* Team Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-card group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-400"
                  loading="lazy"
                />
              </div>
              <h3 className="font-heading text-[#2C2A6B] text-[22px]">{member.name}</h3>
              <span className="font-body text-[#1F72A6] text-sm font-medium uppercase tracking-[0.05em] block mt-1">
                {member.role}
              </span>
              <p className="font-body text-[#2C2A6B]/70 text-sm font-light leading-relaxed mt-2 line-clamp-2">
                {member.bio}
              </p>
              <div className="flex gap-3 mt-3 text-[#2C2A6B]/40 group-hover:text-[#2C2A6B] transition-colors duration-300">
                <LinkedInIcon />
                <TwitterIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
