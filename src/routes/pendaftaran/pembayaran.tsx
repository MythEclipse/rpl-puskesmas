import { action, createAsync, useSubmission } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getUser, getPembayaranBelumLunas, updatePembayaran } from "~/lib";
import { Layout } from "~/components/Layout";

const bayarAction = action(async (formData: FormData) => {
    "use server";
    const id = String(formData.get("id"));
    const totalLayanan = parseFloat(String(formData.get("totalLayanan") || "0"));

    try {
        await updatePembayaran(id, {
            totalLayanan,
            status: "lunas",
            metodeBayar: "tunai"
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

export default function PembayaranPage() {
    const user = createAsync(() => getUser());
    const pembayaran = createAsync(() => getPembayaranBelumLunas());
    const submission = useSubmission(bayarAction);

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Pembayaran Pasien Umum</h1>

                        <Suspense fallback={<div class="text-white/60">Memuat data...</div>}>
                            <Show when={pembayaran()}>
                                {(data) => (
                                    <Show when={data().length > 0} fallback={
                                        <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center">
                                            <p class="text-white/60">Tidak ada pembayaran yang menunggu</p>
                                        </div>
                                    }>
                                        <div class="space-y-4">
                                            <For each={data()}>
                                                {(item) => (
                                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                                                        <div class="flex items-start justify-between">
                                                            <div>
                                                                <h3 class="text-lg font-semibold text-white">{item.kunjungan.pasien.nama}</h3>
                                                                <p class="text-white/60 text-sm">No. RM: {item.kunjungan.pasien.noRM}</p>
                                                                <p class="text-white/60 text-sm">Poli: {item.kunjungan.poli.nama}</p>
                                                            </div>
                                                            <div class="text-right">
                                                                <p class="text-white/60 text-sm">Total Obat</p>
                                                                <p class="text-xl font-bold text-white">Rp {item.totalObat.toLocaleString("id-ID")}</p>
                                                            </div>
                                                        </div>

                                                        <form action={bayarAction} method="post" class="mt-4 flex items-end gap-4">
                                                            <input type="hidden" name="id" value={item.id} />
                                                            <div class="flex-1">
                                                                <label class="block text-sm font-medium text-white/80 mb-2">Biaya Layanan</label>
                                                                <input
                                                                    name="totalLayanan"
                                                                    type="number"
                                                                    defaultValue={item.totalLayanan || 25000}
                                                                    class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                                                />
                                                            </div>
                                                            <div class="text-center px-4">
                                                                <p class="text-white/60 text-sm mb-2">Total</p>
                                                                <p class="text-xl font-bold text-emerald-400">
                                                                    Rp {((item.totalLayanan || 25000) + item.totalObat).toLocaleString("id-ID")}
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="submit"
                                                                disabled={submission.pending}
                                                                class="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                                            >
                                                                Bayar Lunas
                                                            </button>
                                                        </form>
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
