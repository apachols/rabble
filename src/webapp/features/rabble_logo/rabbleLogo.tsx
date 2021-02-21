import React from "react";
import { useEffect, useRef } from "react";
import styles from "./rabbleLogo.module.css";
import LogoCube from "./logoCube";

import { useAuth } from "react-use-auth";

const RabbleLogo = () => {
  const containerRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useAuth();

  // the following useEffect and onSkipBtn disp:none the animation container
  // to reduce negative interaction likelihood.
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

  if (isAuthenticated()) {
    return null;
  }

  const onSkipBtn = () => {
    const skipStyle = containerRef?.current?.style;
    if (skipStyle) {
      skipStyle.display = "none";
    }
  }

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
        <button className={styles.skipBtn} onClick={onSkipBtn}>skip ></button>
      </div>
    </>
  );
};

export default RabbleLogo;
