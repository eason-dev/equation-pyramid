import { createMachine, assign } from 'xstate';

import type { GameState, Player } from '@/logic/game/types';
import { generateGameState, calculateEquation } from '@/logic/game/logic';

const MAX_PLAYERS = 2;
const MIN_PLAYERS = 1;
const MAX_ROUNDS = 5;
const MIN_ROUNDS = 1;
const INITIAL_PLAYERS = 1;
const INITIAL_ROUNDS = 3;
const ROUND_DURATION = 180; // 3 minutes in seconds
const GUESS_DURATION = 10; // 10 seconds in seconds
const TILES_PER_EQUATION = 3;

interface GameConfig {
  numPlayers: number;
  numRounds: number;
  currentRound: number;
}

interface GameContext {
  gameState: GameState | null;
  selectedTiles: number[];
  foundEquations: string[];
  config: GameConfig;
  players: Player[];
  mainTimer: number;
  guessTimer: number;
  guessingPlayerId: string | null;
}

type GameEvent =
  | { type: 'START' }
  | { type: 'CONFIG_UPDATE'; config: Partial<GameConfig> }
  | { type: 'START_GAME' }
  | { type: 'GUESS' }
  | { type: 'SELECT_PLAYER'; playerId: string }
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
      numPlayers: INITIAL_PLAYERS,
      numRounds: INITIAL_ROUNDS,
      currentRound: 0,
    },
    players: [],
    mainTimer: ROUND_DURATION,
    guessTimer: GUESS_DURATION,
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
            const newConfig = { ...context.config, ...event.config };
            if (newConfig.numPlayers > MAX_PLAYERS) {
              newConfig.numPlayers = MAX_PLAYERS;
            } else if (newConfig.numPlayers < MIN_PLAYERS) {
              newConfig.numPlayers = MIN_PLAYERS;
            }
            if (newConfig.numRounds > MAX_ROUNDS) {
              newConfig.numRounds = MAX_ROUNDS;
            } else if (newConfig.numRounds < MIN_ROUNDS) {
              newConfig.numRounds = MIN_ROUNDS;
            }
            return { ...context, config: newConfig };
          })
        },
        START_GAME: {
          target: 'game',
          actions: assign(({ context }) => ({
            ...context,
            config: { ...context.config, currentRound: 1 },
            players: Array.from({ length: context.config.numPlayers }, (_, i) => ({
              id: `player-${i + 1}`,
              name: `Player ${i + 1}`,
              score: 0
            })),
            gameState: generateGameState(),
            selectedTiles: [],
            foundEquations: [],
            mainTimer: ROUND_DURATION,
            guessTimer: GUESS_DURATION,
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
            guessTimer: GUESS_DURATION
          }))
        },
        UPDATE_TIMER: {
          actions: assign(({ context }) => ({
            ...context,
            mainTimer: Math.max(0, context.mainTimer - 1)
          }))
        },
      },
      after: {
        [ROUND_DURATION * 1000]: {
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
            guessingPlayerId: event.type === 'SELECT_PLAYER' ? event.playerId.toString() : null
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
            if (event.type !== 'SELECT_TILE' || context.selectedTiles.length >= TILES_PER_EQUATION) {
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
            if (context.selectedTiles.length !== TILES_PER_EQUATION || !context.gameState || !context.guessingPlayerId) {
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
            
            const result = calculateEquation(equation.tiles);
            const newContext = { ...context };
            
            if (context.foundEquations.includes(equationKey)) {
              // Deduct point from the guessing player
              const player = newContext.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score -= 1;
              }
            } else if (result === context.gameState.targetNumber) {
              // Award point to the guessing player
              const player = newContext.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score += 1;
              }
              newContext.foundEquations.push(equationKey);
            } else {
              // Deduct point from the guessing player
              const player = newContext.players.find(p => p.id === context.guessingPlayerId);
              if (player) {
                player.score -= 1;
              }
            }
            
            return {
              ...newContext,
              selectedTiles: [],
            };
          })
        }
      },
      after: {
        [GUESS_DURATION * 1000]: {
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
                mainTimer: ROUND_DURATION,
                guessTimer: GUESS_DURATION,
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