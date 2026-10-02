# Authentication

The web session uses a stateless HS256 JWT stored by the Worker in an
`HttpOnly; Secure; SameSite=Strict` cookie. Configure the signing key as a
Cloudflare secret before deploying:

```sh
npx wrangler secret put JWT_SECRET
```

Use a long, randomly generated value and do not place it in source control or
the public `wrangler.toml` file.

For local Wrangler development, create the ignored `.dev.vars` file with:

```text
JWT_SECRET=replace-with-a-long-random-local-secret
```

# Local R2 storage

The Worker uses the `ID_CARD_BUCKET` R2 binding for uploaded ID-card files. Wrangler provides a local R2 emulator, so no S3 credentials or S3 client are needed during local development.

Certificate fields remain in D1, which is the source of truth for listing, searching, editing, and viewing certificate data. The `CERTIFICATE_BUCKET` binding is reserved for generated PDF files under `certificates/<certificate-id>.pdf`.

Start the Worker with:

```sh
npx wrangler dev
```

Local R2 data is persisted by Wrangler. The production deployment uses the same binding name with the R2 bucket configured in `wrangler.toml`.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
