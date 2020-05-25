import React, { useRef } from "react";
import styles from "./InviteLink.module.css";

type InviteLinkProps = {
  gameID: string | undefined;
};

const InviteLink = (props: InviteLinkProps) => {
  const { gameID } = props;
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <>
      <input
        readOnly
        ref={inputRef}
        className={styles.clipboardInput}
        value={`${window.location.origin}/join/${gameID}`}
      />
      <button
        onClick={(event) => {
          const theInput = inputRef.current as HTMLInputElement;
          if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange();
            range.selectNodeContents(theInput);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            theInput.setSelectionRange(0, 999999);
          } else {
            theInput.select();
          }
          document.execCommand("copy");
          theInput.blur();
        }}
      >
        <strong>Invite a friend! (Click to copy) </strong>
      </button>
    </>
  );
};

export default InviteLink;
