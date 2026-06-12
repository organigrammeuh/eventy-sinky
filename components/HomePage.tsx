import { HeroSection } from "./Home/HeroSection";
import { EventSection } from "./Home/EventSection";
import { SessionSection } from "./Home/SessionSection";
import { SpeakerSection } from "./Home/SpeakerSection";

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <EventSection />
            <SessionSection />
            <SpeakerSection />
        </main>
    );
}