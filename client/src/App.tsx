import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Timetable from "@/pages/Timetable";
import SubjectsRatings from "@/pages/SubjectsRatings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Timetable} />
      <Route path="/subjects" component={SubjectsRatings} />
      <Route component={NotFound} />
    </Switch>
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
