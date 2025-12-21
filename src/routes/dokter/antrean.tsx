import { action, createAsync, useSubmission, useParams } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getAntreanHariIni, getAllPoli, updateStatusKunjungan } from "~/lib";
import { Layout } from "~/components/Layout";

const panggilPasienAction = action(async (formData: FormData) => {
    "use server";
    const id = String(formData.get("id"));
    await updateStatusKunjungan(id, "dipanggil");
    return { success: true };
});

export default function DokterAntreanPage() {
    const user = createAsync(() => getUser());
    const poli = createAsync(() => getAllPoli());
    const [selectedPoli, setSelectedPoli] = createSignal<string>("");

    const antrean = createAsync(() => {
        const poliId = selectedPoli();
        if (!poliId) return [];
        return getAntreanHariIni(poliId);
    });

    const submission = useSubmission(panggilPasienAction);

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
                            <h1 class="text-2xl font-bold text-white">Antrean Pasien</h1>
                            <Suspense>
                                <select
                                    value={selectedPoli()}
                                    onChange={(e) => setSelectedPoli(e.currentTarget.value)}
                                    class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                >
                                    <option value="">Pilih Poli</option>
                                    <For each={poli()}>
                                        {(p) => <option value={p.id}>{p.nama}</option>}
                                    </For>
                                </select>
                            </Suspense>
                        </div>

                        <Show when={selectedPoli()} fallback={
                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                                <p class="text-white/60">Pilih poli untuk melihat antrean</p>
                            </div>
                        }>
                            <Suspense fallback={<div class="text-white/60">Memuat antrean...</div>}>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <For each={antrean() || []} fallback={
                                        <div class="col-span-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                                            <p class="text-white/60">Tidak ada pasien dalam antrean</p>
                                        </div>
                                    }>
                                        {(item) => (
                                            <div class={`rounded-2xl bg-white/5 backdrop-blur-sm border p-6 ${item.status === 'dipanggil' ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10'}`}>
                                                <div class="flex items-start justify-between mb-4">
                                                    <div class="flex items-center gap-4">
                                                        <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                                            <span class="text-2xl font-bold text-slate-900">{item.nomorAntrean}</span>
                                                        </div>
                                                        <div>
                                                            <h3 class="text-lg font-semibold text-white">{item.pasien.nama}</h3>
                                                            <p class="text-white/60 text-sm">{item.pasien.noRM}</p>
                                                            <span class={`px-2 py-1 rounded-full text-xs font-medium ${item.tipePasien === 'bpjs' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                                {item.tipePasien.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span class={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                                                        {item.status}
                                                    </span>
                                                </div>

                                                <div class="flex gap-2">
                                                    <Show when={item.status === 'menunggu'}>
                                                        <form action={panggilPasienAction} method="post" class="flex-1">
                                                            <input type="hidden" name="id" value={item.id} />
                                                            <button
                                                                type="submit"
                                                                class="w-full px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                            >
                                                                Panggil Pasien
                                                            </button>
                                                        </form>
                                                    </Show>
                                                    <Show when={item.status === 'dipanggil' || item.status === 'menunggu'}>
                                                        <a
                                                            href={`/dokter/periksa/${item.id}`}
                                                            class="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold text-center hover:opacity-90 transition-all"
                                                        >
                                                            Periksa
                                                        </a>
                                                    </Show>
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </Suspense>
                        </Show>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
