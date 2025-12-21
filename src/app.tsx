import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Suspense fallback={
            <div class="flex items-center justify-center min-h-screen">
              <div class="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {props.children}
          </Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
