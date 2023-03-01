import crypto from "crypto";

export async function sha256(str) {
  // Convert string to ArrayBuffer
  // const buff = new Uint8Array([].map.call(str, (c) => c.charCodeAt(0))).buffer;
  // Calculate digest
  //const digest = await crypto.subtle.digest("SHA-256", buff);
  return crypto.createHash("sha256").update(str).digest("hex");
  // Convert ArrayBuffer to hex string
  // (from: https://stackoverflow.com/a/40031979)
  // return [].map
  //   .call(new Uint8Array(digest), (x) => ("00" + x.toString(16)).slice(-2))
  //   .join("");
}
