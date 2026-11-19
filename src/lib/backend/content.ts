import { contentLoaders } from '@/lib/integrated-loader';
// BSU V4.5: existing archive IDs, server-side only.
import { backendEnabled, backendGet } from './client';
import { archiveLoaders } from '@/lib/archive-loader';
import type { Material } from '@/components/archive/ArchiveArticle';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function isMaterial(value: unknown): value is Material {
  return isObject(value) && typeof value.title === 'string' &&
    typeof value.lang === 'string' && ['ru', 'ky', 'en', 'cn'].includes(value.lang) &&
    Array.isArray(value.blocks) && value.blocks.every(b => isObject(b) && typeof b.kind === 'string') &&
    Array.isArray(value.variants) && value.variants.every(v => isObject(v) && typeof v.id === 'string' && typeof v.lang === 'string' && typeof v.title === 'string');
}
export async function getArchiveMaterial(id: string): Promise<Material | null> {
  const loader = Object.hasOwn(archiveLoaders, id)
    ? archiveLoaders[id]
    : Object.hasOwn(contentLoaders, id)
      ? contentLoaders[id]
      : undefined;

  if (!loader) return null;
  if (!backendEnabled() || process.env.BSU_CONTENT_SOURCE !== 'backend') return loader();
  // Proposed endpoint relative to BSU_API_BASE_URL; confirm against Swagger first.
  const response = await backendGet<unknown>('content/' + encodeURIComponent(id));
  if (!isMaterial(response)) throw new Error('Unexpected BSU content response: ' + id);
  return response;
}
