// node.js
import * as crypto from "node:crypto";

export async function calculateHashForArrayBuffer(
  data: ArrayBuffer,
): Promise<string> {
  return calculateHashForBuffer(Buffer.from(data));
}
export async function calculateHashForBuffer(data: Buffer) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}
