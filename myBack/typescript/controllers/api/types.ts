export type Season = {
  id: number;
  startDate: string;
  endDate: string;
  winner:
    | {
        id: number;
      }
    | undefined;
};

export type Country = {
  id: number;
  name: string;
  countryCode: string;
};

export type Team = {
  id: number;
  area: {
    id: number;
  };
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  clubColors: string;
};

export type Player = {
  id: number;
  name: string;
  position: string;
  countryOfBirth: string;
  nacionality: string;
  shirtNumber: number;
  dateOfBirth: string;
};

export type PlayersRequest = {
  id: number;
  squad: Player[];
};

export type Match = {
  id: number;
  season: {
    id: number;
  };
  utcDate: string;
  status: string;
};
