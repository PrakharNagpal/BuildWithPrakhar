import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
}

function sign(value: string) {
  const secret = getSecret();

  if (!secret) {
    throw new Error("Admin auth is not configured");
  }

  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && getSecret());
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  return Boolean(expected && safeEqual(password, expected));
}

export function createAdminToken() {
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(16).toString("base64url");
  const value = `${issuedAt}.${nonce}`;
  return `${value}.${sign(value)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [issuedAtValue, nonce, signature] = parts;
  const issuedAt = Number(issuedAtValue);

  if (!Number.isFinite(issuedAt) || issuedAt + MAX_AGE_SECONDS < Math.floor(Date.now() / 1000)) {
    return false;
  }

  try {
    return safeEqual(sign(`${issuedAtValue}.${nonce}`), signature);
  } catch {
    return false;
  }
}

export async function isAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    maxAge: MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
