# IAST Converter - Развертывание с Tauri

## Описание

Это веб-приложение для конвертации санскрита из IAST в русскую диакритику с возможностью скачивания десктопных версий.

## Быстрый запуск

### Сборка и запуск контейнера

```bash
# Из корневой директории проекта
docker-compose up --build
```

Приложение будет доступно по адресу: http://localhost

## Структура проекта

- `web/` - React веб-приложение  
- `src-tauri/` - Конфигурация Tauri для создания десктопных приложений
- `docker/` - Конфигурационные файлы Docker
- `src/` - Основная логика конвертации

## Что происходит при сборке

1. **Tauri Build Stage**: 
   - Устанавливается Rust и Node.js
   - Собирается веб-приложение
   - Создаются mock-файлы установщиков (в текущей версии)
   - В будущем: реальная сборка для Linux, Windows, macOS

2. **Web Build Stage**:
   - Отдельная сборка веб-версии для производства

3. **Production Stage**:
   - Nginx сервер раздает веб-приложение
   - Файлы установщиков доступны в `/downloads/`

## Файлы для скачивания

После запуска контейнера доступны следующие mock-файлы:
- `iast-converter_0.1.0_amd64.deb` - для Ubuntu/Debian
- `iast-converter_0.1.0_amd64.AppImage` - универсальный Linux
- `iast-converter_0.1.0_x64_en-US.msi` - установщик Windows
- `iast-converter.exe` - исполняемый файл Windows
- `iast-converter_0.1.0_universal.dmg` - установщик macOS
- `iast-converter-x86_64-apple-darwin.tar.gz` - macOS Intel
- `iast-converter-aarch64-apple-darwin.tar.gz` - macOS Apple Silicon

## Настройка реальной сборки Tauri

Для включения реальной сборки Tauri:

1. **Замените mock файлы в Dockerfile**:
   Раскомментируйте строку в Dockerfile:
   ```dockerfile
   # RUN npm run tauri:build || echo "Tauri build failed, using mock files"
   ```

2. **Добавьте настоящие иконки**:
   Замените файлы-заглушки в `src-tauri/icons/` на настоящие иконки:
   - `32x32.png`
   - `128x128.png` 
   - `128x128@2x.png`
   - `icon.ico` (для Windows)
   - `icon.icns` (для macOS)

3. **Для кросс-компиляции** (сложно):
   - Требуется настройка OSXCross для macOS
   - MinGW для Windows
   - Дополнительные системные зависимости

## Локальная разработка

### Веб-приложение
```bash
cd app
npm install
npm run web:dev
```

### Tauri приложение (только Linux)
```bash
cd app
npm install
npm run tauri:dev
```

### Сборка Tauri приложения
```bash
cd app
npm run tauri:build
```

## Troubleshooting

### Проблемы с сборкой Tauri
- Убедитесь что установлены все системные зависимости
- Проверьте правильность путей в `tauri.conf.json`
- Для кросс-компиляции нужны дополнительые target'ы Rust

### Проблемы с иконками
- Tauri требует определенные размеры иконок
- Используйте настоящие PNG/ICO файлы вместо текстовых заглушек

### Nginx не раздает файлы
- Проверьте права доступа на файлы в `/usr/share/nginx/html/downloads/`
- Убедитесь что конфигурация nginx правильная

## Продвинутая настройка

### Добавление новых платформ
В `package.json` можно добавить дополнительные target'ы:
```json
"tauri:build:custom": "tauri build --target <target-triple>"
```

### Настройка CI/CD
Для автоматической сборки на разных платформах рекомендуется:
- GitHub Actions с matrix build
- Отдельные runner'ы для каждой ОС
- Кэширование зависимостей

## Архитектура

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Web    │    │   Tauri Desktop  │    │   Docker Build  │
│   Application  │    │   Applications   │    │     System      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌──────────────────┐
                    │  Nginx Server    │
                    │  - Web files     │
                    │  - Download API  │
                    └──────────────────┘
``` 