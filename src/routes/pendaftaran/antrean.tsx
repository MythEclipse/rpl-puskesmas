import { createAsync } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getUser, getAntreanHariIni, getAllPoli } from "~/lib";
import { Layout } from "~/components/Layout";

export default function AntreanPage() {
    const user = createAsync(() => getUser());
    const antrean = createAsync(() => getAntreanHariIni());
    const poli = createAsync(() => getAllPoli());

    const statusColors: Record<string, string> = {
        menunggu: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        dipanggil: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        diperiksa: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        selesai: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <div class="flex items-center justify-between mb-6">
                            <h1 class="text-2xl font-bold text-white">Antrean Hari Ini</h1>
                            <p class="text-white/60">{new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        <Suspense fallback={<div class="text-white/60">Memuat antrean...</div>}>
                            <Show when={antrean()} fallback={<p class="text-white/60">Belum ada antrean hari ini</p>}>
                                {(data) => (
                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                        <table class="w-full">
                                            <thead>
                                                <tr class="border-b border-white/10">
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">No.</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Pasien</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">No. RM</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Poli</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Tipe</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <For each={data()} fallback={
                                                    <tr><td colspan="6" class="px-6 py-8 text-center text-white/60">Belum ada antrean</td></tr>
                                                }>
                                                    {(item) => (
                                                        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                            <td class="px-6 py-4">
                                                                <span class="text-2xl font-bold text-emerald-400">{item.nomorAntrean}</span>
                                                            </td>
                                                            <td class="px-6 py-4 text-white">{item.pasien.nama}</td>
                                                            <td class="px-6 py-4 text-white/70">{item.pasien.noRM}</td>
                                                            <td class="px-6 py-4 text-white/70">{item.poli.nama}</td>
                                                            <td class="px-6 py-4">
                                                                <span class={`px-2 py-1 rounded-full text-xs font-medium ${item.tipePasien === 'bpjs' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                                    {item.tipePasien.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                <span class={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </For>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Show>
                        </Suspense>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
