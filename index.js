
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateImage = async () => {
    setLoading(true);
    setImage(null);
    setMessage('Generating image...');

    try {
      const response = await axios.post('/api/generate', { prompt });
      setImage(response.data.imageUrl);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Error generating image');
    }

    setLoading(false);
  };

  const addToShopify = async () => {
    if (!image) return;
    setMessage('Creating product in Shopify...');

    try {
      await axios.post('/api/shopify', { imageUrl: image, prompt });
      setMessage('Product created successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error creating product');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>AI T-Shirt Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        style={{ width: '60%', padding: '10px' }}
      />
      <button onClick={generateImage} style={{ marginLeft: '10px', padding: '10px' }}>
        Generate
      </button>
      {loading && <p>{message}</p>}
      {image && (
        <div>
          <h3>Preview:</h3>
          <img src={image} alt="AI generated" style={{ maxWidth: '300px' }} />
          <br />
          <button onClick={addToShopify} style={{ marginTop: '1rem', padding: '10px' }}>
            Add to Store
          </button>
        </div>
      )}
      {!loading && message && <p>{message}</p>}
    </div>
  );
}
