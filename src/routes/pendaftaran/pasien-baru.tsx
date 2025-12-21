import { action, createAsync, useAction, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { getUser, createPasien } from "~/lib";
import { Layout } from "~/components/Layout";

const createPasienAction = action(async (formData: FormData) => {
    "use server";
    const data = {
        nik: String(formData.get("nik")),
        nama: String(formData.get("nama")),
        tanggalLahir: new Date(String(formData.get("tanggalLahir"))),
        jenisKelamin: String(formData.get("jenisKelamin")),
        alamat: String(formData.get("alamat")),
        noTelp: String(formData.get("noTelp")),
        noBPJS: formData.get("noBPJS") ? String(formData.get("noBPJS")) : undefined,
    };

    try {
        const pasien = await createPasien(data);
        return { success: true, pasien };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

export default function PasienBaruPage() {
    const user = createAsync(() => getUser());
    const submission = useSubmission(createPasienAction);
    const [showSuccess, setShowSuccess] = createSignal(false);

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-2xl mx-auto">
                        <h1 class="text-2xl font-bold text-white mb-6">Registrasi Pasien Baru</h1>

                        <Show when={submission.result?.success}>
                            <div class="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                <p class="text-emerald-400 font-medium">
                                    ✓ Pasien berhasil didaftarkan! No. RM: {(submission.result as any).pasien?.noRM}
                                </p>
                            </div>
                        </Show>

                        <Show when={submission.result && !submission.result.success}>
                            <div class="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                                <p class="text-red-400">{(submission.result as any).error}</p>
                            </div>
                        </Show>

                        <form action={createPasienAction} method="post" class="space-y-6">
                            <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-4">
                                <h2 class="text-lg font-semibold text-white mb-4">Data Identitas</h2>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">NIK *</label>
                                        <input
                                            name="nik"
                                            type="text"
                                            required
                                            maxLength={16}
                                            placeholder="16 digit NIK"
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Nama Lengkap *</label>
                                        <input
                                            name="nama"
                                            type="text"
                                            required
                                            placeholder="Nama sesuai KTP"
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Tanggal Lahir *</label>
                                        <input
                                            name="tanggalLahir"
                                            type="date"
                                            required
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Jenis Kelamin *</label>
                                        <select
                                            name="jenisKelamin"
                                            required
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-white/80 mb-2">Alamat *</label>
                                    <textarea
                                        name="alamat"
                                        required
                                        rows={3}
                                        placeholder="Alamat lengkap"
                                        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 resize-none"
                                    />
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">No. Telepon *</label>
                                        <input
                                            name="noTelp"
                                            type="tel"
                                            required
                                            placeholder="08xxxxxxxxxx"
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">No. BPJS (Opsional)</label>
                                        <input
                                            name="noBPJS"
                                            type="text"
                                            placeholder="Kosongkan jika tidak ada"
                                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <a
                                    href="/"
                                    class="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                                >
                                    Batal
                                </a>
                                <button
                                    type="submit"
                                    disabled={submission.pending}
                                    class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {submission.pending ? "Menyimpan..." : "Daftarkan Pasien"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Layout>
            )}
        </Show>
    );
}
