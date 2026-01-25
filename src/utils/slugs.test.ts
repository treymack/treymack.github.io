import { describe, it, expect } from "vitest";
import { getSlugFromPostId, getPostUrl } from "./slugs";

describe("getSlugFromPostId", () => {
  const testCases = [
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
      input: "2015-01-01-hello-2015.md",
      expected: "hello-2015",
      description: "handles single-digit months and days",
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
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(description, () => {
      expect(getSlugFromPostId(input)).toBe(expected);
    });
  });
});

describe("getPostUrl", () => {
  const testCases = [
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
  ];

  testCases.forEach(({ input, expected }) => {
    it(`${input} -> ${expected}`, () => {
      expect(getPostUrl(input)).toBe(expected);
    });
  });
});
