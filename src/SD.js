import React, { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { set, get } from "idb-keyval";

const SD = () => {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setIsLoading(true);
    setError("");
    setImageUrl("");

    const payload = {
      prompt: prompt,
      output_format: "webp",
    };

    try {
      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
        axios.toFormData(payload, new FormData()),
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "image/*",
          },
        },
      );
      const blob = new Blob([response.data], { type: "image/webp" });
      await set(blob, "image");
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(
        "Error generating image. Please check your API key and try again.",
      );
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1>Stability AI Image Generator</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button
        onClick={generateImage}
        disabled={isLoading || !apiKey || !prompt}
      >
        {isLoading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
      )}
    </div>
  );
};

export default SD;
