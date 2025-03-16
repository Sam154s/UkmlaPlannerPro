import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function MainNav() {
  const [location] = useLocation();

  return (
    <nav className="flex flex-col space-y-2">
      <Link href="/">
        <Button
          variant={location === "/" ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          Timetable
        </Button>
      </Link>
      <Link href="/subjects">
        <Button
          variant={location === "/subjects" ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          Subjects & Ratings
        </Button>
      </Link>
    </nav>
  );
}
