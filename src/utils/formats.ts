/**
 * Formats time duration in minutes to a human-readable string
 * @param minutes - The number of minutes to format
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 */
export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? h + "h " : ""}${m}m`;
}

/**
 * Formats a timestamp string to a human-readable date and time format
 * @param timestamp - The timestamp string to format (ISO format or valid date string)
 * @returns Formatted date string in "MMM d, yyyy" US format
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Converts a percentage value to a star rating out of 5
 * @param percentage - The percentage value to convert (0-100)
 * @returns Star rating rounded to nearest 0.5 increment
 */
export function formatStarRating(percentage: number): number {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  return Math.round((clampedPercentage / 100) * 5 * 2) / 2;
}
