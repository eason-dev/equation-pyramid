// Utility to detect touch devices
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none)").matches
  );
};

// Hook to manage touch-friendly interactions
export const useTouchFriendly = () => {
  const isTouch = isTouchDevice();

  return {
    isTouch,
    // Use onClick for both touch and mouse on touch devices
    getInteractionProps: (onClick?: () => void) => {
      if (isTouch) {
        return {
          onClick,
          // Disable hover effects on touch devices
          onMouseEnter: undefined,
          onMouseLeave: undefined,
        };
      }
      return {
        onClick,
      };
    },
  };
};
