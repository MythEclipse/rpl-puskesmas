import { action, createAsync, useSubmission } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getUser, getResepMenunggu, processResep, markResepTidakLengkap } from "~/lib";
import { Layout } from "~/components/Layout";

const processResepAction = action(async (formData: FormData) => {
    "use server";
    const resepId = String(formData.get("resepId"));
    return processResep(resepId);
});

const markTidakLengkapAction = action(async (formData: FormData) => {
    "use server";
    const resepId = String(formData.get("resepId"));
    const alasan = String(formData.get("alasan"));
    await markResepTidakLengkap(resepId, alasan);
    return { success: true };
});

export default function ApotekerResepPage() {
    const user = createAsync(() => getUser());
    const resepList = createAsync(() => getResepMenunggu());
    const processSubmission = useSubmission(processResepAction);

    const statusColors: Record<string, string> = {
        dibuat: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        diproses: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        selesai: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        tidakLengkap: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Resep Menunggu</h1>

                        <Suspense fallback={<div class="text-white/60">Memuat resep...</div>}>
                            <Show when={resepList()}>
                                {(data) => (
                                    <Show when={data().length > 0} fallback={
                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                                            <p class="text-white/60">Tidak ada resep yang menunggu diproses</p>
                                        </div>
                                    }>
                                        <div class="space-y-6">
                                            <For each={data()}>
                                                {(resep) => (
                                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                        {/* Header */}
                                                        <div class="flex items-start justify-between mb-4">
                                                            <div>
                                                                <h3 class="text-lg font-semibold text-white">{resep.rekamMedis.kunjungan.pasien.nama}</h3>
                                                                <p class="text-white/60 text-sm">
                                                                    No. RM: {resep.rekamMedis.kunjungan.pasien.noRM} |
                                                                    Dokter: {resep.rekamMedis.dokter.namaLengkap || resep.rekamMedis.dokter.username}
                                                                </p>
                                                                <p class="text-white/60 text-sm">
                                                                    Diagnosis: {resep.rekamMedis.diagnosis}
                                                                </p>
                                                            </div>
                                                            <span class={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[resep.status]}`}>
                                                                {resep.status}
                                                            </span>
                                                        </div>

                                                        {/* Obat List */}
                                                        <div class="mb-4">
                                                            <h4 class="text-sm font-medium text-white/80 mb-2">Daftar Obat:</h4>
                                                            <div class="space-y-2">
                                                                <For each={resep.detailResep}>
                                                                    {(item) => (
                                                                        <div class="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                                                            <div>
                                                                                <p class="text-white font-medium">{item.obat.nama}</p>
                                                                                <p class="text-white/60 text-sm">{item.aturan}</p>
                                                                            </div>
                                                                            <div class="text-right">
                                                                                <p class="text-white">{item.jumlah} {item.obat.satuan}</p>
                                                                                <p class={`text-sm ${item.obat.stok >= item.jumlah ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                                    Stok: {item.obat.stok}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </For>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div class="flex gap-4">
                                                            <form action={markTidakLengkapAction} method="post" class="flex gap-2">
                                                                <input type="hidden" name="resepId" value={resep.id} />
                                                                <input
                                                                    name="alasan"
                                                                    placeholder="Alasan tidak lengkap..."
                                                                    class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    class="px-4 py-2 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                                                                >
                                                                    Tandai Tidak Lengkap
                                                                </button>
                                                            </form>
                                                            <form action={processResepAction} method="post" class="flex-1">
                                                                <input type="hidden" name="resepId" value={resep.id} />
                                                                <button
                                                                    type="submit"
                                                                    disabled={processSubmission.pending}
                                                                    class="w-full px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                                                >
                                                                    Proses & Serahkan Obat
                                                                </button>
                                                            </form>
                                                        </div>

                                                        <Show when={processSubmission.result && !(processSubmission.result as any).success}>
                                                            <div class="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                                                                <p class="text-red-400 font-medium">Stok tidak mencukupi:</p>
                                                                <ul class="text-red-400/80 text-sm mt-2">
                                                                    <For each={(processSubmission.result as any).issues}>
                                                                        {(issue) => <li>• {issue}</li>}
                                                                    </For>
                                                                </ul>
                                                            </div>
                                                        </Show>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </Show>
                                )}
                            </Show>
                        </Suspense>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
