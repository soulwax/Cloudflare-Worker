import { createBrainAtlasResult } from '../core/brain-atlas.js';

export function handleBrainAtlas(): Response {
  return new Response(JSON.stringify(createBrainAtlasResult(), null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
