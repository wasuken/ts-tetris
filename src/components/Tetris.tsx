import React, { useEffect, useState } from "react";
import { TetrisProps } from "../props";
import { BLOCKS, rightRotate, leftRotate } from "../blocks";
import {
  blockMoveLeft,
  blockMoveRight,
  putBlock,
  putOneBlock,
  blockFall,
  generateMap,
  isFallComplete,
  rotateMapBlock,
  TetrisErrorType,
  mapFillLineRemove,
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
  const [sec, setSec] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);
  const w = props.blockWidth * props.edge;
  const handleRotateBtn = (rot: number) => {
    const npoints = rotateMapBlock(movingBlockPoints, rot, 1);
    // 範囲外の場合、回転を中止するか
    const check = npoints.find(
      (p) => p[0] < 0 || p[0] > 20 || p[1] < 0 || p[1] > 10
    );
    if (check) return;
    // 位置の補正をする
    let nmap = [...tmap];
    nmap = putOneBlock(nmap, movingBlockPoints, 0);
    // mapからpointsを削除
    nmap = putOneBlock(nmap, npoints, 1);
    // 対応するミノを回転して配置
    setMovingBlockPoints(npoints);
    setTmap(nmap);
  };
  const handleLeftRotateBtn = () => {
    handleRotateBtn(-1);
  };
  const handleRightRotateBtn = () => {
    handleRotateBtn(1);
  };
  const fallDown = () => {
    const resp = blockFall(tmap, movingBlockPoints);
    // なんらかの理由で落とせなかった
    if (!resp.error) {
      setTmap(resp.map);
      setMovingBlockPoints(resp.points);
    }
  };
  const handleFallDownBtn = () => {
    fallDown();
  };
  const handleMoveLeftBtn = () => {
    const resp = blockMoveLeft(tmap, movingBlockPoints);
    if (resp.error) {
      console.log(resp.msg);
      return;
    }
    setMovingBlockPoints(resp.points);
    setTmap(resp.map);
  };
  const handleMoveRightBtn = () => {
    const resp = blockMoveRight(tmap, movingBlockPoints);
    if (resp.error) {
      console.log(resp.msg);
      return;
    }
    setMovingBlockPoints(resp.points);
    setTmap(resp.map);
  };

  useEffect(() => {
    const resp = putBlock(defaultTmap, BLOCKS[0]);
    setTmap(resp.map);
    setMovingBlockPoints(resp.points);
    setTimeout(() => setSec(sec + 1), 300);
  }, []);
  useEffect(() => {
    if (movingBlockPoints.length < 1) return;
    // 落下
    const resp = blockFall(tmap, movingBlockPoints);
    let lmap = tmap;
    let lpoints = movingBlockPoints;
    if (resp.error) {
      const mps = movingBlockPoints.filter((p) => p[0] === 4).map((p) => p[1]);
      const isEndLine =
        tmap[4].filter((x, i) => mps.includes(i) && x >= 1).length > 0;
      let tgPoints = [];
      if (isEndLine) {
        console.log(tmap);
        alert("finish.");
        setFinish(true);
        return;
      }
      const ri = Math.floor(Math.random() * BLOCKS.length);
      const nresp = putBlock(resp.map, BLOCKS[ri]);
      lmap = JSON.parse(JSON.stringify(nresp.map));
      lpoints = JSON.parse(JSON.stringify(nresp.points));
    } else {
      lmap = JSON.parse(JSON.stringify(resp.map));
      lpoints = JSON.parse(JSON.stringify(resp.points));
    }
    // 横削除処理
    // movingPointsがずれる
    const [nmap, rmCnt] = mapFillLineRemove(tmap);
    const nmapjs = JSON.stringify(nmap);
    const tmapjs = JSON.stringify(tmap);
    if (tmapjs !== nmapjs) {
      lmap = nmap;
      // cnt分Yをずらす
      // これはTスピンみたいなことされたら多分しぬ
      const npoints = lmap.map((p) => [p[0] + rmCnt, p[1]]);
      setMovingBlockPoints(npoints);
    }
    setTmap(lmap);
    setMovingBlockPoints(lpoints);
    setTimeout(() => setSec(sec + 1), 1000);
  }, [sec]);
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
        <Button
          onClick={handleMoveLeftBtn}
          variant="outline-primary"
          disabled={finish}
        >
          {" "}
          左移動
        </Button>
        <Button
          onClick={handleFallDownBtn}
          variant="outline-primary"
          disabled={finish}
        >
          {" "}
          一つ下へ
        </Button>
        <Button
          onClick={handleMoveRightBtn}
          variant="outline-primary"
          disabled={finish}
        >
          {" "}
          右移動
        </Button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleLeftRotateBtn}
          variant="outline-primary"
          disabled={finish}
        >
          {" "}
          左回転
        </Button>
        <Button
          onClick={handleRightRotateBtn}
          variant="outline-primary"
          disabled={finish}
        >
          {" "}
          右回転
        </Button>
      </div>
    </div>
  );
}

export default Tetris;
