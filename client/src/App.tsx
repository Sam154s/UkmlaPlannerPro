import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
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
    <div className="min-h-screen bg-background text-foreground relative">
      {user && <SiteSidebar />}
      <div 
        className={user ? "md:pl-16 relative" : ""}
        style={{ zIndex: 0, position: 'relative' }}
      >
        <main className="p-4 relative" style={{ zIndex: 1 }}>
          <Switch>
            <Route path="/auth">
              {user ? <Redirect to="/" /> : <AuthPage />}
            </Route>
            <Route path="/">
              {!user ? <Redirect to="/auth" /> : <Dashboard />}
            </Route>
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
        <ThemeProvider>
          <Router />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;