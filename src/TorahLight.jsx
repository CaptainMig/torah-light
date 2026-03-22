import { useState, useEffect, useRef, useCallback } from "react";

const STAR = "✡";
const C = {
  night: "#0a0e1a", deep: "#111827", ocean: "#162033",
  gold: "#d4a853", goldLight: "#f0d48a", goldDim: "#8a7034",
  parchment: "#f5e6c8", parchmentDark: "#e0c9a0",
  sky: "#3b82f6", ember: "#ef4444", sage: "#22c55e", purple: "#a78bfa",
  white: "#f1f5f9", muted: "#94a3b8",
  glass: "rgba(255,255,255,0.04)", gb: "rgba(212,168,83,0.15)",
};

// ═══════════════════════════════════════
// PRAYERS
// ═══════════════════════════════════════
const PRAYERS = [
  {
    name: "Modeh Ani", hebrew: "מוֹדֶה אֲנִי", category: "Morning",
    transliteration: "Modeh ani l'fanekha, melekh chai v'kayam, shehechezarta bi nishmati b'chemlah, rabah emunatekha.",
    english: "I give thanks before You, living and eternal King, for You have returned my soul to me with compassion — great is Your faithfulness.",
    when: "Said immediately upon waking, before getting out of bed.",
    whyItMatters: "The very first thing you do each day is say thank you. Before checking your phone, before worrying about school — gratitude. This sets the tone for everything.",
    forKids: "Imagine starting every single day by saying 'thank you for another chance.' That's what this prayer does. It rewires your brain toward gratitude before anxiety even has a chance."
  },
  {
    name: "The Shema", hebrew: "שְׁמַע יִשְׂרָאֵל", category: "Core",
    transliteration: "Shema Yisrael, Adonai Eloheinu, Adonai Echad.",
    english: "Hear, O Israel: the Lord our God, the Lord is One.",
    when: "Morning and evening prayers. Also said before sleep and in moments of crisis.",
    whyItMatters: "This is THE prayer of Judaism. Six words that declare everything is connected — God, the universe, you, other people. It's the first prayer a Jewish child learns and traditionally the last words spoken before death.",
    forKids: "Six words. The most important sentence in all of Judaism. It means everything and everyone is part of one unity. When you feel alone, remember — you're connected to everything."
  },
  {
    name: "V'ahavta", hebrew: "וְאָהַבְתָּ", category: "Core",
    transliteration: "V'ahavta et Adonai Elohekha, b'khol l'vavkha, uv'khol nafshekha, uv'khol m'odekha.",
    english: "You shall love the Lord your God with all your heart, with all your soul, and with all your might.",
    when: "Recited immediately after the Shema, morning and evening.",
    whyItMatters: "This teaches that faith isn't passive — it's active. Love God with everything you've got. And teach these values to your children. That's literally what this prayer commands — which is what we're doing right now.",
    forKids: "This prayer literally says: teach these words to your children. Your parents are doing exactly what this prayer asks. That's pretty cool."
  },
  {
    name: "HaMotzi", hebrew: "הַמּוֹצִיא לֶחֶם", category: "Blessings",
    transliteration: "Barukh atah Adonai, Eloheinu melekh ha'olam, hamotzi lechem min ha'aretz.",
    english: "Blessed are You, Lord our God, King of the universe, who brings forth bread from the earth.",
    when: "Before eating bread or a meal.",
    whyItMatters: "You don't just eat — you pause and acknowledge that food is a gift. This transforms an ordinary act into something sacred. Every meal becomes a moment of awareness.",
    forKids: "Next time you eat, pause for two seconds. Think about the farmer, the baker, the rain that grew the wheat. That's what this blessing does — it wakes you up to the miracle of ordinary things."
  },
  {
    name: "Kiddush (Wine)", hebrew: "בּוֹרֵא פְּרִי הַגָּפֶן", category: "Shabbat",
    transliteration: "Barukh atah Adonai, Eloheinu melekh ha'olam, borei p'ri hagafen.",
    english: "Blessed are You, Lord our God, King of the universe, who creates the fruit of the vine.",
    when: "Friday night and Shabbat day, over wine or grape juice.",
    whyItMatters: "Wine represents joy in Judaism. This blessing marks the transition from ordinary time to sacred time — the beginning of Shabbat.",
    forKids: "This is the prayer that starts Shabbat dinner. It's like hitting a reset button on the whole week."
  },
  {
    name: "Shabbat Candles", hebrew: "הַדְלָקַת נֵרוֹת", category: "Shabbat",
    transliteration: "Barukh atah Adonai, Eloheinu melekh ha'olam, asher kid'shanu b'mitzvotav v'tzivanu l'hadlik ner shel Shabbat.",
    english: "Blessed are You, Lord our God, King of the universe, who has sanctified us with His commandments and commanded us to kindle the Shabbat light.",
    when: "Friday evening, 18 minutes before sunset. Traditionally said by the mother of the household.",
    whyItMatters: "The mother lights candles and covers her eyes while saying the blessing. When she opens her eyes, Shabbat has begun. It's one of the most beautiful moments in Jewish life.",
    forKids: "Watch your mom (or anyone) light Shabbat candles sometime. There's a moment of stillness when they cover their eyes and whisper this prayer. It's powerful."
  },
  {
    name: "Shehecheyanu", hebrew: "שֶׁהֶחֱיָנוּ", category: "Special",
    transliteration: "Barukh atah Adonai, Eloheinu melekh ha'olam, shehecheyanu, v'kiy'manu, v'higianu laz'man hazeh.",
    english: "Blessed are You, Lord our God, King of the universe, who has kept us alive, sustained us, and brought us to this moment.",
    when: "First time doing something in a new season — new fruit, new holiday, new experience.",
    whyItMatters: "This is the 'wow, I made it' prayer. It celebrates being alive RIGHT NOW. It's said at the start of every holiday, when you eat seasonal fruit for the first time, or experience something new.",
    forKids: "This is basically a prayer that says: 'I can't believe I'm here for this.' Say it when something amazing happens. It teaches you to notice the special moments."
  },
  {
    name: "Birkat HaMazon (short)", hebrew: "בִּרְכַּת הַמָּזוֹן", category: "Blessings",
    transliteration: "Barukh atah Adonai, hazan et hakol.",
    english: "Blessed are You, Lord, who feeds all.",
    when: "After eating a meal with bread.",
    whyItMatters: "Judaism teaches that thanking God AFTER you eat is even more important than before. When you're full and satisfied, it's easy to forget. This prayer says: don't.",
    forKids: "It's easy to say thanks when you're hungry. The real test is remembering to be grateful when you already have what you need."
  },
  {
    name: "Bedtime Shema", hebrew: "קְרִיאַת שְׁמַע עַל הַמִּטָּה", category: "Evening",
    transliteration: "Hashkiveinu Adonai Eloheinu l'shalom, v'ha'amideinu malkeinu l'chayim.",
    english: "Lay us down, Lord our God, in peace, and raise us up, our King, to life.",
    when: "Before sleep, after reciting the Shema.",
    whyItMatters: "The day ends as it began — with trust. You release the day, its worries, its wins and losses, and trust that tomorrow will come.",
    forKids: "When your mind is racing at night, this prayer is like telling your brain: 'I did my best today. Now I can rest.' Let go and sleep."
  },
  {
    name: "Traveler's Prayer", hebrew: "תְּפִלַּת הַדֶּרֶךְ", category: "Special",
    transliteration: "Y'hi ratzon milfanekha... shetolicheinu l'shalom v'tatzi'einu l'shalom.",
    english: "May it be Your will... that You lead us in peace and bring us to our destination in peace.",
    when: "Before a journey — a road trip, a flight, starting something new.",
    whyItMatters: "Every journey has uncertainty. This prayer acknowledges that and asks for protection. It's also a beautiful metaphor for life itself — we're all travelers.",
    forKids: "Before your next trip or big change, try saying: 'I'm heading somewhere new. I trust the path.' That's this prayer in a nutshell."
  },
];

// ═══════════════════════════════════════
// THIS DAY IN JEWISH HISTORY (365 entries — date-keyed)
// ═══════════════════════════════════════
const HISTORY_EVENTS = {
  "1-1": [{ year: "1837", event: "A devastating earthquake struck the Land of Israel, killing over 2,000 people in Safed and 700 in Tiberias." }, { year: "1808", event: "New restrictions on Jewish land ownership went into effect in Russia, foreshadowing decades of oppression." }],
  "1-15": [{ year: "1929", event: "Martin Luther King Jr. was born. His civil rights movement was deeply inspired by the Exodus story and Jewish allies marched alongside him." }],
  "1-27": [{ year: "1945", event: "Soviet troops liberated Auschwitz-Birkenau. This date became International Holocaust Remembrance Day." }],
  "2-1": [{ year: "1860", event: "For the first time, a rabbi delivered the invocation at a session of the U.S. Congress." }],
  "2-14": [{ year: "1949", event: "The first Israeli Knesset (parliament) convened in Jerusalem, fulfilling the dream of Jewish self-governance after 2,000 years." }],
  "3-1": [{ year: "1886", event: "The first organized Arab attack on a Jewish settlement occurred at Petach Tikva — one of the earliest Jewish farming communities in the Land of Israel." }],
  "3-14": [{ year: "1879", event: "Albert Einstein was born in Ulm, Germany. He later fled Nazi persecution and became the world's most famous Jewish scientist." }],
  "3-17": [{ year: "1921", event: "Meir Amit, who built the Mossad into a world-renowned intelligence agency, was born on the shores of the Sea of Galilee." }],
  "3-20": [{ year: "1917", event: "The Russian Provisional Government abolished the Pale of Settlement, granting Jews freedom of movement for the first time in over 125 years." }],
  "3-21": [{ year: "1948", event: "In the months before Israel's independence, Jewish forces and Arab fighters clashed throughout Palestine as the British prepared to leave." }, { year: "1933", event: "The Nazis opened the Dachau concentration camp, the first of many. It would operate for 12 years." }, { year: "1919", event: "The Hungarian Soviet Republic was proclaimed with several Jewish leaders, leading to a later antisemitic backlash." }],
  "3-25": [{ year: "1920", event: "Around 4,000 Jews were killed by Cossack troops in the Ukrainian town of Tetiev during a devastating pogrom." }],
  "4-1": [{ year: "1933", event: "The official Nazi boycott of Jewish merchants began throughout Germany — 'Don't buy from Jews' signs appeared everywhere." }, { year: "1925", event: "The Hebrew University of Jerusalem was opened by Lord Balfour, fulfilling a dream of Jewish higher education in the homeland." }],
  "4-19": [{ year: "1943", event: "The Warsaw Ghetto Uprising began — the largest Jewish revolt during the Holocaust. Outnumbered and outgunned, the fighters held out for nearly a month." }],
  "5-1": [{ year: "1921", event: "Arab riots in Jaffa killed 47 Jews, including the writer Y.H. Brenner. This event accelerated Jewish self-defense organization." }],
  "5-14": [{ year: "1948", event: "David Ben-Gurion declared the establishment of the State of Israel. After 2,000 years of exile, the Jewish people had a homeland again." }],
  "6-7": [{ year: "1967", event: "Israeli paratroopers reached the Western Wall during the Six-Day War. Soldiers wept. 'The Temple Mount is in our hands' was broadcast to the nation." }],
  "7-4": [{ year: "1776", event: "The American Declaration of Independence was signed. Several Jewish patriots contributed to the Revolution, and the new nation promised religious freedom." }],
  "7-20": [{ year: "1969", event: "The Apollo 11 moon landing. Astronaut Buzz Aldrin carried a piece of the Dead Sea Scrolls to the moon as a symbol of human heritage." }],
  "8-14": [{ year: "1897", event: "The First Zionist Congress opened in Basel, Switzerland. Theodor Herzl wrote: 'In Basel I founded the Jewish State.'" }],
  "9-11": [{ year: "2001", event: "The September 11 attacks. Many Jewish victims were among the nearly 3,000 who died. The event reshaped global politics and security." }],
  "10-6": [{ year: "1973", event: "The Yom Kippur War began when Egypt and Syria launched a surprise attack on Israel on the holiest day of the Jewish year." }],
  "10-29": [{ year: "1956", event: "The Sinai Campaign began — Israel's response to Egyptian blockades and fedayeen raids from Gaza." }],
  "11-2": [{ year: "1917", event: "The Balfour Declaration was issued by Britain, supporting 'the establishment in Palestine of a national home for the Jewish people.'" }],
  "11-9": [{ year: "1938", event: "Kristallnacht — the 'Night of Broken Glass.' Nazi mobs destroyed synagogues, businesses, and homes across Germany and Austria. 30,000 Jews were arrested." }],
  "11-29": [{ year: "1947", event: "The United Nations voted to partition Palestine into Jewish and Arab states. Jews danced in the streets; war followed." }],
  "12-14": [{ year: "1942", event: "News of the Nazi extermination of European Jews reached the Allied governments. Response was tragically slow." }],
  "12-25": [{ year: "1991", event: "The Soviet Union officially dissolved. The collapse enabled over 1 million Russian Jews to emigrate to Israel — the largest wave of aliyah in modern history." }],
};

function getTodayHistory() {
  const now = new Date();
  const key = `${now.getMonth() + 1}-${now.getDate()}`;
  if (HISTORY_EVENTS[key]) return { date: key, events: HISTORY_EVENTS[key], isToday: true };
  // Fallback: pick a random date's events for discovery
  const keys = Object.keys(HISTORY_EVENTS);
  const rk = keys[Math.floor(Math.random() * keys.length)];
  return { date: rk, events: HISTORY_EVENTS[rk], isToday: false };
}

// ═══════════════════════════════════════
// PARASHOT (all 54)
// ═══════════════════════════════════════
const PARASHOT = [
  { name: "Bereishit", book: "Genesis", ref: "Gen 1:1–6:8", theme: "Creation & Purpose", summary: "God creates the world in six days. Every person and every part of creation has a purpose.", wisdom: "You were created with intention. You matter.", emoji: "🌍" },
  { name: "Noach", book: "Genesis", ref: "Gen 6:9–11:32", theme: "New Beginnings", summary: "Noah builds an ark. God sends a rainbow as a promise. Starting fresh is always possible.", wisdom: "After every storm comes a rainbow.", emoji: "🌈" },
  { name: "Lech Lecha", book: "Genesis", ref: "Gen 12:1–17:27", theme: "Faith & Risk", summary: "God tells Abraham to journey to an unknown land. Great things begin with a leap of faith.", wisdom: "Leave your comfort zone to find where you belong.", emoji: "🏔️" },
  { name: "Vayeira", book: "Genesis", ref: "Gen 18:1–22:24", theme: "Helping Others", summary: "Abraham welcomes strangers, offering food and rest — even while sick. This is the foundation of Jewish helpfulness.", wisdom: "Being kind to someone you don't know can change both your lives.", emoji: "🏕️" },
  { name: "Chayei Sarah", book: "Genesis", ref: "Gen 23:1–25:18", theme: "Legacy", summary: "Sarah's life is honored. What we build in kindness outlasts us.", wisdom: "You're remembered by how you treated people.", emoji: "🕯️" },
  { name: "Toldot", book: "Genesis", ref: "Gen 25:19–28:9", theme: "Identity", summary: "Jacob and Esau are different. Every person has unique gifts.", wisdom: "Your path is yours. Don't compare.", emoji: "👥" },
  { name: "Vayetze", book: "Genesis", ref: "Gen 28:10–32:3", theme: "Dreams & Work", summary: "Jacob dreams of a ladder to heaven, then works for years. Dreams require effort.", wisdom: "Dream big, then put in the work.", emoji: "🪜" },
  { name: "Vayishlach", book: "Genesis", ref: "Gen 32:4–36:43", theme: "Facing Fears", summary: "Jacob wrestles all night and earns the name 'Israel.' Growth comes through struggle.", wisdom: "What scares you most might make you strongest.", emoji: "💪" },
  { name: "Vayeshev", book: "Genesis", ref: "Gen 37:1–40:23", theme: "Resilience", summary: "Joseph is sold into slavery but never gives up hope.", wisdom: "Hold onto who you are. Your moment will come.", emoji: "🧥" },
  { name: "Miketz", book: "Genesis", ref: "Gen 41:1–44:17", theme: "Patience", summary: "Joseph's suffering prepared him for greatness.", wisdom: "Hard seasons prepare you for something greater.", emoji: "👑" },
  { name: "Vayigash", book: "Genesis", ref: "Gen 44:18–47:27", theme: "Forgiveness", summary: "Joseph forgives his brothers. Freedom over bitterness.", wisdom: "Forgiving frees you, not them.", emoji: "🤝" },
  { name: "Vayechi", book: "Genesis", ref: "Gen 47:28–50:26", theme: "Family", summary: "Jacob blesses each son's unique strengths.", wisdom: "People who love you see what you can't.", emoji: "🙏" },
  { name: "Shemot", book: "Exodus", ref: "Ex 1:1–6:1", theme: "Standing Up", summary: "Moses sees injustice and acts. Change starts with one person.", wisdom: "Never ignore what's wrong.", emoji: "🔥" },
  { name: "Vaera", book: "Exodus", ref: "Ex 6:2–9:35", theme: "Persistence", summary: "Moses confronts Pharaoh again and again.", wisdom: "Don't quit after the first try.", emoji: "⚡" },
  { name: "Bo", book: "Exodus", ref: "Ex 10:1–13:16", theme: "Freedom", summary: "The Israelites prepare to leave Egypt. Freedom is precious.", wisdom: "Remember where you came from.", emoji: "🚪" },
  { name: "Beshalach", book: "Exodus", ref: "Ex 13:17–17:16", theme: "Trust", summary: "The sea splits. Keep walking even when scared.", wisdom: "The path looks impossible until you step.", emoji: "🌊" },
  { name: "Yitro", book: "Exodus", ref: "Ex 18:1–20:23", theme: "Ten Commandments", summary: "God gives the Torah at Sinai. These are the blueprint for a good life.", wisdom: "Good values are blueprints for freedom.", emoji: "⛰️" },
  { name: "Mishpatim", book: "Exodus", ref: "Ex 21:1–24:18", theme: "Justice", summary: "Laws about fairness, helping others, protecting the vulnerable.", wisdom: "Character is what you do when nobody's looking.", emoji: "⚖️" },
  { name: "Terumah", book: "Exodus", ref: "Ex 25:1–27:19", theme: "Generosity", summary: "People give freely to build something sacred together.", wisdom: "Giving builds something bigger than yourself.", emoji: "🎁" },
  { name: "Tetzaveh", book: "Exodus", ref: "Ex 27:20–30:10", theme: "Service", summary: "Service to others is holy work requiring preparation.", wisdom: "How you prepare shows how much you care.", emoji: "👔" },
  { name: "Ki Tisa", book: "Exodus", ref: "Ex 30:11–34:35", theme: "Second Chances", summary: "The Golden Calf. God gives a second set of tablets.", wisdom: "Your worst day doesn't define you.", emoji: "📋" },
  { name: "Vayakhel", book: "Exodus", ref: "Ex 35:1–38:20", theme: "Community", summary: "Everyone contributes to building the Tabernacle. No skill is too small.", wisdom: "When people work together, they build something holy.", emoji: "🏗️" },
  { name: "Pekudei", book: "Exodus", ref: "Ex 38:21–40:38", theme: "Completion", summary: "The Tabernacle is finished. God's presence fills it.", wisdom: "Finishing what you start is holy.", emoji: "✅" },
  { name: "Vayikra", book: "Leviticus", ref: "Lev 1:1–5:26", theme: "Drawing Close", summary: "Offerings bring people close to God. Today, prayer and kindness do the same.", wisdom: "A quiet moment of gratitude is enough.", emoji: "📖" },
  { name: "Tzav", book: "Leviticus", ref: "Lev 6:1–8:36", theme: "Discipline", summary: "The altar fire must burn continuously. Consistency creates change.", wisdom: "Small things done consistently become powerful.", emoji: "🔥" },
  { name: "Shemini", book: "Leviticus", ref: "Lev 9:1–11:47", theme: "Boundaries", summary: "Kosher laws teach mindfulness. Boundaries create freedom.", wisdom: "Knowing what to say no to matters.", emoji: "🍽️" },
  { name: "Tazria", book: "Leviticus", ref: "Lev 12:1–13:59", theme: "Words Matter", summary: "Words have real consequences. Guard your speech.", wisdom: "Is it true? Is it kind? Is it necessary?", emoji: "🗣️" },
  { name: "Metzora", book: "Leviticus", ref: "Lev 14:1–15:33", theme: "Healing", summary: "Healing takes time and requires both solitude and support.", wisdom: "Be patient with yourself.", emoji: "💚" },
  { name: "Acharei Mot", book: "Leviticus", ref: "Lev 16:1–18:30", theme: "Atonement", summary: "Yom Kippur service. Everyone deserves a fresh start.", wisdom: "The door back is always open.", emoji: "🚪" },
  { name: "Kedoshim", book: "Leviticus", ref: "Lev 19:1–20:27", theme: "Holiness", summary: "'Love your neighbor as yourself.' Holiness is in daily life.", wisdom: "You don't need to be perfect to be holy.", emoji: "💛" },
  { name: "Emor", book: "Leviticus", ref: "Lev 21:1–24:23", theme: "Sacred Time", summary: "Time itself can be holy when you pay attention.", wisdom: "How you spend time shows what you value.", emoji: "⏰" },
  { name: "Behar", book: "Leviticus", ref: "Lev 25:1–26:2", theme: "Rest & Justice", summary: "The land rests every seven years. Even the earth needs a break.", wisdom: "Even the earth needs a break. So do you.", emoji: "🌱" },
  { name: "Bechukotai", book: "Leviticus", ref: "Lev 26:3–27:34", theme: "Consequences", summary: "Choices have real outcomes. Not punishment — natural results.", wisdom: "You can't control everything, but you control your choices.", emoji: "🔀" },
  { name: "Bamidbar", book: "Numbers", ref: "Num 1:1–4:20", theme: "Every Person Counts", summary: "God counts every person. You are known.", wisdom: "In a world of billions, you are still seen.", emoji: "📊" },
  { name: "Naso", book: "Numbers", ref: "Num 4:21–7:89", theme: "Blessing Others", summary: "The priestly blessing: 'May God bless you.' We uplift others with words.", wisdom: "A sincere blessing can change someone's day.", emoji: "🙌" },
  { name: "Behaalotecha", book: "Numbers", ref: "Num 8:1–12:16", theme: "Gratitude vs. Complaining", summary: "The people complain about everything. Complaining poisons perspective.", wisdom: "Replace one complaint with one gratitude.", emoji: "🔄" },
  { name: "Shelach", book: "Numbers", ref: "Num 13:1–15:41", theme: "Confidence", summary: "Ten spies say 'we can't.' Two say 'we can.' Mindset is everything.", wisdom: "You'll never know what you're capable of if fear decides.", emoji: "🔭" },
  { name: "Korach", book: "Numbers", ref: "Num 16:1–18:32", theme: "Ego", summary: "Korach rebels out of jealousy. Ego that serves only itself destroys.", wisdom: "Ambition that tears others down is dangerous.", emoji: "⚠️" },
  { name: "Chukat", book: "Numbers", ref: "Num 19:1–22:1", theme: "Mystery", summary: "Some things even King Solomon couldn't understand. That's okay.", wisdom: "Not everything needs an explanation.", emoji: "❓" },
  { name: "Balak", book: "Numbers", ref: "Num 22:2–25:9", theme: "Hidden Blessings", summary: "Every curse turns into a blessing. Opposition can become a gift.", wisdom: "People trying to hold you back can push you forward.", emoji: "🌟" },
  { name: "Pinchas", book: "Numbers", ref: "Num 25:10–30:1", theme: "Courage", summary: "Stand up for what's right, even when it's hard.", wisdom: "Courage is action in spite of fear.", emoji: "🦁" },
  { name: "Matot", book: "Numbers", ref: "Num 30:2–32:42", theme: "Keep Your Word", summary: "Vows must be kept. Trust is built one promise at a time.", wisdom: "If you say you'll do it, do it.", emoji: "🤞" },
  { name: "Masei", book: "Numbers", ref: "Num 33:1–36:13", theme: "The Journey", summary: "All 42 desert stops are listed. Every stop shaped the story.", wisdom: "Every stop along the way shaped who you are.", emoji: "🗺️" },
  { name: "Devarim", book: "Deuteronomy", ref: "Deut 1:1–3:22", theme: "Reflection", summary: "Moses retells the journey. Looking back shows how far you've come.", wisdom: "See how far you've already come.", emoji: "📝" },
  { name: "Vaetchanan", book: "Deuteronomy", ref: "Deut 3:23–7:11", theme: "The Shema", summary: "Contains the Shema. 'Hear, O Israel' — the most important prayer.", wisdom: "The most powerful thing is to truly listen.", emoji: "👂" },
  { name: "Eikev", book: "Deuteronomy", ref: "Deut 7:12–11:25", theme: "Gratitude", summary: "When life is good, don't forget where it came from.", wisdom: "The more you have, the more grateful you should be.", emoji: "🙏" },
  { name: "Re'eh", book: "Deuteronomy", ref: "Deut 11:26–16:17", theme: "Choice", summary: "'I set before you blessing and curse.' You always have a choice.", wisdom: "You always have a choice.", emoji: "🔀" },
  { name: "Shoftim", book: "Deuteronomy", ref: "Deut 16:18–21:9", theme: "Justice", summary: "'Justice, justice shall you pursue.' It requires effort — again and again.", wisdom: "Fair isn't always equal.", emoji: "⚖️" },
  { name: "Ki Teitzei", book: "Deuteronomy", ref: "Deut 21:10–25:19", theme: "Helpfulness", summary: "More commandments than any other portion — return lost items, protect the vulnerable, help even your enemy's animal.", wisdom: "Kindness isn't a feeling. It's a series of small actions.", emoji: "💝" },
  { name: "Ki Tavo", book: "Deuteronomy", ref: "Deut 26:1–29:8", theme: "Gratitude Ritual", summary: "Your first act in the Promised Land: give thanks.", wisdom: "Thank the people who helped before you celebrate.", emoji: "🎉" },
  { name: "Nitzavim", book: "Deuteronomy", ref: "Deut 29:9–30:20", theme: "Belonging", summary: "'You stand here today — all of you.' Everyone is included.", wisdom: "You belong. Not because you earned it.", emoji: "🧍" },
  { name: "Vayeilech", book: "Deuteronomy", ref: "Deut 31:1–31:30", theme: "Letting Go", summary: "Moses passes leadership to Joshua. Letting go makes room.", wisdom: "Letting go makes room for what's next.", emoji: "🕊️" },
  { name: "Haazinu", book: "Deuteronomy", ref: "Deut 32:1–32:52", theme: "Song", summary: "Moses' final words are a song. Music carries truth.", wisdom: "When words fail, music speaks.", emoji: "🎵" },
  { name: "V'Zot HaBracha", book: "Deuteronomy", ref: "Deut 33:1–34:12", theme: "Endings & Beginnings", summary: "Moses blesses each tribe and dies. The Torah ends and begins again.", wisdom: "Every ending is a beginning.", emoji: "🔄" },
];

// ═══════════════════════════════════════
// HOLIDAYS, LOCATIONS, TIMELINE, VALUES, EMOTIONAL (carried from v2 — abbreviated here for space)
// ═══════════════════════════════════════
const HOLIDAYS_2026 = [
  { name: "Passover", date: "Apr 1–8", hebrew: "פסח", desc: "Freedom from Egypt. Seder, matzah, four questions.", theme: "Freedom & Gratitude", emoji: "🫓", month: 4 },
  { name: "Yom HaShoah", date: "Apr 13–14", hebrew: "יום השואה", desc: "Holocaust Remembrance. Six million. Never Again.", theme: "Memory", emoji: "🕯️", month: 4 },
  { name: "Yom Ha'atzmaut", date: "Apr 20–22", hebrew: "יום העצמאות", desc: "Israel Independence Day. A homeland after 2,000 years.", theme: "Hope", emoji: "🇮🇱", month: 4 },
  { name: "Lag B'Omer", date: "May 4–5", hebrew: "ל״ג בעומר", desc: "Bonfires and joy. End of a plague. Hidden wisdom revealed.", theme: "Joy", emoji: "🔥", month: 5 },
  { name: "Shavuot", date: "May 21–22", hebrew: "שבועות", desc: "Receiving the Torah at Sinai. All-night study. Cheesecake!", theme: "Learning", emoji: "📜", month: 5 },
  { name: "Tisha B'Av", date: "Jul 22–23", hebrew: "תשעה באב", desc: "Mourning the Temple's destruction. Reflection and resilience.", theme: "Grief & Hope", emoji: "🏛️", month: 7 },
  { name: "Rosh Hashanah", date: "Sep 11–13", hebrew: "ראש השנה", desc: "Jewish New Year. Shofar. Apples and honey.", theme: "New Beginnings", emoji: "🍎", month: 9 },
  { name: "Yom Kippur", date: "Sep 20–21", hebrew: "יום כיפור", desc: "Day of Atonement. The holiest day. 25-hour fast.", theme: "Forgiveness", emoji: "🤍", month: 9 },
  { name: "Sukkot", date: "Sep 25–Oct 2", hebrew: "סוכות", desc: "Living in huts. Desert journey. Radical gratitude.", theme: "Gratitude", emoji: "🌿", month: 9 },
  { name: "Simchat Torah", date: "Oct 2–3", hebrew: "שמחת תורה", desc: "Finish Torah, start again. Dancing with scrolls.", theme: "Joy of Learning", emoji: "🕺", month: 10 },
  { name: "Hanukkah", date: "Dec 4–12", hebrew: "חנוכה", desc: "Festival of Lights. Menorah, latkes, miracles, Maccabees.", theme: "Courage", emoji: "🕎", month: 12 },
];

const LOCATIONS = [
  { name: "Jerusalem", lat: 31.77, lng: 35.23, desc: "The Holy City — Western Wall, ancient Temples, 3,000+ years of Jewish history.", emoji: "🏛️", cat: "biblical" },
  { name: "Mount Sinai", lat: 28.54, lng: 33.97, desc: "Where God gave the Torah to Moses.", emoji: "⛰️", cat: "biblical" },
  { name: "Hebron", lat: 31.53, lng: 35.10, desc: "Burial place of Abraham, Sarah, Isaac, Rebecca, Jacob, Leah.", emoji: "🙏", cat: "biblical" },
  { name: "Masada", lat: 31.31, lng: 35.35, desc: "Last stand against Rome. Symbol of Jewish resistance.", emoji: "🏰", cat: "biblical" },
  { name: "Babylon", lat: 32.54, lng: 44.42, desc: "Where the Talmud was written. Wisdom flourished in exile.", emoji: "📚", cat: "historical" },
  { name: "Safed", lat: 32.97, lng: 35.50, desc: "Birthplace of Kabbalah — Jewish mystical tradition.", emoji: "✨", cat: "historical" },
  { name: "Ur", lat: 30.96, lng: 46.10, desc: "Where Abraham's journey began. Lech Lecha started here.", emoji: "🌟", cat: "biblical" },
  { name: "Egypt", lat: 30.85, lng: 31.34, desc: "Slavery and the Exodus. Passover begins here.", emoji: "⛓️", cat: "biblical" },
  { name: "Sea of Galilee", lat: 32.83, lng: 35.59, desc: "Rabbinic teachings. The Mishnah was compiled in Tiberias.", emoji: "🌊", cat: "biblical" },
  { name: "Moscow", lat: 55.76, lng: 37.62, desc: "Your maternal roots. Jews expelled 1891, but always returned.", emoji: "🇷🇺", cat: "russian" },
  { name: "Odessa", lat: 46.48, lng: 30.73, desc: "'Jewish capital' of the Russian Empire. Hebrew literature, Zionism.", emoji: "📖", cat: "russian" },
  { name: "Vilnius", lat: 54.69, lng: 25.28, desc: "'Jerusalem of the North.' Greatest center of Jewish scholarship.", emoji: "🎓", cat: "russian" },
  { name: "Minsk", lat: 53.90, lng: 27.57, desc: "Major Pale of Settlement city. Jews were 40%+ before WWII.", emoji: "🏘️", cat: "russian" },
  { name: "Kyiv", lat: 50.45, lng: 30.52, desc: "Oldest Eastern European Jewish community. Babi Yar, 1941.", emoji: "🕯️", cat: "russian" },
  { name: "Tel Aviv", lat: 32.08, lng: 34.78, desc: "Founded 1909 by Russian Jews. 1M+ Soviet Jews came in 1990s.", emoji: "🏙️", cat: "heritage" },
  { name: "Brooklyn", lat: 40.63, lng: -73.94, desc: "Largest Jewish community outside Israel. Brighton Beach = 'Little Odessa.'", emoji: "🗽", cat: "heritage" },
];

const RUSSIAN_TIMELINE = [
  { year: "7th C.", title: "Khazar Kingdom", desc: "A powerful kingdom whose rulers converted to Judaism — earliest Jewish presence in the region.", emoji: "👑" },
  { year: "1791", title: "Pale of Settlement", desc: "Catherine the Great confines Jews to a restricted zone. For 125+ years, Jews couldn't leave.", emoji: "🚧" },
  { year: "1881", title: "Pogroms Begin", desc: "Waves of violent attacks sweep through Jewish communities. Over 2 million flee — most to America.", emoji: "💔" },
  { year: "1882", title: "First Aliyah", desc: "Russian Jews fleeing pogroms establish farming communities in the Land of Israel.", emoji: "🌱" },
  { year: "1917", title: "Revolution", desc: "Pale abolished. Jews gain rights — but religion is suppressed. Synagogues close.", emoji: "⭐" },
  { year: "1941–45", title: "Holocaust in USSR", desc: "Over 1.5 million Soviet Jews murdered. Babi Yar: 33,000+ killed in two days.", emoji: "🕯️" },
  { year: "1970s", title: "Refuseniks", desc: "Soviet Jews denied exit visas. They lose jobs, face persecution. 'Let My People Go.'", emoji: "✊" },
  { year: "1990–91", title: "Great Exodus", desc: "Over 1 MILLION Russian Jews move to Israel. The largest modern aliyah.", emoji: "✈️" },
  { year: "Today", title: "Your Story", desc: "Your mom's family is part of this story. Russian Jewish resilience lives in you.", emoji: "💫" },
];

const VALUES = [
  { name: "Gemilut Chasadim", hebrew: "גמילות חסדים", meaning: "Acts of Loving-Kindness", desc: "The Talmud says the world stands on three things: Torah, worship, and acts of loving-kindness. Kindness is one of the three pillars holding up reality itself.", forKids: "Every act of kindness — holding a door, checking on a friend, helping without being asked — literally holds the world up. That's not a metaphor. The rabbis meant it." },
  { name: "Tikkun Olam", hebrew: "תיקון עולם", meaning: "Repairing the World", desc: "We are partners with God in fixing what's broken. Small acts of goodness repair pieces of the world.", forKids: "Every time you help someone, you're fixing the world. That's your superpower." },
  { name: "Hachnasat Orchim", hebrew: "הכנסת אורחים", meaning: "Welcoming Guests", desc: "Abraham's defining act was welcoming strangers — even while recovering from circumcision. The Talmud says welcoming guests is greater than receiving God's presence.", forKids: "Be the person who makes others feel welcome. At lunch, in class, on the team. Include people. It matters more than you know." },
  { name: "Chesed", hebrew: "חסד", meaning: "Loving-Kindness", desc: "Doing good not because you have to, but because it's who you are.", forKids: "Be kind first. Not because someone earned it — because that's who you choose to be." },
  { name: "Teshuvah", hebrew: "תשובה", meaning: "Return / Repentance", desc: "When you mess up, you can always come back. Nobody is defined by their worst moment.", forKids: "Made a mistake? You're not stuck there. Say sorry, fix what you can, keep going." },
  { name: "Kavod", hebrew: "כבוד", meaning: "Respect", desc: "Every person is made in God's image. Everyone deserves dignity — including yourself.", forKids: "Treat every person like they matter — because they do. And so do you." },
  { name: "Tzedakah", hebrew: "צדקה", meaning: "Justice & Giving", desc: "The word comes from 'tzedek' (justice). Sharing isn't charity — it's obligation.", forKids: "Sharing isn't just nice. In Judaism, it's required." },
  { name: "Emet", hebrew: "אמת", meaning: "Truth", desc: "The seal of God is truth. Honesty with others and yourself.", forKids: "Lies build walls between you and people you love." },
  { name: "Rodef Shalom", hebrew: "רודף שלום", meaning: "Pursuing Peace", desc: "Hillel said: 'Be of the disciples of Aaron — love peace and pursue peace.' Peace doesn't just happen; you chase it.", forKids: "Peace takes effort. Be the one who calms things down, not stirs them up." },
  { name: "Bal Tashchit", hebrew: "בל תשחית", meaning: "Don't Be Wasteful", desc: "Even in war, the Torah forbids cutting down fruit trees. Don't destroy what sustains life.", forKids: "Take care of the world around you. Don't waste food, resources, or opportunities." },
  { name: "Derech Eretz", hebrew: "דרך ארץ", meaning: "Common Decency", desc: "The Talmud says: 'Derech eretz (basic decency) came before the Torah.' Being a good human comes before being religious.", forKids: "Before anything else — before religion, before rules — just be a decent person. That comes first." },
  { name: "Kol Yisrael Areivim", hebrew: "כל ישראל ערבים", meaning: "All Israel Are Responsible", desc: "Every Jew is responsible for every other Jew. Expand this: every human is connected. When one suffers, we all feel it.", forKids: "You're not just responsible for yourself. When your friend is struggling, that's your business too. Show up for people." },
];

const EMOTIONAL_TOOLS = [
  { feeling: "Anxious", icon: "😰", teaching: "Gam Zu L'Tovah", source: "Taanit 21a", lesson: "'This too is for good.' Not that bad things are good — but you can grow through them.", practice: "Three slow breaths. Say: 'I'll grow through this.'" },
  { feeling: "Angry", icon: "😤", teaching: "Erekh Apayim", source: "Avot 5:14", lesson: "Slow to anger, easy to calm = truly wise.", practice: "Count to 10. Ask: Will this matter in a week?" },
  { feeling: "Lonely", icon: "😔", teaching: "Lo Tov L'vado", source: "Genesis 2:18", lesson: "'Not good to be alone.' Loneliness is a signal, not a flaw.", practice: "Reach out to one person today." },
  { feeling: "Ashamed", icon: "😞", teaching: "Gates Always Open", source: "Teshuvah", lesson: "No mistake makes you permanently broken.", practice: "Write what happened, then what you'd do next time." },
  { feeling: "Sad", icon: "😢", teaching: "Sitting Shiva", source: "Mourning", lesson: "Don't rush grief. Just show up for yourself.", practice: "Let yourself feel it. Tell someone trusted." },
  { feeling: "Proud", icon: "😊", teaching: "Hakarat HaTov", source: "Daily prayers", lesson: "Notice the good. Joy shared = joy multiplied.", practice: "Name three good things before bed." },
  { feeling: "Confused", icon: "🤔", teaching: "Two Inclinations", source: "Berakhot 61a", lesson: "Everyone has pulls toward good and selfishness. Choosing good = strength.", practice: "Which choice would I be proud of tomorrow?" },
  { feeling: "Overwhelmed", icon: "😫", teaching: "Lo Alekha", source: "Avot 2:16", lesson: "You don't have to finish. You just can't quit.", practice: "Pick ONE thing. Do it. Rest. Repeat." },
];

const WEEKLY_LESSONS = [
  { title: "The Power of Names", text: "In Judaism, names carry destiny. Ariah (אריה) means 'Lion of God' — strength and courage. Eliora (אליאורה) means 'God is my light.' When life gets dark, your name says light is with you.", source: "Jewish naming tradition" },
  { title: "Why We Ask Questions", text: "At the Seder, the youngest asks four questions. Judaism makes questioning sacred. The Talmud is rabbis disagreeing! Doubt isn't the opposite of faith — it's part of it.", source: "Passover Haggadah" },
  { title: "Judaism in One Sentence", text: "Shema Yisrael, Adonai Eloheinu, Adonai Echad — everything is connected. You, the stars, the trees, other people — all part of one unity.", source: "Deuteronomy 6:4" },
  { title: "What Makes a Mitzvah", text: "A mitzvah means 'commandment.' There are 613 in the Torah. The rabbis say: the ones between people are harder and more important than the ones between you and God.", source: "Yoma 85b" },
  { title: "What Kosher Really Means", text: "Kosher means 'fit' or 'proper.' It teaches mindfulness about what you consume — food, media, friendships, what you let into your mind.", source: "Leviticus 11" },
  { title: "Why Help Others?", text: "Hillel was asked to summarize all of Torah while standing on one foot. He said: 'What is hateful to you, do not do to others. The rest is commentary. Now go study.' Helping others IS the Torah.", source: "Talmud, Shabbat 31a" },
  { title: "The Story of Ruth", text: "Ruth wasn't born Jewish — she chose it out of love and loyalty. She became King David's great-grandmother. Choosing to belong is as powerful as being born into it.", source: "Book of Ruth" },
  { title: "Eight Levels of Giving", text: "Maimonides listed 8 levels of charity. The highest: helping someone become self-sufficient. A handout helps today. A job helps forever.", source: "Maimonides, Mishneh Torah" },
  { title: "The Golem of Prague", text: "Rabbi Loew created a Golem — a clay figure brought to life — to protect Jews from persecution. The story teaches: power must be used wisely.", source: "16th century folklore" },
  { title: "What Is the Talmud?", text: "The Talmud is like a 1,500-year-old group chat. Rabbis argue about everything. It teaches that truth comes from many perspectives, not one voice.", source: "Babylonian Talmud" },
];

const SHABBAT_INFO = {
  what: "Shabbat is the weekly rest, Friday sunset to Saturday night. More important than any holiday.",
  why: "God rested after creating the world. Rest isn't laziness — it's sacred.",
  how: "Candles, challah, family meal. Many unplug from tech. 25 hours of being present.",
  forKids: "One day a week with no homework pressure, no performance. Just being. That's the gift."
};

// ═══════════════════════════════════════
// GLOBE
// ═══════════════════════════════════════
function Globe({ onSelect, selected, filter }) {
  const canvasRef = useRef(null);
  const rot = useRef({ x: -0.3, y: 0 });
  const drag = useRef({ on: false, lx: 0, ly: 0 });
  const anim = useRef(null);
  const auto = useRef(true);

  const locs = filter === "all" ? LOCATIONS : LOCATIONS.filter(l => l.cat === filter);
  const catCol = { biblical: "#d4a853", russian: "#ef4444", historical: "#a78bfa", heritage: "#22c55e" };

  const proj = useCallback((lat, lng, rx, ry, R) => {
    const phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
    let x = -R * Math.sin(phi) * Math.cos(theta), y = R * Math.cos(phi), z = R * Math.sin(phi) * Math.sin(theta);
    let x2 = x * Math.cos(ry) - z * Math.sin(ry), z2 = x * Math.sin(ry) + z * Math.cos(ry);
    let y2 = y * Math.cos(rx) - z2 * Math.sin(rx), z3 = y * Math.sin(rx) + z2 * Math.cos(rx);
    return { x: x2, y: y2, z: z3, v: z3 > -R * 0.1 };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = cv.width = 380, H = cv.height = 380, CX = W / 2, CY = H / 2, R = 140;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const gl = ctx.createRadialGradient(CX, CY, R * 0.8, CX, CY, R * 1.4);
      gl.addColorStop(0, "rgba(212,168,83,0.08)"); gl.addColorStop(1, "transparent");
      ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      const gr = ctx.createRadialGradient(CX - 30, CY - 30, 10, CX, CY, R);
      gr.addColorStop(0, "#1e3a5f"); gr.addColorStop(0.6, "#0f1f33"); gr.addColorStop(1, "#060d18");
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
      ctx.strokeStyle = "rgba(212,168,83,0.25)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = "rgba(212,168,83,0.06)"; ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) { ctx.beginPath(); for (let lng = 0; lng <= 360; lng += 3) { const p = proj(lat, lng, rot.current.x, rot.current.y, R); if (p.v) { lng === 0 ? ctx.moveTo(CX + p.x, CY - p.y) : ctx.lineTo(CX + p.x, CY - p.y); } } ctx.stroke(); }
      locs.forEach(loc => {
        const gi = LOCATIONS.indexOf(loc), p = proj(loc.lat, loc.lng, rot.current.x, rot.current.y, R);
        if (!p.v) return;
        const sx = CX + p.x, sy = CY - p.y, isSel = selected === gi, r = isSel ? 8 : 5, col = catCol[loc.cat] || C.gold;
        ctx.beginPath(); ctx.arc(sx, sy, r + 4, 0, Math.PI * 2); ctx.fillStyle = isSel ? col + "4D" : col + "1F"; ctx.fill();
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = isSel ? col : col + "99"; ctx.fill();
        if (isSel || p.z > R * 0.5) { ctx.font = isSel ? "bold 11px Georgia" : "10px Georgia"; ctx.fillStyle = isSel ? "#fff" : col + "99"; ctx.textAlign = "center"; ctx.fillText(loc.name, sx, sy - r - 6); }
      });
      if (auto.current && !drag.current.on) rot.current.y += 0.003;
      anim.current = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(anim.current);
  }, [proj, selected, filter, locs]);

  const md = e => { drag.current = { on: true, lx: e.clientX, ly: e.clientY }; auto.current = false; };
  const mm = e => { if (!drag.current.on) return; rot.current.y += (e.clientX - drag.current.lx) * 0.005; rot.current.x += (e.clientY - drag.current.ly) * 0.005; drag.current.lx = e.clientX; drag.current.ly = e.clientY; };
  const mu = () => { drag.current.on = false; setTimeout(() => auto.current = true, 3000); };
  const ts = e => { const t = e.touches[0]; drag.current = { on: true, lx: t.clientX, ly: t.clientY }; auto.current = false; };
  const tm = e => { if (!drag.current.on) return; const t = e.touches[0]; rot.current.y += (t.clientX - drag.current.lx) * 0.005; rot.current.x += (t.clientY - drag.current.ly) * 0.005; drag.current.lx = t.clientX; drag.current.ly = t.clientY; };
  const ck = e => {
    const rect = canvasRef.current.getBoundingClientRect(), mx = (e.clientX - rect.left) * (380 / rect.width), my = (e.clientY - rect.top) * (380 / rect.height);
    let best = -1, bd = 20;
    locs.forEach(loc => { const gi = LOCATIONS.indexOf(loc), p = proj(loc.lat, loc.lng, rot.current.x, rot.current.y, 140); if (!p.v) return; const d = Math.sqrt((mx - 190 - p.x) ** 2 + (my - 190 + p.y) ** 2); if (d < bd) { best = gi; bd = d; } });
    if (best >= 0) onSelect(best);
  };

  return <canvas ref={canvasRef} width={380} height={380} style={{ cursor: "grab", maxWidth: "100%", height: "auto", touchAction: "none" }} onMouseDown={md} onMouseMove={mm} onMouseUp={mu} onMouseLeave={mu} onTouchStart={ts} onTouchMove={tm} onTouchEnd={mu} onClick={ck} />;
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
// ═══════════════════════════════════════
// ALEPH-BET (Hebrew Alphabet)
// ═══════════════════════════════════════
const ALEPH_BET = [
  { letter: "א", name: "Aleph", sound: "Silent", value: 1, meaning: "Ox / Leader", fun: "The first letter is silent — it teaches that before you speak, listen. Leadership begins with silence.", word: "אֱמֶת (Emet) — Truth" },
  { letter: "בּ", name: "Bet", sound: "B (or V without dot)", value: 2, meaning: "House", fun: "The Torah begins with this letter — 'Bereishit.' It's shaped like a house with one wall open, inviting you in.", word: "בְּרֵאשִׁית (Bereishit) — In the beginning" },
  { letter: "ג", name: "Gimel", sound: "G", value: 3, meaning: "Camel", fun: "A camel carries you through the desert. Gimel represents kindness — carrying others through hard times.", word: "גְּמִילוּת (Gemilut) — Acts of kindness" },
  { letter: "ד", name: "Dalet", sound: "D", value: 4, meaning: "Door", fun: "Every door is a choice. Dalet reminds you that opportunities are everywhere if you look.", word: "דֶּרֶךְ (Derekh) — Path, way" },
  { letter: "ה", name: "He", sound: "H", value: 5, meaning: "Window / Breath", fun: "God added this letter to Abraham and Sarah's names. It represents divine breath — the spark of life in you.", word: "הַלְלוּיָהּ (Halleluyah) — Praise God" },
  { letter: "ו", name: "Vav", sound: "V", value: 6, meaning: "Hook / Connection", fun: "Vav means 'and' — it connects words and ideas. You are the connection between your past and your future.", word: "וְאָהַבְתָּ (V'ahavta) — And you shall love" },
  { letter: "ז", name: "Zayin", sound: "Z", value: 7, meaning: "Weapon / Crown", fun: "Seven is the number of completion (7 days of creation). Zayin looks like a crowned letter — spiritual royalty.", word: "זְמַן (Z'man) — Time" },
  { letter: "ח", name: "Chet", sound: "Ch (guttural)", value: 8, meaning: "Fence / Life", fun: "Eight goes beyond seven (nature) — it represents the supernatural, miracles. Hanukkah is 8 nights!", word: "חַיִּים (Chayyim) — Life" },
  { letter: "ט", name: "Tet", sound: "T", value: 9, meaning: "Snake / Goodness", fun: "First appears in Torah in the word 'tov' (good). Even though it looks like a snake, it carries hidden goodness.", word: "טוֹב (Tov) — Good" },
  { letter: "י", name: "Yod", sound: "Y", value: 10, meaning: "Hand / Point", fun: "The smallest letter in the alphabet. God's name starts with Yod. Small things hold enormous power.", word: "יִשְׂרָאֵל (Yisrael) — Israel" },
  { letter: "כ", name: "Kaf", sound: "K (or Kh)", value: 20, meaning: "Palm of hand", fun: "An open palm — giving and receiving. Your hands can build, create, comfort, and heal.", word: "כָּבוֹד (Kavod) — Honor" },
  { letter: "ל", name: "Lamed", sound: "L", value: 30, meaning: "Shepherd's staff / Learning", fun: "The tallest letter — it towers above all others. It represents learning, which elevates you above everything.", word: "לֵב (Lev) — Heart" },
  { letter: "מ", name: "Mem", sound: "M", value: 40, meaning: "Water", fun: "Water flows, adapts, and gives life. The Torah is compared to water — refreshing, essential, always moving.", word: "מַיִם (Mayim) — Water" },
  { letter: "נ", name: "Nun", sound: "N", value: 50, meaning: "Fish / Faithfulness", fun: "A fish swims forward, never backward. Nun represents faithfulness — keep moving forward with trust.", word: "נֵר (Ner) — Candle, light" },
  { letter: "ס", name: "Samech", sound: "S", value: 60, meaning: "Support / Circle", fun: "Shaped like a circle — representing God's protection surrounding you. You are held.", word: "סֵפֶר (Sefer) — Book" },
  { letter: "ע", name: "Ayin", sound: "Silent (guttural)", value: 70, meaning: "Eye", fun: "See the world with wisdom. The Torah has 70 'faces' — 70 ways to understand every verse.", word: "עוֹלָם (Olam) — World, eternity" },
  { letter: "פ", name: "Pe", sound: "P (or F)", value: 80, meaning: "Mouth", fun: "Your mouth has incredible power — it can heal with kind words or hurt with cruel ones. Choose wisely.", word: "פָּנִים (Panim) — Face" },
  { letter: "צ", name: "Tzadi", sound: "Tz", value: 90, meaning: "Fishhook / Righteousness", fun: "Represents the 'tzaddik' — a righteous person. You don't have to be perfect, just sincere.", word: "צְדָקָה (Tzedakah) — Justice/charity" },
  { letter: "ק", name: "Qof", sound: "K", value: 100, meaning: "Back of head / Holiness", fun: "Represents 'kedushah' (holiness). Holiness means being set apart for a purpose — and you are.", word: "קָדוֹשׁ (Kadosh) — Holy" },
  { letter: "ר", name: "Resh", sound: "R", value: 200, meaning: "Head / Beginning", fun: "Resh means 'head' — it's about what you think. Your thoughts shape your reality.", word: "רַחֲמִים (Rachamim) — Compassion" },
  { letter: "שׁ", name: "Shin", sound: "Sh (or S)", value: 300, meaning: "Tooth / Fire", fun: "Three flames rising. Shin is on every mezuzah — the letter that guards Jewish homes. It stands for 'Shaddai' (God).", word: "שָׁלוֹם (Shalom) — Peace" },
  { letter: "ת", name: "Tav", sound: "T", value: 400, meaning: "Mark / Sign", fun: "The last letter. Tav means 'sign' or 'truth.' Emet (truth) is spelled with the first, middle, and last letters of the alphabet — truth spans everything.", word: "תּוֹרָה (Torah) — Teaching" },
];

const SECTIONS = [
  { id: "home", label: "Home", icon: STAR },
  { id: "alephbet", label: "א-ב", icon: "🔤" },
  { id: "torah", label: "Torah", icon: "📖" },
  { id: "prayer", label: "Prayer", icon: "🙏" },
  { id: "globe", label: "Globe", icon: "🌍" },
  { id: "heritage", label: "Heritage", icon: "🇷🇺" },
  { id: "holidays", label: "Holidays", icon: "🕎" },
  { id: "values", label: "Values", icon: "💎" },
  { id: "heart", label: "Heart", icon: "❤️" },
  { id: "lesson", label: "Lesson", icon: "📚" },
  { id: "shabbat", label: "Shabbat", icon: "🕯️" },
];

export default function TorahLight() {
  const [sec, setSec] = useState("home");
  const [selP, setSelP] = useState(null);
  const [selL, setSelL] = useState(null);
  const [selH, setSelH] = useState(null);
  const [selV, setSelV] = useState(null);
  const [selF, setSelF] = useState(null);
  const [selPr, setSelPr] = useState(null);
  const [selAB, setSelAB] = useState(null);
  const [gf, setGf] = useState("all");
  const [bf, setBf] = useState("all");
  const [pf, setPf] = useState("all");
  const [sd, setSd] = useState(null);
  const [li, setLi] = useState(0);
  const [hist, setHist] = useState(null);
  const [liveParasha, setLiveParasha] = useState(null);
  const [liveTorahText, setLiveTorahText] = useState(null);
  const [liveHaftarah, setLiveHaftarah] = useState(null);
  const [liveDaf, setLiveDaf] = useState(null);
  const [torahLoading, setTorahLoading] = useState(true);
  const [torahExpanded, setTorahExpanded] = useState(false);

  useEffect(() => {
    const w = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000);
    setLi(w % WEEKLY_LESSONS.length);
    setHist(getTodayHistory());
  }, []);

  useEffect(() => {
    fetch("https://www.hebcal.com/shabbat?cfg=json&geonameid=5128581&M=on")
      .then(r => r.json()).then(setSd).catch(() => {});
  }, []);

  // Sefaria: get this week's parasha, haftarah, daf yomi, then fetch actual text
  useEffect(() => {
    setTorahLoading(true);
    fetch("https://www.sefaria.org/api/calendars")
      .then(r => r.json())
      .then(data => {
        const items = data.calendar_items || [];
        const parasha = items.find(i => i.title?.en === "Parashat Hashavua");
        const haftarah = items.find(i => i.title?.en === "Haftarah");
        const daf = items.find(i => i.title?.en === "Daf Yomi");
        if (parasha) {
          setLiveParasha(parasha);
          // Fetch opening verses of the parasha (first aliyah or first 5 verses)
          const ref = parasha.ref;
          const bookChVerse = ref.split("-")[0]; // e.g. "Leviticus 1:1"
          const book = bookChVerse.split(" ")[0];
          const chVerse = bookChVerse.split(" ").slice(1).join(" ");
          const ch = chVerse.split(":")[0];
          // Fetch first 8 verses of the parasha
          const shortRef = `${book} ${ch}:1-8`;
          fetch(`https://www.sefaria.org/api/v3/texts/${encodeURIComponent(shortRef)}?version=english`)
            .then(r => r.json())
            .then(textData => {
              // Extract English text from versions
              const versions = textData.versions || [];
              const enVersion = versions.find(v => v.language === "en") || versions[0];
              if (enVersion?.text) {
                const texts = Array.isArray(enVersion.text) ? enVersion.text : [enVersion.text];
                setLiveTorahText({
                  ref: shortRef,
                  fullRef: ref,
                  verses: texts.slice(0, 8).map((t, i) => ({
                    num: i + 1,
                    text: typeof t === "string" ? t.replace(/<[^>]*>/g, "") : ""
                  })).filter(v => v.text),
                  book: parasha.displayValue?.en || "",
                  heBook: parasha.displayValue?.he || "",
                });
              }
              setTorahLoading(false);
            })
            .catch(() => setTorahLoading(false));
        } else {
          setTorahLoading(false);
        }
        if (haftarah) setLiveHaftarah(haftarah);
        if (daf) setLiveDaf(daf);
      })
      .catch(() => setTorahLoading(false));
  }, []);

  const lp = sd?.items?.find(i => i.category === "parashat");
  const lc = sd?.items?.find(i => i.category === "candles");
  const lh = sd?.items?.find(i => i.category === "havdalah");
  const hd = lp?.hdate || "Nissan 2, 5786";
  const cpn = lp?.title?.replace("Parashat ", "") || "Vayikra";
  const cpi = PARASHOT.findIndex(p => cpn.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(cpn.split("-")[0].toLowerCase().trim()));

  const gc = { background: C.glass, border: `1px solid ${C.gb}`, borderRadius: 16, padding: 24, backdropFilter: "blur(8px)" };
  const btn = a => ({ background: a ? `linear-gradient(135deg,${C.gold},${C.goldDim})` : "transparent", border: `1px solid ${a ? C.gold : C.gb}`, borderRadius: 10, padding: "10px 16px", color: a ? C.night : C.parchment, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, fontWeight: a ? 700 : 400, transition: "all .3s", textAlign: "left", width: "100%" });
  const pl = (a, c) => ({ background: a ? (c || C.gold) : "transparent", color: a ? C.night : (c || C.goldLight), border: `1px solid ${a ? (c || C.gold) : "rgba(212,168,83,0.2)"}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 12, fontWeight: a ? 700 : 400, whiteSpace: "nowrap", transition: "all .3s" });

  const fp = bf === "all" ? PARASHOT : PARASHOT.filter(p => p.book === bf);
  const fpray = pf === "all" ? PRAYERS : PRAYERS.filter(p => p.category === pf);

  // ─── HOME ───
  const renderHome = () => (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(212,168,83,0.4))" }}>{STAR}</div>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: 36, color: C.goldLight, margin: "0 0 8px", letterSpacing: 2, fontWeight: 400 }}>TORAH LIGHT</h1>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 14, color: C.gold, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 32px" }}>A Living Curriculum</p>
      <div style={{ ...gc, maxWidth: 520, margin: "0 auto 20px", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>THIS WEEK</span>
          <span style={{ color: C.gold, fontSize: 13 }}>{hd}</span>
        </div>
        <div style={{ borderTop: `1px solid ${C.gb}`, paddingTop: 16 }}>
          <p style={{ color: C.muted, fontSize: 11, margin: "0 0 4px", letterSpacing: 2, textTransform: "uppercase" }}>Torah Portion</p>
          <p style={{ color: C.goldLight, fontSize: 22, margin: "0 0 8px" }}>📖 Parashat {cpn}</p>
          {cpi >= 0 && <>
            <p style={{ color: C.parchmentDark, fontSize: 14, margin: "0 0 12px", lineHeight: 1.6 }}>{PARASHOT[cpi].summary}</p>
            <div style={{ padding: "12px 16px", background: "rgba(212,168,83,0.06)", borderRadius: 10, borderLeft: `3px solid ${C.gold}` }}>
              <p style={{ color: C.goldLight, fontSize: 13, margin: 0, fontStyle: "italic" }}>"{PARASHOT[cpi].wisdom}"</p>
            </div>
          </>}
        </div>
        {lc && <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140, padding: "10px 14px", background: "rgba(212,168,83,0.04)", borderRadius: 8 }}>
            <p style={{ color: C.muted, fontSize: 10, margin: "0 0 2px", letterSpacing: 1 }}>CANDLE LIGHTING</p>
            <p style={{ color: C.goldLight, fontSize: 15, margin: 0 }}>🕯️ {lc.title.replace("Candle lighting: ", "")}</p>
          </div>
          {lh && <div style={{ flex: 1, minWidth: 140, padding: "10px 14px", background: "rgba(212,168,83,0.04)", borderRadius: 8 }}>
            <p style={{ color: C.muted, fontSize: 10, margin: "0 0 2px", letterSpacing: 1 }}>HAVDALAH</p>
            <p style={{ color: C.goldLight, fontSize: 15, margin: 0 }}>✨ {lh.title.replace(/Havdalah.*?: /, "")}</p>
          </div>}
        </div>}
      </div>

      {/* Live Torah Reading from Sefaria */}
      {liveTorahText && <div style={{ ...gc, maxWidth: 520, margin: "0 auto 20px", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: C.sage, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>📜 LIVE TORAH READING</span>
          <span style={{ color: C.muted, fontSize: 11 }}>{liveTorahText.heBook}</span>
        </div>
        <p style={{ color: C.goldLight, fontSize: 15, margin: "0 0 4px" }}>Parashat {liveTorahText.book} — Opening Verses</p>
        <p style={{ color: C.muted, fontSize: 11, margin: "0 0 12px" }}>{liveTorahText.fullRef} · via Sefaria.org</p>
        {liveTorahText.verses.slice(0, torahExpanded ? 8 : 3).map(v => (
          <div key={v.num} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid rgba(212,168,83,0.15)" }}>
            <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginRight: 6 }}>{v.num}</span>
            <span style={{ color: C.parchmentDark, fontSize: 13, lineHeight: 1.7 }}>{v.text}</span>
          </div>
        ))}
        {liveTorahText.verses.length > 3 && (
          <button onClick={() => setTorahExpanded(!torahExpanded)} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 12, padding: "8px 0 0", textDecoration: "underline" }}>
            {torahExpanded ? "Show less" : `Read all ${liveTorahText.verses.length} verses...`}
          </button>
        )}
        {(liveHaftarah || liveDaf) && <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(212,168,83,0.04)", borderRadius: 8 }}>
          {liveHaftarah && <p style={{ color: C.muted, fontSize: 11, margin: "0 0 2px" }}>Haftarah: <span style={{ color: C.parchmentDark }}>{liveHaftarah.displayValue?.en} ({liveHaftarah.ref})</span></p>}
          {liveDaf && <p style={{ color: C.muted, fontSize: 11, margin: 0 }}>Daf Yomi: <span style={{ color: C.parchmentDark }}>{liveDaf.displayValue?.en}</span></p>}
        </div>}
      </div>}
      {torahLoading && !liveTorahText && <div style={{ ...gc, maxWidth: 520, margin: "0 auto 20px", textAlign: "center" }}>
        <p style={{ color: C.muted, fontSize: 13, margin: 0, fontStyle: "italic" }}>Loading live Torah reading from Sefaria...</p>
      </div>}

      {hist && <div style={{ ...gc, maxWidth: 520, margin: "0 auto 20px", textAlign: "left" }}>
        <p style={{ color: C.purple, fontSize: 11, margin: "0 0 8px", fontWeight: 700, letterSpacing: 1 }}>{hist.isToday ? "📅 THIS DAY IN JEWISH HISTORY" : "📅 FROM JEWISH HISTORY"}</p>
        {hist.events.map((e, i) => (
          <div key={i} style={{ marginBottom: i < hist.events.length - 1 ? 10 : 0 }}>
            <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{e.year}: </span>
            <span style={{ color: C.parchmentDark, fontSize: 13, lineHeight: 1.6 }}>{e.event}</span>
          </div>
        ))}
      </div>}

      <div style={{ ...gc, maxWidth: 520, margin: "0 auto 20px" }}>
        <p style={{ color: C.gold, fontSize: 14, margin: "0 0 12px", fontWeight: 700 }}>🫓 Passover — April 1st</p>
        <p style={{ color: C.parchmentDark, fontSize: 13, margin: 0, lineHeight: 1.6 }}>Pesach celebrates freedom. The Seder retells the Exodus with symbols, songs, and four cups of wine.</p>
      </div>
    </div>
  );

  // ─── ALEPH-BET ───
  const renderAlephBet = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>The Aleph-Bet</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>The Hebrew alphabet has 22 letters. Hebrew reads right-to-left. Every letter has a name, a sound, a number, and a deeper meaning.</p>
      <div style={{ ...gc, marginBottom: 20 }}>
        <p style={{ color: C.gold, fontSize: 13, margin: "0 0 8px", fontWeight: 700 }}>Your Names in Hebrew</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: C.goldLight, fontSize: 28, margin: "0 0 2px", fontFamily: "Georgia,serif" }}>אַרְיֵה</p>
            <p style={{ color: C.parchmentDark, fontSize: 12, margin: 0 }}>Ariah — Lion of God</p>
          </div>
          <div>
            <p style={{ color: C.goldLight, fontSize: 28, margin: "0 0 2px", fontFamily: "Georgia,serif" }}>אֶלִיאוֹרָה</p>
            <p style={{ color: C.parchmentDark, fontSize: 12, margin: 0 }}>Eliora — God is my light</p>
          </div>
        </div>
      </div>
      <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Tap any letter to explore its meaning.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: 6, marginBottom: 20 }}>
        {ALEPH_BET.map((l, i) => (
          <button key={l.name} onClick={() => setSelAB(i === selAB ? null : i)} style={{
            background: i === selAB ? C.gold : C.glass,
            border: `1px solid ${i === selAB ? C.gold : C.gb}`,
            borderRadius: 10, padding: "10px 4px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            transition: "all .2s",
          }}>
            <span style={{ fontSize: 26, color: i === selAB ? C.night : C.goldLight, fontFamily: "Georgia,serif" }}>{l.letter}</span>
            <span style={{ fontSize: 9, color: i === selAB ? C.night : C.muted }}>{l.name}</span>
          </button>
        ))}
      </div>
      {selAB !== null && (
        <div style={{ ...gc, borderLeft: `3px solid ${C.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 56, color: C.goldLight, fontFamily: "Georgia,serif", lineHeight: 1 }}>{ALEPH_BET[selAB].letter}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: C.goldLight, fontSize: 20, margin: "0 0 2px", fontWeight: 700 }}>{ALEPH_BET[selAB].name}</p>
              <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>Letter #{selAB + 1} · Value: {ALEPH_BET[selAB].value}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120, padding: "8px 12px", background: "rgba(212,168,83,0.04)", borderRadius: 8 }}>
              <p style={{ color: C.muted, fontSize: 10, margin: "0 0 2px", letterSpacing: 1 }}>SOUND</p>
              <p style={{ color: C.goldLight, fontSize: 14, margin: 0 }}>{ALEPH_BET[selAB].sound}</p>
            </div>
            <div style={{ flex: 1, minWidth: 120, padding: "8px 12px", background: "rgba(212,168,83,0.04)", borderRadius: 8 }}>
              <p style={{ color: C.muted, fontSize: 10, margin: "0 0 2px", letterSpacing: 1 }}>MEANS</p>
              <p style={{ color: C.goldLight, fontSize: 14, margin: 0 }}>{ALEPH_BET[selAB].meaning}</p>
            </div>
          </div>
          <p style={{ color: C.parchmentDark, fontSize: 14, margin: "0 0 12px", lineHeight: 1.7 }}>{ALEPH_BET[selAB].fun}</p>
          <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.06)", borderRadius: 8, borderLeft: `3px solid ${C.sage}` }}>
            <p style={{ color: C.sage, fontSize: 10, margin: "0 0 2px", fontWeight: 700, letterSpacing: 1 }}>HEBREW WORD</p>
            <p style={{ color: C.parchment, fontSize: 14, margin: 0 }}>{ALEPH_BET[selAB].word}</p>
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, ...gc }}>
        <p style={{ color: C.gold, fontSize: 13, margin: "0 0 8px", fontWeight: 700 }}>Fun Facts</p>
        <p style={{ color: C.parchmentDark, fontSize: 13, margin: "0 0 8px", lineHeight: 1.7 }}>Hebrew is read right-to-left — the opposite of English. The alphabet is over 3,000 years old. There are no capital or lowercase letters. Five letters (Kaf, Mem, Nun, Pe, Tzadi) change shape at the end of a word.</p>
        <p style={{ color: C.parchmentDark, fontSize: 13, margin: "0 0 8px", lineHeight: 1.7 }}>Every letter has a number (gematria). The word Torah (תּוֹרָה) adds up to 611. The word for truth, Emet (אמת), uses the first, middle, and last letters — truth spans the entire alphabet.</p>
        <p style={{ color: C.parchmentDark, fontSize: 13, margin: 0, lineHeight: 1.7 }}>In Kabbalah (Jewish mysticism), each letter is believed to be a channel of divine energy. God spoke the world into existence using these letters — they aren't just an alphabet, they're the building blocks of creation.</p>
      </div>
    </div>
  );

  // ─── TORAH ───
  const renderTorah = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>All 54 Torah Portions</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Read weekly in synagogue. Click to explore.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {["all", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"].map(b => <button key={b} onClick={() => setBf(b)} style={pl(bf === b)}>{b === "all" ? "All 54" : b}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {fp.map(p => { const gi = PARASHOT.indexOf(p), cur = gi === cpi; return (
          <button key={p.name} onClick={() => setSelP(gi === selP ? null : gi)} style={btn(gi === selP)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{p.emoji} <strong>{p.name}</strong>{cur && <span style={{ marginLeft: 8, fontSize: 10, background: C.sage, color: C.night, padding: "2px 8px", borderRadius: 10 }}>THIS WEEK</span>}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{p.book}</span>
            </div>
            {gi === selP && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gb}` }}>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>{p.ref}</p>
              <p style={{ fontSize: 13, color: C.goldLight, margin: "0 0 4px", fontWeight: 700 }}>{p.theme}</p>
              <p style={{ fontSize: 13, color: C.parchmentDark, margin: "0 0 12px", lineHeight: 1.6, fontWeight: 400 }}>{p.summary}</p>
              <div style={{ padding: "10px 14px", background: "rgba(212,168,83,0.06)", borderRadius: 8, borderLeft: `3px solid ${C.gold}` }}>
                <p style={{ fontSize: 12, color: C.goldLight, margin: 0, fontStyle: "italic", fontWeight: 400 }}>"{p.wisdom}"</p>
              </div>
              <a href={`https://www.sefaria.org/${p.ref.replace(/\s/g, "_").replace(/[–:]/g, ".")}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, color: C.sky, fontSize: 12, textDecoration: "underline" }}>
                Read full text on Sefaria →
              </a>
            </div>}
          </button>
        ); })}
      </div>
    </div>
  );

  // ─── PRAYER ───
  const renderPrayer = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>🙏 Jewish Prayers & Blessings</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Learn the prayers that have connected Jewish people for thousands of years. Each includes Hebrew, pronunciation, and what it means for your life.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {["all", "Morning", "Core", "Blessings", "Shabbat", "Evening", "Special"].map(c => <button key={c} onClick={() => setPf(c)} style={pl(pf === c)}>{c === "all" ? "All" : c}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fpray.map((p, i) => { const gi = PRAYERS.indexOf(p); return (
          <button key={p.name} onClick={() => setSelPr(gi === selPr ? null : gi)} style={btn(gi === selPr)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{p.name}</strong>
              <span style={{ fontSize: 16, color: C.gold }}>{p.hebrew}</span>
            </div>
            <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0", fontWeight: 400 }}>{p.category} · {p.when.split(".")[0]}</p>
            {gi === selPr && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gb}` }}>
              <div style={{ padding: "14px 16px", background: "rgba(212,168,83,0.08)", borderRadius: 10, marginBottom: 12 }}>
                <p style={{ color: C.gold, fontSize: 20, margin: "0 0 8px", fontFamily: "Georgia,serif", textAlign: "center" }}>{p.hebrew}</p>
                <p style={{ color: C.goldLight, fontSize: 13, margin: "0 0 8px", fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>{p.transliteration}</p>
                <p style={{ color: C.parchment, fontSize: 13, margin: 0, textAlign: "center", lineHeight: 1.6 }}>{p.english}</p>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px", fontWeight: 700 }}>When:</p>
              <p style={{ fontSize: 13, color: C.parchmentDark, margin: "0 0 12px", lineHeight: 1.6, fontWeight: 400 }}>{p.when}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px", fontWeight: 700 }}>Why It Matters:</p>
              <p style={{ fontSize: 13, color: C.parchmentDark, margin: "0 0 12px", lineHeight: 1.6, fontWeight: 400 }}>{p.whyItMatters}</p>
              <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.06)", borderRadius: 8, borderLeft: `3px solid ${C.sage}` }}>
                <p style={{ fontSize: 11, color: C.sage, margin: "0 0 2px", fontWeight: 700 }}>FOR YOU</p>
                <p style={{ fontSize: 13, color: C.parchment, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>{p.forKids}</p>
              </div>
            </div>}
          </button>
        ); })}
      </div>
    </div>
  );

  // ─── GLOBE ───
  const renderGlobe = () => {
    const cc = { all: C.gold, biblical: C.gold, russian: C.ember, historical: C.purple, heritage: C.sage };
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>Jewish History Globe</h2>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Drag to explore. Tap dots to learn.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {[{ id: "all", l: "All" }, { id: "biblical", l: "Biblical" }, { id: "russian", l: "Russian" }, { id: "historical", l: "Historical" }, { id: "heritage", l: "Modern" }].map(f => <button key={f.id} onClick={() => setGf(f.id)} style={pl(gf === f.id, cc[f.id])}>{f.l}</button>)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Globe onSelect={setSelL} selected={selL} filter={gf} /></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {(gf === "all" ? LOCATIONS : LOCATIONS.filter(l => l.cat === gf)).map(loc => { const gi = LOCATIONS.indexOf(loc); return <button key={loc.name} onClick={() => setSelL(gi === selL ? null : gi)} style={pl(gi === selL, cc[loc.cat])}>{loc.emoji} {loc.name}</button>; })}
        </div>
        {selL !== null && <div style={{ ...gc, borderLeft: `3px solid ${cc[LOCATIONS[selL].cat] || C.gold}` }}>
          <p style={{ fontSize: 20, margin: "0 0 4px", color: C.goldLight }}>{LOCATIONS[selL].emoji} {LOCATIONS[selL].name}</p>
          <p style={{ fontSize: 14, margin: 0, color: C.parchmentDark, lineHeight: 1.7 }}>{LOCATIONS[selL].desc}</p>
        </div>}
      </div>
    );
  };

  // ─── HERITAGE ───
  const renderHeritage = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>Your Russian Jewish Heritage</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>Your mom's family comes from one of the most remarkable chapters in Jewish history.</p>
      <p style={{ color: C.parchmentDark, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>Russian Jews survived centuries of persecution and built a culture of extraordinary resilience, humor, and brilliance.</p>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,${C.ember},${C.gold})` }} />
        {RUSSIAN_TIMELINE.map((item, i) => (
          <div key={i} style={{ marginBottom: 20, position: "relative" }}>
            <div style={{ position: "absolute", left: -20, top: 4, width: 12, height: 12, borderRadius: "50%", background: i === RUSSIAN_TIMELINE.length - 1 ? C.gold : C.ember, border: `2px solid ${C.night}` }} />
            <div style={{ ...gc, marginLeft: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.ember, fontSize: 12, fontWeight: 700 }}>{item.year}</span>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
              </div>
              <p style={{ color: C.goldLight, fontSize: 15, margin: "0 0 6px", fontWeight: 700 }}>{item.title}</p>
              <p style={{ color: C.parchmentDark, fontSize: 13, margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(239,68,68,0.06)", borderRadius: 12, borderLeft: `3px solid ${C.ember}` }}>
        <p style={{ fontSize: 11, color: C.ember, margin: "0 0 4px", fontWeight: 700, letterSpacing: 1 }}>THE CONNECTION TO ISRAEL</p>
        <p style={{ fontSize: 13, color: C.parchment, margin: 0, lineHeight: 1.7 }}>Nearly every wave of immigration to Israel was driven by Russian Jews — from 1882 to the 1990s exodus of over a million. Russian Jews didn't just move to Israel — they helped build it.</p>
      </div>
    </div>
  );

  // ─── Compact sections: Holidays, Values, Heart, Lesson, Shabbat ───
  const renderHolidays = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>Jewish Holidays 5786–5787</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>A cycle of remembrance, celebration, and growth.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HOLIDAYS_2026.map((h, i) => (
          <button key={h.name} onClick={() => setSelH(i === selH ? null : i)} style={btn(i === selH)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{h.emoji} <strong>{h.name}</strong>{h.name === "Passover" && <span style={{ marginLeft: 8, fontSize: 10, background: C.ember, color: "#fff", padding: "2px 8px", borderRadius: 10 }}>COMING UP</span>}</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{h.date}</span>
            </div>
            {i === selH && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gb}` }}>
              <p style={{ fontSize: 16, color: C.gold, margin: "0 0 4px" }}>{h.hebrew}</p>
              <p style={{ fontSize: 13, color: C.goldLight, margin: "0 0 4px", fontWeight: 700 }}>{h.theme}</p>
              <p style={{ fontSize: 13, color: C.parchmentDark, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>{h.desc}</p>
            </div>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderValues = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>Core Jewish Values</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Building blocks of a meaningful life — with helpfulness at the center.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {VALUES.map((v, i) => (
          <button key={v.name} onClick={() => setSelV(i === selV ? null : i)} style={btn(i === selV)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{v.name}</strong>
              <span style={{ fontSize: 14, color: C.gold }}>{v.hebrew}</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0", fontWeight: 400 }}>{v.meaning}</p>
            {i === selV && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gb}` }}>
              <p style={{ fontSize: 13, color: C.parchmentDark, margin: "0 0 12px", lineHeight: 1.6, fontWeight: 400 }}>{v.desc}</p>
              <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.06)", borderRadius: 8, borderLeft: `3px solid ${C.sage}` }}>
                <p style={{ fontSize: 11, color: C.sage, margin: "0 0 2px", fontWeight: 700 }}>FOR YOU</p>
                <p style={{ fontSize: 13, color: C.parchment, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>{v.forKids}</p>
              </div>
            </div>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderHeart = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>When You're Feeling...</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Judaism has wisdom for every emotion.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {EMOTIONAL_TOOLS.map((e, i) => <button key={e.feeling} onClick={() => setSelF(i === selF ? null : i)} style={pl(i === selF)}>{e.icon} {e.feeling}</button>)}
      </div>
      {selF !== null && <div style={gc}>
        <p style={{ fontSize: 28, margin: "0 0 8px" }}>{EMOTIONAL_TOOLS[selF].icon}</p>
        <p style={{ fontSize: 18, color: C.goldLight, margin: "0 0 4px" }}>{EMOTIONAL_TOOLS[selF].teaching}</p>
        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 12px" }}>{EMOTIONAL_TOOLS[selF].source}</p>
        <p style={{ fontSize: 14, color: C.parchmentDark, margin: "0 0 16px", lineHeight: 1.7 }}>{EMOTIONAL_TOOLS[selF].lesson}</p>
        <div style={{ padding: "14px 16px", background: "rgba(167,139,250,0.06)", borderRadius: 10, borderLeft: `3px solid ${C.purple}` }}>
          <p style={{ fontSize: 11, color: C.purple, margin: "0 0 4px", fontWeight: 700, letterSpacing: 1 }}>TRY THIS</p>
          <p style={{ fontSize: 13, color: C.parchment, margin: 0, lineHeight: 1.7 }}>{EMOTIONAL_TOOLS[selF].practice}</p>
        </div>
      </div>}
    </div>
  );

  const renderLesson = () => { const l = WEEKLY_LESSONS[li]; return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>Weekly Lesson</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>A new teaching each week.</p>
      <div style={{ ...gc, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: C.sage, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>THIS WEEK</span>
          <span style={{ color: C.muted, fontSize: 11 }}>#{li + 1}/{WEEKLY_LESSONS.length}</span>
        </div>
        <p style={{ fontSize: 20, color: C.goldLight, margin: "0 0 12px" }}>{l.title}</p>
        <p style={{ fontSize: 14, color: C.parchmentDark, margin: "0 0 12px", lineHeight: 1.8 }}>{l.text}</p>
        <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Source: {l.source}</p>
      </div>
      <p style={{ color: C.gold, fontSize: 14, marginBottom: 12, fontWeight: 700 }}>Browse All</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_LESSONS.map((wl, i) => <button key={i} onClick={() => setLi(i)} style={btn(i === li)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{wl.title}</strong>
            {i === li && <span style={{ fontSize: 10, background: C.sage, color: C.night, padding: "2px 8px", borderRadius: 10 }}>ACTIVE</span>}
          </div>
          {i === li && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gb}` }}>
            <p style={{ fontSize: 13, color: C.parchmentDark, margin: "0 0 8px", lineHeight: 1.7, fontWeight: 400 }}>{wl.text}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 400 }}>{wl.source}</p>
          </div>}
        </button>)}
      </div>
    </div>
  ); };

  const renderShabbat = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: C.goldLight, fontSize: 22, marginBottom: 4 }}>🕯️ Shabbat</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Weekly reset for your soul.</p>
      {[{ l: "What is it?", t: SHABBAT_INFO.what }, { l: "Why?", t: SHABBAT_INFO.why }, { l: "How?", t: SHABBAT_INFO.how }].map(i =>
        <div key={i.l} style={{ ...gc, marginBottom: 16 }}><p style={{ color: C.gold, margin: "0 0 8px", fontWeight: 700 }}>{i.l}</p><p style={{ color: C.parchmentDark, margin: 0, lineHeight: 1.7 }}>{i.t}</p></div>
      )}
      <div style={{ padding: "16px 20px", background: "rgba(212,168,83,0.06)", borderRadius: 12, borderLeft: `3px solid ${C.gold}` }}>
        <p style={{ fontSize: 11, color: C.gold, margin: "0 0 4px", fontWeight: 700, letterSpacing: 1 }}>REAL TALK</p>
        <p style={{ fontSize: 14, color: C.parchment, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>{SHABBAT_INFO.forKids}</p>
      </div>
    </div>
  );

  const R = { home: renderHome, alephbet: renderAlephBet, torah: renderTorah, prayer: renderPrayer, globe: renderGlobe, heritage: renderHeritage, holidays: renderHolidays, values: renderValues, heart: renderHeart, lesson: renderLesson, shabbat: renderShabbat };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg,${C.night} 0%,${C.deep} 40%,${C.ocean} 100%)`, fontFamily: "Georgia,'Times New Roman',serif", color: C.parchment, display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", gap: 2, padding: "8px 6px 0", overflowX: "auto", borderBottom: `1px solid ${C.gb}`, background: "rgba(10,14,26,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, WebkitOverflowScrolling: "touch" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSec(s.id)} style={{ background: sec === s.id ? "rgba(212,168,83,0.12)" : "transparent", border: "none", borderBottom: sec === s.id ? `2px solid ${C.gold}` : "2px solid transparent", color: sec === s.id ? C.goldLight : C.muted, padding: "8px 10px", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 10, whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 44, transition: "all .2s" }}>
            <span style={{ fontSize: 15 }}>{s.icon}</span><span>{s.label}</span>
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, maxWidth: 700, margin: "0 auto", width: "100%" }}>{(R[sec] || renderHome)()}</main>
      <footer style={{ textAlign: "center", padding: "24px 20px", borderTop: `1px solid ${C.gb}`, fontFamily: "Georgia,serif", fontSize: 11 }}>
        <p style={{ margin: "0 0 4px", color: C.parchmentDark, fontSize: 13 }}>Torah Light</p>
        <p style={{ margin: "0 0 8px", color: C.goldDim }}>Built with love for <strong style={{ color: C.goldLight }}>Ariah (אריה)</strong> & <strong style={{ color: C.goldLight }}>Isabelle Eliora (אליאורה)</strong></p>
        <p style={{ margin: 0, letterSpacing: 2, fontSize: 12, color: C.goldDim }}>AMDG {STAR} Am Yisrael Chai</p>
      </footer>
    </div>
  );
}
