import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CollectionEntry } from "astro:content";

// Mock module implementations
const mockGetCollection = vi.fn();
const mockRss = vi.fn((config) => config);
const mockProcessPostsExcerpts = vi.fn();
const mockGetPostUrl = vi.fn();

vi.mock("astro:content", () => ({
  getCollection: mockGetCollection,
}));

vi.mock("@astrojs/rss", () => ({
  default: mockRss,
}));

vi.mock("../consts", () => ({
  SITE_TITLE: "Test Site",
  SITE_DESCRIPTION: "Test Description",
}));

vi.mock("../utils/excerpts", () => ({
  processPostsExcerpts: mockProcessPostsExcerpts,
}));

vi.mock("../utils/slugs", () => ({
  getPostUrl: mockGetPostUrl,
}));

// Dynamic import of the actual module
const getFeedModule = async () => {
  return await import("./feed.xml.js");
};

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

describe("feed.xml GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations
    mockProcessPostsExcerpts.mockImplementation((posts) =>
      Promise.resolve(
        posts.map((post: CollectionEntry<"blog">) => ({
          ...post,
          excerpt: "Test excerpt",
          excerptHtml: "<p>Test excerpt HTML</p>",
          hasMore: true,
        })),
      ),
    );

    mockGetPostUrl.mockImplementation(
      (postId: string) =>
        `/blog/${postId.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx?$/, "")}`,
    );

    mockRss.mockImplementation((config) => config);
  });

  it("sorts posts by date (most recent first)", async () => {
    const posts = [
      mockPost("2024-01-01-old-post.md", "Old Post", "2024-01-01"),
      mockPost("2024-03-01-newest-post.md", "Newest Post", "2024-03-01"),
      mockPost("2024-02-01-middle-post.md", "Middle Post", "2024-02-01"),
    ];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    await GET(context);

    expect(mockProcessPostsExcerpts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({ title: "Newest Post" }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ title: "Middle Post" }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({ title: "Old Post" }),
        }),
      ]),
    );
  });

  it("limits to 10 most recent posts", async () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
      mockPost(
        `2024-01-${String(i + 1).padStart(2, "0")}-post.md`,
        `Post ${i + 1}`,
        `2024-01-${String(i + 1).padStart(2, "0")}`,
      ),
    );

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    await GET(context);

    const sortedPosts = mockProcessPostsExcerpts.mock.calls[0][0];
    expect(sortedPosts).toHaveLength(10);
  });

  it("includes excerpt HTML in content field", async () => {
    const posts = [mockPost("2024-01-01-test-post.md", "Test Post", "2024-01-01")];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    const result = await GET(context);

    expect(result.items[0].content).toBe("<p>Test excerpt HTML</p>");
  });

  it("uses getPostUrl utility for link generation", async () => {
    const posts = [mockPost("2024-01-01-test-post.md", "Test Post", "2024-01-01")];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    await GET(context);

    expect(mockGetPostUrl).toHaveBeenCalledWith("2024-01-01-test-post.md");
  });

  it("generates RSS feed with correct structure", async () => {
    const posts = [
      mockPost("2024-01-15-first-post.md", "First Post", "2024-01-15"),
      mockPost("2024-01-10-second-post.md", "Second Post", "2024-01-10"),
    ];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    const result = await GET(context);

    expect(mockRss).toHaveBeenCalledWith({
      title: "Test Site",
      description: "Test Description",
      site: "https://example.com",
      items: expect.arrayContaining([
        expect.objectContaining({
          title: "First Post",
          pubDate: new Date("2024-01-15"),
          link: expect.stringContaining("/blog/first-post"),
          content: "<p>Test excerpt HTML</p>",
        }),
        expect.objectContaining({
          title: "Second Post",
          pubDate: new Date("2024-01-10"),
          link: expect.stringContaining("/blog/second-post"),
          content: "<p>Test excerpt HTML</p>",
        }),
      ]),
    });
  });

  it("handles empty posts collection", async () => {
    mockGetCollection.mockResolvedValue([]);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    const result = await GET(context);

    expect(result.items).toEqual([]);
  });

  it("processes excerpts for all posts", async () => {
    const posts = [
      mockPost("2024-01-01-post1.md", "Post 1", "2024-01-01"),
      mockPost("2024-01-02-post2.md", "Post 2", "2024-01-02"),
      mockPost("2024-01-03-post3.md", "Post 3", "2024-01-03"),
    ];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    await GET(context);

    expect(mockProcessPostsExcerpts).toHaveBeenCalledTimes(1);
    expect(mockProcessPostsExcerpts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "2024-01-03-post3.md" }),
        expect.objectContaining({ id: "2024-01-02-post2.md" }),
        expect.objectContaining({ id: "2024-01-01-post1.md" }),
      ]),
    );
  });

  it("sets pubDate from post data date", async () => {
    const testDate = new Date("2024-06-15T00:00:00Z");
    const posts = [mockPost("2024-06-15-dated-post.md", "Dated Post", "2024-06-15")];

    mockGetCollection.mockResolvedValue(posts);

    const { GET } = await getFeedModule();
    const context = { site: "https://example.com" };
    const result = await GET(context);

    expect(result.items[0].pubDate).toEqual(testDate);
  });
});
