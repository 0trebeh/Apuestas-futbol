export type Prediction = {
    team_id: number;
    team_name: string;
    p_winner: any;
    p_loser: any;
    p_draw: any;
};

export type PredictionMatches = {
    name1: string;
    side1: string;
    tm1_winner: any;
    tm_draw: any;
    tm2_winner: any;
    name2: string;
    side2: string;
    resultado: string; 
    match_status: string;
    date: string;
}