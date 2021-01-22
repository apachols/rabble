import React, { useState, useRef } from "react";
// import React, { useRef } from "react";
import styles from "./InviteLink.module.css";
import Button from "./Button/Button";

type InviteLinkProps = {
  gameID: string | undefined;
};

const InviteLink = (props: InviteLinkProps) => {
  const { gameID } = props;
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const [copied, setCopied] = useState(false);

  // took event out of args, not needed here
  const handleInviteLink = () => {
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

    setCopied(true);
    const copiedTimeout = setTimeout(() => {
      return setCopied(false);
    }, 500);
    return clearTimeout(copiedTimeout);
    // TODO: ask adam:: this doesn't quite get it -> setting setCopied(false) at end of timeout doesn't rerender the button
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
        {/* <Button
          content="Invite a friend! (Click to copy)"
          onClick={handleInviteLink}
        /> */}
      </div>
    </div>
  );
};

export default InviteLink;
