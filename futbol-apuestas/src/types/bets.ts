export type Bet = {
  status: 'En espera' | 'Terminada';
  team: string;
  id: string;
  ammount: number;
  result?: string;
};
