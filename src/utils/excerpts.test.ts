import { describe, it, expect } from "vitest";
import type { CollectionEntry } from "astro:content";
import { processPostExcerpt, processPostsExcerpts } from "./excerpts";

const mockPost = (body: string): CollectionEntry<"blog"> =>
  ({
    id: "2024-01-01-test-post.md",
    collection: "blog",
    body,
    data: {
      title: "Test Post",
      date: new Date("2024-01-01"),
    },
  }) as CollectionEntry<"blog">;

describe("processPostExcerpt", () => {
  it("extracts excerpt before <!--more--> tag", async () => {
    const post = mockPost(
      "This is the excerpt.<!--more-->This is more content.",
    );
    const result = await processPostExcerpt(post);

    expect(result.excerpt).toBe("This is the excerpt.");
    expect(result.hasMore).toBe(true);
    expect(result.excerptHtml).toContain("<p>This is the excerpt.</p>");
  });

  it("handles posts without <!--more--> tag", async () => {
    const post = mockPost("This is the full content.");
    const result = await processPostExcerpt(post);

    expect(result.excerpt).toBe("");
    expect(result.excerptHtml).toBe("");
    expect(result.hasMore).toBe(false);
  });

  it("handles empty body", async () => {
    const post = mockPost("");
    const result = await processPostExcerpt(post);

    expect(result.excerpt).toBe("");
    expect(result.excerptHtml).toBe("");
    expect(result.hasMore).toBe(false);
  });

  it("renders markdown in excerpt to HTML", async () => {
    const post = mockPost("**Bold text** and *italic*.<!--more-->");
    const result = await processPostExcerpt(post);

    expect(result.excerptHtml).toContain("<strong>Bold text</strong>");
    expect(result.excerptHtml).toContain("<em>italic</em>");
  });

  it("preserves original post properties", async () => {
    const post = mockPost("Excerpt<!--more-->More");
    const result = await processPostExcerpt(post);

    expect(result.id).toBe(post.id);
    expect(result.collection).toBe(post.collection);
    expect(result.data.title).toBe(post.data.title);
  });
});

describe("processPostsExcerpts", () => {
  it("processes multiple posts", async () => {
    const posts = [
      mockPost("First excerpt<!--more-->"),
      mockPost("Second excerpt<!--more-->"),
      mockPost("No excerpt"),
    ];

    const results = await processPostsExcerpts(posts);

    expect(results).toHaveLength(3);
    expect(results[0].excerpt).toBe("First excerpt");
    expect(results[1].excerpt).toBe("Second excerpt");
    expect(results[2].excerpt).toBe("");
  });

  it("handles empty array", async () => {
    const results = await processPostsExcerpts([]);
    expect(results).toEqual([]);
  });
});
