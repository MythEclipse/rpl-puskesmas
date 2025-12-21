import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getUser, getDashboardStats } from "~/lib";
import { Layout } from "~/components/Layout";

export const route = {
  preload() {
    getUser();
  }
} satisfies RouteDefinition;

export default function Dashboard() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const stats = createAsync(() => getDashboardStats());

  return (
    <Show when={user()}>
      {(u) => (
        <Layout user={u()}>
          <div class="max-w-7xl mx-auto">
            {/* Header */}
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-white mb-2">
                Selamat Datang, {u().namaLengkap || u().username}!
              </h1>
              <p class="text-white/60">
                Dashboard Sistem Informasi Puskesmas
              </p>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<div class="text-white/60">Memuat statistik...</div>}>
              <Show when={stats()}>
                {(s) => (
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-2xl font-bold text-white">{s().totalPasien}</p>
                          <p class="text-sm text-white/60">Total Pasien</p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-2xl font-bold text-white">{s().kunjunganHariIni}</p>
                          <p class="text-sm text-white/60">Kunjungan Hari Ini</p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-2xl font-bold text-white">{s().antreanAktif}</p>
                          <p class="text-sm text-white/60">Antrean Aktif</p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-2xl font-bold text-white">{s().obatStokRendah}</p>
                          <p class="text-sm text-white/60">Obat Stok Rendah</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Show>
            </Suspense>

            {/* Quick Actions based on role */}
            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
              <h2 class="text-xl font-bold text-white mb-4">Aksi Cepat</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Show when={u().role === "pendaftaran" || u().role === "admin"}>
                  <a href="/pendaftaran/pasien-baru" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Pasien Baru</span>
                  </a>
                  <a href="/pendaftaran/daftar-kunjungan" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Daftar Kunjungan</span>
                  </a>
                </Show>
                <Show when={u().role === "dokter"}>
                  <a href="/dokter/antrean" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Lihat Antrean</span>
                  </a>
                </Show>
                <Show when={u().role === "apoteker"}>
                  <a href="/apoteker/resep" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Proses Resep</span>
                  </a>
                </Show>
                <Show when={u().role === "kepalaPuskesmas"}>
                  <a href="/laporan/kunjungan" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Lihat Laporan</span>
                  </a>
                </Show>
                <Show when={u().role === "admin"}>
                  <a href="/admin/users" class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-white/80">Kelola User</span>
                  </a>
                </Show>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </Show>
  );
}
