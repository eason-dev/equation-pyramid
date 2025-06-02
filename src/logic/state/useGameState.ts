"use client";

import { useMachine } from "@xstate/react";
import { appMachine } from "./machine";

export function useGameState() {
  const [state, send] = useMachine(appMachine);
  return { state, send, context: state.context };
} 