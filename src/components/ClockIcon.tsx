interface ClockIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ClockIcon({
  width = 33,
  height = 33,
  className,
}: ClockIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Timer Clock</title>
      <path
        d="M16.5 0C25.608 0 33 7.392 33 16.5C33 25.608 25.608 33 16.5 33C7.392 33 0 25.608 0 16.5C0 7.392 7.392 0 16.5 0ZM16.5 29.7C23.793 29.7 29.7 23.793 29.7 16.5C29.7 9.207 23.793 3.3 16.5 3.3C9.207 3.3 3.3 9.207 3.3 16.5C3.3 23.793 9.207 29.7 16.5 29.7ZM22.3344 8.3325L24.6675 10.6656L16.5 18.8331L14.1669 16.5L22.3344 8.3325Z"
        fill="currentColor"
      />
    </svg>
  );
}
