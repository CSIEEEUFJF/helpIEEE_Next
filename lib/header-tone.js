export function shouldUseIeeeBlueHeader({
  hasSplash,
  scrollY = 0,
  headerHeight = 0,
  isIntersecting = false,
  splashBottom = Number.POSITIVE_INFINITY,
}) {
  if (!hasSplash) return scrollY > 0;

  return !isIntersecting && splashBottom <= headerHeight;
}
