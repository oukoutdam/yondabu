function KakuteiButton({ handleClick, disabled, voteSubmitted }) {
  return (
    <button
      style={{ borderRadius: "100px", width: "4rem", height: "4rem" }}
      onClick={handleClick}
      disabled={disabled}
    >
      {voteSubmitted ? "完了" : "確定"}
    </button>
  );
}

export default KakuteiButton;
