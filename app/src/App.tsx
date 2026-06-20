import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Mission from './sections/Mission';
import Programs from './sections/Programs';
import Impact from './sections/Impact';
import Team from './sections/Team';
import Topographic from './sections/Topographic';
import Partners from './sections/Partners';
import DonateCTA from './sections/DonateCTA';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="relative">
      <Navigation />
      <Hero />
      <Mission />
      <Programs />
      <Impact />
      <Team />
      <Topographic />
      <Partners />
      <DonateCTA />
      <Contact />
      <Footer />
    </div>
  );
}
