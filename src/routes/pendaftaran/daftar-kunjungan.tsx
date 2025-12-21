import { action, createAsync, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, searchPasien, getAllPoli, createKunjungan, getPasienByNIK } from "~/lib";
import { Layout } from "~/components/Layout";

const searchAction = action(async (formData: FormData) => {
    "use server";
    const query = String(formData.get("query"));
    if (!query || query.length < 2) return [];
    return searchPasien(query);
});

const createKunjunganAction = action(async (formData: FormData) => {
    "use server";
    try {
        const kunjungan = await createKunjungan({
            pasienId: String(formData.get("pasienId")),
            poliId: String(formData.get("poliId")),
            tipePasien: String(formData.get("tipePasien")) as "umum" | "bpjs",
        });
        return { success: true, kunjungan };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

export default function DaftarKunjunganPage() {
    const user = createAsync(() => getUser());
    const poli = createAsync(() => getAllPoli());
    const searchSubmission = useSubmission(searchAction);
    const kunjunganSubmission = useSubmission(createKunjunganAction);

    const [selectedPasien, setSelectedPasien] = createSignal<any>(null);
    const [tipePasien, setTipePasien] = createSignal<"umum" | "bpjs">("umum");

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Daftar Kunjungan</h1>

                        <Show when={kunjunganSubmission.result?.success}>
                            <div class="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                <p class="text-emerald-400 font-medium">
                                    ✓ Kunjungan berhasil didaftarkan!
                                </p>
                                <p class="text-white/80 mt-2">
                                    Nomor Antrean: <span class="text-2xl font-bold text-emerald-400">{(kunjunganSubmission.result as any).kunjungan?.nomorAntrean}</span>
                                </p>
                                <p class="text-white/60 text-sm">
                                    Poli: {(kunjunganSubmission.result as any).kunjungan?.poli?.nama}
                                </p>
                            </div>
                        </Show>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Search Patient */}
                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                <h2 class="text-lg font-semibold text-white mb-4">1. Cari Pasien</h2>

                                <form action={searchAction} method="post" class="mb-4">
                                    <div class="flex gap-2">
                                        <input
                                            name="query"
                                            type="text"
                                            placeholder="Cari NIK, No. RM, atau Nama..."
                                            class="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                        <button
                                            type="submit"
                                            class="px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                                        >
                                            Cari
                                        </button>
                                    </div>
                                </form>

                                <Show when={searchSubmission.result && (searchSubmission.result as any[]).length > 0}>
                                    <div class="space-y-2 max-h-60 overflow-auto">
                                        <For each={searchSubmission.result as any[]}>
                                            {(pasien) => (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedPasien(pasien)}
                                                    class={`w-full text-left p-3 rounded-xl border transition-all ${selectedPasien()?.id === pasien.id
                                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <p class="text-white font-medium">{pasien.nama}</p>
                                                    <p class="text-white/60 text-sm">NIK: {pasien.nik} | No. RM: {pasien.noRM}</p>
                                                </button>
                                            )}
                                        </For>
                                    </div>
                                </Show>

                                <Show when={searchSubmission.result && (searchSubmission.result as any[]).length === 0}>
                                    <p class="text-white/60 text-center py-4">
                                        Pasien tidak ditemukan. <a href="/pendaftaran/pasien-baru" class="text-emerald-400 hover:underline">Daftarkan pasien baru?</a>
                                    </p>
                                </Show>
                            </div>

                            {/* Create Kunjungan */}
                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                <h2 class="text-lg font-semibold text-white mb-4">2. Pilih Poli & Tipe</h2>

                                <Show when={selectedPasien()} fallback={
                                    <p class="text-white/60 text-center py-8">Pilih pasien terlebih dahulu</p>
                                }>
                                    <div class="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                        <p class="text-cyan-400 font-medium">{selectedPasien().nama}</p>
                                        <p class="text-white/60 text-sm">No. RM: {selectedPasien().noRM}</p>
                                        <Show when={selectedPasien().noBPJS}>
                                            <p class="text-white/60 text-sm">No. BPJS: {selectedPasien().noBPJS}</p>
                                        </Show>
                                    </div>

                                    <form action={createKunjunganAction} method="post" class="space-y-4">
                                        <input type="hidden" name="pasienId" value={selectedPasien().id} />

                                        <div>
                                            <label class="block text-sm font-medium text-white/80 mb-2">Poli Tujuan *</label>
                                            <Suspense fallback={<p class="text-white/60">Memuat...</p>}>
                                                <select
                                                    name="poliId"
                                                    required
                                                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                                >
                                                    <option value="">Pilih Poli</option>
                                                    <For each={poli()}>
                                                        {(p) => <option value={p.id}>{p.nama}</option>}
                                                    </For>
                                                </select>
                                            </Suspense>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-white/80 mb-2">Tipe Pasien *</label>
                                            <div class="flex gap-4">
                                                <label class="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="tipePasien"
                                                        value="umum"
                                                        checked={tipePasien() === "umum"}
                                                        onChange={() => setTipePasien("umum")}
                                                        class="w-4 h-4 text-emerald-400"
                                                    />
                                                    <span class="text-white">Umum</span>
                                                </label>
                                                <label class="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="tipePasien"
                                                        value="bpjs"
                                                        checked={tipePasien() === "bpjs"}
                                                        onChange={() => setTipePasien("bpjs")}
                                                        disabled={!selectedPasien()?.noBPJS}
                                                        class="w-4 h-4 text-emerald-400 disabled:opacity-50"
                                                    />
                                                    <span class={`${selectedPasien()?.noBPJS ? 'text-white' : 'text-white/40'}`}>
                                                        BPJS {!selectedPasien()?.noBPJS && "(Tidak terdaftar)"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={kunjunganSubmission.pending}
                                            class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                        >
                                            {kunjunganSubmission.pending ? "Memproses..." : "Daftarkan Kunjungan"}
                                        </button>
                                    </form>
                                </Show>
                            </div>
                        </div>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
