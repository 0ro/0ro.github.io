import { getCollection } from "astro:content";
import generateOgImage, { stripEmojis } from "@utils/generateOgImage";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params }) => {
  return {
    body: await generateOgImage(params.ogTitle),
  };
};

const postImportResult = await getCollection("blog", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export function getStaticPaths() {
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(({ data }) => {
      // NOTE: need to remove emoji from ogTitle
      const ogTitle = stripEmojis(data.title);

      return {
        params: { ogTitle },
      };
    });
}
