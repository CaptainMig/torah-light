// /api/torah/today.js
// Torah Light Bridge Endpoint — Vercel Serverless Function
// Normalizes Hebcal + Sefaria into a single cached response
// Modeled after AnthonyCharts composite index pattern

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=1800");

  const { zip = "10001", diaspora = "1" } = req.query;

  try {
    // ─── Parallel fetch: Hebcal (Shabbat + calendar) + Sefaria (calendar + text) ───
    const [hebcalShabbat, hebcalCalendar, sefariaCalendar] = await Promise.all([
      fetch(`https://www.hebcal.com/shabbat?cfg=json&zip=${zip}&M=on`)
        .then(r => r.json()).catch(() => null),
      fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=now&ss=on&c=off&s=on&leyning=on`)
        .then(r => r.json()).catch(() => null),
      fetch(`https://www.sefaria.org/api/calendars?diaspora=${diaspora}`)
        .then(r => r.json()).catch(() => null),
    ]);

    // ─── Extract Hebcal data ───
    const hebItems = hebcalShabbat?.items || [];
    const parashat = hebItems.find(i => i.category === "parashat");
    const candles = hebItems.find(i => i.category === "candles");
    const havdalah = hebItems.find(i => i.category === "havdalah");
    const hebrewDate = parashat?.hdate || hebItems.find(i => i.hdate)?.hdate || null;

    // Extract leyning (aliyot) from Hebcal
    const leyning = parashat?.leyning || null;

    // ─── Extract Sefaria data ───
    const sefItems = sefariaCalendar?.calendar_items || [];
    const sefParasha = sefItems.find(i => i.title?.en === "Parashat Hashavua");
    const sefHaftarah = sefItems.find(i => i.title?.en === "Haftarah");
    const sefDaf = sefItems.find(i => i.title?.en === "Daf Yomi");
    const sefMishnah = sefItems.find(i => i.title?.en === "Daily Mishnah");
    const sefRambam = sefItems.find(i => i.title?.en === "Daily Rambam");

    // ─── Fetch opening Torah text from Sefaria ───
    let torahText = null;
    if (sefParasha?.ref) {
      try {
        const ref = sefParasha.ref;
        const firstVerse = ref.split("-")[0];
        const book = firstVerse.split(" ")[0];
        const chVerse = firstVerse.split(" ").slice(1).join(" ");
        const ch = chVerse.split(":")[0];
        const shortRef = `${book} ${ch}:1-8`;

        const textData = await fetch(
          `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(shortRef)}?version=english`
        ).then(r => r.json());

        const versions = textData.versions || [];
        const enVersion = versions.find(v => v.language === "en") || versions[0];
        if (enVersion?.text) {
          const texts = Array.isArray(enVersion.text) ? enVersion.text : [enVersion.text];
          torahText = {
            ref: shortRef,
            fullRef: ref,
            verses: texts.slice(0, 8).map((t, i) => ({
              num: i + 1,
              text: typeof t === "string" ? t.replace(/<[^>]*>/g, "") : ""
            })).filter(v => v.text),
          };
        }
      } catch (e) {
        // Torah text fetch failed — non-critical
      }
    }

    // ─── News-to-Torah Context Mapping ───
    // AnthonyCharts-style composite signal: map current calendar moment to historical resonance
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const contextSignals = getContextSignals(month, day, sefParasha?.displayValue?.en || parashat?.title?.replace("Parashat ", "") || "");

    // ─── Compose Response (AnthonyCharts index pattern) ───
    const response = {
      timestamp: new Date().toISOString(),
      source: "Torah Light Bridge v1.0",

      // Hebrew Calendar
      hebrewDate,
      date: sefariaCalendar?.date || today.toISOString().split("T")[0],

      // This Week's Reading
      parasha: {
        name: sefParasha?.displayValue?.en || parashat?.title?.replace("Parashat ", "") || null,
        hebrew: sefParasha?.displayValue?.he || parashat?.hebrew?.replace("פרשת ", "") || null,
        ref: sefParasha?.ref || leyning?.torah || null,
        sefaria_url: sefParasha?.url ? `https://www.sefaria.org/${sefParasha.url}` : null,
      },

      // Live Torah Text
      torahText,

      // Aliyot (7 Torah readings for Shabbat)
      leyning: leyning ? {
        torah: leyning.torah,
        haftarah: leyning.haftarah,
        maftir: leyning.maftir,
        aliyot: {
          1: leyning["1"], 2: leyning["2"], 3: leyning["3"], 4: leyning["4"],
          5: leyning["5"], 6: leyning["6"], 7: leyning["7"],
        },
        triennial: leyning.triennial || null,
      } : null,

      // Haftarah
      haftarah: sefHaftarah ? {
        name: sefHaftarah.displayValue?.en,
        hebrew: sefHaftarah.displayValue?.he,
        ref: sefHaftarah.ref,
      } : null,

      // Daily Learning
      dailyLearning: {
        dafYomi: sefDaf ? { name: sefDaf.displayValue?.en, ref: sefDaf.ref } : null,
        mishnah: sefMishnah ? { name: sefMishnah.displayValue?.en, ref: sefMishnah.ref } : null,
        rambam: sefRambam ? { name: sefRambam.displayValue?.en, ref: sefRambam.ref } : null,
      },

      // Shabbat Times (location-aware)
      shabbat: {
        candleLighting: candles?.title?.replace("Candle lighting: ", "") || null,
        candleTime: candles?.date || null,
        havdalah: havdalah?.title?.replace(/Havdalah.*?: /, "") || null,
        havdalahTime: havdalah?.date || null,
        location: hebcalShabbat?.location?.title || null,
      },

      // Context Signals (news-to-Torah mapping)
      contextSignals,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Torah Light Bridge error",
      message: error.message,
    });
  }
}

// ═══════════════════════════════════════
// Context Signal Engine
// Maps calendar dates + current parasha to historical/Torah resonance
// Modeled after AnthonyCharts composite index methodology
// ═══════════════════════════════════════
function getContextSignals(month, day, parashaName) {
  const signals = [];

  // ─── Date-based historical resonance ───
  const dateSignals = {
    "1-27": { event: "Liberation of Auschwitz (1945)", theme: "Memory", connection: "International Holocaust Remembrance Day — 'Never forget' is not just a slogan, it's a Jewish commandment: Zachor." },
    "2-14": { event: "First Knesset convened (1949)", theme: "Sovereignty", connection: "Jewish self-governance restored after 2,000 years of exile." },
    "3-20": { event: "Pale of Settlement abolished (1917)", theme: "Freedom", connection: "Russian Jews gain freedom of movement — your family's history shifts." },
    "3-21": { event: "Dachau opened (1933) / Pre-independence fighting (1948)", theme: "Darkness & Dawn", connection: "The same calendar can hold tragedy and the birth of a nation. History is layered." },
    "4-1": { event: "Nazi boycott of Jewish businesses (1933) / Hebrew University opens (1925)", theme: "Destruction & Building", connection: "While some tore down, others built. Choose to be a builder." },
    "4-19": { event: "Warsaw Ghetto Uprising (1943)", theme: "Resistance", connection: "Outnumbered, outgunned — they fought anyway. Courage isn't about odds." },
    "5-14": { event: "Israel declares independence (1948)", theme: "Rebirth", connection: "After 2,000 years, a homeland. The longest comeback story in human history." },
    "6-7": { event: "Paratroopers reach Western Wall (1967)", theme: "Return", connection: "'The Temple Mount is in our hands.' Soldiers wept. Some prayers take millennia to answer." },
    "7-20": { event: "Apollo 11 moon landing (1969)", theme: "Exploration", connection: "A piece of the Dead Sea Scrolls traveled to the moon — human heritage beyond earth." },
    "9-11": { event: "September 11 attacks (2001)", theme: "Grief & Unity", connection: "In the aftermath, strangers helped strangers. That's Gemilut Chasadim in action." },
    "10-6": { event: "Yom Kippur War begins (1973)", theme: "Surprise & Resilience", connection: "Attacked on the holiest day. Israel survived. Faith and readiness aren't opposites." },
    "11-2": { event: "Balfour Declaration (1917)", theme: "Promise", connection: "Britain supports a Jewish homeland. Promises matter — even political ones." },
    "11-9": { event: "Kristallnacht (1938)", theme: "Warning", connection: "The Night of Broken Glass. When hatred goes unchecked, glass isn't the only thing that breaks." },
    "11-29": { event: "UN votes for partition (1947)", theme: "Decision", connection: "The world voted. Jews danced. War followed. Every decision has consequences." },
    "12-25": { event: "Soviet Union dissolves (1991)", theme: "Exodus", connection: "Over 1 million Russian Jews move to Israel. The modern Exodus." },
  };

  const key = `${month}-${day}`;
  if (dateSignals[key]) {
    signals.push({ type: "historical", ...dateSignals[key] });
  }

  // ─── Parasha-based thematic signals ───
  const parashaSignals = {
    "Vayikra": { theme: "Drawing Close", modernResonance: "In a world of noise and distraction, the ancient practice of making space for the sacred is more relevant than ever. Vayikra opens Leviticus with God calling — quietly. The question isn't whether God calls. It's whether we're listening.", regions: ["Jerusalem", "Safed"] },
    "Tzav": { theme: "Discipline & Consistency", modernResonance: "The eternal flame on the altar must never go out. In an age of burnout and hustle culture, Judaism teaches that the fire requires tending — not force. Consistency, not intensity.", regions: ["Jerusalem"] },
    "Bereishit": { theme: "Creation & Innovation", modernResonance: "Every startup, every new idea, every fresh start echoes Bereishit. Creation isn't a one-time event — it's ongoing. You participate in it every day.", regions: ["Jerusalem", "Tel Aviv"] },
    "Noach": { theme: "Climate & Covenant", modernResonance: "The flood narrative resonates with modern climate concerns. The rainbow covenant says: I will not destroy. But the responsibility shifts to humanity — we must protect what was saved.", regions: ["Mount Ararat"] },
    "Lech Lecha": { theme: "Migration & Identity", modernResonance: "Every immigrant, every refugee, every person who left home for an unknown future walks in Abraham's footsteps. Lech Lecha is the story of the diaspora.", regions: ["Ur", "Jerusalem", "Brooklyn", "Moscow"] },
    "Shemot": { theme: "Oppression & Liberation", modernResonance: "Wherever people are enslaved — physically, economically, psychologically — the Exodus story speaks. Moses saw injustice and couldn't look away. That's the standard.", regions: ["Egypt", "Jerusalem"] },
    "Beshalach": { theme: "Freedom & Doubt", modernResonance: "They crossed the sea and three days later complained about water. Freedom is terrifying. It's easier to be told what to do. Real liberation requires courage after the miracle.", regions: ["Egypt", "Mount Sinai"] },
    "Yitro": { theme: "Law & Morality", modernResonance: "The Ten Commandments aren't ancient rules — they're the operating system for civilization. Every legal code in the Western world traces back to Sinai.", regions: ["Mount Sinai"] },
    "Mishpatim": { theme: "Justice & Workers' Rights", modernResonance: "3,300 years ago, the Torah mandated fair wages, rest days, and protection for the vulnerable. The labor movement has ancient roots.", regions: ["Mount Sinai", "Jerusalem"] },
  };

  if (parashaSignals[parashaName]) {
    signals.push({ type: "parasha", ...parashaSignals[parashaName] });
  }

  // ─── Seasonal / Calendar proximity signals ───
  const seasonalSignals = [];
  if (month === 3 || month === 4) seasonalSignals.push({ type: "seasonal", theme: "Passover Season", note: "Preparing for the Seder. Freedom is the theme. Ask: what enslaves you, and what would liberation look like?" });
  if (month === 9) seasonalSignals.push({ type: "seasonal", theme: "High Holy Days", note: "The month of Elul — introspection before Rosh Hashanah. Who do you want to become this year?" });
  if (month === 12) seasonalSignals.push({ type: "seasonal", theme: "Hanukkah Season", note: "Light against darkness. The Maccabees were outnumbered but fought anyway. Courage over comfort." });

  return [...signals, ...seasonalSignals];
}
