import { Context, MiddlewareHandler } from 'hono';
import { BrotliOptions, ZlibOptions } from 'node:zlib';
import { IntClosedRange } from 'type-fest';

declare const ACCEPTED_ENCODINGS: readonly ["zstd", "br", "gzip", "deflate"];
declare const NODE_ENCODINGS: readonly ["br", "gzip", "deflate"];
declare const ZSTD_MIN_LEVEL = 1;
declare const ZSTD_MAX_LEVEL = 22;
declare const BROTLI_MIN_LEVEL = 1;
declare const BROTLI_MAX_LEVEL = 11;
declare const GZIP_MIN_LEVEL = 0;
declare const GZIP_MAX_LEVEL = 9;

type CompressionEncoding = (typeof ACCEPTED_ENCODINGS)[number];
type NodeCompressionEncoding = (typeof NODE_ENCODINGS)[number];
type NodeCompressionOptions = BrotliOptions & ZlibOptions;
type CompressionFilter = (c: Context) => boolean;
type ZstdLevel = IntClosedRange<typeof ZSTD_MIN_LEVEL, typeof ZSTD_MAX_LEVEL>;
type BrotliLevel = IntClosedRange<typeof BROTLI_MIN_LEVEL, typeof BROTLI_MAX_LEVEL>;
type GzipLevel = IntClosedRange<typeof GZIP_MIN_LEVEL, typeof GZIP_MAX_LEVEL>;
interface CompressOptions {
    encoding?: CompressionEncoding;
    encodings?: CompressionEncoding[];
    force?: boolean;
    threshold?: number;
    zstdLevel?: ZstdLevel;
    brotliLevel?: BrotliLevel;
    gzipLevel?: GzipLevel;
    options?: NodeCompressionOptions;
    filter?: CompressionFilter;
}

declare function compress({ encoding, encodings, force, threshold, zstdLevel, brotliLevel, gzipLevel, options, filter, }?: CompressOptions): MiddlewareHandler;

declare class ZstdCompressionStream extends TransformStream {
    constructor(level?: number);
}
declare class ZlibCompressionStream {
    readable: ReadableStream;
    writable: WritableStream;
    constructor(encoding: NodeCompressionEncoding, options?: NodeCompressionOptions);
}

export { type BrotliLevel, type CompressOptions, type CompressionEncoding, type CompressionFilter, type GzipLevel, type NodeCompressionEncoding, type NodeCompressionOptions, ZlibCompressionStream, ZstdCompressionStream, type ZstdLevel, compress, compress as default };
