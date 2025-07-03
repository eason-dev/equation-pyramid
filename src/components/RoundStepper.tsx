import { cn } from "@/lib/utils";

interface RoundStepperProps {
  currentRound: number;
  totalRounds: number;
  onRoundClick?: (round: number) => void;
  selectedRound?: number;
}

export function RoundStepper({ 
  currentRound, 
  totalRounds, 
  onRoundClick,
  selectedRound
}: RoundStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
        <div key={round} className="flex items-center">
          <button
            type="button"
            className={cn(
              "w-8 h-8 rounded-full border border-white/20 transition-colors flex items-center justify-center text-base font-normal",
              "bg-black/60 hover:bg-black/80",
              round === (selectedRound || currentRound) ? "text-white" : "text-[#969696]",
              onRoundClick && "cursor-pointer",
            )}
            style={{ fontFamily: "Inter" }}
            onClick={() => onRoundClick?.(round)}
            disabled={!onRoundClick}
          >
            R{round}
          </button>
          {round < totalRounds && (
            <div className="w-6 h-0 border-t-2 border-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}
