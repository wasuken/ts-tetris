export type PutMapResponse = {
  map: number[][];
  points: number[][];
  error: boolean;
  msg: string | null;
};
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
  // 範囲外チェック
  const ff = (v: number, high: number) => v < 0 || v >= high;
  // 一つでも範囲外があればエラー判定
  const exists = movedPoints.find(
    (p) => ff(p[0], map.length) || ff(p[1], map[0].length)
  );
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

export function blockMoveLeft(
  map: number[][],
  points: number[][]
): PutMapResponse {
  return moveBlock(map, points, [0, -1]);
}
export function blockMoveRight(
  map: number[][],
  points: number[][]
): PutMapResponse {
  return moveBlock(map, points, [0, 1]);
}

// 移動ブロックが一番下まで落下したかどうか
export function isFallComplete(map: number[][], points: number[][]): boolean {
  // pointsの各pointの下にブロックがあるか、また一番したかどうか判定
  const ff = (v: number, high: number) => v < 0 || v >= high;
  return !!points.find((p) => {
    const [a, b] = p;
    return (ff(a, map.length) || ff(b, map[0].length)) && map[a][b] > 0;
  });
}

// mapを生成
export function generateMap(height: number, width: number): number[][] {
  return [...Array(height)].map((_) => [...Array(width)].map((_) => 0));
}
export function defaultGenerateMap(): number[][] {
  return generateMap(20, 10);
}
