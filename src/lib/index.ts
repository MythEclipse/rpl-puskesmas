import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePassword,
  validateUsername,
  getCurrentUser,
  type UserRole,
} from "./server";

export const getUser = query(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("User not found");
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role as UserRole,
    };
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  return redirect("/");
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return redirect("/login");
});

// Re-export functions for use in components
export { getCurrentUser } from "./server";
export * from "./pasien";
export * from "./kunjungan";
export * from "./rekammedis";
export * from "./resep";
export * from "./laporan";
export * from "./admin";
