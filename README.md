# ChinaL — HSK 3.0 Vocabulary Studio (Levels 1–6)

A focused web app for learning **HSK 3.0 vocabulary (Elementary Levels 1–3 & Intermediate Levels 4–6)** through:

- **Short & Real Conversations:** Practical everyday dialogues (ordering milk tea, taking the subway, hiking plans, overtime snacks, apartment hunting, work-life balance) with Mandarin TTS playback, speed control, toggleable Pinyin/English, and **Roleplay Mode**.
- **Cartoons & Short Tales:** 4-panel illustrated comic strips (HSK 1–3) and graded Chinese tales (HSK 4–6) with cultural notes and quick comprehension checks.
- **Tap-to-Define → SRS Flashcards:** Tap any underlined word in a conversation or story to inspect its tone-colored pinyin, meaning, and usage tip, save it to your **Saved from Reading** deck, and review with spaced repetition (`Again / Hard / Good / Easy`).

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## GitHub Pages Deployment

A GitHub Actions workflow is included in `.github/workflows/deploy.yml`. To publish live:
1. Open your repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Every push to `main` will automatically build and deploy to `https://oporlet15-cellular.github.io/ChinaL/`.
