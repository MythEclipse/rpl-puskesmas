import { Component, JSX, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { logout } from "~/lib";

type UserRole = "pendaftaran" | "dokter" | "apoteker" | "kepalaPuskesmas" | "admin";

interface LayoutProps {
    children: JSX.Element;
    user: { username: string; namaLengkap: string; role: UserRole };
}

const roleLabels: Record<UserRole, string> = {
    pendaftaran: "Petugas Pendaftaran",
    dokter: "Dokter",
    apoteker: "Apoteker",
    kepalaPuskesmas: "Kepala Puskesmas",
    admin: "Administrator"
};

const roleMenus: Record<UserRole, Array<{ href: string; label: string; icon: string }>> = {
    pendaftaran: [
        { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/pendaftaran/pasien-baru", label: "Pasien Baru", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
        { href: "/pendaftaran/daftar-kunjungan", label: "Daftar Kunjungan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { href: "/pendaftaran/antrean", label: "Antrean", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { href: "/pendaftaran/pembayaran", label: "Pembayaran", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    ],
    dokter: [
        { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/dokter/antrean", label: "Antrean Pasien", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { href: "/dokter/rekam-medis", label: "Rekam Medis", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ],
    apoteker: [
        { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/apoteker/resep", label: "Resep Menunggu", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
        { href: "/apoteker/stok-obat", label: "Stok Obat", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    ],
    kepalaPuskesmas: [
        { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/laporan/kunjungan", label: "Laporan Kunjungan", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        { href: "/laporan/penyakit", label: "10 Penyakit Terbanyak", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { href: "/laporan/obat", label: "Pemakaian Obat", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
    ],
    admin: [
        { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/admin/users", label: "Kelola Pengguna", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { href: "/admin/poli", label: "Master Poli", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
        { href: "/admin/obat", label: "Master Obat", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
        { href: "/admin/tarif", label: "Master Tarif", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    ],
};

export const Layout: Component<LayoutProps> = (props) => {
    const [sidebarOpen, setSidebarOpen] = createSignal(true);
    const menus = () => roleMenus[props.user.role] || roleMenus.pendaftaran;

    return (
        <div class="flex min-h-screen">
            {/* Sidebar */}
            <aside class={`${sidebarOpen() ? 'w-64' : 'w-20'} transition-all duration-300 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col`}>
                {/* Logo */}
                <div class="p-4 border-b border-white/10">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                            <span class="text-xl font-bold text-slate-900">P</span>
                        </div>
                        <Show when={sidebarOpen()}>
                            <div>
                                <h1 class="text-lg font-bold text-white">SI-Puskesmas</h1>
                                <p class="text-xs text-white/60">{roleLabels[props.user.role]}</p>
                            </div>
                        </Show>
                    </div>
                </div>

                {/* Navigation */}
                <nav class="flex-1 p-4 space-y-2">
                    {menus().map(menu => (
                        <A
                            href={menu.href}
                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            activeClass="!bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 !text-white border border-emerald-500/30"
                            end={menu.href === "/"}
                        >
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={menu.icon} />
                            </svg>
                            <Show when={sidebarOpen()}>
                                <span class="text-sm font-medium">{menu.label}</span>
                            </Show>
                        </A>
                    ))}
                </nav>

                {/* User info & Logout */}
                <div class="p-4 border-t border-white/10">
                    <Show when={sidebarOpen()}>
                        <div class="mb-3 px-3">
                            <p class="text-sm font-medium text-white truncate">{props.user.namaLengkap || props.user.username}</p>
                            <p class="text-xs text-white/60">@{props.user.username}</p>
                        </div>
                    </Show>
                    <form action={logout} method="post">
                        <button
                            type="submit"
                            class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <Show when={sidebarOpen()}>
                                <span class="text-sm font-medium">Keluar</span>
                            </Show>
                        </button>
                    </form>
                </div>

                {/* Toggle button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen())}
                    class="absolute top-20 -right-3 w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ left: sidebarOpen() ? '248px' : '68px' }}
                >
                    <svg class={`w-4 h-4 transition-transform ${sidebarOpen() ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </aside>

            {/* Main Content */}
            <main class="flex-1 p-6 overflow-auto">
                {props.children}
            </main>
        </div>
    );
};
