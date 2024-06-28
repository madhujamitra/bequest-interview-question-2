import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [history, setHistory] = useState<
    { data: string; hash: string; previousHash: string }[]
  >([]);
  const [selectedVersion, setSelectedVersion] = useState<number>(-1);

  useEffect(() => {
    getData();
    getHistory();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const getHistory = async () => {
    const response = await fetch(`${API_URL}/history`);
    const historyData = await response.json();
    setHistory(historyData);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
    await getHistory();
  };

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const { valid } = await response.json();
    if (valid) {
      setCurrentStatus("Data is valid and untampered.");
    } else {
      setCurrentStatus("Data is tampered with.");
    }
  };

  const recoverData = async () => {
    if (selectedVersion === -1) {
      setCurrentStatus("Please select a version to recover.");
      return;
    }

    const response = await fetch(`${API_URL}/recover`, {
      method: "POST",
      body: JSON.stringify({ index: selectedVersion }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const { data } = await response.json();
    setData(data);
    setCurrentStatus("Data has been recovered to the selected version.");
    await getHistory();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
      <div>{currentStatus}</div>

      {history.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div>History</div>
          <select
            style={{ fontSize: "30px" }}
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(parseInt(e.target.value))}
          >
            <option value={-1}>Select a version</option>
            {history.map((item, index) => (
              <option key={index} value={index}>
                {`Version ${index + 1}: ${item.data}`}
              </option>
            ))}
          </select>
          <button style={{ fontSize: "20px" }} onClick={recoverData}>
            Recover Data
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
