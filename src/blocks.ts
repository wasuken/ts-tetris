export type Rotate = 1 | 2 | 3 | 4;
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

function listFourLine(block: number[][]) {
  let lines = [];
  let rows = [...Array(block[0].length)].map((_) => true);
  for (let i = 0; i < block.length; i++) {
    let line = true;
    for (let k = 0; k < block[i].length; k++) {
      const v = block[i][k] >= 1;
      line &&= v;
      rows[k] &&= v;
    }
    lines.push(line);
  }
  return {
    lines,
    rows,
  };
}
// 4つ並びブロック判定
function isFourLine(block: number[][]) {
  const { lines, rows } = listFourLine(block);
  return [...lines, ...rows].find((ary) => ary);
}

// 4つ棒とそれ以外で処理が変わるから抽象化関数を作成
export function rightRotate(block: number[][], rot: Rotate): number[][] {
  // 長棒だけ特別処理
  if (isFourLine(block)) {
    return rightRotateFourLine(block, rot);
  } else {
    return nrightRotate(block, rot);
  }
}

export function leftRotate(block: number[][], rot: Rotate): number[][] {
  // 長棒だけ特別処理
  if (isFourLine(block)) {
    return leftRotateFourLine(block, rot);
  } else {
    return nleftRotate(block, rot);
  }
}
// blockをrot回右回転して返却する
export function nrightRotate(block: number[][], rot: Rotate): number[][] {
  // 1未満の場合、そのまま返却する
  if (rot < 1) {
    return block;
  }
  let newb: number[][] = [...Array(block.length)].map((_) =>
    [...Array(block.length)].map((_) => 0)
  );
  for (let i = 0; i < block.length; i++) {
    for (let j = 0; j < block[i].length; j++) {
      newb[j][i] = block[i][j];
    }
  }
  return nrightRotate(newb, (rot - 1) as Rotate);
}
export function nleftRotate(block: number[][], rot: Rotate): number[][] {
  return nrightRotate(block, Math.abs(rot - 4) as Rotate);
}

const FOUR_LINE_BLOCKS = [
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
];

export function rightRotateFourLine(
  block: number[][],
  rot: Rotate
): number[][] {
  let { lines, rows } = listFourLine(block);
  //  a
  // b c
  //  d
  const [a, _a, _b, c] = lines;
  const [d, _c, _d, b] = rows;
  // a -> b -> c -> d -> a で変換
  let rst = -1;
  const ary = [a, b, c, d];
  for (let i = 0; i < ary.length; i++) {
    if (ary[i]) {
      rst = i;
      break;
    }
  }
  if (rst < 0) {
    throw "not four line";
  } else {
    return FOUR_LINE_BLOCKS[(rst + rot) % FOUR_LINE_BLOCKS.length];
  }
}

export function leftRotateFourLine(block: number[][], rot: Rotate): number[][] {
  return rightRotateFourLine(block, Math.abs(rot - 4) as Rotate);
}

