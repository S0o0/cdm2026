import { translations } from "../data/translations";

// Traduire les pays, les codes et continents grâce à la data translations
export function translate(value: string, context: "name" | "code" = "name"): string {
    // L'api renvoie "USA" peu importe que l'on demande le nom du pays ou le code
    // Donc on gère ce cas particulier ici
    if (value === "USA") {
        return context === "name" ? "Etats-Unis" : "USA";
    }

    return translations[value] || value;
}