import { leftRotate, rightRotate, Rotate } from "./blocks";

export const TetrisErrorType = {
  RANGE: "range",
  ALREADY_BLOCK: "alreadyBlock",
} as const;
type TetrisErrorType = typeof TetrisErrorType[keyof typeof TetrisErrorType];

export type PutMapResponse = {
  map: number[][];
  points: number[][];
  error: TetrisErrorType | null;
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
  return { map: nmap, points, error: null, msg: null };
}
export function putOneBlock(
  map: number[][],
  points: number[][],
  v: number
): number[][] {
  let nmap = [...map];
  for (let i = 0; i < points.length; i++) {
    const [a, b] = points[i];
    nmap[a][b] = v;
  }
  return nmap;
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
  let nmap: number[][] = JSON.parse(JSON.stringify(map));
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
  // 移動先にブロックがあればエラーにする
  if (exists) {
    return {
      map,
      points,
      error: TetrisErrorType.RANGE,
      msg: "範囲エラー",
    };
  }
  const v = map[points[0][0]][points[0][1]];
  points.forEach((p) => (nmap[p[0]][p[1]] = 0));
  const ex = movedPoints.find((p) => {
    const [a, b] = p;
    const v = nmap[a][b];
    return v >= 1;
  });
  if (ex) {
    return {
      map,
      points,
      error: TetrisErrorType.ALREADY_BLOCK,
      msg: "already exists.",
    };
  } else {
    movedPoints.forEach((p) => (nmap[p[0]][p[1]] = v));
    return {
      map: nmap,
      points: movedPoints,
      error: null,
      msg: null,
    };
  }
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

// map上のブロックをrot回右回転する
export function rightRotateBlock(points: number[][], rot: Rotate) {
  let blocks = [...Array(4)].map((x) => [...Array(4)].map((y) => 0));
  points.forEach((p) => {
    const [a, b] = p;
    blocks[a][b] = 1;
  });

  const rotated_points = rightRotate(blocks, rot);
}

type RotateReverseFunc = (a: number[]) => number[];
type RotateRepeatFunc = (
  f: RotateReverseFunc,
  x: number[][],
  y: number
) => number[][];

// map上のブロックの座標をmd向きにrot回左回転する
export function rotateMapBlock(points: number[][], md: number, rot: Rotate) {
  const piv: number[] = points[0];
  const ref: RotateReverseFunc = (p: number[]): number[] => [
    p[1] * -md,
    p[0] * md,
  ];
  const repf: RotateRepeatFunc = (
    f: RotateReverseFunc,
    x: number[][],
    n: number
  ) => (n > 0 ? repf(f, x.map(f), n - 1) : x);
  let ppoints: number[][] = points
    .slice(1)
    // 相対座標へ変換
    .map((p) => [p[0] - piv[0], p[1] - piv[1]]);
  return [
    piv,
    // もとの座標に復元
    ...repf(ref, ppoints, rot).map((p: number[]) => [
      p[0] + piv[0],
      p[1] + piv[1],
    ]),
  ];
}

// 行が埋まっているか確認
export function isMapLineFill(map: number[][]): boolean {
  return !!map.find(
    (l) => l.reduce((acm, x) => acm + (x >= 1 ? 1 : 0), 0) === l.length
  );
}
// 埋まっている行を削除する
export function mapFillLineRemove(map: number[][]): [number[][], number] {
  let nmap = [];
  let rmCnt = 0;
  for (let i = 0; i < map.length; i++) {
    let line: number[] = [];
    let isFill = true;
    for (let j = 0; j < map[i].length; j++) {
      isFill = isFill && map[i][j] >= 1;
      line.push(map[i][j])
    }
    if (isFill === false) {
      nmap.push(line);
    }else{
      rmCnt++;
    }
  }
  for (let i = 0; i < rmCnt; i++) {
    // 先頭に空白行を追加していく
    nmap.unshift(Array.from({ length: map[0].length}, () => 0));
  }
  return [nmap, rmCnt];
}

// mapを生成
export function generateMap(height: number, width: number): number[][] {
  return [...Array(height)].map((_) => [...Array(width)].map((_) => 0));
}
export function defaultGenerateMap(): number[][] {
  return generateMap(20, 10);
}
