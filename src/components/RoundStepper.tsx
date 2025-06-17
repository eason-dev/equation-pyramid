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
              "w-8 h-8 rounded-full border border-white/20 transition-colors flex items-center justify-center text-base font-normal",
              "bg-black/60",
              round === currentRound ? "text-white" : "text-[#969696]",
            )}
            style={{ fontFamily: "Inter" }}
          >
            R{round}
          </div>
          {round < totalRounds && (
            <div className="w-6 h-0 border-t-2 border-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}
