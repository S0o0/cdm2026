const API_URL = import.meta.env.VITE_API_URL || "https://worldcup2026.shrp.dev";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Récupération du token JWT si présent
  const token = localStorage.getItem("token");

  // Construction des en-têtes HTTP
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Exécution de la requête
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Lecture du corps JSON
  const data = await response.json().catch(() => null);

  // Gestion des erreurs HTTP
  if (!response.ok) {
    const message = data?.message || `Erreur ${response.status}`;
    throw new Error(message);
  }

  // Certaines réponses sont encapsulées dans un objet { data: ... }
  return data?.data ?? data;
}
