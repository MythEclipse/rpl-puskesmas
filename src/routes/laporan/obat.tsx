import { createAsync } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getLaporanPemakaianObat } from "~/lib";
import { Layout } from "~/components/Layout";

export default function LaporanObatPage() {
    const user = createAsync(() => getUser());

    const [startDate, setStartDate] = createSignal("");
    const [endDate, setEndDate] = createSignal("");

    const laporan = createAsync(async () => {
        const filter: any = {};
        if (startDate()) filter.startDate = new Date(startDate());
        if (endDate()) filter.endDate = new Date(endDate());
        return getLaporanPemakaianObat(filter);
    });

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Laporan Pemakaian Obat</h1>

                        {/* Filter */}
                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            </div>
                        </div>

                        {/* Results */}
                        <Suspense fallback={<div class="text-white/60">Memuat laporan...</div>}>
                            <Show when={laporan()}>
                                {(data) => (
                                    <>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                <p class="text-white/60 text-sm">Total Transaksi Obat</p>
                                                <p class="text-3xl font-bold text-white">{data().totalTransaksi}</p>
                                            </div>
                                            <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6">
                                                <p class="text-emerald-400/80 text-sm">Total Nilai</p>
                                                <p class="text-3xl font-bold text-emerald-400">
                                                    Rp {data().pemakaian.reduce((a, b) => a + b.totalNilai, 0).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                            <h2 class="px-6 py-4 text-lg font-semibold text-white border-b border-white/10">Detail Pemakaian Obat</h2>
                                            <table class="w-full">
                                                <thead>
                                                    <tr class="border-b border-white/10">
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Nama Obat</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Satuan</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Total Pemakaian</th>
                                                        <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Total Nilai</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <For each={data().pemakaian} fallback={
                                                        <tr><td colspan="4" class="px-6 py-8 text-center text-white/60">Belum ada data pemakaian obat</td></tr>
                                                    }>
                                                        {(item) => (
                                                            <tr class="border-b border-white/5 hover:bg-white/5">
                                                                <td class="px-6 py-4 text-white font-medium">{item.obat}</td>
                                                                <td class="px-6 py-4 text-white/70">{item.satuan}</td>
                                                                <td class="px-6 py-4 text-emerald-400 font-medium">{item.totalPemakaian}</td>
                                                                <td class="px-6 py-4 text-white">Rp {item.totalNilai.toLocaleString("id-ID")}</td>
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
