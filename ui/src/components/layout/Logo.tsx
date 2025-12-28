import { Book } from "lucide-react";

export function CostudyLogo() {
    return (
        <div className="mb-8 flex items-center gap-2 opacity-90">
           <Book className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
           <span className="font-bold text-3xl tracking-tight text-blue-600" style={{ fontFamily: "var(--font-cedarville)"}}>costudy.</span>
        </div>
    )
}