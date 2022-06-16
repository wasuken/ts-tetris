import * as TestModule from "./blocks";
describe("rotate test", () => {
  test("rotate 0 == 4", () => {
    TestModule.BLOCKS.slice(1).forEach((b) => {
      const resp = TestModule.rightRotate(b, 4 as TestModule.Rotate);
      expect(resp).toEqual(expect.arrayContaining(b));
    });
  });
  test("rotate right 1", () => {
    const resp_2 = TestModule.rightRotate(
      TestModule.BLOCKS[2],
      1 as TestModule.Rotate
    );
    expect(resp_2).toEqual(
      expect.arrayContaining([
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ])
    );
  });
  test("rotate right four line 1", () => {
    const resp = TestModule.rightRotate(
      TestModule.BLOCKS[0],
      1 as TestModule.Rotate
    );
    expect(resp).toEqual(
      expect.arrayContaining([
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ])
    );
  });
  test("rotate right four line 2", () => {
    const resp = TestModule.rightRotate(
      TestModule.BLOCKS[0],
      2 as TestModule.Rotate
    );
    expect(resp).toEqual(
      expect.arrayContaining([
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
    );
  });
  test("rotate right 2", () => {
    const resp_2 = TestModule.rightRotate(
      TestModule.BLOCKS[2],
      2 as TestModule.Rotate
    );
    expect(resp_2).toEqual(
      expect.arrayContaining([
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ])
    );
  });
  test("rotate right 3", () => {
    const resp_2 = TestModule.rightRotate(
      TestModule.BLOCKS[2],
      3 as TestModule.Rotate
    );
    expect(resp_2).toEqual(
      expect.arrayContaining([
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
      ])
    );
  });
});
