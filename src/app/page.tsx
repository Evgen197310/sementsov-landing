import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Cases from "@/components/Cases";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getAllTeam, getAllServices, getAllCases, getAbout, getAllAdvantages, getContacts, getHero } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const team = getAllTeam();
  const services = getAllServices();
  const cases = getAllCases();
  const aboutData = getAbout();
  const advantages = getAllAdvantages();
  const contacts = getContacts();
  const hero = getHero();

  return (
    <main className="min-h-screen">
      <Header contacts={contacts || { phone: null, email: null, address: null, map_url: null, lat: null, lng: null }} />
      <Hero hero={hero || null} contacts={contacts || null} />
      <About about={aboutData || null} advantages={advantages} />
      <Services services={services} />
      <Team members={team} />
      <Cases cases={cases} />
      <ContactForm contacts={contacts || null} />
      <Footer contacts={contacts || null} />
    </main>
  );
}
