import './App.css'
import { useEffect, useState, useCallback } from 'react'

const API_URL = "http://localhost:8000"

function App() {
  const [numberData, setNumberData] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const fetchNumber = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/number`);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setNumberData(data);

    } catch (error) {
      console.error('Error fetching number:', error);
      setNumberData({error: "Network error"});
    }
  }, [])

  useEffect(() => {
    fetchNumber();
  }, [fetchNumber])

  function renderNumberStatus() {
    if (numberData?.error) {
      return <p>Number is not set yet</p>;
    }

    if (numberData) {
      if (numberData.number === null){
        return <p>Number is not set yet</p>;
      }

      return <p>Current number: {numberData.number}</p>
    }
    return null;
  }

  async function handleSubmit(event){
    event.preventDefault();

    if (!inputValue) {
      alert("Please enter a number");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: parseInt(inputValue, 10) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Failed to save number"}`);
        return;
      }

      setInputValue("");
      fetchNumber(); // Refresh the number after saving
    } catch (error) {
      console.error('Error saving number:', error);
      alert("Network error while saving number");
    }
  }

  return (
    <>
      <div>
        {renderNumberStatus()}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="number-input">Set a new number</label>
          <input 
            id="number-input"
            name='number-input'
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button type="submit">Save Number</button>
      </form>
    </>
  )
}

export default App
