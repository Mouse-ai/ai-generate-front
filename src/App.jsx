import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState(''); // Тема, введённая пользователем
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Пожалуйста, введите тему');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении ответа');
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🚀 Генератор идей</h1>
        <div className="input-group">
          <label htmlFor="topic">Тема</label>
          <textarea
            id="topic"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: идеи для поста в блоге о технологиях"
            rows={3}
          />
        </div>
        <div className="output">
          {loading && (
            <div className="loader">
              <div className="spinner"></div>
              <span>Генерация...</span>
            </div>
          )}
          {error && <div className="error">❌ {error}</div>}
          {!loading && !error && generatedText && (
            <p>{generatedText}</p>
          )}
          {!loading && !error && !generatedText && (
            <p className="placeholder">✨ Нажмите кнопку, чтобы сгенерировать идею</p>
          )}
        </div>
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Генерация...' : 'Сгенерировать идею'}
        </button>
      </div>
    </div>
  );
}

export default App;