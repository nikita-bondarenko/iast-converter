import React, { useState } from 'react';
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
  const output = convertIastToRus(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="container ">
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

export default App; 