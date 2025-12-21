import { action, createAsync, useParams, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getKunjunganById, createRekamMedis, createResep, getAllObat, getRiwayatRekamMedis } from "~/lib";
import { Layout } from "~/components/Layout";

const createRekamMedisAction = action(async (formData: FormData) => {
    "use server";
    try {
        const tandaVital = {
            tekananDarah: String(formData.get("tekananDarah")),
            suhu: String(formData.get("suhu")),
            nadi: String(formData.get("nadi")),
            pernapasan: String(formData.get("pernapasan")),
            beratBadan: String(formData.get("beratBadan")),
            tinggiBadan: String(formData.get("tinggiBadan")),
        };

        const rekamMedis = await createRekamMedis({
            kunjunganId: String(formData.get("kunjunganId")),
            keluhan: String(formData.get("keluhan")),
            pemeriksaan: String(formData.get("pemeriksaan")),
            diagnosis: String(formData.get("diagnosis")),
            tandaVital,
            catatan: formData.get("catatan") ? String(formData.get("catatan")) : undefined,
        });
        return { success: true, rekamMedis };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

const createResepAction = action(async (formData: FormData) => {
    "use server";
    try {
        const rekamMedisId = String(formData.get("rekamMedisId"));
        const itemsJson = String(formData.get("items"));
        const items = JSON.parse(itemsJson);

        const resep = await createResep({
            rekamMedisId,
            items,
            catatan: formData.get("catatan") ? String(formData.get("catatan")) : undefined,
        });
        return { success: true, resep };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

export default function PeriksaPage() {
    const params = useParams();
    const user = createAsync(() => getUser());
    const kunjungan = createAsync(() => getKunjunganById(params.id));
    const obatList = createAsync(() => getAllObat());

    const [step, setStep] = createSignal<"rekam" | "resep" | "done">("rekam");
    const [rekamMedisId, setRekamMedisId] = createSignal<string>("");
    const [resepItems, setResepItems] = createSignal<Array<{ obatId: string; jumlah: number; aturan: string }>>([]);

    const rekamMedisSubmission = useSubmission(createRekamMedisAction);
    const resepSubmission = useSubmission(createResepAction);

    // Handle rekam medis success
    const handleRekamMedisResult = () => {
        if (rekamMedisSubmission.result?.success) {
            setRekamMedisId((rekamMedisSubmission.result as any).rekamMedis.id);
            setStep("resep");
        }
    };

    const addResepItem = () => {
        setResepItems([...resepItems(), { obatId: "", jumlah: 1, aturan: "" }]);
    };

    const updateResepItem = (index: number, field: string, value: any) => {
        const items = [...resepItems()];
        (items[index] as any)[field] = value;
        setResepItems(items);
    };

    const removeResepItem = (index: number) => {
        setResepItems(resepItems().filter((_, i) => i !== index));
    };

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <Suspense fallback={<div class="text-white/60">Memuat data...</div>}>
                        <Show when={kunjungan()}>
                            {(k) => (
                                <div class="max-w-4xl mx-auto">
                                    {/* Patient Info Header */}
                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                                        <div class="flex items-center gap-4">
                                            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                                <span class="text-2xl font-bold text-slate-900">{k().nomorAntrean}</span>
                                            </div>
                                            <div class="flex-1">
                                                <h1 class="text-xl font-bold text-white">{k().pasien.nama}</h1>
                                                <p class="text-white/60">No. RM: {k().pasien.noRM} | {k().poli.nama}</p>
                                                <p class="text-white/60 text-sm">
                                                    {k().pasien.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} | {new Date(k().pasien.tanggalLahir).toLocaleDateString("id-ID")}
                                                </p>
                                            </div>
                                            <span class={`px-3 py-1 rounded-full text-xs font-medium ${k().tipePasien === 'bpjs' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {k().tipePasien.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Steps indicator */}
                                    <div class="flex items-center gap-4 mb-6">
                                        <div class={`flex items-center gap-2 ${step() === 'rekam' ? 'text-emerald-400' : 'text-white/40'}`}>
                                            <div class={`w-8 h-8 rounded-full flex items-center justify-center ${step() === 'rekam' ? 'bg-emerald-500' : step() !== 'rekam' ? 'bg-emerald-500/50' : 'bg-white/10'}`}>
                                                1
                                            </div>
                                            <span>Rekam Medis</span>
                                        </div>
                                        <div class="flex-1 h-0.5 bg-white/10" />
                                        <div class={`flex items-center gap-2 ${step() === 'resep' ? 'text-emerald-400' : 'text-white/40'}`}>
                                            <div class={`w-8 h-8 rounded-full flex items-center justify-center ${step() === 'resep' ? 'bg-emerald-500' : step() === 'done' ? 'bg-emerald-500/50' : 'bg-white/10'}`}>
                                                2
                                            </div>
                                            <span>Resep Obat</span>
                                        </div>
                                        <div class="flex-1 h-0.5 bg-white/10" />
                                        <div class={`flex items-center gap-2 ${step() === 'done' ? 'text-emerald-400' : 'text-white/40'}`}>
                                            <div class={`w-8 h-8 rounded-full flex items-center justify-center ${step() === 'done' ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                                ✓
                                            </div>
                                            <span>Selesai</span>
                                        </div>
                                    </div>

                                    {/* Step 1: Rekam Medis */}
                                    <Show when={step() === 'rekam'}>
                                        <form action={createRekamMedisAction} method="post" class="space-y-6" onSubmit={() => setTimeout(handleRekamMedisResult, 500)}>
                                            <input type="hidden" name="kunjunganId" value={k().id} />

                                            {/* Tanda Vital */}
                                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                <h2 class="text-lg font-semibold text-white mb-4">Tanda Vital</h2>
                                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Tekanan Darah</label>
                                                        <input name="tekananDarah" placeholder="120/80" required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Suhu (°C)</label>
                                                        <input name="suhu" placeholder="36.5" required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Nadi (x/menit)</label>
                                                        <input name="nadi" placeholder="80" required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Pernapasan (x/menit)</label>
                                                        <input name="pernapasan" placeholder="20" required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Berat Badan (kg)</label>
                                                        <input name="beratBadan" placeholder="60" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Tinggi Badan (cm)</label>
                                                        <input name="tinggiBadan" placeholder="165" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pemeriksaan */}
                                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                <h2 class="text-lg font-semibold text-white mb-4">Pemeriksaan</h2>
                                                <div class="space-y-4">
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Keluhan *</label>
                                                        <textarea name="keluhan" rows={3} required placeholder="Keluhan utama pasien" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Hasil Pemeriksaan *</label>
                                                        <textarea name="pemeriksaan" rows={3} required placeholder="Hasil pemeriksaan fisik" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Diagnosis *</label>
                                                        <input name="diagnosis" required placeholder="Diagnosis penyakit" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-white/80 mb-2">Catatan Tambahan</label>
                                                        <textarea name="catatan" rows={2} placeholder="Catatan lainnya (opsional)" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <Show when={rekamMedisSubmission.result && !rekamMedisSubmission.result.success}>
                                                <div class="p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                                                    <p class="text-red-400">{(rekamMedisSubmission.result as any).error}</p>
                                                </div>
                                            </Show>

                                            <button
                                                type="submit"
                                                disabled={rekamMedisSubmission.pending}
                                                class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                            >
                                                {rekamMedisSubmission.pending ? "Menyimpan..." : "Simpan & Lanjut ke Resep"}
                                            </button>
                                        </form>
                                    </Show>

                                    {/* Step 2: Resep */}
                                    <Show when={step() === 'resep'}>
                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                            <div class="flex items-center justify-between mb-4">
                                                <h2 class="text-lg font-semibold text-white">Resep Obat</h2>
                                                <button
                                                    type="button"
                                                    onClick={addResepItem}
                                                    class="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                                                >
                                                    + Tambah Obat
                                                </button>
                                            </div>

                                            <Show when={resepItems().length === 0}>
                                                <p class="text-white/60 text-center py-8">
                                                    Klik "Tambah Obat" untuk menambahkan obat ke resep, atau lewati jika tidak perlu obat.
                                                </p>
                                            </Show>

                                            <div class="space-y-4">
                                                <For each={resepItems()}>
                                                    {(item, index) => (
                                                        <div class="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                                                            <div class="flex-1">
                                                                <label class="block text-sm font-medium text-white/80 mb-2">Obat</label>
                                                                <select
                                                                    value={item.obatId}
                                                                    onChange={(e) => updateResepItem(index(), "obatId", e.currentTarget.value)}
                                                                    class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                                                >
                                                                    <option value="">Pilih Obat</option>
                                                                    <For each={obatList()}>
                                                                        {(obat) => <option value={obat.id}>{obat.nama} ({obat.satuan}) - Stok: {obat.stok}</option>}
                                                                    </For>
                                                                </select>
                                                            </div>
                                                            <div class="w-24">
                                                                <label class="block text-sm font-medium text-white/80 mb-2">Jumlah</label>
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    value={item.jumlah}
                                                                    onChange={(e) => updateResepItem(index(), "jumlah", parseInt(e.currentTarget.value))}
                                                                    class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                                                />
                                                            </div>
                                                            <div class="flex-1">
                                                                <label class="block text-sm font-medium text-white/80 mb-2">Aturan Pakai</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="3x1 sehari sesudah makan"
                                                                    value={item.aturan}
                                                                    onChange={(e) => updateResepItem(index(), "aturan", e.currentTarget.value)}
                                                                    class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeResepItem(index())}
                                                                class="mt-7 p-2 text-red-400 hover:text-red-300"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>

                                            <div class="flex gap-4 mt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep("done")}
                                                    class="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                                                >
                                                    Lewati (Tanpa Resep)
                                                </button>
                                                <form action={createResepAction} method="post" class="flex-1" onSubmit={() => setTimeout(() => setStep("done"), 500)}>
                                                    <input type="hidden" name="rekamMedisId" value={rekamMedisId()} />
                                                    <input type="hidden" name="items" value={JSON.stringify(resepItems().filter(i => i.obatId && i.aturan))} />
                                                    <button
                                                        type="submit"
                                                        disabled={resepSubmission.pending || resepItems().filter(i => i.obatId && i.aturan).length === 0}
                                                        class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                                    >
                                                        {resepSubmission.pending ? "Menyimpan..." : "Simpan Resep"}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </Show>

                                    {/* Step 3: Done */}
                                    <Show when={step() === 'done'}>
                                        <div class="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-8 text-center">
                                            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h2 class="text-2xl font-bold text-white mb-2">Pemeriksaan Selesai!</h2>
                                            <p class="text-white/60 mb-6">
                                                Data rekam medis dan resep obat telah disimpan.
                                            </p>
                                            <a
                                                href="/dokter/antrean"
                                                class="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all"
                                            >
                                                Kembali ke Antrean
                                            </a>
                                        </div>
                                    </Show>
                                </div>
                            )}
                        </Show>
                    </Suspense>
                </Layout>
            )}
        </Show>
    );
}
