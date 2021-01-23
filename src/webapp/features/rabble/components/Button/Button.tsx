import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  textColor?: string;
  onClick: () => void;
  content: string;
  children?: JSX.Element;
}

const Button = ({ onClick, content, children, textColor }: ButtonProps) => {
  return (
    <button className={styles.Button} onClick={onClick}>
      {!!children && children}
      {!!textColor ? (
        <span style={{ color: textColor }}>{content}</span>
      ) : (
        <span style={{ color: "inherit" }}>{content}</span>
      )}
    </button>
  );
};

export default Button;
