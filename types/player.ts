export interface Player {
  playerid: number;
  name: string;
  price: number;
  squad: number;
}

export interface PlayerWithScore extends Player {
  currentgw: number;
  total: number;
}