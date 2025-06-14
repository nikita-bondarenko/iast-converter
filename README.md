# IAST → Russian Diacritic Converter

TypeScript-powered command-line utility for macOS (and other platforms) that converts Sanskrit text written in IAST into Russian diacritic transliteration.

## 📦 Installation

```bash
# 1. Clone this repository and install dependencies
npm install

# 2. Build TypeScript → JavaScript
npm run build

# 3. Link the CLI locally (optional)
npm link
```

After linking you will have a global command `iast2rus` available.

## 🚀 Usage

```
$ iast2rus "Śrī Bhagavad-gītā"
Шри Бхагавад-гита̄
```

### Convert a whole file and save the result

```bash
$ iast2rus ./gita-iast.txt -o gita-ru.txt
```

If no argument is provided, the program reads from **stdin**:

```bash
echo "tattvaṃ" | iast2rus
таттва̣м
```

## API

The conversion function can be imported in your own TypeScript project:

```ts
import { convertIastToRus } from "iast-to-rus";

console.log(convertIastToRus("mokṣa")); // муш̣а
```

## Packaging into a macOS `.app`

If you want a graphical desktop application, you can wrap the same converter
in [Electron](https://www.electronjs.org/) or turn the CLI into a standalone
binary using [pkg](https://github.com/vercel/pkg):

```bash
npm install --save-dev pkg
pkg . --targets node16-macos-arm64 --output iast2rus.app
```

Feel free to open pull-requests extending the mapping table, improving the
rules, or adding a GUI.

## 🖥️ Графический интерфейс (Electron)

```bash
npm run electron   # запустит окно с полем ввода/вывода
```

В окне:
1. Введите или вставьте текст на IAST
2. Нажмите «Конвертировать» – результат появится в нижнем блоке
3. Кнопка «Скопировать результат» отправит конвертированный текст в буфер обмена

Собрать самостоятельное `.app` можно например через electron-builder или `npm i -D @electron/packager`. 