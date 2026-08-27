interface SparkIconProps {
  size?: number;
}

export function SparkIcon({ size = 16 }: SparkIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2c.5 3.9 1.8 5.2 5.7 5.7-3.9.5-5.2 1.8-5.7 5.7-.5-3.9-1.8-5.2-5.7-5.7 3.9-.5 5.2-1.8 5.7-5.7Z"
        fill="var(--accent)"
      />
      <path
        d="M18.4 14.6c.26 1.9.88 2.5 2.8 2.8-1.92.26-2.54.88-2.8 2.8-.26-1.92-.88-2.54-2.8-2.8 1.92-.3 2.54-.9 2.8-2.8Z"
        fill="var(--accent)"
        opacity="0.55"
      />
    </svg>
  );
}
