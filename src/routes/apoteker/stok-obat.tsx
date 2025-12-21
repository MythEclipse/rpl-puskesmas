import { action, createAsync, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getAllObat, updateStokObat, createObat } from "~/lib";
import { Layout } from "~/components/Layout";

const updateStokAction = action(async (formData: FormData) => {
    "use server";
    const id = String(formData.get("id"));
    const jumlah = parseInt(String(formData.get("jumlah")));
    const tipe = String(formData.get("tipe")) as "tambah" | "kurang";

    try {
        await updateStokObat(id, jumlah, tipe);
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

const createObatAction = action(async (formData: FormData) => {
    "use server";
    try {
        await createObat({
            kode: String(formData.get("kode")),
            nama: String(formData.get("nama")),
            satuan: String(formData.get("satuan")),
            stok: parseInt(String(formData.get("stok"))),
            harga: parseFloat(String(formData.get("harga"))),
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

export default function StokObatPage() {
    const user = createAsync(() => getUser());
    const obatList = createAsync(() => getAllObat());
    const [showAddForm, setShowAddForm] = createSignal(false);
    const createSubmission = useSubmission(createObatAction);

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <div class="flex items-center justify-between mb-6">
                            <h1 class="text-2xl font-bold text-white">Stok Obat</h1>
                            <button
                                onClick={() => setShowAddForm(!showAddForm())}
                                class="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                {showAddForm() ? "Tutup" : "+ Tambah Obat Baru"}
                            </button>
                        </div>

                        {/* Add Obat Form */}
                        <Show when={showAddForm()}>
                            <form action={createObatAction} method="post" class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                                <h2 class="text-lg font-semibold text-white mb-4">Tambah Obat Baru</h2>
                                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Kode</label>
                                        <input name="kode" required placeholder="OBT001" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Nama Obat</label>
                                        <input name="nama" required placeholder="Paracetamol" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Satuan</label>
                                        <input name="satuan" required placeholder="tablet" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Stok Awal</label>
                                        <input name="stok" type="number" required placeholder="100" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Harga</label>
                                        <input name="harga" type="number" required placeholder="5000" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                </div>
                                <button type="submit" disabled={createSubmission.pending} class="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                                    Simpan
                                </button>
                            </form>
                        </Show>

                        {/* Obat List */}
                        <Suspense fallback={<div class="text-white/60">Memuat data obat...</div>}>
                            <Show when={obatList()}>
                                {(data) => (
                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                        <table class="w-full">
                                            <thead>
                                                <tr class="border-b border-white/10">
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Kode</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Nama Obat</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Satuan</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Stok</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Harga</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <For each={data()} fallback={
                                                    <tr><td colspan="6" class="px-6 py-8 text-center text-white/60">Belum ada data obat</td></tr>
                                                }>
                                                    {(obat) => (
                                                        <tr class="border-b border-white/5 hover:bg-white/5">
                                                            <td class="px-6 py-4 text-white/70">{obat.kode}</td>
                                                            <td class="px-6 py-4 text-white font-medium">{obat.nama}</td>
                                                            <td class="px-6 py-4 text-white/70">{obat.satuan}</td>
                                                            <td class="px-6 py-4">
                                                                <span class={`font-bold ${obat.stok <= 10 ? 'text-red-400' : obat.stok <= 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                                    {obat.stok}
                                                                </span>
                                                            </td>
                                                            <td class="px-6 py-4 text-white/70">Rp {obat.harga.toLocaleString("id-ID")}</td>
                                                            <td class="px-6 py-4">
                                                                <form action={updateStokAction} method="post" class="flex gap-2 items-center">
                                                                    <input type="hidden" name="id" value={obat.id} />
                                                                    <input
                                                                        name="jumlah"
                                                                        type="number"
                                                                        min={1}
                                                                        placeholder="10"
                                                                        class="w-20 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                                                                    />
                                                                    <button type="submit" name="tipe" value="tambah" class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30">
                                                                        +
                                                                    </button>
                                                                    <button type="submit" name="tipe" value="kurang" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30">
                                                                        −
                                                                    </button>
                                                                </form>
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
