import { createAsync } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getLaporanKunjungan, getAllPoli } from "~/lib";
import { Layout } from "~/components/Layout";

export default function LaporanKunjunganPage() {
    const user = createAsync(() => getUser());
    const poli = createAsync(() => getAllPoli());

    const [startDate, setStartDate] = createSignal("");
    const [endDate, setEndDate] = createSignal("");
    const [selectedPoli, setSelectedPoli] = createSignal("");

    const laporan = createAsync(async () => {
        const filter: any = {};
        if (startDate()) filter.startDate = new Date(startDate());
        if (endDate()) filter.endDate = new Date(endDate());
        if (selectedPoli()) filter.poliId = selectedPoli();
        return getLaporanKunjungan(filter);
    });

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Laporan Kunjungan</h1>

                        {/* Filter */}
                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-2">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={startDate()}
                                        onInput={(e) => setStartDate(e.currentTarget.value)}
                                        class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-2">Tanggal Akhir</label>
                                    <input
                                        type="date"
                                        value={endDate()}
                                        onInput={(e) => setEndDate(e.currentTarget.value)}
                                        class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-2">Poli</label>
                                    <Suspense>
                                        <select
                                            value={selectedPoli()}
                                            onChange={(e) => setSelectedPoli(e.currentTarget.value)}
                                            class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        >
                                            <option value="">Semua Poli</option>
                                            <For each={poli()}>
                                                {(p) => <option value={p.id}>{p.nama}</option>}
                                            </For>
                                        </select>
                                    </Suspense>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <Suspense fallback={<div class="text-white/60">Memuat laporan...</div>}>
                            <Show when={laporan()}>
                                {(data) => (
                                    <>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                <p class="text-white/60 text-sm">Total Kunjungan</p>
                                                <p class="text-3xl font-bold text-white">{data().total}</p>
                                            </div>
                                            <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6">
                                                <p class="text-emerald-400/80 text-sm">Pasien Umum</p>
                                                <p class="text-3xl font-bold text-emerald-400">
                                                    {data().byPoli.reduce((a, b) => a + b.umum, 0)}
                                                </p>
                                            </div>
                                            <div class="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-6">
                                                <p class="text-cyan-400/80 text-sm">Pasien BPJS</p>
                                                <p class="text-3xl font-bold text-cyan-400">
                                                    {data().byPoli.reduce((a, b) => a + b.bpjs, 0)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* By Poli Table */}
                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden mb-6">
                                            <h2 class="px-6 py-4 text-lg font-semibold text-white border-b border-white/10">Kunjungan per Poli</h2>
                                            <table class="w-full">
                                                <thead>
                                                    <tr class="border-b border-white/10">
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Poli</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Total</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Umum</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">BPJS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <For each={data().byPoli}>
                                                        {(item) => (
                                                            <tr class="border-b border-white/5 hover:bg-white/5">
                                                                <td class="px-6 py-4 text-white font-medium">{item.poli}</td>
                                                                <td class="px-6 py-4 text-white">{item.total}</td>
                                                                <td class="px-6 py-4 text-emerald-400">{item.umum}</td>
                                                                <td class="px-6 py-4 text-cyan-400">{item.bpjs}</td>
                                                            </tr>
                                                        )}
                                                    </For>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </Show>
                        </Suspense>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
