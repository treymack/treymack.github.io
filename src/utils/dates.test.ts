import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { formatDate } from "./dates";

// Frontmatter dates are parsed as UTC midnight, so the UTC calendar day is
// the one the author wrote. Run under zones west and east of UTC so the tests
// fail without the UTC formatting even when the machine itself is in UTC (CI).
describe.each(["America/Los_Angeles", "Asia/Tokyo", "UTC"])(
  "formatDate with machine timezone %s",
  (timeZone) => {
    const originalTimeZone = process.env.TZ;

    beforeEach(() => {
      process.env.TZ = timeZone;
    });

    afterEach(() => {
      if (originalTimeZone === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTimeZone;
      }
    });

    it("formats a UTC-midnight date as its UTC calendar day", () => {
      expect(formatDate(new Date("2015-01-01T00:00:00Z"))).toBe("Jan 1, 2015");
    });

    it("formats a late-UTC time as its UTC calendar day", () => {
      expect(formatDate(new Date("2015-01-01T23:59:59Z"))).toBe("Jan 1, 2015");
    });

    it("formats a two-digit day", () => {
      expect(formatDate(new Date("2026-02-10T00:00:00Z"))).toBe("Feb 10, 2026");
    });
  },
);
