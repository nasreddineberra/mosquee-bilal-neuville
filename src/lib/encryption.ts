// ─── Chiffrement AES-256-GCM pour données personnelles ─────────────────────
// Utilise une clé stockée dans ENCRYPTION_KEY (hex 64 caractères = 32 bytes)
// Le ciphertext est encodé en base64 avec IV préfixé (format: iv:ciphertext)
//
// Attention : Ce module ne peut être utilisé que côté serveur (Node.js crypto).

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY manquante ou invalide (doit être 64 caractères hexadécimaux = 32 bytes). ' +
      'Générez-en une avec : node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Chiffre un texte en clair.
 * Retourne une chaîne base64 formatée : `base64(iv):base64(ciphertext):base64(authTag)`
 * Ou null si le texte est vide.
 */
export function encrypt(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  const crypto = require('crypto');
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag().toString('base64');
  return `${iv.toString('base64')}:${encrypted}:${tag}`;
}

/**
 * Déchiffre un texte chiffré produit par `encrypt()`.
 * Retourne le texte en clair, ou null si le ciphertext est vide/invalide.
 */
export function decrypt(ciphertext: string | null | undefined): string | null {
  if (!ciphertext) return null;
  try {
    const crypto = require('crypto');
    const key = getKey();
    const parts = ciphertext.split(':');
    if (parts.length !== 3) return null;
    const iv = Buffer.from(parts[0], 'base64');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    // Échec de déchiffrement (clé invalide, données corrompues)
    return null;
  }
}
