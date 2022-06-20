import * as TestModule from "./map";
import * as blocks from "./blocks";

describe("map、blockテスト", () => {
  // const rst = TestModule.putBlock(m, b);
  test("一番上にブロックを配置する", () => {
    let nmap = TestModule.defaultGenerateMap();
    const resp = TestModule.putBlock(nmap, blocks.BLOCKS[1]);
    nmap = resp.map;
    expect(nmap.map((x) => x.slice(3, 7)).slice(0, 4)).toEqual(
      expect.arrayContaining(blocks.BLOCKS[1])
    );
  });
  test("配置したブロックを一つ下に落とす", () => {});
  test("ブロックをマップ上で回転させる", () => {});
});
