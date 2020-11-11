/// <reference types="node" />
/// <reference types="node/stream" />

interface FileEntry {
  buffer: Buffer;
  fileName: string;
  type: string; // MIME Type
}

interface JimpStreamInterface {
  stream: NodeJS.ReadableStream;
  buffer: Buffer;
}
