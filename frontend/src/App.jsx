import { useState } from "react";
import Result from "./Components/Result";
import KakuteiButton from "./Components/KakuteiButton";
import Button from "./Components/RandomButton";
import RankingTable from "./Components/RankingTable";
import Toukou from "./Components/Toukou";
import { BACKEND_URL } from "./config";
import "./App.css";

function App() {
  const [generatedSentence, setGeneratedSentence] = useState("");
  const [sentenceId, setSentenceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  function createSentence(data) {
    const [when, where, who, what] = data.values;
    return `${when}${where}${who}${what}`;
  }

  function resetState() {
    setIsSubmitting(false);
    setVoteSubmitted(false);
  }

  async function fetchGeneratedSentence() {
    try {
      const response = await fetch(`${BACKEND_URL}/random-sentence`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setGeneratedSentence(createSentence(data));
      setSentenceId(data.id);
      resetState();
    } catch (error) {
      console.error("Error fetching random sentence:", error);
      setGeneratedSentence("エラーが発生しました。");
    }
  }

  async function handleKakutei() {
    if (isSubmitting) return;

    if (!sentenceId) {
      console.error("No sentence ID available for submission.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/publish/${sentenceId}`, {
        method: "POST",
        // No 'Content-Type' or 'body' is needed
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Sentence published successfully:", result);
      setVoteSubmitted(true);
    } catch (error) {
      console.error("Error publishing sentence:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="contentGroup">
          <Result text={generatedSentence} />
          <div
            style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
          >
            <KakuteiButton
              handleClick={handleKakutei}
              disabled={isSubmitting}
              voteSubmitted={voteSubmitted}
            />
            <Button onButtonClick={fetchGeneratedSentence} />
          </div>
        </div>
        <Toukou />
        <RankingTable />
      </div>
    </>
  );
}

export default App;
