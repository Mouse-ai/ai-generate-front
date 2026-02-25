// api/generate.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Промпт не может быть пустым' });
  }

  // Переменные окружения должны быть заданы в настройках Vercel
  const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
  const YANDEX_API_KEY = process.env.YANDEX_API_KEY;

  if (!YANDEX_FOLDER_ID || !YANDEX_API_KEY) {
    console.error('❌ Отсутствуют переменные окружения Yandex');
    return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
  }

  try {
    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: 2000
        },
        messages: [
          {
            role: 'system',
            text: 'Ты креативный ассистент, который генерирует идеи для контента на русском языке.'
          },
          {
            role: 'user',
            text: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${YANDEX_API_KEY}`
        }
      }
    );

    // Извлекаем текст ответа (структура, которую мы выяснили ранее)
    const generatedText = response.data.result.alternatives[0].message.text;
    res.json({ generatedText });

  } catch (error) {
    console.error('YandexGPT API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка генерации контента' });
  }
};