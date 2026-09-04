export function shouldUseIeeeBlueHeader({
  hasSplash,
  headerHeight = 0,
  isIntersecting = false,
  splashBottom = Number.POSITIVE_INFINITY,
}) {
  if (!hasSplash) return true;

  return !isIntersecting && splashBottom <= headerHeight;
}
