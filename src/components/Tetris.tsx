import React, { useEffect, useState } from "react";
import { TetrisProps } from "../props";
import { BLOCKS, rightRotate, leftRotate } from "../blocks";
import {
  blockMoveLeft,
  blockMoveRight,
  putBlock,
  blockFall,
  generateMap,
  isFallComplete,
} from "../map";
import { Button } from "react-bootstrap";

const colorAry = ["white", "#6899e8", "#de4568", "#69f542", "#f7df63"];

function Tetris(props: TetrisProps) {
  const defaultTmap: number[][] = generateMap(
    props.blockHeight,
    props.blockWidth
  );
  const [movingBlockPoints, setMovingBlockPoints] = useState<number[][]>([]);
  const [tmap, setTmap] = useState<number[][]>(defaultTmap);
  const w = props.blockWidth * props.edge;
  const handleLeftRotateBtn = () => {};
  const handleRightRotateBtn = () => {};
  const handleFallDownBtn = () => {
    const resp = blockFall(tmap, movingBlockPoints);
    if (resp.error) {
      alert(resp.msg);
      return;
    }
    setMovingBlockPoints(resp.points);
    setTmap(resp.map);
  };
  const handleMoveLeftBtn = () => {
    const resp = blockMoveLeft(tmap, movingBlockPoints);
    if (resp.error) {
      alert(resp.msg);
      return;
    }
    setMovingBlockPoints(resp.points);
    setTmap(resp.map);
  };
  const handleMoveRightBtn = () => {
    const resp = blockMoveRight(tmap, movingBlockPoints);
    if (resp.error) {
      alert(resp.msg);
      return;
    }
    setMovingBlockPoints(resp.points);
    setTmap(resp.map);
  };

  useEffect(() => {
    const resp = putBlock(defaultTmap, BLOCKS[0]);
    setTmap(resp.map);
    setMovingBlockPoints(resp.points);
    setInterval(() => {}, 1000);
  }, []);
  return (
    <div style={{ width: `${w}px` }}>
      {tmap.map((l, i) => (
        <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
          {l.map((n, k) => (
            <div
              key={k}
              style={{
                width: `${props.edge - 2}px`,
                height: `${props.edge - 2}px`,
                backgroundColor: colorAry[n],
                borderStyle: "solid",
                borderColor: "black",
                borderWidth: "1px",
              }}
            ></div>
          ))}
          {<div style={{ width: "100%" }}> </div>}
        </div>
      ))}
      <div
        style={{
          paddingBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleMoveLeftBtn} variant="outline-primary">
          {" "}
          左移動
        </Button>
        <Button onClick={handleFallDownBtn} variant="outline-primary">
          {" "}
          一つ下へ
        </Button>
        <Button onClick={handleMoveRightBtn} variant="outline-primary">
          {" "}
          右移動
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleLeftRotateBtn} variant="outline-primary">
          {" "}
          左回転
        </Button>
        <Button onClick={handleRightRotateBtn} variant="outline-primary">
          {" "}
          右回転
        </Button>
      </div>
    </div>
  );
}

export default Tetris;
