import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Timetable from "@/pages/Timetable";
import SubjectsRatings from "@/pages/SubjectsRatings";
import { SiteSidebar } from "@/components/ui/site-sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <SiteSidebar />
      <div className="md:pl-64">
        <main className="p-4">
          <Switch>
            <Route path="/" component={Timetable} />
            <Route path="/subjects" component={SubjectsRatings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;