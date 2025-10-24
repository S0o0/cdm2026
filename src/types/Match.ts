import type { Team } from './Team';
import type { Stadium } from './Stadium';
export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchStage = 'group_stage' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';

export type Match = {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  status: MatchStatus;
  stage: MatchStage;
  date: string;
  availableSeats: number;
  priceMultiplier: number;
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
};