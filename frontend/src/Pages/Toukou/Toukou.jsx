import { useState } from "react";
import styles from "./Toukou.module.css";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

function Toukou() {
  const [whoData, setWhoData] = useState("");
  const [whenData, setWhenData] = useState("");
  const [whereData, setWhereData] = useState("");
  const [whatData, setWhatData] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    // const formData = {
    //   who: whoData,
    //   when: whenData,
    //   where: whereData,
    //   what: whatData,
    // };
    const formData = [whenData, whereData, whoData, whatData];
    const sendingData = {
      values: formData,
      userId: "user123",
    };

    try {
      const response = await fetch(`${backend_url}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendingData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Reset form fields after submission
      setWhoData("");
      setWhenData("");
      setWhereData("");
      setWhatData("");
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.forminputcontainer}>
          <div className={styles.forminputrow}>
            <label htmlFor="who">誰：</label>
            <input
              type="text"
              id="who"
              name="who"
              value={whoData}
              onChange={(e) => setWhoData(e.target.value)}
              required
            />
            <label>が</label>
          </div>
          <div className={styles.forminputrow}>
            <label htmlFor="when">いつ：</label>
            <input
              type="text"
              id="when"
              name="when"
              value={whenData}
              onChange={(e) => setWhenData(e.target.value)}
              required
            />
            <label>に</label>
          </div>
          <div className={styles.forminputrow}>
            <label htmlFor="where">どこ：</label>
            <input
              type="text"
              id="where"
              name="where"
              value={whereData}
              onChange={(e) => setWhereData(e.target.value)}
              required
            />
            <label>で</label>
          </div>
          <div className={styles.forminputrow}>
            <label htmlFor="what">なにを：</label>
            <input
              type="text"
              id="what"
              name="what"
              value={whatData}
              onChange={(e) => setWhatData(e.target.value)}
              required
            />
            <label>（した、する）</label>
          </div>
        </div>

        <button type="submit" className={styles.button}>
          投稿
        </button>
      </form>
    </div>
  );
}

export default Toukou;
