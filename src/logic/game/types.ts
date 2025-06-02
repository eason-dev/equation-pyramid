export type Operator = '+' | '-' | '*' | '/';

export interface Tile {
  operator: Operator;
  number: number;
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