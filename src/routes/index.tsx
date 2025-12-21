import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/lib";

export const route = {
  preload() {
    getUser();
  }
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Selamat Datang,{" "}
          <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {user()?.username || "Pengguna"}
          </span>
        </h1>
        <p class="text-xl text-white/60 max-w-2xl mx-auto">
          Sistem Informasi Manajemen Puskesmas untuk pelayanan kesehatan yang lebih baik
        </p>
      </div>

      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-white mb-1">1,234</h3>
            <p class="text-white/60">Total Pasien</p>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-white mb-1">567</h3>
            <p class="text-white/60">Kunjungan Hari Ini</p>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-white mb-1">89</h3>
            <p class="text-white/60">Antrian Aktif</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8">
        <h2 class="text-2xl font-bold text-white mb-6">Menu Cepat</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button class="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-white/80">Pasien Baru</span>
          </button>

          <button class="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-sm font-medium text-white/80">Rekam Medis</span>
          </button>

          <button class="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-white/80">Jadwal</span>
          </button>

          <button class="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-white/80">Laporan</span>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div class="mt-8 flex justify-center">
        <form action={logout} method="post">
          <button
            name="logout"
            type="submit"
            class="px-6 py-3 text-sm font-medium text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300"
          >
            Logout dari Sistem
          </button>
        </form>
      </div>
    </div>
  );
}
