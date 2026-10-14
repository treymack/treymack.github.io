import { describe, it, expect } from "vitest";
import { getSlugFromPostId, getPostUrl, assertUniqueSlugs } from "./slugs";

describe("getSlugFromPostId", () => {
  const testCases = [
    {
      input: "2015-01-01-hello-2015",
      expected: "hello-2015",
      description:
        "removes date prefix from a bare ID (the form Astro produces)",
    },
    {
      input: "hello",
      expected: "hello",
      description: "leaves an undated ID alone",
    },
    {
      input: "3-2-1-launch",
      expected: "3-2-1-launch",
      description: "leaves a numeric slug without a 4-digit year alone",
    },
    {
      input: "2017-06-30-get-adobject-pscx-memberof.md",
      expected: "get-adobject-pscx-memberof",
      description: "removes date prefix and .md extension",
    },
    {
      input: "2024-01-15-my-mdx-post.mdx",
      expected: "my-mdx-post",
      description: "removes date prefix and .mdx extension",
    },
    {
      input: "notes-2015-1-1-foo",
      expected: "notes-2015-1-1-foo",
      description: "ignores an unpadded date that is not at the start",
    },
    {
      input: "2016-02-11-powershell-automation-of-git-svn.md",
      expected: "powershell-automation-of-git-svn",
      description: "preserves hyphens in slug",
    },
    {
      input: "1995-03-27-benefits-eight-based-system.md",
      expected: "benefits-eight-based-system",
      description: "handles posts with numbers in slug",
    },
    {
      input: "2017-06-30-get-adobject-pscx-memberof/index.md",
      expected: "get-adobject-pscx-memberof",
      description: "handles folder-per-post layout with index.md",
    },
    {
      input: "2024-01-15-my-mdx-post/index.mdx",
      expected: "my-mdx-post",
      description: "handles folder-per-post layout with index.mdx",
    },
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(description, () => {
      expect(getSlugFromPostId(input)).toBe(expected);
    });
  });

  const unpaddedIds = [
    "2015-1-1-foo",
    "2015-01-1-foo",
    "2015-1-01-foo",
    "2015-1-01-foo/index.md",
  ];

  unpaddedIds.forEach((input) => {
    it(`throws for unpadded date prefix: ${input}`, () => {
      expect(() => getSlugFromPostId(input)).toThrow(input);
      expect(() => getSlugFromPostId(input)).toThrow("YYYY-MM-DD-slug");
    });
  });
});

describe("getPostUrl", () => {
  it("throws for unpadded date prefix", () => {
    expect(() => getPostUrl("2015-1-1-foo")).toThrow("2015-1-1-foo");
  });

  const testCases = [
    {
      input: "2015-01-01-hello-2015",
      expected: "/blog/hello-2015",
    },
    {
      input: "2017-06-30-get-adobject-pscx-memberof.md",
      expected: "/blog/get-adobject-pscx-memberof",
    },
    {
      input: "2024-01-15-my-mdx-post.mdx",
      expected: "/blog/my-mdx-post",
    },
    {
      input: "2015-12-25-npm-xmas.md",
      expected: "/blog/npm-xmas",
    },
    {
      input: "2017-07-25-https-binding-iis.md",
      expected: "/blog/https-binding-iis",
    },
    {
      input: "2017-07-25-https-binding-iis/index.md",
      expected: "/blog/https-binding-iis",
    },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`${input} -> ${expected}`, () => {
      expect(getPostUrl(input)).toBe(expected);
    });
  });
});

describe("assertUniqueSlugs", () => {
  it("accepts posts with distinct slugs", () => {
    expect(() =>
      assertUniqueSlugs(["2015-01-01-hello-2015", "2015-12-25-npm-xmas"]),
    ).not.toThrow();
  });

  it("accepts an empty list", () => {
    expect(() => assertUniqueSlugs([])).not.toThrow();
  });

  it("throws when two posts on different dates share a slug", () => {
    const ids = [
      "2017-07-25-https-binding-iis",
      "2018-03-02-https-binding-iis",
    ];

    expect(() => assertUniqueSlugs(ids)).toThrow(ids[0]);
    expect(() => assertUniqueSlugs(ids)).toThrow(ids[1]);
    expect(() => assertUniqueSlugs(ids)).toThrow("https-binding-iis");
  });

  it("throws when a dated post and an undated post share a slug", () => {
    const ids = ["2015-01-01-hello-2015", "hello-2015"];

    expect(() => assertUniqueSlugs(ids)).toThrow(ids[0]);
    expect(() => assertUniqueSlugs(ids)).toThrow('"hello-2015" both');
  });

  it("throws for a post with an unpadded date prefix", () => {
    expect(() =>
      assertUniqueSlugs(["2015-01-01-hello-2015", "2015-1-1-foo"]),
    ).toThrow("unpadded date prefix");
  });
});
