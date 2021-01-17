import React from "react";
import styles from "./rabbleLogo.module.css";
import LogoCubeWall from "./logoCubeWall";

interface LogoCubeProps {
    front: string
    back: string
    left: string
    right: string
    top: string
    bottom: string
  }
  
  const LogoCube = ({
      front,
      back,
      left,
      right,
      top,
      bottom
    }: LogoCubeProps) => {
  
    return (
      <div className={styles.cube}>
        <LogoCubeWall whichFace={"front"} letter={front}/>
        <LogoCubeWall whichFace={"back"} letter={back}/>
        <LogoCubeWall whichFace={"left"} letter={left}/>
        <LogoCubeWall whichFace={"right"} letter={right}/>
        <LogoCubeWall whichFace={"top"} letter={top}/>
        <LogoCubeWall whichFace={"bottom"} letter={bottom}/>
      </div>
    )
  }

  export default LogoCube;
  