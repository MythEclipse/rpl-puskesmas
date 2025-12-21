import { useSession } from "vinxi/http";
import { db } from "./db";

export type UserRole =
  | "pendaftaran"
  | "dokter"
  | "apoteker"
  | "kepalaPuskesmas"
  | "admin";

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username minimal 3 karakter`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password minimal 6 karakter`;
  }
}

export async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || password !== user.password)
    throw new Error("Username atau password salah");
  return user;
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => {
    d.userId = undefined;
  });
}

export async function register(
  username: string,
  password: string,
  namaLengkap: string = "",
  role: UserRole = "pendaftaran"
) {
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("Username sudah digunakan");
  return db.user.create({
    data: { username, password, namaLengkap, role },
  });
}

export function getSession() {
  return useSession<{ userId?: string }>({
    password:
      process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  });
}

// Role check helpers
export async function getCurrentUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireRole(...roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Tidak terautentikasi");
  if (!roles.includes(user.role as UserRole)) {
    throw new Error("Tidak memiliki akses");
  }
  return user;
}
