import { describe, it, expect } from "vitest";
import type { CollectionEntry } from "astro:content";
import { sortAndLimitPosts, postsToRSSItems } from "./feed";
import type { PostWithExcerpt } from "./excerpts";

const mockPost = (
  id: string,
  title: string,
  date: string,
): CollectionEntry<"blog"> =>
  ({
    id,
    collection: "blog",
    body: "Post body content",
    data: {
      title,
      date: new Date(date),
    },
  }) as CollectionEntry<"blog">;

const mockPostWithExcerpt = (
  id: string,
  title: string,
  date: string,
  excerptHtml: string = "<p>Test excerpt</p>",
): PostWithExcerpt =>
  ({
    ...mockPost(id, title, date),
    excerpt: "Test excerpt",
    excerptHtml,
    hasMore: true,
  }) as PostWithExcerpt;

describe("sortAndLimitPosts", () => {
  it("sorts posts by date (most recent first)", () => {
    const posts = [
      mockPost("2024-01-01-old-post.md", "Old Post", "2024-01-01"),
      mockPost("2024-03-01-newest-post.md", "Newest Post", "2024-03-01"),
      mockPost("2024-02-01-middle-post.md", "Middle Post", "2024-02-01"),
    ];

    const result = sortAndLimitPosts(posts);

    expect(result[0].data.title).toBe("Newest Post");
    expect(result[1].data.title).toBe("Middle Post");
    expect(result[2].data.title).toBe("Old Post");
  });

  it("limits posts to default of 10", () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
      mockPost(
        `2024-01-${String(i + 1).padStart(2, "0")}-post.md`,
        `Post ${i + 1}`,
        `2024-01-${String(i + 1).padStart(2, "0")}`,
      ),
    );

    const result = sortAndLimitPosts(posts);

    expect(result).toHaveLength(10);
  });

  it("limits posts to specified count", () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
      mockPost(
        `2024-01-${String(i + 1).padStart(2, "0")}-post.md`,
        `Post ${i + 1}`,
        `2024-01-${String(i + 1).padStart(2, "0")}`,
      ),
    );

    const result = sortAndLimitPosts(posts, 5);

    expect(result).toHaveLength(5);
  });

  it("handles empty posts array", () => {
    const result = sortAndLimitPosts([]);

    expect(result).toEqual([]);
  });

  it("handles posts array smaller than limit", () => {
    const posts = [
      mockPost("2024-01-01-post1.md", "Post 1", "2024-01-01"),
      mockPost("2024-01-02-post2.md", "Post 2", "2024-01-02"),
    ];

    const result = sortAndLimitPosts(posts, 10);

    expect(result).toHaveLength(2);
  });

  it("does not mutate original array", () => {
    const posts = [
      mockPost("2024-01-01-old-post.md", "Old Post", "2024-01-01"),
      mockPost("2024-03-01-newest-post.md", "Newest Post", "2024-03-01"),
    ];
    const originalFirstPost = posts[0];

    sortAndLimitPosts(posts);

    expect(posts[0]).toBe(originalFirstPost);
  });
});

describe("postsToRSSItems", () => {
  it("transforms posts to RSS items with correct fields", () => {
    const posts = [
      mockPostWithExcerpt(
        "2024-01-15-first-post.md",
        "First Post",
        "2024-01-15",
        "<p>First excerpt</p>",
      ),
      mockPostWithExcerpt(
        "2024-01-10-second-post.md",
        "Second Post",
        "2024-01-10",
        "<p>Second excerpt</p>",
      ),
    ];

    const result = postsToRSSItems(posts);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      title: "First Post",
      pubDate: new Date("2024-01-15"),
      link: "/blog/first-post",
      content: "<p>First excerpt</p>",
    });
    expect(result[1]).toEqual({
      title: "Second Post",
      pubDate: new Date("2024-01-10"),
      link: "/blog/second-post",
      content: "<p>Second excerpt</p>",
    });
  });

  it("uses getPostUrl for link generation", () => {
    const posts = [
      mockPostWithExcerpt(
        "2024-01-01-test-post.md",
        "Test Post",
        "2024-01-01",
      ),
    ];

    const result = postsToRSSItems(posts);

    expect(result[0].link).toBe("/blog/test-post");
  });

  it("includes excerpt HTML in content field", () => {
    const posts = [
      mockPostWithExcerpt(
        "2024-01-01-test-post.md",
        "Test Post",
        "2024-01-01",
        "<p>Custom <strong>HTML</strong> excerpt</p>",
      ),
    ];

    const result = postsToRSSItems(posts);

    expect(result[0].content).toBe("<p>Custom <strong>HTML</strong> excerpt</p>");
  });

  it("handles empty posts array", () => {
    const result = postsToRSSItems([]);

    expect(result).toEqual([]);
  });

  it("preserves post date as pubDate", () => {
    const testDate = new Date("2024-06-15T12:30:00Z");
    const posts = [
      mockPostWithExcerpt("2024-06-15-dated-post.md", "Dated Post", testDate.toISOString()),
    ];

    const result = postsToRSSItems(posts);

    expect(result[0].pubDate).toEqual(testDate);
  });
});
