import { action, createAsync, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getAllPoli, createPoli, updatePoli } from "~/lib";
import { Layout } from "~/components/Layout";

const createPoliAction = action(async (formData: FormData) => {
    "use server";
    try {
        await createPoli({
            kode: String(formData.get("kode")),
            nama: String(formData.get("nama")),
            deskripsi: formData.get("deskripsi") ? String(formData.get("deskripsi")) : undefined,
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

const togglePoliAction = action(async (formData: FormData) => {
    "use server";
    const id = String(formData.get("id"));
    const isActive = formData.get("isActive") === "true";
    await updatePoli(id, { isActive: !isActive });
    return { success: true };
});

export default function AdminPoliPage() {
    const user = createAsync(() => getUser());
    const poliList = createAsync(() => getAllPoli());
    const [showAddForm, setShowAddForm] = createSignal(false);
    const createSubmission = useSubmission(createPoliAction);

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-4xl mx-auto">
                        <div class="flex items-center justify-between mb-6">
                            <h1 class="text-2xl font-bold text-white">Master Data Poli</h1>
                            <button
                                onClick={() => setShowAddForm(!showAddForm())}
                                class="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                {showAddForm() ? "Tutup" : "+ Tambah Poli"}
                            </button>
                        </div>

                        {/* Add Form */}
                        <Show when={showAddForm()}>
                            <form action={createPoliAction} method="post" class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                                <h2 class="text-lg font-semibold text-white mb-4">Tambah Poli Baru</h2>

                                <Show when={createSubmission.result && !createSubmission.result.success}>
                                    <div class="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                                        <p class="text-red-400">{(createSubmission.result as any).error}</p>
                                    </div>
                                </Show>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Kode Poli</label>
                                        <input name="kode" required placeholder="POLI-UMUM" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Nama Poli</label>
                                        <input name="nama" required placeholder="Poli Umum" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Deskripsi</label>
                                        <input name="deskripsi" placeholder="Opsional" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                </div>
                                <button type="submit" disabled={createSubmission.pending} class="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                                    Simpan
                                </button>
                            </form>
                        </Show>

                        {/* Poli List */}
                        <Suspense fallback={<div class="text-white/60">Memuat data poli...</div>}>
                            <Show when={poliList()}>
                                {(data) => (
                                    <div class="space-y-4">
                                        <For each={data()} fallback={
                                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                                                <p class="text-white/60">Belum ada data poli</p>
                                            </div>
                                        }>
                                            {(poli) => (
                                                <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center justify-between">
                                                    <div>
                                                        <div class="flex items-center gap-3">
                                                            <span class="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-mono">{poli.kode}</span>
                                                            <h3 class="text-lg font-semibold text-white">{poli.nama}</h3>
                                                        </div>
                                                        {poli.deskripsi && <p class="text-white/60 text-sm mt-1">{poli.deskripsi}</p>}
                                                    </div>
                                                    <span class={`px-3 py-1 rounded-full text-xs font-medium ${poli.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {poli.isActive ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                            )}
                                        </For>
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
