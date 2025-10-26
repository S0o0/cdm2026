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

// Structure pour la disponibilité des tickets d’un match
export type TicketCategoryName = "VIP" | "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3";

export type TicketCategoryInfo = {
  available: boolean;
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  price: number;
};

export type MatchAvailability = {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: string;
  totalAvailableSeats: number;
  categories: Record<TicketCategoryName, TicketCategoryInfo>;
};