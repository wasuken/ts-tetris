export type Rotate = 1 | 2 | 3 | 4;
export type PutMapResponse = {
  map: number[][];
  points: number[][];
  error: boolean;
  msg: string | null;
};
export const BLOCKS = [
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
  ],
];

// blockをrot回右回転して返却する
export function rightRotate(block: number[][], rot: Rotate): number[][] {
  // 1未満の場合、そのまま返却する
  let newb: number[][] = [...Array(block.length)].map((_) =>
    [...Array(block.length)].map((_) => 0)
  );
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      newb[j][i] = block[i][j];
    }
  }
  if (rot === 1) {
    return block;
  } else {
    return rightRotate(newb, (rot - 1) as Rotate);
  }
}
export function leftRotate(block: number[][], rot: Rotate): number[][] {
  return rightRotate(block, Math.abs(rot - 4) as Rotate);
}
// ブロック配置関数
// 配置したブロック(>1)の座標も返却
export function basePutMap(
  map: number[][],
  block: number[][],
  x: number,
  y: number
): PutMapResponse {
  let nmap: number[][] = [...map];
  let points: number[][] = [];
  for (let i = 0; i < block.length; i++) {
    for (let k = 0; k < block[i].length; k++) {
      const v = (nmap[i + y][k + x] = block[i][k]);
      if (v >= 1) points.push([i + y, k + x]);
    }
  }
  return { map: nmap, points, error: false, msg: null };
}
// ブロック配置はどうせ一箇所なので公開するのはこちらだけ
export function putBlock(map: number[][], block: number[][]): PutMapResponse {
  return basePutMap(map, block, 3, 0);
}

// TODO: 既存ブロック判定が入ってない
function moveBlock(
  map: number[][],
  points: number[][],
  direction: number[]
): PutMapResponse {
  let nmap: number[][] = [...map];
  let movedPoints: number[][] = points.map((p) => [
    p[0] + direction[0],
    p[1] + direction[1],
  ]);
  const ff = (v: number, high: number) => v <= 0 || v > high;
  const exists = movedPoints.find((p) => ff(p[0], 20) && ff(p[1], 10));
  if (exists) {
    return {
      map,
      points,
      error: true,
      msg: "範囲エラー",
    };
  }
  const v = map[points[0][0]][points[0][1]];
  points.forEach((p) => (nmap[p[0]][p[1]] = 0));
  console.log(movedPoints)
  movedPoints.forEach((p) => (nmap[p[0]][p[1]] = v));
  return {
    map: nmap,
    points: movedPoints,
    error: false,
    msg: null,
  };
}

// TODO: 最後まで手動で落とすと落ちる()
// TODO: 一番下へ到達した際に到達したとわかるようなレスポンスを返却する必要がある
export function blockFall(map: number[][], points: number[][]): PutMapResponse {
  return moveBlock(map, points, [1, 0]);
}

export function blockMoveLeft(map: number[][], points: number[][]): PutMapResponse{
  return moveBlock(map, points, [0, -1]);
}
export function blockMoveRight(map: number[][], points: number[][]): PutMapResponse{
  return moveBlock(map, points, [0, 1]);
}
