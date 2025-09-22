export function getCurrentTimeWithTimezone(_tz: string = 'UTC'): string {
  return new Date().toISOString();
}
