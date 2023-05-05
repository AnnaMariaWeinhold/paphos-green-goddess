import { useSanityClient, createImageBuilder } from 'astro-sanity';

export const imageBuilder = createImageBuilder(useSanityClient());

export function urlForImage(source) {
  console.log("IMAGE SOURCE", source);
  return imageBuilder.image(source);
}