export async function fetchCategoryDefaults(supabase: any): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('images')
    .select('category, url')
    .not('category', 'is', null);
  return Object.fromEntries(
    (data ?? []).map((r: { category: string; url: string }) => [r.category, r.url])
  );
}

export function getArticleImage(opts: {
  image_url?: string | null;
  category: string;
  categoryDefaults?: Record<string, string>;
}): string {
  return opts.image_url || opts.categoryDefaults?.[opts.category] || '';
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
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Impossible de charger l\'image.')); };
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
