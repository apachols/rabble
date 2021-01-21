import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  btnclass: string;
  onClick: () => void;
  content: string;
  children: JSX.Element;
}

const Button = ({ onClick, content, children, btnclass }: ButtonProps) => {
  return (
    <>
      <button
        className={`${styles.Button} ${styles[btnclass]}`}
        onClick={onClick}
      >
        {!!children && children}
        {content}
      </button>
    </>
  );
};

export default Button;
