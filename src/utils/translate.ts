import { translations } from "../data/translations";

export function translate(value: string): string {
    return translations[value] || value;
}
