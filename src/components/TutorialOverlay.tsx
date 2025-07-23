"use client";

import { useEffect } from "react";
import { useTutorialStore, tutorialSteps } from "@/logic/state/tutorialStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorialOverlay() {
  const { isActive, currentStep, nextStep, previousStep, exitTutorial } = useTutorialStore();

  const currentStepData = tutorialSteps[currentStep - 1];
  const isLastStep = currentStep === tutorialSteps.length;

  useEffect(() => {
    if (isActive) {
      // Prevent scrolling during tutorial
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-2xl mx-4"
        >
          {/* Tutorial Content Card */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {currentStepData.title && (
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {currentStepData.title}
              </h2>
            )}

            {/* Content */}
            <div className="text-white text-lg mb-8">
              {Array.isArray(currentStepData.content) ? (
                <ul className="space-y-2">
                  {currentStepData.content.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center">{currentStepData.content}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={currentStep === 1 ? exitTutorial : previousStep}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {currentStep === 1 ? "Home" : "Back"}
              </button>

              {/* Progress Dots */}
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index + 1 === currentStep ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              {/* Next/Done Button */}
              <button
                onClick={isLastStep ? exitTutorial : nextStep}
                className="flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                {isLastStep ? "Done" : "Next"}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}