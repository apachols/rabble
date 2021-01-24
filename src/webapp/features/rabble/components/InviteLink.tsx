import React, { useState, useRef } from "react";
import styles from "./InviteLink.module.css";
import Button from "./Button/Button";

type InviteLinkProps = {
  gameID: string | undefined;
};

const InviteLink = (props: InviteLinkProps) => {
  const { gameID } = props;
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const [copied, setCopied] = useState(false);

  const handleInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${gameID}`);
    setCopied(true);

    setTimeout(() => {
      return setCopied(false);
    }, 800);
  };

  return (
    <div className="inviteLink">
      <input
        readOnly
        ref={inputRef}
        className={styles.clipboardInput}
        value={`${window.location.origin}/join/${gameID}`}
      />
      <div className={styles.invBtnWrapper}>
        {copied ? (
          <Button content="Copied!" onClick={handleInviteLink} />
        ) : (
          <Button
            content="Invite a friend! (Click to copy)"
            onClick={handleInviteLink}
          />
        )}
      </div>
    </div>
  );
};

export default InviteLink;
