import { Badge } from "@/components/ui/badge";
import { Mail, Building2, IdCard, GraduationCap } from "lucide-react";
import type { AuthorProfile } from "@/data/mockData";

interface AuthorProfileCardProps {
  author: AuthorProfile;
  isSupervisor?: boolean;
}

export function AuthorProfileCard({ author, isSupervisor }: AuthorProfileCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-heading font-bold text-lg flex items-center justify-center shrink-0">
        {author.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-heading font-semibold text-foreground">{author.name}</span>
          <Badge variant="outline" className={
            author.role === "Student"
              ? "bg-primary/10 text-primary border-primary/20 text-[10px]"
              : "bg-success/10 text-success border-success/20 text-[10px]"
          }>
            {isSupervisor ? "Supervisor" : author.role}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {author.department && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {author.department}
            </span>
          )}
          {author.campusId && (
            <span className="flex items-center gap-1">
              <IdCard className="w-3 h-3" /> {author.campusId}
            </span>
          )}
          {author.year && (
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {author.year}
            </span>
          )}
          {author.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {author.email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
