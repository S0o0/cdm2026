import type { Team } from './Team';
import type { Stadium } from './Stadium';
import type {TicketCategoryName} from './Ticket'
export type MatchStatus = 'upcoming' | 'live' | 'finished';

// Stage
export type MatchStage = 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';

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

// Informations des catégories
export type TicketCategoryInfo = {
  available: boolean;
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  price: number;
};

// Disponibilité
export type MatchAvailability = {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: string;
  totalAvailableSeats: number;
  categories: Record<TicketCategoryName, TicketCategoryInfo>;
};