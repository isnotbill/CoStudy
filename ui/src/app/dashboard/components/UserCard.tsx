import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UserCardProps = {
    username: string;
    avatarUrl?: string;
    badgeLabel?: string;
    streakDays?: number;
}

export function UserCard({ username, avatarUrl, badgeLabel, streakDays }: UserCardProps) {
    return (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12 border-2 border-slate-900">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <h4 className="font-bold text-slate-900 truncate">{username}</h4>
              <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-yellow-100 text-yellow-800 border-yellow-200">
                {badgeLabel}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between text-xs font-bold text-slate-500 border-t border-dashed border-slate-200 pt-2">
            <span>🔥 {streakDays} Day Streak</span>
          </div>
        </div>
    )
}