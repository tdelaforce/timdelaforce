export function getAnonymousThreshold(): number {
  return parseInt(process.env.ANON_MESSAGE_THRESHOLD ?? "3", 10);
}
