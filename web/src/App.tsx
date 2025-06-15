import React, { useState, useEffect } from 'react';
import { convertIastToRus } from '../../src/converter';
import './app.css';

const examples = [
  'Śrī Bhagavad-gītā',
  'tattvaṃ',
  'mokṣa',
  'dharma',
  'saṃskṛta',
  'yoga',
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  type DownloadItem = { name: string; url: string };
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const output = convertIastToRus(input);

  useEffect(() => {
    // Получаем список доступных файлов для скачивания
    fetch('/downloads/')
      .then(response => response.text())
      .then(html => {
        // Простой парсинг HTML для извлечения ссылок на файлы
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a[href]'))
          .map(link => link.getAttribute('href'))
          .filter(href => href && !href.startsWith('..') && href !== '/')
          .map(href => href!.replace(/\/$/, ''));
        const items = links.map(name => ({ name, url: `/downloads/${name}` }));
        setDownloads(items);
      })
      .catch(() => {
        setDownloads([]);
      });

    // Дополнительно пробуем получить последние релизы GitHub
    const owner = 'nikita-bondarenko';
    const repo = 'iast-converter';
    fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (!data.assets) return;
        const ghItems: DownloadItem[] = data.assets
          .filter((a: any) => a.name.endsWith('.dmg'))
          .map((a: any) => ({ name: a.name, url: a.browser_download_url }));
        setDownloads(prev => [...prev, ...ghItems]);
      })
      .catch(() => {/*ignore*/});
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="container">
      <h1>🕉️ Конвертер IAST → русская диакритика</h1>

      <label htmlFor="input">Ввод IAST:</label>
      <textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите санскрит в IAST..."
      />

      <label htmlFor="output">Результат:</label>
      <div id="output" className="output">
        {output}
      </div>

      <button onClick={handleCopy} disabled={!output} className="copy-btn">
        Скопировать результат
      </button>

      <div className="examples">
        <h3>Примеры:</h3>
        {examples.map((ex) => (
          <div key={ex} className="example" onClick={() => setInput(ex)}>
            {ex}
          </div>
        ))}
      </div>
    </div>
  );
};

// Вспомогательные функции
const getPlatformFromFilename = (filename: string): string => {
  if (filename.includes('.deb') || filename.includes('.AppImage')) return 'Linux';
  if (filename.includes('.msi') || filename.includes('.exe')) return 'Windows';  
  if (filename.includes('.dmg') || filename.includes('apple-darwin')) {
    if (filename.includes('aarch64')) return 'macOS (Apple Silicon)';
    return 'macOS (Intel)';
  }
  return 'Другое';
};

const getIconForPlatform = (filename: string): string => {
  if (filename.includes('.deb') || filename.includes('.AppImage')) return '🐧';
  if (filename.includes('.msi') || filename.includes('.exe')) return '🪟';
  if (filename.includes('.dmg') || filename.includes('apple-darwin')) return '🍎';
  return '📦';
};

export default App; 