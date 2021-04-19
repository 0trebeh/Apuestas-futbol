export type Scorer = {
  top: number;
  number_goals: number;
  player_id:  number;
  player: string;
  team: string;
};

export type TopTeams = {
  top: number;
  team_id: number;
  team_name: string;
  total_matches: number;
  total_goals: number;
  total_winner: number;
  total_loser: number;
  total_draw: number;
};