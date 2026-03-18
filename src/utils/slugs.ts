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
 */
export function getSlugFromPostId(postId: string): string {
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
