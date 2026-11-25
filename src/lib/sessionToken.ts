export const SESSION_COOKIE_NAME = 'lenha_session';
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'lenha-session-secret-key-salt-pt-cascais'
  );
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getSecretKey();
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  exp: number;
}

export async function createSessionToken(payload: {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const fullPayload: SessionPayload = { ...payload, exp };
  const payloadStr = JSON.stringify(fullPayload);
  const encodedPayload = base64UrlEncode(payloadStr);

  const key = await getHmacKey();
  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encodedPayload)
  );

  let binarySig = '';
  const bytes = new Uint8Array(signatureBytes);
  for (let i = 0; i < bytes.byteLength; i++) {
    binarySig += String.fromCharCode(bytes[i]);
  }
  const encodedSignature = btoa(binarySig).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, encodedSignature] = parts;

    const key = await getHmacKey();

    let base64Sig = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Sig.length % 4) base64Sig += '=';
    const binarySig = atob(base64Sig);
    const signatureBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      signatureBytes[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(encodedPayload)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
