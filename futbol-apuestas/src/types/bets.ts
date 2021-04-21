export type Bet = {
  status: string;
  team: string;
  team_name: string;
  bet_name: string;
  bet: string;
  ammount: number;
  result?: string;
  name: string;
  prediction: string;
};

export type Notification = {
  user_id: string;
  message: string;
  status: string;
  bet_type: string;
  home_team: string;
  away_team: string;
  tournament_name: string;
};
