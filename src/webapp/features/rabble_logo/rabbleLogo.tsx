import React from 'react';
import { useEffect } from "react";
import styles from './rabbleLogo.module.css';

const RabbleLogo = () => {
  // need a useEffect Hook here. makes cleanup of intro component much easier.
  useEffect(() => {
    const disappear = setTimeout(() => {
      let logoContainer = document.getElementById("disappear");
      if (logoContainer) logoContainer.style.display = "none";

      // thanks to the way react renames component classnames, I can't do this method.
    }, 7000);
    return () => {
      clearTimeout(disappear);
    }
  }, [])

    return (
      <>
    <div className={styles.rabbleLogo__container} id={"disappear"}>
      <div className={styles.flex}>
        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              P
              <sub>3</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              Q
              <sub>10</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              F
              <sub>4</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              N
              <sub>1</sub>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              R
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}>
            <span>
              W
              <sub>4</sub>
            </span>
          </div>
        </div>
        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              A
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              V
              <sub>4</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              G
              <sub>2</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              A
              <sub>1</sub>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              A
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}></div>
        </div>
        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              C
              <sub>3</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              I
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              Z
              <sub>10</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              E
              <sub>1</sub>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              B
              <sub>3</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}>
            <span>
              O
              <sub>1</sub>
            </span>
          </div>
        </div>
        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              H
              <sub>2</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              A
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              C
              <sub>3</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              O
              <sub>1</sub>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              B
              <sub>3</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}>
            <span>
              S
              <sub>1</sub>
            </span>
          </div>
        </div>
        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              O
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              X
              <sub>10</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              D
              <sub>2</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              K
              <sub>5</sub>
            </span>
          </div>
    
          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              L
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}>
            <span>
              S
              <sub>1</sub>
            </span>
          </div>
        </div>

        <div className={styles.cube}>
          <div className={`${styles.wall} ${styles.front}`}>
            <span>
              L
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.back}`}>
            <span>
              T
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.left}`}>
            <span>
              U
              <sub>1</sub>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.right}`}>
            <span>
              L
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.top}`}>
            <span>
              E
              <sub>1</sub>
            </span>
          </div>
          <div className={`${styles.wall} ${styles.bottom}`}>
            <span>
              M
              <sub>3</sub>
            </span>
          </div>
        </div>
      </div>
    </div> 
    </>
    )
}

export default RabbleLogo;