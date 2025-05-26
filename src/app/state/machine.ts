import { createMachine } from 'xstate';
import type { GameState } from '../game/types';
import { generateGameState } from '../game/logic';

interface GameContext {
  gameState: GameState | null;
  selectedTiles: number[];
  foundEquations: string[];
}

export const appMachine = createMachine({
  id: 'app',
  initial: 'idle',
  context: {
    gameState: null,
    selectedTiles: [],
    foundEquations: []
  } as GameContext,
  states: {
    idle: {
      on: {
        START: {
          target: 'playing',
          actions: 'generateGame'
        }
      }
    },
    playing: {
      on: {
        SELECT_TILE: {
          actions: 'selectTile'
        },
        CHECK_EQUATION: {
          actions: 'checkEquation'
        },
        STOP: 'idle'
      }
    }
  }
}, {
  actions: {
    generateGame: (context) => {
      context.gameState = generateGameState();
      context.selectedTiles = [];
      context.foundEquations = [];
    },
    selectTile: (context, event) => {
      if (context.selectedTiles.length < 3) {
        context.selectedTiles.push(event.tileIndex);
      }
    },
    checkEquation: (context) => {
      if (context.selectedTiles.length !== 3 || !context.gameState) return;
      
      const [i, j, k] = context.selectedTiles;
      const equation = {
        tiles: [
          context.gameState.tiles[i],
          context.gameState.tiles[j],
          context.gameState.tiles[k]
        ]
      };
      
      const equationKey = `${i},${j},${k}`;
      if (!context.foundEquations.includes(equationKey)) {
        context.foundEquations.push(equationKey);
      }
      
      context.selectedTiles = [];
    }
  }
}); 