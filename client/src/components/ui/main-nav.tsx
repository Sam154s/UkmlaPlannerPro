import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar, Sliders, LayoutDashboard, Settings } from "lucide-react";

interface MainNavProps {
  isCollapsed: boolean;
}

export function MainNav({ isCollapsed }: MainNavProps) {
  const [location] = useLocation();

  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/">
        <Button
          variant={location === "/" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-white hover:bg-white/20",
            location === "/" && "bg-white/20 hover:bg-white/30",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Dashboard</span>}
        </Button>
      </Link>
      <Link href="/timetable">
        <Button
          variant={location === "/timetable" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-white hover:bg-white/20",
            location === "/timetable" && "bg-white/20 hover:bg-white/30",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Calendar className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Timetable</span>}
        </Button>
      </Link>
      <Link href="/subjects">
        <Button
          variant={location === "/subjects" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-white hover:bg-white/20",
            location === "/subjects" && "bg-white/20 hover:bg-white/30",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Sliders className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Subjects & Ratings</span>}
        </Button>
      </Link>
      <Link href="/settings">
        <Button
          variant={location === "/settings" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-white hover:bg-white/20",
            location === "/settings" && "bg-white/20 hover:bg-white/30",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Settings</span>}
        </Button>
      </Link>
    </nav>
  );
}