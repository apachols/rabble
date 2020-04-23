import React from "react";
import styles from "./Modal.module.css";

type Props = {
  showModal: boolean;
  toggle?: () => void;
  children: any;
};

const Modal = (props: Props) => {
  const showModalStyle = { display: props.showModal ? undefined : "none" };
  const toggle = props.toggle;
  return (
    <div className={styles.Modal} style={showModalStyle}>
      {toggle && <button onClick={(ev) => toggle()}>X</button>}
      {props.children}
    </div>
  );
};

export default Modal;
