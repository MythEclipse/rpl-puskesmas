import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <nav class="fixed top-0 w-full backdrop-blur-md bg-white/10 border-b border-white/10 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                    <span class="text-xl font-bold text-slate-900">P</span>
                  </div>
                  <span class="text-xl font-bold text-white">Puskesmas</span>
                </div>
                <div class="flex items-center gap-4">
                  <a
                    href="/"
                    class="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                  >
                    Home
                  </a>
                  <a
                    href="/login"
                    class="px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main class="pt-20">
            <Suspense fallback={
              <div class="flex items-center justify-center min-h-[60vh]">
                <div class="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {props.children}
            </Suspense>
          </main>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
