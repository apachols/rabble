import React from "react";
import styles from "./ReusableButton.module.css";

// TODO:
// PROPS: class = string
// fx: function for onclick (function pass)
// icon: string (conditional render icon in btn - maybe select path if possible? seems like importing won't work that way unless I import all the svgs to the button component and conditionally use based on string.
// content: string = actual button writing
// btntype link/button:

// interface ButtonProps {
//   clickFx: {}??
//   btnclass: string;
//   content: string;
//   isLink: boolean;
//   icon: string;
// }

// { btnclass, content, isLink }: ButtonProps

// notes: btn organization wants svgs for icons separate, keep em th

const ReusableButton = () => {
  return (
    <>
      <button className={styles.reusableButton}></button>
    </>
  );
};

export default ReusableButton;
