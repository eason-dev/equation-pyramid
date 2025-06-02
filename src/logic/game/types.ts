export type Operator = '+' | '-' | '*' | '/';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Tile {
  number: number;
  operator: string;
}

export interface Equation {
  tiles: [Tile, Tile, Tile];
  result: number;
}

export interface GameState {
  tiles: Tile[];
  targetNumber: number;
  validEquations: Equation[];
} 