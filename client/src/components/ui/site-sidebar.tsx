import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function SiteSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const shouldExpand = !isCollapsed || isHovered;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 z-50",
          shouldExpand ? "md:w-64" : "md:w-16",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto relative bg-gradient-theme">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-white hover:bg-white/20"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>

          <div className={cn(
            "flex items-center gap-3 flex-shrink-0 px-4 transition-opacity duration-200",
            !shouldExpand && "opacity-0"
          )}>
            <Logo />
            <h1 className="text-xl font-bold text-white">Spiral</h1>
          </div>

          <div className="mt-5 flex-grow flex flex-col px-3">
            <MainNav isCollapsed={!shouldExpand} />
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is expanded */}
      {shouldExpand && (
        <div 
          className="hidden md:block fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => {
            setIsCollapsed(true);
            setIsHovered(false);
          }}
        />
      )}

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gradient-theme">
          <SheetHeader>
            <SheetTitle className="text-left text-white flex items-center gap-3">
              <Logo />
              Spiral
            </SheetTitle>
          </SheetHeader>
          <div className="mt-5 flex-grow flex flex-col">
            <MainNav isCollapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}