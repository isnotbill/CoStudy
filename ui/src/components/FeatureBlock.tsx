import { Button } from "@/components/ui/button";
import { 
  ArrowRight 
} from "lucide-react";

interface FeatureBlockProps {
  index: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  reverse?: boolean;
}

export const FeatureBlock = ({ index, title, description, icon, image, reverse }: FeatureBlockProps) => {
  return (
    <div className={`flex flex-col gap-12 lg:items-center ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      
      {/* Text Content */}
      <div className="flex-1 space-y-6 ">
        <div className="flex items-center gap-4">
          <span className="font-cursive text-4xl text-primary/90 leading-none">
            {index}
          </span>
          <div className="h-[2px] w-12 bg-primary/90" />
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
        
        <h3 className="text-3xl font-bold font-sans leading-tight text-primary/80">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
        
        {/* <Button variant="ghost" className="group p-0 hover:bg-transparent text-primary font-semibold">
          Learn more 
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button> */}
      </div>

      {/* Image Side with "Purple Glow" Styling */}
      <div className="flex-1 relative">
        <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] -z-10 blur-2xl" />
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xl transition-all duration-500 hover:shadow-purple-glow/10">
          <img 
            src={image} 
            alt={title} 
            className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
};
