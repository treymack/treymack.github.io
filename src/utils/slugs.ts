/**
 * Extracts the slug from a blog post ID.
 * Handles both flat files and folder-per-post layouts.
 *
 * @example
 * getSlugFromPostId("2017-06-30-get-adobject-pscx-memberof.md")
 * // Returns: "get-adobject-pscx-memberof"
 *
 * getSlugFromPostId("2017-06-30-get-adobject-pscx-memberof/index.md")
 * // Returns: "get-adobject-pscx-memberof"
 *
 * @throws if the ID starts with a date whose month or day is not zero-padded
 * (e.g. "2017-6-30-..."), since the prefix would otherwise leak into the URL.
 */
export function getSlugFromPostId(postId: string): string {
  if (
    /^\d{4}-\d{1,2}-\d{1,2}-/.test(postId) &&
    !/^\d{4}-\d{2}-\d{2}-/.test(postId)
  ) {
    throw new Error(
      `Blog post "${postId}" has an unpadded date prefix. Expected the format YYYY-MM-DD-slug.`,
    );
  }

  return postId
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\/index\.mdx?$/, "")
    .replace(/\.mdx?$/, "");
}

/**
 * Returns the full URL path for a blog post.
 *
 * @example
 * getPostUrl("2017-06-30-get-adobject-pscx-memberof.md")
 * // Returns: "/blog/get-adobject-pscx-memberof"
 */
export function getPostUrl(postId: string): string {
  return `/blog/${getSlugFromPostId(postId)}`;
}

/**
 * Verifies that no two blog posts resolve to the same slug.
 *
 * @throws if two post IDs share a slug, since they would be built to the same URL.
 */
export function assertUniqueSlugs(postIds: string[]): void {
  const seen = new Map<string, string>();

  for (const postId of postIds) {
    const slug = getSlugFromPostId(postId);
    const existing = seen.get(slug);
    if (existing !== undefined) {
      throw new Error(
        `Blog posts "${existing}" and "${postId}" both resolve to the slug "${slug}".`,
      );
    }
    seen.set(slug, postId);
  }
}
