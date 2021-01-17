import React from "react";
import styles from "./rabbleLogo.module.css";
import { tileBagConfig } from "../../../game/tileBag";

interface LogoCubeWallProps {
  whichFace: string
  letter: string
}

const LogoCubeWall = ({whichFace, letter}: LogoCubeWallProps) => {
  const tileConfig = tileBagConfig[letter];
  return (
    <div className={`${styles.wall} ${styles[whichFace]}`}>
      {!tileConfig.blank && <span>
        {letter}<sub>{tileConfig.value}</sub>
      </span>}
    </div>
  )
}

export default LogoCubeWall