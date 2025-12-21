import { action, createAsync, useSubmission } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { getUser, getAllUsers, createUser, updateUser, deleteUser } from "~/lib";
import { Layout } from "~/components/Layout";

const createUserAction = action(async (formData: FormData) => {
    "use server";
    try {
        await createUser({
            username: String(formData.get("username")),
            password: String(formData.get("password")),
            namaLengkap: String(formData.get("namaLengkap")),
            role: String(formData.get("role")) as any,
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
});

const deleteUserAction = action(async (formData: FormData) => {
    "use server";
    await deleteUser(String(formData.get("id")));
    return { success: true };
});

export default function AdminUsersPage() {
    const user = createAsync(() => getUser());
    const users = createAsync(() => getAllUsers());
    const [showAddForm, setShowAddForm] = createSignal(false);
    const createSubmission = useSubmission(createUserAction);

    const roleLabels: Record<string, string> = {
        pendaftaran: "Petugas Pendaftaran",
        dokter: "Dokter",
        apoteker: "Apoteker",
        kepalaPuskesmas: "Kepala Puskesmas",
        admin: "Administrator",
    };

    const roleColors: Record<string, string> = {
        pendaftaran: "bg-blue-500/20 text-blue-400",
        dokter: "bg-emerald-500/20 text-emerald-400",
        apoteker: "bg-purple-500/20 text-purple-400",
        kepalaPuskesmas: "bg-orange-500/20 text-orange-400",
        admin: "bg-red-500/20 text-red-400",
    };

    return (
        <Show when={user()}>
            {(u) => (
                <Layout user={u()}>
                    <div class="max-w-6xl mx-auto">
                        <div class="flex items-center justify-between mb-6">
                            <h1 class="text-2xl font-bold text-white">Kelola Pengguna</h1>
                            <button
                                onClick={() => setShowAddForm(!showAddForm())}
                                class="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            >
                                {showAddForm() ? "Tutup" : "+ Tambah Pengguna"}
                            </button>
                        </div>

                        {/* Add User Form */}
                        <Show when={showAddForm()}>
                            <form action={createUserAction} method="post" class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-6">
                                <h2 class="text-lg font-semibold text-white mb-4">Tambah Pengguna Baru</h2>

                                <Show when={createSubmission.result && !createSubmission.result.success}>
                                    <div class="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                                        <p class="text-red-400">{(createSubmission.result as any).error}</p>
                                    </div>
                                </Show>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Username</label>
                                        <input name="username" required placeholder="username" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Password</label>
                                        <input name="password" type="password" required placeholder="******" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Nama Lengkap</label>
                                        <input name="namaLengkap" required placeholder="Dr. John Doe" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-white/80 mb-2">Role</label>
                                        <select name="role" required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50">
                                            <option value="">Pilih Role</option>
                                            <option value="pendaftaran">Petugas Pendaftaran</option>
                                            <option value="dokter">Dokter</option>
                                            <option value="apoteker">Apoteker</option>
                                            <option value="kepalaPuskesmas">Kepala Puskesmas</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={createSubmission.pending} class="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                                    Simpan
                                </button>
                            </form>
                        </Show>

                        {/* Users List */}
                        <Suspense fallback={<div class="text-white/60">Memuat data pengguna...</div>}>
                            <Show when={users()}>
                                {(data) => (
                                    <div class="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                        <table class="w-full">
                                            <thead>
                                                <tr class="border-b border-white/10">
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Username</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Nama Lengkap</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Role</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Dibuat</th>
                                                    <th class="px-6 py-4 text-left text-sm font-semibold text-white/80">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <For each={data()} fallback={
                                                    <tr><td colspan="5" class="px-6 py-8 text-center text-white/60">Belum ada pengguna</td></tr>
                                                }>
                                                    {(item) => (
                                                        <tr class="border-b border-white/5 hover:bg-white/5">
                                                            <td class="px-6 py-4 text-white font-medium">@{item.username}</td>
                                                            <td class="px-6 py-4 text-white">{item.namaLengkap || "-"}</td>
                                                            <td class="px-6 py-4">
                                                                <span class={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[item.role] || 'bg-gray-500/20 text-gray-400'}`}>
                                                                    {roleLabels[item.role] || item.role}
                                                                </span>
                                                            </td>
                                                            <td class="px-6 py-4 text-white/60 text-sm">
                                                                {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                <Show when={item.id !== u().id}>
                                                                    <form action={deleteUserAction} method="post" class="inline">
                                                                        <input type="hidden" name="id" value={item.id} />
                                                                        <button
                                                                            type="submit"
                                                                            class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
                                                                            onClick={(e) => {
                                                                                if (!confirm("Hapus pengguna ini?")) e.preventDefault();
                                                                            }}
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </form>
                                                                </Show>
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
