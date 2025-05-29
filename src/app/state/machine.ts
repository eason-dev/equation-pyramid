import { createMachine, assign } from 'xstate';
import type { GameState } from '../game/types';
import { generateGameState, calculateEquation } from '../game/logic';

interface Player {
  id: number;
  name: string;
  score: number;
}

interface GameConfig {
  numPlayers: number;
  numRounds: number;
  currentRound: number;
  players: Player[];
}

interface GameContext {
  gameState: GameState | null;
  selectedTiles: number[];
  foundEquations: string[];
  config: GameConfig;
  mainTimer: number;
  guessTimer: number;
  guessingPlayerId: number | null;
}

type GameEvent =
  | { type: 'START' }
  | { type: 'CONFIG_UPDATE'; config: Partial<GameConfig> }
  | { type: 'START_GAME' }
  | { type: 'GUESS' }
  | { type: 'SELECT_PLAYER'; playerId: number }
  | { type: 'SELECT_TILE'; tileIndex: number }
  | { type: 'CHECK_EQUATION' }
  | { type: 'NEXT_ROUND' }
  | { type: 'CONTINUE' }
  | { type: 'EXIT' }
  | { type: 'UPDATE_TIMER' }
  | { type: 'UPDATE_GUESS_TIMER' };

type GameStateType = {
  value: 'menu' | 'config' | 'game' | 'guessing' | 'roundResult' | 'finalResult';
  context: GameContext;
};

export const appMachine = createMachine({
  id: 'app',
  initial: 'menu',
  types: {} as {
    context: GameContext;
    events: GameEvent;
    typegen: GameStateType;
  },
  context: {
    gameState: null,
    selectedTiles: [],
    foundEquations: [],
    config: {
      numPlayers: 1,
      numRounds: 1,
      currentRound: 0,
      players: []
    },
    mainTimer: 180, // 3 minutes in seconds
    guessTimer: 10, // 10 seconds for guessing
    guessingPlayerId: null
  },
  states: {
    menu: {
      on: {
        START: 'config'
      }
    },
    config: {
      on: {
        CONFIG_UPDATE: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'CONFIG_UPDATE') return context;
            const newConfig = { ...context.config, ...event.config };
            // Initialize players if not already done
            if (newConfig.players.length === 0) {
              newConfig.players = Array.from({ length: newConfig.numPlayers }, (_, i) => ({
                id: i + 1,
                name: `Player ${i + 1}`,
                score: 0
              }));
            }
            return { ...context, config: newConfig };
          })
        },
        START_GAME: {
          target: 'game',
          actions: assign(({ context }) => ({
            ...context,
            config: { ...context.config, currentRound: 1 },
            gameState: generateGameState(),
            selectedTiles: [],
            foundEquations: [],
            mainTimer: 180,
            guessTimer: 10,
            guessingPlayerId: null
          }))
        }
      }
    },
    game: {
      on: {
        GUESS: {
          target: 'guessing',
          actions: assign(({ context }) => ({
            ...context,
            guessTimer: 10
          }))
        },
        UPDATE_TIMER: {
          actions: assign(({ context }) => ({
            ...context,
            mainTimer: Math.max(0, context.mainTimer - 1)
          }))
        },
        SELECT_TILE: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'SELECT_TILE' || context.selectedTiles.length >= 3) {
              return context;
            }
            return {
              ...context,
              selectedTiles: [...context.selectedTiles, event.tileIndex]
            };
          })
        },
        CHECK_EQUATION: {
          actions: assign(({ context }) => {
            if (context.selectedTiles.length !== 3 || !context.gameState || !context.guessingPlayerId) {
              return context;
            }
            
            const [i, j, k] = context.selectedTiles;
            const equation = {
              tiles: [
                context.gameState.tiles[i],
                context.gameState.tiles[j],
                context.gameState.tiles[k]
              ] as [typeof context.gameState.tiles[0], typeof context.gameState.tiles[0], typeof context.gameState.tiles[0]]
            };
            
            const equationKey = `${i},${j},${k}`;
            if (context.foundEquations.includes(equationKey)) {
              return context;
            }
            
            const result = calculateEquation(equation.tiles);
            const newContext = { ...context };
            
            if (result === context.gameState.targetNumber) {
              // Award point to the guessing player
              const player = newContext.config.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score += 1;
              }
            } else {
              // Deduct point from the guessing player
              const player = newContext.config.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score -= 1;
              }
            }
            
            return {
              ...newContext,
              selectedTiles: [],
              foundEquations: [...context.foundEquations, equationKey]
            };
          })
        }
      },
      after: {
        180000: { // 3 minutes in milliseconds
          target: 'roundResult',
          actions: assign(({ context }) => ({
            ...context,
            mainTimer: 0
          }))
        }
      }
    },
    guessing: {
      on: {
        SELECT_PLAYER: {
          actions: assign(({ context, event }) => ({
            ...context,
            guessingPlayerId: event.type === 'SELECT_PLAYER' ? event.playerId : null
          }))
        },
        UPDATE_GUESS_TIMER: {
          actions: assign(({ context }) => ({
            ...context,
            guessTimer: Math.max(0, context.guessTimer - 1)
          }))
        },
        SELECT_TILE: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'SELECT_TILE' || context.selectedTiles.length >= 3) {
              return context;
            }
            return {
              ...context,
              selectedTiles: [...context.selectedTiles, event.tileIndex]
            };
          })
        },
        CHECK_EQUATION: {
          actions: assign(({ context }) => {
            if (context.selectedTiles.length !== 3 || !context.gameState || !context.guessingPlayerId) {
              return context;
            }
            
            const [i, j, k] = context.selectedTiles;
            const equation = {
              tiles: [
                context.gameState.tiles[i],
                context.gameState.tiles[j],
                context.gameState.tiles[k]
              ] as [typeof context.gameState.tiles[0], typeof context.gameState.tiles[0], typeof context.gameState.tiles[0]]
            };
            
            const equationKey = `${i},${j},${k}`;
            if (context.foundEquations.includes(equationKey)) {
              return context;
            }
            
            const result = calculateEquation(equation.tiles);
            const newContext = { ...context };
            
            if (result === context.gameState.targetNumber) {
              // Award point to the guessing player
              const player = newContext.config.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score += 1;
              }
            } else {
              // Deduct point from the guessing player
              const player = newContext.config.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score -= 1;
              }
            }
            
            return {
              ...newContext,
              selectedTiles: [],
              foundEquations: [...context.foundEquations, equationKey]
            };
          })
        }
      },
      after: {
        10000: { // 10 seconds in milliseconds
          target: 'game',
          actions: assign(({ context }) => ({
            ...context,
            guessingPlayerId: null,
            selectedTiles: []
          }))
        }
      }
    },
    roundResult: {
      on: {
        NEXT_ROUND: [
          {
            target: 'finalResult',
            guard: ({ context }) => context.config.currentRound >= context.config.numRounds,
            actions: assign(({ context }) => ({
              ...context,
              config: { ...context.config, currentRound: context.config.currentRound }
            }))
          },
          {
            target: 'game',
            actions: assign(({ context }) => {
              const newRound = context.config.currentRound + 1;
              return {
                ...context,
                config: { ...context.config, currentRound: newRound },
                gameState: generateGameState(),
                selectedTiles: [],
                foundEquations: [],
                mainTimer: 180,
                guessTimer: 10,
                guessingPlayerId: null
              };
            })
          }
        ]
      }
    },
    finalResult: {
      on: {
        CONTINUE: {
          target: 'config',
          actions: assign(({ context }) => ({
            ...context,
            config: { ...context.config, currentRound: 0 }
          }))
        },
        EXIT: 'menu'
      }
    }
  }
}); 