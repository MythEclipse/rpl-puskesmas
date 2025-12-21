import { createAsync } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getLaporan10Penyakit } from "~/lib";
import { Layout } from "~/components/Layout";

export default function LaporanPenyakitPage() {
    const user = createAsync(() => getUser());

    const [startDate, setStartDate] = createSignal("");
    const [endDate, setEndDate] = createSignal("");

    const laporan = createAsync(async () => {
        const filter: any = {};
        if (startDate()) filter.startDate = new Date(startDate());
        if (endDate()) filter.endDate = new Date(endDate());
        return getLaporan10Penyakit(filter);
    });

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">10 Penyakit Terbanyak</h1>

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
                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                                            <p class="text-white/60 text-sm">Total Diagnosis</p>
                                            <p class="text-3xl font-bold text-white">{data().total}</p>
                                        </div>

                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                            <h2 class="px-6 py-4 text-lg font-semibold text-white border-b border-white/10">Ranking Penyakit</h2>
                                            <div class="divide-y divide-white/5">
                                                <For each={data().top10} fallback={
                                                    <div class="px-6 py-8 text-center text-white/60">Belum ada data diagnosis</div>
                                                }>
                                                    {(item) => (
                                                        <div class="flex items-center gap-4 px-6 py-4 hover:bg-white/5">
                                                            <div class={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${item.rank <= 3
                                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-slate-900'
                                                                    : 'bg-white/10 text-white/60'
                                                                }`}>
                                                                {item.rank}
                                                            </div>
                                                            <div class="flex-1">
                                                                <p class="text-white font-medium capitalize">{item.diagnosis}</p>
                                                            </div>
                                                            <div class="text-right">
                                                                <p class="text-2xl font-bold text-emerald-400">{item.count}</p>
                                                                <p class="text-white/60 text-sm">kasus</p>
                                                            </div>
                                                            <div class="w-32">
                                                                <div class="h-3 rounded-full bg-white/10 overflow-hidden">
                                                                    <div
                                                                        class="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                                                                        style={{ width: `${(item.count / data().total) * 100}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
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
