import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const cachedAPIKey = sessionStorage.getItem("apiKey");
  const [apiKey, setApiKey] = useState(cachedAPIKey || "");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const callAPI = async () => {
    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );
      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => {
          const key = e.target.value;
          sessionStorage.setItem("apiKey", key);
          setApiKey(key);
        }}
      />
      <textarea
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={callAPI}>Get Response</button>
      <p>{response}</p>
    </div>
  );
};

export default ChatGPT;
