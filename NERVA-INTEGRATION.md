# Torah Light → NERVA Globe Integration Guide

## Phase 1: Standalone (Now)
Torah Light deploys as its own Vercel project at `torah-light.vercel.app`
The `/api/torah/today` endpoint serves normalized Hebcal + Sefaria data.

## Phase 2: Mount Under NERVA Globe
Add to NERVA Globe's `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/torah/:path*",
      "destination": "https://torah-light.vercel.app/:path*"
    },
    {
      "source": "/api/torah/:path*",
      "destination": "https://torah-light.vercel.app/api/torah/:path*"
    }
  ]
}
```

This gives you:
- `nerva-globe.vercel.app/torah` → Torah Light app
- `nerva-globe.vercel.app/api/torah/today` → Bridge API
- Globe shell stays intact, no refactor needed

## Phase 3: Third Surface in Globe Nav
Add to NERVA Globe's mode selector:

```
Globe | Map + Real Estate | Torah Light
```

Torah Light surface layout:
- Left rail: Today / Parsha / Aleph-Bet / Israel-Diaspora / Shabbat
- Right rail: Live study pane (Hebrew date, parsha, aliyot, haftarah, candle-lighting, Sefaria excerpt)
- Globe: Sacred Time layer — Jerusalem anchor, diaspora cities glow with candle-lighting wave

## API Contract: /api/torah/today

```
GET /api/torah/today?zip=10001&diaspora=1

Response:
{
  timestamp: "2026-03-21T...",
  hebrewDate: "Nissan 2, 5786",
  parasha: {
    name: "Vayikra",
    hebrew: "ויקרא",
    ref: "Leviticus 1:1-5:26",
    sefaria_url: "https://www.sefaria.org/Leviticus.1.1-5.26"
  },
  torahText: {
    ref: "Leviticus 1:1-8",
    fullRef: "Leviticus 1:1-5:26",
    verses: [
      { num: 1, text: "The LORD called to Moses..." },
      ...
    ]
  },
  leyning: {
    torah: "Leviticus 1:1-5:26",
    haftarah: "Isaiah 43:21-44:23",
    maftir: "Leviticus 5:24-5:26",
    aliyot: { 1: "Lev 1:1-1:13", 2: "Lev 1:14-2:6", ... },
    triennial: { ... }
  },
  haftarah: {
    name: "Isaiah 43:21-44:23",
    hebrew: "ישעיהו מ״ג:כ״א-מ״ד:כ״ג",
    ref: "Isaiah 43:21-44:23"
  },
  dailyLearning: {
    dafYomi: { name: "Bava Kamma 96", ref: "Bava Kamma 96" },
    mishnah: { ... },
    rambam: { ... }
  },
  shabbat: {
    candleLighting: "6:52pm",
    havdalah: "7:52pm",
    location: "New York, NY"
  },
  contextSignals: [
    {
      type: "historical",
      event: "Dachau opened (1933)",
      theme: "Darkness & Dawn",
      connection: "The same calendar can hold tragedy and birth..."
    },
    {
      type: "parasha",
      theme: "Drawing Close",
      modernResonance: "In a world of noise...",
      regions: ["Jerusalem", "Safed"]
    },
    {
      type: "seasonal",
      theme: "Passover Season",
      note: "Preparing for the Seder..."
    }
  ]
}
```

## Context Signal Engine
Modeled after AnthonyCharts composite index methodology:
- Date-based historical signals (25+ date-keyed events)
- Parasha-based thematic signals (modern resonance mapping)
- Seasonal/calendar proximity signals
- Future: Anthropic API bridge for live news-to-Torah mapping

## Sacred Time Globe Layer (Phase 3)
- Jerusalem always glowing as anchor
- Diaspora cities colored by parasha.regions[]
- Shabbat candle-lighting wave rolling westward (Hebcal location API)
- Palette: Gold/Parchment (distinct from NERVA's quantum state colors)
- Vocabulary: Prepare / Read / Reflect / Shabbat (not COMMIT/TOXIC/HOLD)

## Data Sources
- Sefaria (sefaria.org) — Free, no API key, CORS-friendly
- Hebcal (hebcal.com) — Free, Creative Commons, location-aware
- AnthonyCharts methodology — Composite index pattern for signal synthesis
