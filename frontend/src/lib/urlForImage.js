import { useSanityClient, createImageBuilder } from 'astro-sanity';

export const imageBuilder = createImageBuilder(useSanityClient());

export function urlForImage(source) {
  if (source === undefined) return { url: () => "" };
  return imageBuilder.image(source);
}