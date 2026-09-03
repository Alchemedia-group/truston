type ImageModule = { default: string | { src: string } };

const files = import.meta.glob<ImageModule>('/src/content/*', { eager: true });

function normalize(name: string): string {
  return name
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const byName = new Map<string, string>();
for (const [path, mod] of Object.entries(files)) {
  const filename = path.split('/').pop() ?? '';
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const url = typeof mod.default === 'string' ? mod.default : mod.default.src;
  byName.set(normalize(withoutExt), url);
}

export function getMedia(name: string): string | undefined {
  return byName.get(normalize(name));
}

export function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(url);
}
