import React, { useState } from 'react';
import axios from 'axios';
import './tejas.css'; // Import your CSS file

const Tejas_G = () => {
  const [inputTexts, setInputTexts] = useState(Array(10).fill(''));
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateComicPanels = async () => {
    setLoading(true);
    setComicPanels([]); // Clear existing panels

    try {
      const promises = inputTexts.map(async (inputText, index) => {
        if (inputText.trim() !== '') {
          const response = await axios.post(
            'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
            { inputs: inputText },
            {
              headers: {
                Accept: 'image/png',
                Authorization: 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
                'Content-Type': 'application/json',
              },
              responseType: 'arraybuffer',
            }
          );

          const uint8Array = new Uint8Array(response.data);
          const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
          return `data:image/png;base64,${btoa(base64String)}`;
        }
        return null;
      });

      const results = await Promise.all(promises);
      setComicPanels(results.filter(result => result !== null));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputTexts = [...inputTexts];
    newInputTexts[index] = value;
    setInputTexts(newInputTexts);
  };

  return (
    <div className="full-screen-scroll">
      <div className="comic-panel-generator">
        <div className='body_background'></div>
        <h1 className='stylish-heading glass-background'>Comics Panel Generator</h1>

        <div className="input-grid">
          {inputTexts.map((text, index) => (
            <div key={index} className="input-wrapper">
              <input
                type="text"
                value={text}
                className='inputBorder glass-background'
                placeholder={`Enter your text for image ${index + 1}`}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="Tejas_butt" onClick={generateComicPanels} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Images'}
        </button>

       
        {/* Scrollable container for comic panels */}
        <div className="comic-panels-container" style={{ maxHeight: '400px' }}>
          {comicPanels.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Comic Panel ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tejas_G;
