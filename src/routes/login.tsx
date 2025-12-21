import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-white mb-2">Masuk ke Sistem</h1>
              <p class="text-white/60">Silakan masuk untuk melanjutkan</p>
            </div>

            <form action={loginOrRegister} method="post" class="space-y-6">
              <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />

              {/* Login Type Toggle */}
              <div class="flex rounded-xl bg-white/5 p-1 border border-white/10">
                <label class="flex-1">
                  <input type="radio" name="loginType" value="login" checked={true} class="peer sr-only" />
                  <span class="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-white/60 peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-cyan-400 peer-checked:text-slate-900 transition-all cursor-pointer">
                    Login
                  </span>
                </label>
                <label class="flex-1">
                  <input type="radio" name="loginType" value="register" class="peer sr-only" />
                  <span class="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-white/60 peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-cyan-400 peer-checked:text-slate-900 transition-all cursor-pointer">
                    Register
                  </span>
                </label>
              </div>

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
          </div>
        </div>

        {/* Footer */}
        <p class="text-center text-white/40 text-sm mt-6">
          © 2024 Puskesmas. Sistem Informasi Manajemen Kesehatan.
        </p>
      </div>
    </div>
  );
}
