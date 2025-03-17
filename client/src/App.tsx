import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Timetable from "@/pages/Timetable";
import SubjectsRatings from "@/pages/SubjectsRatings";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import { SiteSidebar } from "@/components/ui/site-sidebar";
import { FloatingChat } from "@/components/ui/floating-chat";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user && <SiteSidebar />}
      <div className={user ? "md:pl-16 relative z-0" : ""}>
        <main className="p-4">
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/" component={Dashboard} />
            <ProtectedRoute path="/timetable" component={Timetable} />
            <ProtectedRoute path="/subjects" component={SubjectsRatings} />
            <ProtectedRoute path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      {user && <FloatingChat />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;