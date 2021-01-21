import React from "react";
import { useEffect, useRef } from "react";
import styles from "./rabbleLogo.module.css";
import LogoCube from "./logoCube";

const RabbleLogo = () => {
  const containerRef = useRef<HTMLInputElement>(null);

  // this just display:none's the container after a countdown to diminish
  // the chance of weird interactions with it hiding in the z-index.
  useEffect(() => {
    const disappear = setTimeout(() => {
      const containerStyle = containerRef?.current?.style;
      if (containerStyle) {
        containerStyle.display = "none";
      }
    }, 6500);
    return () => {
      clearTimeout(disappear);
    };
  }, []);

  return (
    <>
      <div className={styles.rabbleLogo__container} ref={containerRef}>
        <div className={styles.flex}>
          <LogoCube
            front={"P"}
            back={"Q"}
            left={"F"}
            right={"N"}
            top={"R"}
            bottom={"W"}
          />
          <LogoCube
            front={"A"}
            back={"V"}
            left={"G"}
            right={"A"}
            top={"A"}
            bottom={" "}
          />
          <LogoCube
            front={"C"}
            back={"I"}
            left={"Z"}
            right={"E"}
            top={"B"}
            bottom={"O"}
          />
          <LogoCube
            front={"H"}
            back={"A"}
            left={"C"}
            right={"O"}
            top={"B"}
            bottom={"S"}
          />
          <LogoCube
            front={"O"}
            back={"X"}
            left={"D"}
            right={"K"}
            top={"L"}
            bottom={"S"}
          />
          <LogoCube
            front={"L"}
            back={"T"}
            left={"U"}
            right={"L"}
            top={"E"}
            bottom={"M"}
          />
        </div>
      </div>
    </>
  );
};

export default RabbleLogo;
