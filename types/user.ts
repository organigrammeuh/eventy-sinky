export type AuthProvider = "local" | "google" | "github";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  createdAt: string;
}
