import React from "react";
import styles from "./ReusableButton.module.css";

// TODO:
// PROPS: class = string
// fx: function for onclick (function pass)
// icon: string (conditional render "")
// content: string = name
// btntype link/button:

// interface ButtonProps {
//   btnclass: string;
//   content: string;
//   isLink: boolean;
// }

// { btnclass, content, isLink }: ButtonProps

const ReusableButton = () => {
  return (
    <>
      <button className={styles.reusableButton}></button>
    </>
  );
};

export default ReusableButton;
