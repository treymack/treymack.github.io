/**
 * Formats a post date for display, e.g. "Jan 1, 2015".
 * Frontmatter dates are parsed as UTC midnight, so they are formatted in UTC
 * to show the same day regardless of the build machine's timezone.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
