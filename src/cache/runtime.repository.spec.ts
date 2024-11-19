import { secDiff } from "./runtime.repository";

describe("RuntimeRepository", () => {
  it("secDiff", async () => {
    const d1 = new Date();
    const d2 = new Date();

    d1.setTime(d1.getTime() - 1000 * 5);

    expect(secDiff(d1, d2)).toEqual(5);
  });
});
