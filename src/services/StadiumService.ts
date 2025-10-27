import { apiFetch } from "./Api";
import type { Stadium } from "../types/Stadium";

export async function getStadiums(): Promise<Stadium[]> {
  return apiFetch("/stadiums");
}

export async function getStadium(id: number): Promise<Stadium> {
  return apiFetch(`/stadiums/${id}`);
}