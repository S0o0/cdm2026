const API_URL = import.meta.env.VITE_API_URL || "https://worldcup2026.shrp.dev";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  // Construction des en-têtes HTTP
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Exécution de la requête
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Lecture du corps JSON
  const data = await response.json().catch(() => null);

  // Gestion globale du cas "401 Unauthorized"
  if (response.status === 401) {
    console.warn("Session expirée ou utilisateur non authentifié.");

    // Supprime l'utilisateur du localStorage
    localStorage.removeItem("currentUser");

    // Affiche une alerte à l'utilisateur
    alert("Votre session a expiré. Veuillez vous reconnecter.");

    // Redirige vers la page de connexion
    window.location.href = "/auth/signin";

    throw new Error("Session expirée. Redirection vers la connexion...");
  }

  // Gestion des erreurs HTTP
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  // Certaines réponses sont encapsulées dans un objet { data: ... }
  return data?.data ?? data;
}
