# Changelog

Fork of [yuseferi/opencode-litellm](https://github.com/yuseferi/opencode-litellm) — based on upstream
v1.5.0. Upstream releases are not tracked below.

## 1.6.0 — 2026-10-17

Fork packaging and feature consolidation. All upstream v1.5.0 plugin behavior is included.

### Features

- **OpenCode 2 connect-provider dialog** ([upstream PR #41](https://github.com/yuseferi/opencode-litellm/pull/41)):
  connect LiteLLM entirely from the web UI — API key plus optional base URL and provider id.
  Reconnecting with a changed URL/provider id rebuilds the provider in place and removes replaced ids
  from the provider registry.
- **e-infra token-limit mapping**: `model_info.context_size` → `max_input_tokens` and
  `litellm_params.extra_body.max_completion_tokens` (fallback `extra_body.max_tokens`) →
  `max_output_tokens`, applied only when the standard field names are absent (standard names always
  win, so a future migration to the standard schema needs no plugin change).
- **e-infra capability mapping**: the non-standard `model_info.capabilities`
  array (`multimodal`, `tools`) fills `supports_vision` /
  `supports_function_calling` when the standard booleans are absent — image
  attachments and tool calls light up for exactly the models the proxy marks
  accordingly (e.g. glm-5.3-flash yes, glm-5.3 no).
- npm **git installs** work with `opencode plugin add`: the package ships no `build`/`prepare` scripts
  (OpenCode's npm wrapper cannot run nested installs — anomalyco/opencode#49704).

### Packaging

- Package renamed to `opencode-plugin-litellm-einfra`; repo metadata points at this fork.
- Removed upstream release machinery (semantic-release, npm-publish workflow, PR/issue templates,
  Renovate, security policy, IDE files) and replaced the README with fork documentation.
- OpenCode 1 (`server()` entrypoint) support is retained.
