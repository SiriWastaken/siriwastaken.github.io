import { AboutSection } from "@/components/about/about-section";
import { Hero } from "@/components/hero/hero";
import { WorkSection } from "@/components/projects/work-section";
import { StackSection } from "@/components/stack/stack-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkSection />
      <StackSection />
      <AboutSection />
    </>
  );
}
