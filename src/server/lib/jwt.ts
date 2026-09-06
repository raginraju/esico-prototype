import type { RequestActor } from "./requestActor";

const encoder = new TextEncoder();
const tokenLifetimeSeconds = 60 * 60 * 8;

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

function encode(value: string): string {
  return btoa(value)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

async function signingKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

async function signature(input: string, secret: string): Promise<string> {
  const key = await signingKey(secret, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return encode(String.fromCharCode(...new Uint8Array(bytes)));
}

export async function createJwt(actor: RequestActor, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encode(JSON.stringify({
    sub: actor.id,
    email: actor.email,
    role: actor.role,
    iat: now,
    exp: now + tokenLifetimeSeconds,
  } satisfies JwtPayload));
  const input = `${header}.${payload}`;
  return `${input}.${await signature(input, secret)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  const [header, payload, providedSignature] = token.split(".");
  if (!header || !payload || !providedSignature) return null;

  try {
    const parsedHeader = JSON.parse(decode(header)) as { alg?: string; typ?: string };
    if (parsedHeader.alg !== "HS256" || parsedHeader.typ !== "JWT") return null;

    const expectedSignature = await (async () => {
      const key = await signingKey(secret, ["verify"]);
      const bytes = Uint8Array.from(atob(providedSignature.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(providedSignature.length / 4) * 4, "=")), (character) => character.charCodeAt(0));
      const valid = await crypto.subtle.verify("HMAC", key, bytes, encoder.encode(`${header}.${payload}`));
      return valid ? providedSignature : null;
    })();

    if (!expectedSignature) return null;
    const parsed = JSON.parse(decode(payload)) as JwtPayload;
    if (parsed.exp <= Math.floor(Date.now() / 1000) || !parsed.sub || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export { tokenLifetimeSeconds };
