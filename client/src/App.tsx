import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Exam from "@/pages/exam";
import Review from "@/pages/review";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exam" component={Exam} />
      <Route path="/review" component={Review} />
      <Route path="/quiz/:id" component={Quiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <AppRouter />
    </Router>
  );
}
