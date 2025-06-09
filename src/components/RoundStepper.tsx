import { cn } from "@/lib/utils";

interface RoundStepperProps {
  currentRound: number;
  totalRounds: number;
}

export function RoundStepper({ currentRound, totalRounds }: RoundStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
        <div key={round} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full transition-colors flex items-center justify-center text-sm font-medium",
              round === currentRound
                ? "bg-blue-500 text-white"
                : round < currentRound
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-600",
            )}
          >
            R{round}
          </div>
          {round < totalRounds && (
            <div
              className={cn(
                "w-8 h-0.5",
                round < currentRound ? "bg-blue-200" : "bg-gray-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
