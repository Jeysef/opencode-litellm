<div align="center">

<img src="assets/logo.svg" alt="opencode-litellm logo" width="128" height="128" />

# opencode-litellm (e-infra fork)

**[OpenCode](https://opencode.ai) (v1 and v2) plugin for [LiteLLM](https://github.com/BerriAI/litellm) proxies — zero-config auto-detection, dynamic model discovery, and full web-UI connect.**

Fork of [yuseferi/opencode-litellm](https://github.com/yuseferi/opencode-litellm) (based on v1.5.0) with the
[connect-provider dialog integration](https://github.com/yuseferi/opencode-litellm/pull/41) and e-infra's
non-standard token-limit fields.

</div>

## Install

**OpenCode 2** (CLI / Desktop / web UI):

```sh
opencode plugin add 'github:Jeysef/opencode-litellm'
```

This installs from the default branch (`main`). For a stable pin, use a full commit hash:
`github:Jeysef/opencode-litellm#<commit>`.

**OpenCode 1** (v1.18.29+): the legacy `server()` entrypoint is still supported. Install from a checkout
(`git clone` + add the directory under `plugin` in `opencode.json` — the root `index.ts` shim makes
directory loading work) or from an npm-packed tarball of this repo.

## What it does

- **Zero-config detection** — finds a local LiteLLM proxy on ports 4000/8000/8080, or honors
  `LITELLM_BASE_URL` / `LITELLM_API_KEY` / `LITELLM_MASTER_KEY`, or a provider block in `opencode.json(c)`.
- **Connect-provider dialog (OpenCode 2)** — connect entirely from the web UI (`/connect` → LiteLLM):
  API key plus optional base URL and provider id. Reconnecting with a changed URL or provider id
  rebuilds the provider in place and removes stale ids from the registry.
- **Dynamic discovery** — pulls the model list from `/v1/models` and rich metadata (context/output
  limits, pricing, reasoning) from `/v1/model/info`, cached for 7 days with stale-while-revalidate.
- **e-infra token limits** — e-infra's LiteLLM publishes limits under non-standard fields:
  - `model_info.context_size` → `max_input_tokens`
  - `litellm_params.extra_body.max_completion_tokens` (fallback `extra_body.max_tokens`) → `max_output_tokens`

  These only **fill gaps**: the standard LiteLLM/OpenAI field names (`max_input_tokens`,
  `max_output_tokens`, `max_tokens`) always win when present, so the plugin keeps working unchanged
  if e-infra migrates to the standard schema.

## Configuration

All options are optional. Provider-level options live under `provider.<id>.options`:

| Option | Default | Description |
| --- | --- | --- |
| `baseURL` / env `LITELLM_BASE_URL` | auto-detect | Proxy URL including the `/v1` suffix |
| `apiKey` / env `LITELLM_API_KEY` / `LITELLM_MASTER_KEY` | — | Proxy key |
| `formatModelNames` | `false` | Rewrite ids to `litellm/<model>` |
| `includeModels` / `excludeModels` | — | Glob filters (`*` wildcards); exclude wins |
| `modelCapabilities` | — | Per-model overrides (reasoning effort, tool-call, ...) |
| `headers` | — | Extra HTTP headers for discovery requests |
| env `LITELLM_REQUEST_TIMEOUT_MS` | `15000` | Discovery request timeout |

Minimal explicit config example:

```jsonc
{
  "provider": {
    "litellm": {
      "options": {
        "baseURL": "https://llm.ai.e-infra.cz/v1",
        "apiKey": "{env:LITELLM_API_KEY}"
      }
    }
  }
}
```

…or skip the config file entirely and use the connect dialog on OpenCode 2.

## Troubleshooting

- **Wrong/missing limits after a proxy change**: the discovery cache is
  `~/.cache/opencode-litellm/models-*.json`. Delete it and restart the server
  (`opencode service restart` — on a custom-bound server use your full `opencode serve --hostname ...
  --port ... --service` command; a bare `service restart` re-binds to a local default).
- **Plugin not loading after an update**: restart the OpenCode server; plugin changes are not picked
  up by a config reload alone.

## Development

```sh
npm install
npm run typecheck
npm test
```

## License

MIT — © Yusef Mohamadi. This fork carries the same license; all upstream attribution is preserved in
[LICENSE](LICENSE).
