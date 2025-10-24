import type { Team } from './Team';

export type Group = {
  id: number;
  name: string;
  teams: Team[];
};