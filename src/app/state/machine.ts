import { createMachine } from 'xstate';

export const appMachine = createMachine({
  id: 'app',
  initial: 'idle',
  states: {
    idle: {
      on: {
        START: 'active'
      }
    },
    active: {
      on: {
        STOP: 'idle'
      }
    }
  }
}); 