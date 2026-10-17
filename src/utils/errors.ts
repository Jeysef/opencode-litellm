/**
 * Extract a human-readable message from an unknown `catch` binding.
 *
 * The plugin catches at many boundary points (network, host callbacks,
 * cache IO) where the thrown value is untyped; centralize the
 * stringification so log lines stay uniform.
 */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
