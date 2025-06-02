import { createActor } from 'xstate';

import { appMachine } from '../machine';

// Mock the game logic functions
jest.mock('../../game/logic', () => ({
  generateGameState: jest.fn().mockReturnValue({
    tiles: [
      { operator: '+', number: 5 },
      { operator: '+', number: 3 },
      { operator: '+', number: 2 }
    ],
    targetNumber: 10,
    validEquations: []
  }),
  calculateEquation: jest.fn().mockReturnValue(10)
}));

describe('Game State Machine', () => {
  let actors: ReturnType<typeof createActor>[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Stop all actors created during the test
    for (const actor of actors) {
      actor.stop();
    }
    actors = [];
  });

  it('should start in menu state', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    expect(actor.getSnapshot().value).toBe('menu');
  });

  it('should transition from menu to config state', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('config');
  });

  it('should update config with player count', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 3, numRounds: 2 }
    });

    const context = actor.getSnapshot().context;
    expect(context.config.numPlayers).toBe(3);
    expect(context.config.numRounds).toBe(2);
    expect(context.config.players).toHaveLength(3);
    expect(context.config.players[0].name).toBe('Player 1');
    expect(context.config.players[1].name).toBe('Player 2');
    expect(context.config.players[2].name).toBe('Player 3');
  });

  it('should start game and initialize first round', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    const context = actor.getSnapshot().context;
    expect(actor.getSnapshot().value).toBe('game');
    expect(context.config.currentRound).toBe(1);
    expect(context.gameState).toBeTruthy();
    expect(context.selectedTiles).toHaveLength(0);
    expect(context.foundEquations).toHaveLength(0);
    expect(context.mainTimer).toBe(180);
    expect(context.guessTimer).toBe(10);
    expect(context.guessingPlayerId).toBeNull();
  });

  it('should handle tile selection', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    // Select tiles
    actor.send({ type: 'SELECT_TILE', tileIndex: 0 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 1 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 2 });

    const context = actor.getSnapshot().context;
    expect(context.selectedTiles).toEqual([0, 1, 2]);
  });

  it('should transition to guessing state and handle player selection', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    // Start guessing
    actor.send({ type: 'GUESS' });
    expect(actor.getSnapshot().value).toBe('guessing');
    expect(actor.getSnapshot().context.guessTimer).toBe(10);

    // Select player
    actor.send({ type: 'SELECT_PLAYER', playerId: '1' });
    expect(actor.getSnapshot().context.guessingPlayerId).toBe('1');
  });

  it('should handle correct equation guess', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    // Start guessing
    actor.send({ type: 'GUESS' });
    actor.send({ type: 'SELECT_PLAYER', playerId: '1' });

    // Select tiles and check equation
    actor.send({ type: 'SELECT_TILE', tileIndex: 0 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 1 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 2 });
    actor.send({ type: 'CHECK_EQUATION' });

    const context = actor.getSnapshot().context;
    expect(context.config.players[0].score).toBe(1); // Player 1 gets a point
    expect(context.selectedTiles).toHaveLength(0); // Tiles are cleared
    expect(context.foundEquations).toHaveLength(1); // Equation is recorded
  });

  it('should handle incorrect equation guess', () => {
    // Mock calculateEquation to return wrong result
    const { calculateEquation } = require('../../game/logic');
    calculateEquation.mockReturnValueOnce(15); // Wrong result

    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    // Start guessing
    actor.send({ type: 'GUESS' });
    actor.send({ type: 'SELECT_PLAYER', playerId: '1' });

    // Select tiles and check equation
    actor.send({ type: 'SELECT_TILE', tileIndex: 0 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 1 });
    actor.send({ type: 'SELECT_TILE', tileIndex: 2 });
    actor.send({ type: 'CHECK_EQUATION' });

    const context = actor.getSnapshot().context;
    expect(context.config.players[0].score).toBe(-1); // Player 1 loses a point
    expect(context.selectedTiles).toHaveLength(0); // Tiles are cleared
    expect(context.foundEquations).toHaveLength(1); // Equation is still recorded
  });

  it.skip('should handle round completion and transition to next round', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 2 }
    });
    actor.send({ type: 'START_GAME' });

    // Complete first round
    actor.send({ type: 'NEXT_ROUND' });

    const context = actor.getSnapshot().context;
    expect(actor.getSnapshot().value).toBe('game');
    expect(context.config.currentRound).toBe(2);
    expect(context.gameState).toBeTruthy();
    expect(context.selectedTiles).toHaveLength(0);
    expect(context.foundEquations).toHaveLength(0);
    expect(context.mainTimer).toBe(180);
    expect(context.guessTimer).toBe(10);
    expect(context.guessingPlayerId).toBeNull();
  });

  it.skip('should handle game completion and show final results', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });

    // Complete the only round
    actor.send({ type: 'NEXT_ROUND' });

    expect(actor.getSnapshot().value).toBe('finalResult');
  });

  it.skip('should allow continuing to config or exiting to menu from final result', () => {
    const actor = createActor(appMachine);
    actors.push(actor);
    actor.start();
    actor.send({ type: 'START' });
    actor.send({
      type: 'CONFIG_UPDATE',
      config: { numPlayers: 2, numRounds: 1 }
    });
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'NEXT_ROUND' });

    // Test continue to config
    actor.send({ type: 'CONTINUE' });
    expect(actor.getSnapshot().value).toBe('config');

    // Go back to final result
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'NEXT_ROUND' });

    // Test exit to menu
    actor.send({ type: 'EXIT' });
    expect(actor.getSnapshot().value).toBe('menu');
  });
}); 