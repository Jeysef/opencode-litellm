const PREFIX = '[opencode-litellm]'

/**
 * Plugin-side console logging for the OpenCode 2 modules.
 *
 * OpenCode 2 exposes no log API through the plugin context (unlike OpenCode 1,
 * whose `client.app.log` routes into the host log store — see `initV2Logging`
 * in `plugin/index.ts`). The host does capture console output into its log
 * files, so a single prefixed console write is the house pattern: diagnostics
 * stay out of the TUI's way, remain greppable by the `[opencode-litellm]`
 * tag, and the prefix lives here instead of being retyped at every call site.
 */
export function logInfo(message: string): void {
  console.log(`${PREFIX} ${message}`)
}

export function logWarn(message: string): void {
  console.warn(`${PREFIX} ${message}`)
}
