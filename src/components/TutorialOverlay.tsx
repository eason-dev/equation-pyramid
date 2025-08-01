"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { Typography } from "@/components/Typography";
import { tutorialSteps } from "@/logic/state/tutorialStore";

interface TutorialOverlayProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
}

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialOverlay({ currentStep, onNext, onPrevious, onExit }: TutorialOverlayProps) {
  const [highlightPositions, setHighlightPositions] = useState<HighlightPosition[]>([]);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStepData = tutorialSteps[currentStep - 1];
  const isLastStep = currentStep === tutorialSteps.length;
  const isFirstStep = currentStep === 1;

  // Safety check
  if (!currentStepData) {
    console.error(`Tutorial step ${currentStep} not found`);
    return null;
  }

  // Detect mobile/tablet screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Include tablets for consistent popup width
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset drag offset when step changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
  }, [currentStep]);

  // Calculate highlight position based on step
  useEffect(() => {
    const calculatePosition = () => {
      // On mobile/tablet, always center the popup and skip highlights
      if (isMobile) {
        setHighlightPositions([]);
        // Fixed width only
        const popupWidth = 380; // Fixed width
        setTooltipPosition({
          top: window.innerHeight / 2 - 200, // Center vertically (approximate)
          left: Math.max(20, (window.innerWidth - popupWidth) / 2), // Center horizontally with padding
        });
        return;
      }

      let selector = "";
      
      switch (currentStep) {
        case 1:
          // Highlight the main game content area (tiles and target)
          selector = '[data-tutorial="main-game-content"]';
          break;
        case 2:
          // Highlight the guessing state area
          selector = '[data-tutorial="guessing-state"]';
          break;
        case 3:
          // Highlight the guessing state showing result
          selector = '[data-tutorial="guessing-state"]';
          break;
        case 4:
          // Highlight the answer button (score area)
          selector = '[data-tutorial="answer-button"]';
          break;
        case 5:
          // No highlight for step 5 - full overlay
          selector = '';
          break;
      }

      if (selector) {
        const elements = document.querySelectorAll(selector);
        
        if (elements.length > 0) {
          const padding = 10;
          const positions: HighlightPosition[] = [];
          
          // Create a single bounding box for all elements
          let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
          
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            minX = Math.min(minX, rect.left);
            minY = Math.min(minY, rect.top);
            maxX = Math.max(maxX, rect.right);
            maxY = Math.max(maxY, rect.bottom);
          });
          
          // For step 1, adjust the left boundary to exclude empty answer column space
          if (currentStep === 1) {
            // Find the tiles area to use as left boundary
            const tilesArea = document.querySelector('[data-tutorial="tiles-area"]');
            if (tilesArea) {
              const tilesRect = tilesArea.getBoundingClientRect();
              minX = Math.max(minX, tilesRect.left - 50); // Add some margin but not full column width
            }
          }
          
          positions.push({
            top: minY - padding,
            left: minX - padding,
            width: maxX - minX + (padding * 2),
            height: maxY - minY + (padding * 2),
          });
          
          setHighlightPositions(positions);

          // Calculate tooltip position based on all highlight positions
          let tooltipTop, tooltipLeft;
          let boundsMinX = Infinity, boundsMinY = Infinity, boundsMaxX = 0, boundsMaxY = 0;
          
          // Calculate overall bounds of all highlights
          positions.forEach(pos => {
            boundsMinX = Math.min(boundsMinX, pos.left);
            boundsMinY = Math.min(boundsMinY, pos.top);
            boundsMaxX = Math.max(boundsMaxX, pos.left + pos.width);
            boundsMaxY = Math.max(boundsMaxY, pos.top + pos.height);
          });
          
          // Special positioning for specific steps
          if (currentStep === 2 || currentStep === 3) {
            // Position below the highlighted element (guessing state)
            tooltipTop = boundsMaxY - 350;
            tooltipLeft = (boundsMinX + boundsMaxX) / 2 - 200; // Center relative to highlighted element
            
            // Ensure it doesn't go off screen bottom
            // Increased threshold from 300 to 200 to allow popup to go lower
            if (tooltipTop > window.innerHeight - 200) {
              // If still too low, clamp to bot
              // tom edge instead of flipping above
              tooltipTop = window.innerHeight - 200;
            }
            
            // Ensure it doesn't go off screen horizontally
            if (tooltipLeft < 20) tooltipLeft = 20;
            if (tooltipLeft > window.innerWidth - 420) tooltipLeft = window.innerWidth - 420;
          } else if (currentStep === 4) {
            // Position above the answer button (score) for step 4
            tooltipTop = boundsMinY - 10 - 360;
            tooltipLeft = (boundsMinX + boundsMaxX) / 2 - 200;
            
            // Ensure it doesn't go off screen
            if (tooltipTop < 20) tooltipTop = 20;
            if (tooltipLeft < 20) tooltipLeft = 20;
            if (tooltipLeft > window.innerWidth - 420) tooltipLeft = window.innerWidth - 420;
          } else if (currentStep === 1) {
            // Step 1 - Bottom center (default position)
            tooltipTop = window.innerHeight - 250;
            tooltipLeft = window.innerWidth / 2 - 200;
          } else {
            // Default bottom center position
            tooltipTop = window.innerHeight - 250;
            tooltipLeft = window.innerWidth / 2 - 200;
          }
          
          setTooltipPosition({
            top: tooltipTop,
            left: tooltipLeft,
          });
        }
      } else {
        // No highlight for this step
        setHighlightPositions([]);
        
        // Position based on step
        if (currentStep === 5) {
          // Step 5 - Center position
          setTooltipPosition({
            top: window.innerHeight / 2 - 150, // Center vertically
            left: window.innerWidth / 2 - 200, // Center horizontally
          });
        } else {
          // Default bottom center for other steps
          setTooltipPosition({
            top: window.innerHeight - 250,
            left: window.innerWidth / 2 - 200,
          });
        }
      }
    };

    calculatePosition();
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);
    
    // Recalculate after a small delay to ensure DOM is ready
    const timeout1 = setTimeout(calculatePosition, 100);
    // Additional recalculation for step 2 to ensure guessing state is rendered
    const timeout2 = setTimeout(calculatePosition, 500);
    // One more recalculation for safety
    const timeout3 = setTimeout(calculatePosition, 800);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [currentStep, isMobile]);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={isMobile ? undefined : { opacity: 0 }}
        animate={isMobile ? undefined : { opacity: 1 }}
        exit={isMobile ? undefined : { opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Dark overlay with cutout - simplified for mobile */}
        {isMobile ? (
          <div className="fixed inset-0 bg-black/80 pointer-events-auto" />
        ) : (
          <div className="fixed inset-0 pointer-events-auto">
            <svg className="w-full h-full">
              <defs>
                <mask id="highlight-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {highlightPositions.map((pos, index) => (
                    <motion.rect
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      x={pos.left}
                      y={pos.top}
                      width={pos.width}
                      height={pos.height}
                      rx="8"
                      fill="black"
                    />
                  ))}
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.8)"
                mask="url(#highlight-mask)"
              />
            </svg>
          </div>
        )}

        {/* Highlight borders - hide on mobile */}
        {!isMobile && highlightPositions.map((pos, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed border-2 border-white rounded-lg pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
            }}
          />
        ))}

        {/* Tutorial tooltip */}
        <FocusTrap active={true}>
          <motion.div
            initial={isMobile ? undefined : { opacity: 0 }}
            animate={isMobile ? {
              x: tooltipPosition.left,
              y: tooltipPosition.top
            } : { 
              opacity: 1,
              x: tooltipPosition.left + dragOffset.x,
              y: tooltipPosition.top + dragOffset.y
            }}
            drag={!isMobile}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={(event, info) => {
              if (!isMobile) {
                setDragOffset((prev) => ({
                  x: prev.x + info.offset.x,
                  y: prev.y + info.offset.y,
                }));
              }
            }}
            className="fixed pointer-events-auto"
            style={{
              top: 0,
              left: 0,
              width: isMobile ? "380px" : "auto",
              maxWidth: isMobile ? "calc(100vw - 40px)" : "min(400px, 90vw)",
              cursor: isMobile ? "default" : "grab",
              zIndex: 10000, // Ensure it's on top
            }}
            whileDrag={{ cursor: isMobile ? "default" : "grabbing" }}
          >
            <div 
              className="rounded-lg shadow-2xl border border-gray-700 select-none" 
              style={{ 
                backgroundColor: "#0E0E12"
              }}
            >
              {/* Drag handle - hide on mobile */}
              {!isMobile && (
                <div className="rounded-t-lg px-6 py-2 flex justify-center items-center" style={{ backgroundColor: "#17171A" }}>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#D9D9D9" }} />
                </div>
              )}
              
              <div className="p-6">
                {/* Step title - only for steps 4 & 5 */}
                {currentStepData.title && currentStep >= 4 && (
                  <Typography variant="h2" className="text-white mb-4 text-center">
                    {currentStepData.title}
                  </Typography>
                )}

              {/* Content */}
              <div className={currentStep >= 4 ? "mb-6" : "mb-6"}>
                {Array.isArray(currentStepData.content) ? (
                  <ul className="space-y-2 text-left">
                    {currentStepData.content.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-white">•</span>
                        <Typography variant="p3" className="text-white">
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  currentStepData.content && (
                    <Typography variant="p2" className="text-center text-white">
                      {currentStepData.content}
                    </Typography>
                  )
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={isFirstStep ? onExit : onPrevious}
                  className="flex items-center text-white/80 hover:text-white transition-colors px-3 py-2"
                >
                  <span className="mr-2">←</span>
                  {isFirstStep ? "Home" : "Back"}
                </button>

                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index + 1 === currentStep ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={onNext}
                  className="flex items-center text-white hover:bg-white/10 px-4 py-2 rounded transition-colors"
                >
                  {isLastStep ? "Done" : "Next"}
                  <span className="ml-2">→</span>
                </button>
              </div>
              </div>
            </div>
          </motion.div>
        </FocusTrap>
      </motion.div>
    </AnimatePresence>
  );
}