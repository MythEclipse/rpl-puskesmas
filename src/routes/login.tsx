import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        {/* Card */}
        <div class="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          {/* Glow Effects */}
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl" />
          <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl" />

          <div class="relative">
            {/* Header */}
            <div class="text-center mb-8">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-white mb-2">SI-Puskesmas</h1>
              <p class="text-white/60">Sistem Informasi Manajemen Puskesmas</p>
            </div>

            <form action={loginOrRegister} method="post" class="space-y-6">
              <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
              <input type="hidden" name="loginType" value="login" />

              {/* Username Input */}
              <div class="space-y-2">
                <label for="username-input" class="block text-sm font-medium text-white/80">
                  Username
                </label>
                <input
                  id="username-input"
                  name="username"
                  placeholder="Masukkan username"
                  class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                />
              </div>

              {/* Password Input */}
              <div class="space-y-2">
                <label for="password-input" class="block text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loggingIn.pending}
              >
                {loggingIn.pending ? (
                  <span class="flex items-center justify-center gap-2">
                    <div class="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : "Masuk"}
              </button>

              {/* Error Message */}
              <Show when={loggingIn.result}>
                <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p class="text-sm text-red-400 text-center" role="alert" id="error-message">
                    {loggingIn.result!.message}
                  </p>
                </div>
              </Show>
            </form>

            {/* Demo Credentials */}
            <div class="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p class="text-xs text-white/60 text-center mb-2">Demo Login:</p>
              <div class="grid grid-cols-2 gap-2 text-xs text-white/40">
                <div>admin / admin123</div>
                <div>dokter1 / 123456</div>
                <div>petugas1 / 123456</div>
                <div>apoteker1 / 123456</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p class="text-center text-white/40 text-sm mt-6">
          © 2024 Puskesmas. Tugas RPL - Pemodelan Sistem Informasi.
        </p>
      </div>
    </div>
  );
}
