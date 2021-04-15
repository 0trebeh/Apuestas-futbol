export interface SeasonMatches {
  tournament_name: string;
  match_id: number;
  date: Date;
  match_status: string;
  team_id: number;
  team_name: string;
  side: string;
  winner?: boolean;
  loser?: boolean;
  draw?: boolean;
  goals?: number;
}
