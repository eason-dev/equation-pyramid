import { cn } from "@/lib/utils";

interface RoundStepperProps {
  currentRound: number;
  totalRounds: number;
  onRoundClick?: (round: number) => void;
  selectedRound?: number;
  showLabels?: boolean;
}

export function RoundStepper({
  currentRound,
  totalRounds,
  onRoundClick,
  selectedRound,
  showLabels = false,
}: RoundStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
        <div key={round} className="flex items-center">
          <button
            type="button"
            className={cn(
              "relative",
              onRoundClick && "cursor-pointer",
            )}
            onClick={() => onRoundClick?.(round)}
            disabled={!onRoundClick}
          >
            {showLabels ? (
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                  round === (selectedRound || currentRound)
                    ? "border-white/80 bg-white/10"
                    : "border-white/40 bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    round === (selectedRound || currentRound)
                      ? "text-white/90"
                      : "text-white/50",
                  )}
                >
                  R{round}
                </span>
              </div>
            ) : (
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  round === (selectedRound || currentRound)
                    ? "bg-white/60"
                    : "bg-white/20",
                )}
              />
            )}
          </button>
          {round < totalRounds && (
            <div className={showLabels ? "w-8 h-0 border-t-2 border-white/30" : "w-6 h-0 border-t-1 border-white/20"} />
          )}
        </div>
      ))}
    </div>
  );
}
