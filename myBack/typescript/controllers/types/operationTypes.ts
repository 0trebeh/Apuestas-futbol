export interface MatchInfo {
  match_id: number;
  date: string;
  match_status: string;
  home_team_id: number;
  home_team_name: string;
  home_status?: string;
  home_goals?: number;
  away_team_id: number;
  away_team_name: string;
  away_status?: string;
  away_goals?: number;
}
