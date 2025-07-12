# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm storybook` - Run Storybook for component development

### Code Quality
- `pnpm lint` - Run Biome linter checks
- `pnpm lint:fix` - Auto-fix linting issues with Biome

### Testing
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- Run single test: `pnpm test -- path/to/test.test.ts`

## Architecture

### Game Flow State Machine
The game follows a strict state flow managed by Zustand:
```
Menu → Config → Game → Guessing → ShowingResult → RoundOver → GameOver
```

### Core Systems

**State Management**: Zustand store at `src/logic/state/game-state.tsx` with Immer middleware for immutable updates. Game state includes:
- Player configurations and scores
- Current game phase and round
- Selected tiles and equation validation
- Sound settings

**Game Logic**: Located in `src/logic/game/` with:
- `equation-builder.ts` - Core equation validation and scoring
- `tile-generator.ts` - Generates number and operator tiles
- `game-types.ts` - TypeScript types for game entities

**Audio System**: Custom hooks in `src/hooks/` manage different audio tracks:
- `useAudioManager` - Coordinates all game audio
- Separate hooks for menu, game, and result music
- Fade transitions between tracks

**Visual Components**: 
- Views in `src/views/` correspond to game states
- Components in `src/components/` with Storybook stories
- WebGL background shader effects
- GSAP animations for transitions

### Testing Strategy
- Component tests use React Testing Library
- Game logic has unit tests
- Storybook for visual testing
- Mock Zustand store for isolated testing

## Key Patterns

- Always use `pnpm` as package manager
- Use Context7 MCP for library documentation (Next.js, React, etc.)
- Prefer Biome for formatting (double quotes configured)
- Path alias `@/*` maps to `src/*`
- TypeScript strict mode is enabled
- Tests go in `__tests__` directories
- Storybook stories alongside components as `.stories.tsx`