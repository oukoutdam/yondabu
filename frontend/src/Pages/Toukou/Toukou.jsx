import { useState } from "react";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

function Toukou() {
  const [whoData, setWhoData] = useState("");
  const [whenData, setWhenData] = useState("");
  const [whereData, setWhereData] = useState("");
  const [whatData, setWhatData] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      who: whoData,
      when: whenData,
      where: whereData,
      what: whatData,
    };

    try {
      const response = await fetch(`${backend_url}/toukou`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
    <form onSubmit={handleSubmit}>
      <div>
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
      <div>
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
      <div>
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
      <div>
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

      <button type="submit">投稿</button>
    </form>
  );
}

export default Toukou;
