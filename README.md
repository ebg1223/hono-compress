# hono-compress

Compression plugin for [Hono](https://github.com/honojs/hono)

Drop-in replacement of the built-in [Compress Middleware](https://hono.dev/docs/middleware/builtin/compress), but with some extra...

### Features

- all available compression formats (`zstd`, `brotli`, `gzip`, `deflate`)
- ultra-fast and 100% type-safe
- best format auto-selection
- streaming response support
- configurable compression level and zlib options
- double-compressed content protection
- content size threshold and custom filtering
- Cloudflare Workers and Deno Deploy runtime detection
- works with [Node](https://nodejs.org/), [Deno](https://deno.com/) and [Bun](https://bun.sh/)

## Installation

<details open>
<summary>npm</summary>

```bash
npm install hono-compress
```

</details>

<details>
<summary>Yarn</summary>

```bash
yarn add hono-compress
```

</details>

<details>
<summary>pnpm</summary>

```bash
pnpm add hono-compress
```

</details>

<details>
<summary>Bun</summary>

```bash
bun add hono-compress
```

</details>

<details>
<summary>Deno</summary>

```bash
deno add hono-compress
```

</details>

## Usage

```typescript
import { Hono } from 'hono'
import { compress } from 'hono-compress'

const app = new Hono()

app.use(compress())
```

### Configuration

```typescript
compress({
  encoding,
  encodings,
  threshold,
  zstdLevel,
  brotliLevel,
  zlibLevel,
  options,
  filter,
})
```

#### encoding

Defaults to `undefined`.

The compression format to use to compress the response content.
Can be one of the following:

- `zstd`
- `br`
- `gzip`
- `deflate`

If not defined, all the formats defined in the option `encodings` are allowed.

This option is provided primarily to maintain compatibility with `hono/compress`; it is recommended to use the option `encodings` to set the wanted compression formats.

#### encodings

Defaults to `['zstd', 'br', 'gzip', 'deflate']`.

The compression formats allowed to be used to compress the response content.

The first format matching the request header `Accept-Encoding` is chosen to be used to compress the response content.

#### threshold

Defaults to `1024`.

The minimum size in bytes for a response content to be compressed.

#### zstdLevel

Defaults to `2`.

Zstandard algorithm compression level.

Refer to the zstd [manual](https://facebook.github.io/zstd/zstd_manual.html) for more details.

#### brotliLevel

Defaults to `4`.

Brotli algorithm compression level.

Refer to the Brotli [specification](https://www.ietf.org/rfc/rfc7932.txt) for more details.

#### zlibLevel

Defaults to `6`.

Zlib algorithms compression level.

Refer to the zlib [manual](https://zlib.net/manual.html) for more details.

#### options

Defaults to `{}`.

Options passed to the node compression engine to compress content.

Refer to the node zlib [documentation](https://nodejs.org/api/zlib.html) for more details.

#### filter

Defaults to `undefined`.

An optional function callback to state if the response content should be compressed or not.

**Parameters**

- [Hono Context](https://hono.dev/docs/api/context)

**Return value**

Boolean

By default, content compression is disabled on Cloudflare Workers and Deno Deploy, a custom filter can be used to bypass this behavior and force the response to be always compressed:

```typescript
import type { Context } from 'hono'

compress({
  filter: (c: Context) => true,
})
```

## About

This project is a fork of [bun-compression](https://github.com/sunneydev/bun-compression), which itself is a fork of [elysia-compression](https://github.com/gusb3ll/elysia-compression).

Both projects were not maintained and lacked many of the features I was looking for, so I started with them, but ended up rewriting and expanding many parts.

This project was also inspired by [hono/compress](https://github.com/honojs/hono), [expressjs/compression](https://github.com/expressjs/compression) and [elysia-compress](https://github.com/vermaysha/elysia-compress).
