const utf8decoder = new TextDecoder();

export function uint8Array2string(u: Uint8Array) {
  return utf8decoder.decode(u);
}
