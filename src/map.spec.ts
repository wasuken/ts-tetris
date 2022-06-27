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
  test("配置したブロックを一つ下に落とす", () => {
    let nmap = TestModule.defaultGenerateMap();
    let resp = TestModule.putBlock(nmap, blocks.BLOCKS[1]);
    resp = TestModule.blockFall(resp.map, resp.points);
    nmap = resp.map;
    expect(nmap.map((x) => x.slice(3, 7)).slice(1, 5)).toEqual(
      expect.arrayContaining(blocks.BLOCKS[1])
    );
  });
  test("ブロックをマップ上で回転させる(障害物想定なし)", () => {
    let nmap = TestModule.defaultGenerateMap();
    let resp = TestModule.putBlock(nmap, blocks.BLOCKS[1]);
    nmap = resp.map;
    const points = resp.points;
    // console.log(points)
    const npoints = TestModule.rotateMapBlock(points, 1, 0 as TestModule.Rotate)
    // console.log(npoints)
    nmap = TestModule.putOneBlock(nmap, points, 0);
    nmap = TestModule.putOneBlock(nmap, npoints, 1);
    expect(nmap.map((x) => x.slice(3, 7)).slice(1, 5)).toEqual(
      expect.arrayContaining(blocks.BLOCKS[1])
    );
  });
});
