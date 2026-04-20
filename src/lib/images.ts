export const CATEGORY_IMAGES: Record<string, string> = {
  'Vie de la mosquée': '/images/mosquee-bilal-thumbnail.jpg',
  'Événements':        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'Cours':             'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
  'Communauté':        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
};

export function getArticleImage(opts: { image_url?: string | null; category: string }): string {
  return opts.image_url || CATEGORY_IMAGES[opts.category] || '';
}

const MAX_WIDTH = 1200;
const QUALITY = 0.85;
const MAX_BYTES = 1_000_000;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function optimizeImage(file: File): Promise<Blob> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format non supporté. Utilisez JPG, PNG ou WebP.');
  }

  const img = await loadImage(file);
  const { width, height } = scaleDown(img.width, img.height, MAX_WIDTH);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de créer le contexte canvas.');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, 'image/webp', QUALITY);
  if (blob.size > MAX_BYTES) {
    throw new Error(`Image trop volumineuse après optimisation (${(blob.size / 1024 / 1024).toFixed(2)} Mo). Maximum : 1 Mo.`);
  }
  return blob;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de charger l\'image.'));
    };
    img.src = url;
  });
}

function scaleDown(w: number, h: number, maxW: number): { width: number; height: number } {
  if (w <= maxW) return { width: w, height: h };
  const ratio = maxW / w;
  return { width: maxW, height: Math.round(h * ratio) };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Conversion échouée.'))),
      type,
      quality
    );
  });
}
