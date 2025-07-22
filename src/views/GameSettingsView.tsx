"use client";

import { Button } from "@/components/Button";
import { RoundButton } from "@/components/RoundButton";
import { Typography } from "@/components/Typography";
import { PLAYERS_OPTIONS, ROUNDS_OPTIONS } from "@/constants";

interface GameSettingsViewProps {
  numPlayers: number;
  numRounds: number;
  onConfigUpdate: (config: { numPlayers?: number; numRounds?: number }) => void;
  onStartGame: () => void;
}

export function GameSettingsView({
  numPlayers,
  numRounds,
  onConfigUpdate,
  onStartGame,
}: GameSettingsViewProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 gap-8 md:gap-10 lg:gap-12">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
        <Typography
          variant="h1"
          className="text-center text-2xl md:text-3xl lg:text-4xl"
        >
          Game Setup
        </Typography>
      </div>

      {/* Button Groups */}
      <div className="flex flex-col items-center gap-12 md:gap-16 lg:gap-20">
        {/* Number of Players */}
        <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
          <Typography
            variant="h2"
            className="text-center text-xl md:text-2xl lg:text-3xl"
          >
            Number of Player
          </Typography>
          <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-[72px]">
            {PLAYERS_OPTIONS.map((option) => (
              <RoundButton
                key={option}
                onClick={() => onConfigUpdate({ numPlayers: option })}
                isActive={numPlayers === option}
              >
                <span className="flex items-end justify-center gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">
                    {option}
                  </span>
                  <span className="hidden md:inline text-sm md:text-base lg:text-lg leading-none pb-[2px]">
                    {option === 1 ? "Player" : "Players"}
                  </span>
                </span>
              </RoundButton>
            ))}
          </div>
        </div>

        {/* Number of Rounds */}
        <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
          <Typography
            variant="h2"
            className="text-center text-xl md:text-2xl lg:text-3xl"
          >
            Number of Round
          </Typography>
          <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-[72px] p-2.5">
            {ROUNDS_OPTIONS.map((option) => (
              <RoundButton
                key={option}
                onClick={() => onConfigUpdate({ numRounds: option })}
                isActive={numRounds === option}
              >
                <span className="flex items-end justify-center gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">
                    {option}
                  </span>
                  <span className="hidden md:inline text-sm md:text-base lg:text-lg leading-none pb-[2px]">
                    {option === 1 ? "Round" : "Rounds"}
                  </span>
                </span>
              </RoundButton>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center w-full">
        <Button onClick={onStartGame} variant="primary">
          Start
        </Button>
      </div>
    </div>
  );
}
