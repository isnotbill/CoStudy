import { 
  Users, 
  Sparkles, 
  Library, 
  ArrowRight 
} from "lucide-react";

import { FeatureBlock } from "@/components/FeatureBlock";

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="container px-4 md:px-6 flex items-center justify-center">

        {/* Scrollable Feature Blocks */}
        <div className="space-y-32 flex flex-col justify-center items-center">
          <FeatureBlock 
            index="01"
            title="Study together, anywhere in the world"
            description="CoStudy lets students create or join public and private virtual study rooms. Chat in real‑time, keep everyone on track with a synchronized Pomodoro timer (fully customisable), and ask the AI tutor when you hit a roadblock."
            icon={<Users className="w-6 h-6 text-primary" />}
            image="/images/react.png"
          />
          
          <FeatureBlock 
            index="02"
            title="Stay on pace with live timers"
            description="The shared timer keeps everyone synced, whether you love Pomodoro or your own rhythm. Gentle alerts appear for every user in the room."
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            image="/images/react.png"
            reverse
          />
        </div>
      </div>
    </section>
  );
};
