import React, { useEffect, useMemo, useRef, useState } from "react";

const styles = [
  { name: "lyrical", color: "blue", stats: { craft: 5, viral: 1, underground: 4, mainstream: 1 } },
  { name: "sad late-night music", color: "purple", stats: { craft: 2, viral: 3, underground: 3, mainstream: 3 } },
  { name: "cloud rap", color: "pink", stats: { craft: 2, viral: 2, underground: 5, mainstream: 2 } },
  { name: "rage", color: "coral", stats: { craft: 1, viral: 5, underground: 3, mainstream: 4 } },
  { name: "jazz rap", color: "gold", stats: { craft: 5, viral: 1, underground: 5, mainstream: 1 } },
  { name: "melodic", color: "teal", stats: { craft: 2, viral: 4, underground: 1, mainstream: 5 } },
];

const producers = [
  { id: "own", name: "make own beat", price: 0, bonus: { craft: 0, viral: 0, underground: 0, mainstream: 0 }, fixedTier: null, fixedBeatQuality: null },
  { id: "sora", name: "Basement Sora", price: 50, bonus: { craft: 1, viral: 0, underground: 2, mainstream: 0 }, fixedTier: "solid", fixedBeatQuality: 30 },
  { id: "miko", name: "404Miko", price: 150, bonus: { craft: 0, viral: 2, underground: 1, mainstream: 1 }, fixedTier: "fire", fixedBeatQuality: 40 },
  { id: "velvet", name: "Velvet Axis", price: 400, bonus: { craft: 2, viral: 0, underground: 2, mainstream: 0 }, fixedTier: "banger", fixedBeatQuality: 50 },
  { id: "brickwall", name: "DJ Brickwall", price: 1000, bonus: { craft: 0, viral: 3, underground: 0, mainstream: 1 }, fixedTier: "legendary", fixedBeatQuality: 60 },
];

const studios = [
  { name: "Bedroom", cost: 0, setupNeeded: 0, quality: 0, description: "free starter setup" },
  { name: "Garage Setup", cost: 300, setupNeeded: 12, quality: 8, description: "less echo, more hope" },
  { name: "Local Studio", cost: 900, setupNeeded: 25, quality: 17, description: "real booth time" },
  { name: "Pro Studio", cost: 2500, setupNeeded: 45, quality: 28, description: "serious engineer room" },
];

const studioUpgrades = [
  { name: "Pocket Notebook", detail: "bars written in class margins", cost: 50, stat: "lyrics", gain: 5, effect: "+5 Lyrics", helps: "Small boost to writing quality" },
  { name: "Phone Voice Memos", detail: "record ideas before they vanish", cost: 75, stat: "production", gain: 5, effect: "+5 Production", helps: "Tiny recording quality boost" },
  { name: "Starter USB Mic", detail: "not clean, but usable", cost: 150, stat: "production", gain: 10, effect: "+10 Production", helps: "Better recordings at home" },
  { name: "Cheap Sample Pack", detail: "some loops actually hit", cost: 225, stat: "beats", gain: 10, effect: "+10 Beats", helps: "Better own-beat quality" },
  { name: "Foam Panels", detail: "barely stick to the wall", cost: 350, stat: "production", gain: 15, effect: "+15 Production", helps: "Less room echo when recording" },
  { name: "Rhyme Journal Stack", detail: "more pages, fewer excuses", cost: 450, stat: "lyrics", gain: 15, effect: "+15 Lyrics", helps: "More consistent writing" },
  { name: "Basic MIDI Keyboard", detail: "tiny keys, real ideas", cost: 650, stat: "beats", gain: 25, effect: "+25 Beats", helps: "Own beats stop sounding random" },
  { name: "Garage Setup", detail: "less bedroom, more session", cost: 900, stat: "production", gain: 25, studioName: "Garage Setup", effect: "+25 Production + unlock Garage", helps: "+8 studio recording quality" },
  { name: "Better Laptop", detail: "exports without crying", cost: 1200, stat: "production", gain: 30, effect: "+30 Production", helps: "Cleaner recording workflow" },
  { name: "Drum Kit Library", detail: "kicks finally punch", cost: 1800, stat: "beats", gain: 35, effect: "+35 Beats", helps: "Stronger own-beat ceiling" },
  { name: "Studio Monitors", detail: "hear the bad mix clearly", cost: 2500, stat: "production", gain: 40, effect: "+40 Production", helps: "Better engineering and mix quality" },
  { name: "Punchline Study Pack", detail: "wordplay training arc", cost: 3200, stat: "lyrics", gain: 40, effect: "+40 Lyrics", helps: "Higher lyric quality ceiling" },
  { name: "Local Studio Pass", detail: "actual booth time", cost: 5000, stat: "production", gain: 100, studioName: "Local Studio", effect: "+100 Production + unlock Local Studio", helps: "+17 studio recording quality" },
  { name: "Producer Plugin Bundle", detail: "expensive buttons that work", cost: 7500, stat: "beats", gain: 120, effect: "+120 Beats", helps: "Big own-beat quality jump" },
  { name: "Vocal Chain Presets", detail: "less raw, more polished", cost: 10000, stat: "production", gain: 150, effect: "+150 Production", helps: "Major final-quality boost" },
  { name: "Writing Retreat", detail: "focus like the phone died", cost: 14000, stat: "lyrics", gain: 150, effect: "+150 Lyrics", helps: "Huge writing skill boost" },
  { name: "Pro Studio Access", detail: "engineer stops judging", cost: 20000, stat: "production", gain: 250, studioName: "Pro Studio", effect: "+250 Production + unlock Pro Studio", helps: "+28 studio recording quality" },
];

const skills = [
  { id: "perfectionist", name: "Perfectionist", unlockFans: 5000, cost: 2500, text: "+1 writing roll per song" },
  { id: "marketing", name: "Marketing Brain", unlockFans: 10000, cost: 7000, text: "+20% fan gain on releases" },
  { id: "thickSkin", name: "Thick Skin", unlockFans: 1000, cost: 1200, text: "Negative events cause 50% less stress" },
  { id: "plug", name: "Industry Plug", unlockFans: 100000, cost: 35000, text: "+25% label/rich event chance" },
  { id: "beatEar", name: "Beat Ear", unlockFans: 25000, cost: 18000, text: "Better own-beat consistency" },
  { id: "trendsetter", name: "Trendsetter", unlockFans: 50000, cost: 45000, text: "+50% viral moment chance" },
];

const projectTypes = {
  mixtape: { label: "Mixtape", minSongs: 5, maxSongs: 10, fanMultiplier: 1.4, payoutMultiplier: 1.3, repBonus: 0, stressCost: 15, unlockFans: 0 },
  album: { label: "Album", minSongs: 10, maxSongs: 15, fanMultiplier: 2.2, payoutMultiplier: 2, repBonus: 10, stressCost: 30, unlockFans: 5000 },
};

const coverStyles = ["Upload Custom Image"];
const coverColors = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24", "#34d399", "#111827", "#ffffff", "#ec4899"];

const hairOptions = ["Buzz Cut / Short Fade", "Short Afro", "Big Afro", "Dreadlocks", "Braids", "360 Waves", "Man Bun", "Bald / Shaved"];
const hairColorOptions = [
  { name: "Black", color: "#05060a" },
  { name: "Dark Brown", color: "#24130d" },
  { name: "Brown", color: "#5b3421" },
  { name: "Blonde", color: "#d4a84f" },
  { name: "Platinum Blonde", color: "#f1e3b0" },
  { name: "Red", color: "#a93424" },
  { name: "Blue", color: "#2563eb" },
  { name: "Pink", color: "#ec4899" },
];
const skinToneOptions = [
  { name: "Fair", color: "from-[#f0c7a7] to-[#b87855]" },
  { name: "Light", color: "from-[#d9a27c] to-[#8d5738]" },
  { name: "Light Brown", color: "from-[#a7653c] to-[#6c351e]" },
  { name: "Medium Brown", color: "from-[#8b4a2d] to-[#4b2417]" },
  { name: "Medium Dark", color: "from-[#6b351f] to-[#2b120b]" },
  { name: "Deep Brown", color: "from-[#4a2417] to-[#170806]" },
];
const outfitOptions = ["Plain Hoodie", "Thrift Tee", "Black Hoodie", "Old Jersey", "Purple Jacket", "Puffer Vest"];
const backdropOptions = ["Bedroom Studio", "Neon Alley", "Graffiti Wall", "Rooftop Night", "Small Stage"];
const accessoryOptions = [
  { name: "Gold Glasses", unlockFans: 20, cost: 150 },
  { name: "Silver Studs", unlockFans: 35, cost: 200 },
  { name: "Gold Hoop", unlockFans: 50, cost: 250 },
  { name: "Rope Chain", unlockFans: 100, cost: 500 },
  { name: "Crown Pendant", unlockFans: 250, cost: 1000 },
  { name: "Black Watch", unlockFans: 500, cost: 1500 },
];

const concepts = [
  "late nights, overthinking, empty streets",
  "trying to be heard through bad wifi and worse confidence",
  "a hook that sounds like it came from a cracked phone screen",
  "quiet flexing over a beat that barely survived export",
  "honest thoughts with cheap headphones and too much ambition",
  "bedroom dreams with the fan buzzing in the background",
  "sad melody, sharp lines, and a chorus that wants attention",
  "old voice memos stitched into something almost legendary",
];

const titlePool = ["Basement Moon", "No Signal", "After Midnight", "Rain Window", "Algorithm Blues", "Cheap Mic Anthem", "Bedroom Static"];
const rivalNames = ["Lil Static", "Yung Eclipse", "Kilo Verse", "Baby Signal", "Manny Mirage", "Nova Redd", "Kid Voltage"];

const sideHustles = [
  { id: "cashier", name: "Cashier", weeklyPay: 40, stressFloor: 30, description: "easy job, low pay." },
  { id: "delivery", name: "Delivery Driver", weeklyPay: 70, stressFloor: 50, recordingMultiplier: 0.9, description: "good pay but tired vocals." },
  { id: "babysitter", name: "Babysitter", weeklyPay: 30, stressFloor: 20, creativityWriteMultiplier: 0.5, description: "kid energy kinda inspires." },
  { id: "cornerStore", name: "Corner Store", weeklyPay: 50, stressFloor: 35, description: "balanced grind." },
];

const sideActivities = [
  { id: "busking", name: "Busking", description: "1 week. Requires 1 released song. Always available after that." },
  { id: "soundcloud", name: "SoundCloud Grind", description: "1 week. Requires 1 released song. Locks at 5k fans." },
  { id: "battle", name: "Battle Rap", description: "1 week. Unlocks at 100 fans. Lyrics skill check. Locks when shows become your main performance lane." },
  { id: "ghostwrite", name: "Ghostwrite", description: "1 week. Requires Lyrics 30+. Pays well, hurts rep." },
  { id: "studioHelp", name: "Studio Session For Others", description: "1 week. Unlocks at 500 fans. Fixed pay." },
];

const fanMilestones = [
  { value: 50, text: "your first 50. someone you don't know listened to your song" },
  { value: 100, text: "100 fans. people recognize you at the corner store" },
  { value: 500, text: "your song hit 1k plays on soundcloud" },
  { value: 1000, text: "a small blog wrote about you. people are paying attention" },
  { value: 5000, text: "you're getting playlist placements. industry is watching" },
  { value: 10000, text: "10k fans. you can quit your day job" },
  { value: 50000, text: "regional buzz. labels are circling" },
  { value: 100000, text: "you're a known name now" },
  { value: 500000, text: "your face is on magazines" },
  { value: 1000000, text: "you went platinum" },
];

const streamMilestones = [1000, 10000, 100000, 1000000, 10000000, 100000000];

const feedUsers = {
  fan: ["@dayonefan", "@localaux", "@replayking", "@undergroundfan", "@hookstuck"],
  hater: ["@skipbutton", "@mixpolice", "@canthearit", "@deletebutton", "@ratiofiend"],
  blog: ["@localblog", "@undergrounddaily", "@newwavereport", "@scenecheck", "@musicwatch"],
  industry: ["@labelintern", "@playlistplug", "@aandrwatch", "@producerline", "@industryeyes"],
  neutral: ["@streetscanner", "@musicfeed", "@weeklydrops", "@sceneupdate", "@newdropbot"],
};

const chartDefs = [
  { id: "local", name: "Local Chart", unlockFans: 100, entryScore: 15 },
  { id: "underground", name: "Underground Chart", unlockFans: 1000, entryScore: 35 },
  { id: "streaming", name: "Streaming Chart", unlockFans: 10000, entryScore: 80 },
  { id: "national", name: "National Chart", unlockFans: 50000, entryScore: 160 },
];

const videoOptions = [
  { id: "phone", maker: "Juno PhoneCam", type: "Phone Video", cost: 100, boostMin: 1.05, boostMax: 1.18, boostWeeks: 2, unlockFans: 0, fanMin: 5, fanMax: 20, description: "cheap phone-shot visual. small but real push." },
  { id: "friend", maker: "Tariq Takes", type: "Friend Shoot", cost: 600, boostMin: 1.12, boostMax: 1.35, boostWeeks: 3, unlockFans: 0, fanMin: 20, fanMax: 60, description: "better angles, cleaner edit, more replay value." },
  { id: "local", maker: "Mina Frames", type: "Local Director", cost: 2500, boostMin: 1.25, boostMax: 1.65, boostWeeks: 4, unlockFans: 0, fanMin: 80, fanMax: 250, description: "real director treatment. can move the song." },
  { id: "big", maker: "Cole Vision", type: "Big Budget Video", cost: 15000, boostMin: 1.5, boostMax: 2.3, boostWeeks: 6, unlockFans: 50000, fanMin: 1000, fanMax: 4000, description: "full rollout visual. expensive for a reason." },
];

const rolloutOptions = [
  { id: "quiet", name: "Quiet Drop", cost: 0, fanMultiplier: 1, streamMultiplier: 1, stress: 0, unlockFans: 0, text: "No cost. Normal release." },
  { id: "social", name: "Social Tease", cost: 20, fanMultiplier: 1.1, streamMultiplier: 1, stress: 5, unlockFans: 0, text: "+10% fans, +5 stress." },
  { id: "playlist", name: "Playlist Push", cost: 100, fanMultiplier: 1.1, streamMultiplier: 1.25, stress: 0, unlockFans: 1000, text: "+25% initial streams, +10% fans." },
  { id: "controversy", name: "Controversial Promo", cost: 0, fanMultiplier: 1, streamMultiplier: 1, stress: 15, unlockFans: 10000, viralBonus: 0.3, text: "+viral chance, +15 stress, possible rep loss." },
];

const showOptions = [
  { id: "openMic", name: "Open Mic", unlockFans: 0, weeks: 1, fanMin: 5, fanMax: 15, payMin: 5, payMax: 25, stress: 10, stressFloor: 25 },
  { id: "house", name: "House Show", unlockFans: 100, weeks: 1, fanMin: 20, fanMax: 50, payMin: 50, payMax: 50, stress: 15, stressFloor: 35 },
  { id: "club", name: "Small Club", unlockFans: 500, weeks: 2, fanMin: 75, fanMax: 150, payMin: 150, payMax: 150, stress: 20, stressFloor: 45 },
  { id: "venue", name: "Local Venue", unlockFans: 2000, weeks: 2, fanMin: 300, fanMax: 700, payMin: 750, payMax: 750, stress: 25, stressFloor: 50 },
  { id: "festival", name: "Festival Slot", unlockFans: 10000, weeks: 2, fanMin: 2000, fanMax: 5000, payMin: 2500, payMax: 2500, stress: 30, stressFloor: 60 },
  { id: "regional", name: "Regional Tour", unlockFans: 50000, weeks: 3, fanMin: 10000, fanMax: 25000, payMin: 15000, payMax: 15000, stress: 45, stressFloor: 70 },
  { id: "national", name: "National Tour", unlockFans: 250000, weeks: 5, fanMin: 75000, fanMax: 150000, payMin: 100000, payMax: 100000, stress: 60, stressFloor: 80 },
];

const restPools = {
  small: [
    { text: "A small blog called your sound raw but promising.", fans: 120, money: 25, rep: 6, stress: 2, tone: "good" },
    { text: "A fan DM said your song helped them through a rough night.", fans: 80, money: 0, rep: 5, stress: -4, tone: "good" },
  ],
  mid: [
    { text: "A playlist curator added you to a small underground playlist.", fans: 600, money: 120, rep: 8, stress: 4, tone: "good" },
    { text: "An underground producer said your sound is different.", fans: 250, money: 0, rep: 10, stress: 1, tone: "good" },
  ],
  big: [
    { text: "A smaller artist asked about a feature.", fans: 1800, money: 500, rep: 12, stress: 6, tone: "good" },
    { text: "A niche music page posted you as an artist to watch.", fans: 2400, money: 350, rep: 16, stress: 8, tone: "good" },
  ],
};

let audioContext = null;
let rhythmSchedulerTimeoutId = null;
const SAVE_KEY = "rap-sim-autosave-v1";
const SETTINGS_KEY = "rapSimSettings";
const SAVE_HASH_PREFIX = "rapsave=";

const defaultSettings = {
  masterVolume: 70,
  musicVolume: 60,
  sfxVolume: 80,
  mute: false,
  timingOffset: 0,
  autosave: true,
  uiScale: 1,
  reduceMotion: false,
  showFps: false,
  colorblindMode: false,
  highContrastText: false,
};

function encodeSaveData(save) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(save))));
  } catch (error) {
    return "";
  }
}

function decodeSaveData(text) {
  try {
    const cleaned = text.includes(SAVE_HASH_PREFIX) ? text.split(SAVE_HASH_PREFIX)[1] : text;
    return JSON.parse(decodeURIComponent(escape(atob(cleaned.trim()))));
  } catch (error) {
    return null;
  }
}

function playTone(kind = "click", settingsOverride = null) {
  const settings = settingsOverride || (typeof window !== "undefined" && window.__rapSimSettings) || defaultSettings;
  if (settings.mute || settings.masterVolume <= 0 || settings.sfxVolume <= 0) return;
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const sounds = {
      click: [420, 520, 0.035, 0.055],
      ping: [660, 880, 0.05, 0.11],
      success: [520, 980, 0.065, 0.16],
      soft: [360, 460, 0.035, 0.12],
    };
    const [start, end, volume, time] = sounds[kind] || sounds.click;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + time);
    gain.gain.setValueAtTime(volume * (settings.masterVolume / 100) * (settings.sfxVolume / 100), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + time + 0.02);
  } catch (error) {}
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getEffectiveSkill(skill) {
  return Math.log10(skill + 10) * 20;
}

function getCreativityMultiplier(creativity) {
  return 0.3 + (creativity / 100) * 0.7;
}

function getQualityTier(value) {
  if (value < 15) return "trash";
  if (value < 25) return "mid";
  if (value < 35) return "solid";
  if (value < 45) return "fire";
  if (value < 55) return "banger";
  return "legendary";
}

function getDraftGrade(value) {
  if (value < 10) return "F";
  if (value < 15) return "D-";
  if (value < 20) return "D";
  if (value < 25) return "D+";
  if (value < 30) return "C-";
  if (value < 35) return "C";
  if (value < 40) return "C+";
  if (value < 45) return "B-";
  if (value < 50) return "B";
  if (value < 55) return "B+";
  if (value < 60) return "A-";
  if (value < 65) return "A";
  if (value < 70) return "A+";
  if (value < 80) return "S";
  const extraPluses = Math.max(1, Math.floor((value - 80) / 10) + 1);
  return `S${"+".repeat(extraPluses)}`;
}

function artistStatCost(value) {
  return Math.floor(50 + Math.pow(value, 1.7) * 8);
}

function artistStatGain(cost) {
  if (cost < 500) return 10;
  if (cost < 5000) return 30;
  return 100;
}

function predictOwnBeatValue(player) {
  return getEffectiveSkill(player.skills.beats) * getCreativityMultiplier(player.creativity);
}

function predictOwnBeatQuality(player) {
  return getQualityTier(predictOwnBeatValue(player));
}

function beatTierForProducer(producer, player) {
  return producer.id === "own" ? predictOwnBeatQuality(player) : producer.fixedTier;
}

function beatQualityForProducer(producer, player) {
  return producer.id === "own" ? Math.round(predictOwnBeatValue(player)) : producer.fixedBeatQuality;
}

function calculateDraftQuality({ lyricsSkill, beatsSkill, creativity, producer }) {
  const multiplier = getCreativityMultiplier(creativity);
  const lyricQuality = getEffectiveSkill(lyricsSkill) * multiplier;
  const player = { skills: { beats: beatsSkill }, creativity };
  const beatQuality = beatQualityForProducer(producer, player);
  return {
    lyricQuality,
    beatQuality,
    beatTier: beatTierForProducer(producer, player),
    draftQuality: (lyricQuality + beatQuality) / 2,
  };
}

function calculateFinalSongQuality({ draftQuality, productionSkill, stress, studioQuality, recordingMultiplier = 1 }) {
  const recordingQuality = (1 + studioQuality / 100) * (1 - stress / 200) * recordingMultiplier;
  const productionMultiplier = getEffectiveSkill(productionSkill) / 50 + 0.5;
  return draftQuality * recordingQuality * productionMultiplier;
}

function getSongPeakHoldUntil(song) {
  if (song.quality >= 55) return song.releaseWeek + 3;
  if (song.quality >= 35) return song.releaseWeek + 2;
  return song.releaseWeek + 1;
}

function getSongDecayRate(song) {
  return 0.2 - (song.quality / 100) * 0.15;
}

function getFanReachMultiplier(fans) {
  return Math.min(Math.pow(Math.max(1, fans) / 100, 0.7), 1000);
}

function getQualityStreamMultiplier(quality) {
  return Math.pow(Math.max(1, quality) / 50, 1.5);
}

function createStreamingStats(song, playerFans, projectMultiplier = 1) {
  const fanReachMultiplier = getFanReachMultiplier(playerFans);
  const qualityMultiplier = getQualityStreamMultiplier(song.quality);
  const peakWeeklyStreams = Math.max(1, Math.floor(50 * qualityMultiplier * fanReachMultiplier * projectMultiplier));
  return {
    peakWeeklyStreams,
    weeklyStreams: peakWeeklyStreams,
    lifetimeStreams: peakWeeklyStreams,
    streamsHistory: [peakWeeklyStreams],
    decayRate: getSongDecayRate(song),
    peakHoldUntilWeek: getSongPeakHoldUntil(song),
    lastSpikeWeek: song.releaseWeek,
    streamMilestonesHit: [],
  };
}

function getStreamMilestoneText(song, milestone) {
  if (milestone === 1000) return `${song.title} hit 1k streams`;
  if (milestone === 10000) return `${song.title} crossed 10k streams. people are listening`;
  if (milestone === 100000) return `${song.title} passed 100k. this one's traveling`;
  if (milestone === 1000000) return `${song.title} is officially a hit. 1 million streams`;
  if (milestone === 10000000) return `${song.title} hit 10 million. legendary track`;
  return `${song.title} passed 100m. timeless`;
}

function useAnimatedNumber(value, duration = 500) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const start = previous.current;
    const end = value;
    const startTime = performance.now();
    let frame;
    function tick(now) {
      const progress = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else previous.current = end;
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return display;
}

function Button({ children, onClick, className = "", disabled = false, tone = "click", onMouseEnter, onMouseLeave, title }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(event) => {
        if (disabled) return;
        playTone(tone);
        onClick?.(event);
      }}
      className={cx("transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(34,211,238,.12)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-none", className)}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={cx("rounded-[1.75rem] border border-cyan-100/10 bg-[#08111f]/90 shadow-[0_24px_80px_rgba(0,0,0,.35)] ring-1 ring-white/[0.03] backdrop-blur-xl", className)}>{children}</div>;
}

function IconBubble({ label, color = "teal" }) {
  const colorMap = {
    teal: "bg-cyan-400/15 text-cyan-300 border-cyan-300/30",
    pink: "bg-pink-400/15 text-pink-300 border-pink-300/30",
    purple: "bg-violet-400/15 text-violet-300 border-violet-300/30",
    gold: "bg-amber-400/15 text-amber-300 border-amber-300/30",
    coral: "bg-rose-400/15 text-rose-300 border-rose-300/30",
    lime: "bg-lime-400/15 text-lime-300 border-lime-300/30",
    blue: "bg-blue-400/15 text-blue-300 border-blue-300/30",
    gray: "bg-zinc-400/10 text-zinc-300 border-zinc-300/20",
  };
  return <span className={cx("inline-flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-black", colorMap[color] || colorMap.teal)}>{label}</span>;
}

function SectionTitle({ title, right }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.7)]" /><h3 className="text-xs font-black uppercase tracking-[0.22em] text-zinc-200">{title}</h3></div>
      {right ? <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-bold text-zinc-500">{right}</div> : null}
    </div>
  );
}

function StatBar({ label, value, color = "teal", icon, hint, max = 100 }) {
  const animated = useAnimatedNumber(value, 500);
  const colorMap = {
    teal: "bg-cyan-300", pink: "bg-pink-400", purple: "bg-violet-400", gold: "bg-amber-300", coral: "bg-rose-400", lime: "bg-lime-300", blue: "bg-blue-400",
  };
  const width = max ? `${clamp((animated / max) * 100, 0, 100)}%` : `${clamp(animated % 100, 0, 100)}%`;
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-zinc-200"><IconBubble label={icon} color={color} /><span className="font-semibold">{label}</span></div>
        <div className="text-xs text-zinc-400"><span className="font-black text-white">{Math.round(animated).toLocaleString()}</span>{max ? `/${max}` : ""}</div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={cx("h-full rounded-full transition-all duration-500", colorMap[color] || colorMap.teal)} style={{ width }} /></div>
      {hint ? <div className="mt-2 text-[11px] leading-relaxed text-zinc-500">{hint}</div> : null}
    </div>
  );
}

function getReputationMilestone(rep) {
  if (rep >= 10000) return "Legend Status";
  if (rep >= 5000) return "Industry Respect";
  if (rep >= 2500) return "National Name";
  if (rep >= 1000) return "Regional Buzz";
  if (rep >= 500) return "Underground Respected";
  if (rep >= 250) return "People Talk About You";
  if (rep >= 100) return "Known Locally";
  if (rep >= 50) return "Small Respect";
  return "Unknown";
}

function getNextReputationMilestone(rep) {
  const milestones = [50, 100, 250, 500, 1000, 2500, 5000, 10000];
  return milestones.find((value) => rep < value) || null;
}

function InfoCard({ icon, title, text, color = "teal" }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="mb-2 flex items-center gap-2"><IconBubble label={icon} color={color} /><div className="text-sm font-black text-white">{title}</div></div><div className="text-xs leading-relaxed text-zinc-400">{text}</div></div>;
}

function TopNumber({ value, type = "number" }) {
  const animated = useAnimatedNumber(value, 500);
  return <>{type === "money" ? formatMoney(animated) : Math.round(animated).toLocaleString()}</>;
}

function TextInput({ label, value, onChange, placeholder }) {
  return <label className="block"><div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{label}</div><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/60" /></label>;
}

function SettingsRow({ label, children, sub }) {
  return <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-sm font-black text-white">{label}</div>{sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}</div><div className="sm:min-w-[13rem]">{children}</div></div>;
}

function Toggle({ checked, onChange }) {
  return <Button onClick={() => onChange(!checked)} className={cx("w-full rounded-2xl border px-4 py-2 text-sm font-black", checked ? "border-cyan-300/40 bg-cyan-300/20 text-cyan-100" : "border-white/10 bg-black/30 text-zinc-400")}>{checked ? "On" : "Off"}</Button>;
}

function Slider({ value, min, max, step = 1, onChange, suffix = "" }) {
  return <div><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan-300" /><div className="mt-1 text-right text-xs font-black text-cyan-200">{value}{suffix}</div></div>;
}

function SettingsModal({ settings, setSettings, onClose, onSaveNow, onExportJson, onImportJson, onResetGame, playerName, version, fps }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  function update(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImportJson(String(reader.result || ""));
    reader.readAsText(file);
    event.target.value = "";
  }
  return <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 px-3 py-5 backdrop-blur-sm"><Card className={cx("max-h-[92vh] w-[min(48rem,96vw)] overflow-y-auto p-5", settings.highContrastText ? "text-white" : "")}><div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Settings</div><div className="mt-1 text-4xl font-black text-white">Game Options</div>{settings.showFps ? <div className="mt-1 text-xs font-black text-lime-200">FPS: {fps}</div> : null}</div><Button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Close</Button></div><div className="space-y-5"><div><SectionTitle title="Audio" /><div className="grid gap-2"><SettingsRow label="Master Volume"><Slider value={settings.masterVolume} min={0} max={100} onChange={(v) => update("masterVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="Music Volume"><Slider value={settings.musicVolume} min={0} max={100} onChange={(v) => update("musicVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="SFX Volume"><Slider value={settings.sfxVolume} min={0} max={100} onChange={(v) => update("sfxVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="Mute"><Toggle checked={settings.mute} onChange={(v) => update("mute", v)} /></SettingsRow></div></div><div><SectionTitle title="Rhythm Minigame" /><div className="grid gap-2"><SettingsRow label="Timing Offset" sub="Calibration only. Does not widen timing windows."><Slider value={settings.timingOffset} min={-100} max={100} onChange={(v) => update("timingOffset", v)} suffix="ms" /></SettingsRow><SettingsRow label="Key Bindings" sub="No rebinding. Scroll speed stays locked."><div className="text-sm font-black text-white">← ↓ ↑ →</div></SettingsRow></div></div><div><SectionTitle title="Gameplay" /><div className="grid gap-2"><SettingsRow label="Autosave"><Toggle checked={settings.autosave} onChange={(v) => update("autosave", v)} /></SettingsRow><SettingsRow label="Save Now"><Button onClick={onSaveNow} className="w-full rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-black text-black hover:bg-cyan-200">Save Now</Button></SettingsRow></div></div><div><SectionTitle title="Display" /><div className="grid gap-2"><SettingsRow label="UI Scale"><Slider value={settings.uiScale} min={0.8} max={1.2} step={0.05} onChange={(v) => update("uiScale", Number(v.toFixed(2)))} suffix="x" /></SettingsRow><SettingsRow label="Reduce Motion"><Toggle checked={settings.reduceMotion} onChange={(v) => update("reduceMotion", v)} /></SettingsRow><SettingsRow label="Show FPS"><Toggle checked={settings.showFps} onChange={(v) => update("showFps", v)} /></SettingsRow></div></div><div><SectionTitle title="Accessibility" /><div className="grid gap-2"><SettingsRow label="Colorblind Mode" sub="Rhythm arrows switch to high contrast red/blue/green/yellow."><Toggle checked={settings.colorblindMode} onChange={(v) => update("colorblindMode", v)} /></SettingsRow><SettingsRow label="High Contrast Text"><Toggle checked={settings.highContrastText} onChange={(v) => update("highContrastText", v)} /></SettingsRow></div></div><div><SectionTitle title="Data" /><div className="grid gap-2"><SettingsRow label="Export Save"><Button onClick={onExportJson} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Download JSON</Button></SettingsRow><SettingsRow label="Import Save"><input ref={fileInputRef} type="file" accept="application/json" onChange={importFile} className="hidden" /><Button onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Upload JSON</Button></SettingsRow><SettingsRow label="Reset Game" sub="this will erase everything. are you sure?"><div className="grid gap-2">{confirmReset ? <><Button onClick={onResetGame} className="rounded-2xl bg-rose-400 px-4 py-2 text-sm font-black text-black">Confirm Reset</Button><Button onClick={() => setConfirmReset(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white">Cancel</Button></> : <Button onClick={() => setConfirmReset(true)} className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-black text-rose-100">RESET GAME</Button>}</div></SettingsRow></div></div><div><SectionTitle title="Credits" /><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-400"><div>Game version: {version}</div><div>built by {playerName || "player name placeholder"}</div><div className="mt-1 text-xs text-zinc-600">optional link space</div></div></div></div><div className="sticky bottom-0 mt-5 grid gap-3 border-t border-white/10 bg-[#08111f]/95 pt-4 sm:grid-cols-2"><Button onClick={onSaveNow} className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black hover:bg-cyan-200">Save</Button><Button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white hover:bg-white/10">Close</Button></div></Card></div>;
}

function BackdropScene({ backdrop }) {
  const base = "absolute inset-0";
  if (backdrop === "Neon Alley") return <div className={cx(base, "bg-gradient-to-br from-[#170b2d] via-[#10213a] to-black")}><div className="absolute inset-y-0 left-8 w-2 bg-cyan-300/40 blur-sm" /><div className="absolute inset-y-0 right-10 w-2 bg-pink-400/35 blur-sm" /><div className="absolute bottom-0 left-0 right-0 h-20 bg-black/50" /></div>;
  if (backdrop === "Graffiti Wall") return <div className={cx(base, "bg-gradient-to-br from-[#1f2937] via-[#111827] to-black")}><div className="absolute left-5 top-16 h-12 w-28 rotate-[-10deg] rounded-full bg-pink-400/25 blur-sm" /><div className="absolute right-6 top-24 h-12 w-24 rotate-[12deg] rounded-full bg-lime-300/20 blur-sm" /><div className="absolute bottom-0 left-0 right-0 h-20 bg-black/45" /></div>;
  if (backdrop === "Rooftop Night") return <div className={cx(base, "bg-gradient-to-br from-[#07111f] via-[#10172a] to-black")}><div className="absolute right-8 top-8 h-10 w-10 rounded-full bg-amber-200/80 shadow-[0_0_30px_rgba(253,230,138,.45)]" /><div className="absolute bottom-10 left-5 h-16 w-8 bg-slate-800/90" /><div className="absolute bottom-10 right-8 h-20 w-10 bg-slate-800/80" /></div>;
  if (backdrop === "Small Stage") return <div className={cx(base, "bg-gradient-to-br from-[#25071d] via-[#111827] to-black")}><div className="absolute left-8 top-4 h-28 w-14 rotate-12 bg-pink-400/25 blur-xl" /><div className="absolute right-8 top-4 h-28 w-14 -rotate-12 bg-cyan-300/25 blur-xl" /><div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-purple-950/30" /></div>;
  return <div className={cx(base, "bg-gradient-to-br from-[#0d1726] via-[#151024] to-black")}><div className="absolute bottom-8 left-5 h-20 w-28 rounded-xl border border-cyan-300/10 bg-slate-800/80" /><div className="absolute bottom-8 right-6 h-28 w-16 rounded-t-2xl border border-white/10 bg-slate-700/70" /></div>;
}

function HairLayer({ hair, hairColor = "Black" }) {
  const picked = hairColorOptions.find((item) => item.name === hairColor) || hairColorOptions[0];
  const c = picked.color;
  const detail = "rgba(255,255,255,.22)";
  const shadow = "rgba(0,0,0,.28)";
  if (hair === "Bald / Shaved") return null;

  const common = "pointer-events-none absolute left-1/2 overflow-visible -translate-x-1/2";

  if (hair === "Buzz Cut / Short Fade") {
    const d = "M15 58 C15 25 36 8 62 8 C89 8 109 27 109 60 C93 51 32 51 15 58Z";
    return <svg className={cx(common, "-top-[1.7rem] h-[6.25rem] w-[9.35rem]")} viewBox="0 0 124 82"><defs><clipPath id="clip-buzz"><path d={d} /></clipPath></defs><path d={d} fill={c} /><g clipPath="url(#clip-buzz)"><path d="M24 50 C43 40 82 40 101 50" stroke={detail} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M20 59 C42 51 82 51 106 59" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" /></g></svg>;
  }

  if (hair === "360 Waves") {
    const d = "M14 59 C14 25 36 8 62 8 C90 8 110 27 109 61 C91 52 33 52 14 59Z";
    return <svg className={cx(common, "-top-[1.7rem] h-[6.25rem] w-[9.35rem]")} viewBox="0 0 124 82"><defs><clipPath id="clip-waves"><path d={d} /></clipPath></defs><path d={d} fill={c} /><g clipPath="url(#clip-waves)">{[25,33,41,49,57].map((y, i) => <path key={i} d={`M19 ${y} C38 ${y - 9} 61 ${y + 8} 83 ${y - 3} C95 ${y - 9} 106 ${y - 2} 114 ${y + 2}`} stroke={detail} strokeWidth="3" fill="none" strokeLinecap="round" />)}<path d="M16 61 C39 53 84 53 109 62" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" /></g></svg>;
  }

  if (hair === "Short Afro") {
    const d = "M17 82 C4 64 13 39 31 37 C33 18 52 14 63 26 C80 6 106 19 104 39 C126 42 134 66 116 83 C94 70 42 69 17 82Z";
    return <svg className={cx(common, "-top-[2.7rem] h-[6.9rem] w-[8.6rem]")} viewBox="0 0 138 112"><defs><clipPath id="clip-short-afro"><path d={d} /></clipPath></defs><path d={d} fill={c} /><g clipPath="url(#clip-short-afro)">{[28,43,58,76,94,111,121,18].map((x, i) => <circle key={i} cx={x} cy={42 + (i % 3) * 13} r="5" fill="rgba(255,255,255,.13)" />)}<path d="M19 84 C46 69 93 69 119 84" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" /></g></svg>;
  }

  if (hair === "Big Afro") {
    const d = "M22 119 C1 101 5 59 31 51 C25 22 59 8 78 29 C98 -1 139 14 138 48 C171 47 184 86 159 115 C124 97 62 96 22 119Z";
    return <svg className={cx(common, "-top-[3.95rem] h-[8.45rem] w-[10.2rem]")} viewBox="0 0 188 156"><defs><clipPath id="clip-big-afro"><path d={d} /></clipPath></defs><path d={d} fill={c} /><g clipPath="url(#clip-big-afro)">{[35,55,76,98,120,145,162,25,70,132].map((x, i) => <circle key={i} cx={x} cy={49 + (i % 4) * 19} r="7" fill="rgba(255,255,255,.11)" />)}<path d="M30 121 C68 96 123 96 161 116" stroke={shadow} strokeWidth="5" fill="none" strokeLinecap="round" /></g></svg>;
  }

  if (hair === "Dreadlocks") {
    const cap = "M26 72 C23 34 46 16 75 16 C109 16 129 38 124 74 C99 61 54 61 26 72Z";
    const full = "M26 72 C23 34 46 16 75 16 C109 16 129 38 124 74 C127 105 137 140 129 188 C118 186 113 151 112 91 C106 130 112 167 101 196 C90 190 91 137 96 82 C91 133 88 175 76 199 C65 178 67 132 73 82 C67 135 61 178 49 195 C40 174 45 130 53 84 C44 128 39 167 28 186 C20 151 21 105 26 72Z";
    return <svg className={cx(common, "-top-[2.55rem] h-[15.65rem] w-[11.65rem]")} viewBox="0 0 150 206"><defs><clipPath id="clip-dreads"><path d={full} /></clipPath></defs><path d={cap} fill={c} /><g clipPath="url(#clip-dreads)">{[25,38,51,64,76,89,102,115,127].map((x, i) => <path key={i} d={`M${x} 56 C${x - 8} 94 ${x + 7} 130 ${x - 2} 184`} stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />)}{[32,56,82,108,126].map((x, i) => <path key={i} d={`M${x} 62 C${x + 8} 99 ${x - 4} 137 ${x + 4} 186`} stroke="rgba(255,255,255,.16)" strokeWidth="2" fill="none" strokeLinecap="round" />)}</g><path d={cap} fill={c} /></svg>;
  }

  if (hair === "Braids") {
    const d = "M18 72 C19 34 42 15 66 15 C97 15 116 38 114 74 C90 61 42 61 18 72Z";
    return <svg className={cx(common, "-top-[2.55rem] h-[10.65rem] w-[10.25rem]")} viewBox="0 0 132 142"><defs><clipPath id="clip-braids"><path d={d} /></clipPath></defs><path d={d} fill={c} /><g clipPath="url(#clip-braids)">{[28,41,54,66,79,92,105].map((x, i) => <g key={i}><path d={`M${x} 23 C${x - 2} 44 ${x + 2} 61 ${x - 1} 82`} stroke="rgba(0,0,0,.30)" strokeWidth="5" fill="none" strokeLinecap="round" /><path d={`M${x - 4} 31 L${x + 4} 39 M${x - 4} 49 L${x + 4} 57 M${x - 4} 67 L${x + 4} 75`} stroke={detail} strokeWidth="2" strokeLinecap="round" /></g>)}<path d="M20 74 C44 62 88 62 114 75" stroke={shadow} strokeWidth="4" fill="none" strokeLinecap="round" /></g></svg>;
  }

  if (hair === "Man Bun") {
    const base = "M14 88 C12 42 38 28 62 35 C88 27 114 44 112 89 C89 75 38 75 14 88Z";
    const bun = "M39 26 C39 5 85 5 85 26 C85 48 39 48 39 26Z";
    return <svg className={cx(common, "-top-[4.65rem] h-[11.6rem] w-[11.15rem]")} viewBox="0 0 124 142"><defs><clipPath id="clip-manbun-base"><path d={base} /></clipPath><clipPath id="clip-manbun-bun"><path d={bun} /></clipPath></defs><path d={bun} fill={c} /><path d={base} fill={c} /><g clipPath="url(#clip-manbun-bun)"><path d="M43 26 C54 38 70 38 82 26" stroke={detail} strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M48 17 C58 25 68 25 78 17" stroke="rgba(0,0,0,.22)" strokeWidth="3" fill="none" strokeLinecap="round" /></g><g clipPath="url(#clip-manbun-base)"><path d="M24 86 C50 72 82 72 108 87" stroke={shadow} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M20 70 C43 60 82 60 106 71" stroke={detail} strokeWidth="3" fill="none" strokeLinecap="round" /></g></svg>;
  }

  return null;
}

function OutfitLayer({ outfit }) {
  const looks = {
    "Plain Hoodie": { body: "from-zinc-800 to-black", chest: "bg-zinc-600/25", accent: "bg-zinc-400/20" },
    "Thrift Tee": { body: "from-emerald-700 to-emerald-950", chest: "bg-emerald-300/20", accent: "bg-emerald-200/25" },
    "Black Hoodie": { body: "from-slate-950 to-black", chest: "bg-cyan-300/15", accent: "bg-cyan-200/20" },
    "Old Jersey": { body: "from-blue-700 to-blue-950", chest: "bg-amber-300/20", accent: "bg-white/25" },
    "Purple Jacket": { body: "from-violet-700 to-black", chest: "bg-pink-300/18", accent: "bg-pink-200/25" },
    "Puffer Vest": { body: "from-slate-700 to-black", chest: "bg-white/10", accent: "bg-white/20" },
  };
  const look = looks[outfit] || looks["Plain Hoodie"];
  return <div className={cx("relative -mt-2 h-44 w-48 overflow-hidden rounded-t-[4rem] rounded-b-[1.4rem] bg-gradient-to-br shadow-xl", look.body)}><div className="absolute left-1/2 top-2 h-8 w-16 -translate-x-1/2 rounded-b-full bg-black/35" /><div className={cx("absolute inset-x-7 top-7 h-24 rounded-2xl", look.chest)} />{(outfit === "Plain Hoodie" || outfit === "Black Hoodie") && <><div className="absolute left-[4.35rem] top-9 h-14 w-1 rounded-full bg-white/20" /><div className="absolute right-[4.35rem] top-9 h-14 w-1 rounded-full bg-white/20" /><div className={cx("absolute left-1/2 top-16 h-10 w-20 -translate-x-1/2 rounded-2xl", look.accent)} /></>}{outfit === "Old Jersey" && <><div className="absolute left-12 top-8 h-24 w-3 rounded-full bg-white/25" /><div className="absolute right-12 top-8 h-24 w-3 rounded-full bg-white/25" /></>}{outfit === "Purple Jacket" && <><div className="absolute left-1/2 top-8 h-28 w-1 -translate-x-1/2 rounded-full bg-white/20" /><div className="absolute left-9 top-16 h-12 w-10 rounded-xl bg-pink-200/15" /><div className="absolute right-9 top-16 h-12 w-10 rounded-xl bg-pink-200/15" /></>}{outfit === "Puffer Vest" && <div className="absolute inset-x-8 top-10 space-y-3">{[0, 1, 2, 3].map((item) => <div key={item} className="h-2 rounded-full bg-white/12" />)}</div>}</div>;
}

function AccessoryLayer({ accessories = [] }) {
  return <>{accessories.includes("Gold Glasses") && <><div className="absolute left-4 top-12 h-6 w-9 rounded-full border-2 border-amber-300/95" /><div className="absolute right-4 top-12 h-6 w-9 rounded-full border-2 border-amber-300/95" /><div className="absolute left-1/2 top-[3.65rem] h-0.5 w-5 -translate-x-1/2 bg-amber-300/90" /></>}{accessories.includes("Silver Studs") && <><div className="absolute left-0.5 top-16 h-2.5 w-2.5 rounded-full bg-zinc-200" /><div className="absolute right-0.5 top-16 h-2.5 w-2.5 rounded-full bg-zinc-200" /></>}{accessories.includes("Gold Hoop") && <><div className="absolute left-[-3px] top-[4.15rem] h-4 w-4 rounded-full border-2 border-amber-300/95" /><div className="absolute right-[-3px] top-[4.15rem] h-4 w-4 rounded-full border-2 border-amber-300/95" /></>}</>;
}

function BodyAccessoryLayer({ accessories = [] }) {
  return <>{accessories.includes("Rope Chain") && <svg className="absolute left-1/2 -top-5 h-20 w-32 -translate-x-1/2 overflow-visible" viewBox="0 0 128 80"><path d="M24 18 C35 48 93 48 104 18" stroke="rgba(252,211,77,.95)" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M32 24 C45 44 83 44 96 24" stroke="rgba(255,255,255,.18)" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}{accessories.includes("Crown Pendant") && <svg className="absolute left-1/2 -top-5 h-24 w-32 -translate-x-1/2 overflow-visible" viewBox="0 0 128 96"><path d="M24 18 C35 48 93 48 104 18" stroke="rgba(252,211,77,.95)" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M32 24 C45 44 83 44 96 24" stroke="rgba(255,255,255,.18)" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="64" cy="49" r="12" fill="rgb(252,211,77)" /><text x="64" y="53" textAnchor="middle" fontSize="10" fontWeight="900" fill="black">C</text></svg>}{accessories.includes("Black Watch") && <div className="absolute right-3 bottom-8 h-4 w-7 rounded-full border border-zinc-500 bg-zinc-900/90" />}</>;
}

function AvatarRenderer({ avatar, compact = false }) {
  const skin = skinToneOptions.find((item) => item.name === avatar.skinTone) || skinToneOptions[2];
  return <div className={cx("relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-black/20 shadow-2xl shadow-cyan-950/40", compact ? "h-72 w-60" : "h-[28rem] w-80")}><BackdropScene backdrop={avatar.backdrop} /><div className="relative z-10 flex h-full items-end justify-center pb-3"><div className="flex flex-col items-center"><div className={cx("relative h-28 w-28 rounded-full bg-gradient-to-br shadow-xl", skin.color)}><HairLayer hair={avatar.hair} hairColor={avatar.hairColor} /><AccessoryLayer accessories={avatar.accessories || []} /><div className="absolute left-7 top-14 h-2 w-2 rounded-full bg-black" /><div className="absolute right-7 top-14 h-2 w-2 rounded-full bg-black" /><div className="absolute left-1/2 top-[4.05rem] h-3 w-2 -translate-x-1/2 rounded-full bg-black/20" /><div className="absolute left-1/2 top-[4.95rem] h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/50" /><div className="absolute left-1 top-16 h-5 w-4 rounded-full bg-black/10" /><div className="absolute right-1 top-16 h-5 w-4 rounded-full bg-black/10" /></div><div className="relative"><OutfitLayer outfit={avatar.outfit} /><div className="absolute inset-0"><BodyAccessoryLayer accessories={avatar.accessories || []} /></div></div></div></div><div className="absolute bottom-0 left-0 right-0 z-20 h-20 bg-gradient-to-t from-black/70 to-transparent" /></div>;
}

function AvatarCard({ stageName, avatar, compact = false }) {
  return <Card className={cx("relative overflow-hidden p-4", compact ? "min-h-[23rem]" : "min-h-[34rem]")}><div className="relative z-20 mb-4 flex items-start justify-between gap-3 px-1 pt-1"><div className="min-w-0"><div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Stage Name</div><div className="mt-1 truncate text-4xl font-black italic tracking-tight text-white drop-shadow md:text-5xl">{stageName || "Unnamed"}</div></div><div className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">{avatar.backdrop}</div></div><div className="relative z-10 flex justify-center"><AvatarRenderer avatar={avatar} compact={compact} /></div></Card>;
}

function OptionButton({ children, active, onClick }) {
  return <Button onClick={onClick} className={cx("rounded-2xl border px-3 py-3 text-sm font-bold", active ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:border-white/20 hover:bg-white/10")}>{children}</Button>;
}

function EmptyState({ text }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-500">{text}</div>;
}

function ProjectCover({ project, small = false }) {
  const size = small ? "h-20 w-20" : "h-32 w-32";
  const title = project.title || "Untitled";
  const a = project.coverA || "#22d3ee";
  const b = project.coverB || "#a78bfa";
  if (project.coverStyle === "custom" || project.coverStyle === "Upload Custom Image") {
    if (project.customCoverImage) return <div className={cx(size, "shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30")}><img src={project.customCoverImage} alt="cover" className="h-full w-full object-cover" /></div>;
    return <div className={cx(size, "relative shrink-0 overflow-hidden rounded-2xl border border-zinc-300 bg-white text-black")}><div className="absolute inset-x-3 top-3 border-t-4 border-black" /><div className="absolute bottom-3 left-3 right-3 text-lg font-black uppercase leading-none">{title}</div></div>;
  }
  if (project.coverStyle === "Gradient") return <div className={cx(size, "relative shrink-0 overflow-hidden rounded-2xl border border-white/10")} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}><div className="absolute inset-0 bg-black/20" /><div className="absolute bottom-2 left-2 right-2 text-sm font-black uppercase leading-none text-white drop-shadow">{title}</div></div>;
  if (project.coverStyle === "Abstract Shapes") return <div className={cx(size, "relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950")}><div className="absolute -left-5 top-3 h-20 w-20 rounded-full opacity-80" style={{ background: a }} /><div className="absolute -right-4 bottom-2 h-24 w-24 rotate-12 rounded-3xl opacity-70" style={{ background: b }} /><div className="absolute left-6 top-7 h-12 w-20 -rotate-12 border-4 border-white/30" /><div className="absolute bottom-2 left-2 right-2 text-sm font-black uppercase leading-none text-white drop-shadow">{title}</div></div>;
  if (project.coverStyle === "Minimal") return <div className={cx(size, "relative shrink-0 overflow-hidden rounded-2xl border border-zinc-300 bg-white text-black")}><div className="absolute inset-x-3 top-3 border-t-4 border-black" /><div className="absolute bottom-3 left-3 right-3 text-lg font-black uppercase leading-none">{title}</div></div>;
  return <div className={cx(size, "relative shrink-0 overflow-hidden rounded-2xl border border-white/10")} style={{ background: a }}><div className="absolute inset-0 bg-black/15" /><div className="absolute bottom-2 left-2 right-2 text-sm font-black uppercase leading-none text-white drop-shadow">{title}</div></div>;
}

function resizeImage(dataUrl, maxSize, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;
    if (width > height && width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL("image/jpeg", 0.8));
  };
  img.src = dataUrl;
}

function CoverPicker({ draft, setDraft, label = "Cover" }) {
  const fileInputRef = useRef(null);
  function openPicker() {
    fileInputRef.current?.click();
  }
  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("image too big. max 5mb please.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      resizeImage(dataUrl, 500, (resized) => {
        setDraft({ ...draft, coverStyle: "custom", customCoverImage: resized });
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }
  return <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3"><div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{label}</div><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />{draft.customCoverImage ? <div className="flex items-center gap-3"><ProjectCover project={{ ...draft, coverStyle: "custom", title: draft.title || "Preview" }} small /><div className="grid gap-2"><Button onClick={openPicker} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white">Change Image</Button><Button onClick={() => setDraft({ ...draft, coverStyle: "custom", customCoverImage: null })} className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-xs font-black text-rose-100">Remove Image</Button></div></div> : <Button onClick={openPicker} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-4 text-sm font-black text-cyan-100 hover:bg-cyan-300/15"><span className="text-lg">⇧</span><span>Upload Cover Image</span></Button>}</div>;
}

function ChoiceModal({ title, text, options }) {
  return <Card className="w-[min(34rem,92vw)] p-6 animate-[popIn_.2s_ease-out]"><div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Major Event</div><div className="mt-2 text-3xl font-black text-white">{title}</div><p className="mt-3 text-sm leading-relaxed text-zinc-400">{text}</p><div className="mt-5 grid gap-3">{options.map((option) => <Button key={option.label} onClick={option.onClick} tone={option.tone === "good" ? "success" : "click"} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left hover:bg-white/10"><div className="font-black text-white">{option.label}</div><div className="mt-1 text-xs text-zinc-500">{option.sub}</div></Button>)}</div></Card>;
}

const RHYTHM_TIMING = { perfect: 0.045, great: 0.09, good: 0.135 };
const LANE_COLORS = ["violet", "cyan", "pink", "amber"];
const LANE_ARROWS = ["◀", "▼", "▲", "▶"];
const LANE_KEYS = ["LEFT", "DOWN", "UP", "RIGHT"];
const LANE_ADLIBS = ["Yuh", "Huh", "Aye", "Ok"];

function playLaneAdlib(lane) {
  console.log("=== playLaneAdlib called ===");
  console.log("lane:", lane);
  console.log("window exists:", typeof window !== "undefined");
  console.log("speechSynthesis exists:", typeof window !== "undefined" && !!window.speechSynthesis);
  console.log("speechSynthesis.speaking:", window?.speechSynthesis?.speaking);
  console.log("speechSynthesis.pending:", window?.speechSynthesis?.pending);
  console.log("speechSynthesis.paused:", window?.speechSynthesis?.paused);
  const voicesDebug = window?.speechSynthesis?.getVoices() || [];
  console.log("available voices count:", voicesDebug.length);
  console.log("voice names:", voicesDebug.map((v) => v.name));

  const settings = (typeof window !== "undefined" && window.__rapSimSettings) || defaultSettings;
  console.log("settings:", settings);
  console.log("mute:", settings.mute);
  console.log("masterVolume:", settings.masterVolume);
  console.log("sfxVolume:", settings.sfxVolume);
  if (settings.mute || settings.masterVolume <= 0 || settings.sfxVolume <= 0) return;

  // speechSynthesis is the working approach. dont swap this for oscillators.
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const LANE_ADLIBS = ["Yuh", "Huh", "Aye", "Ok"];
  const word = LANE_ADLIBS[lane];
  if (!word) return;

  try {
    // cancel any in-flight speech so adlibs dont stack on fast hits
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 1.7;
    utterance.pitch = 0.7;
    utterance.volume = clamp((settings.masterVolume / 100) * (settings.sfxVolume / 100), 0, 1);

    // prefer a male voice if available
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find((v) => /male|daniel|alex|fred|tom|david|mark|aaron|arthur|gordon|oliver/i.test(v.name)) || voices.find((v) => !/female|samantha|victoria|karen|moira|tessa|fiona|susan|kate|allison|ava|serena/i.test(v.name)) || voices[0];

    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => console.log("utterance started speaking");
    utterance.onend = () => console.log("utterance finished speaking");
    utterance.onerror = (e) => console.log("utterance ERROR:", e.error, e);

    console.log("about to speak utterance:", { word, voice: utterance.voice?.name, rate: utterance.rate, pitch: utterance.pitch, volume: utterance.volume });
    window.speechSynthesis.speak(utterance);
    console.log("speak() called");
  } catch (error) {}
}

function getRhythmStyle(selectedStyles) {
  const names = selectedStyles.map((style) => style.name.toLowerCase()).join(" ");
  if (names.includes("rage")) return { name: "aggressive", bpm: 140, density: 1, duration: 32 };
  if (names.includes("melodic")) return { name: "melodic", bpm: 100, density: 0.5, duration: 30 };
  if (names.includes("sad") || names.includes("cloud")) return { name: "chill", bpm: 80, density: 0.25, duration: 26 };
  if (names.includes("lyrical") || names.includes("jazz")) return { name: "smooth", bpm: 110, density: 0.5, duration: 30 };
  return { name: "smooth", bpm: 110, density: 0.5, duration: 30 };
}

function getStudioTimingBonus(studioName) {
  if (studioName === "Bedroom") return 0.9;
  if (studioName === "Garage Setup") return 1;
  if (studioName === "Local Studio") return 1.1;
  if (studioName === "Pro Studio") return 1.2;
  return 1;
}

function ensureRhythmAudio() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
  if (!AudioContextClass) return null;
  audioContext = audioContext || new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function getAudioVolume(kind = "music") {
  const settings = (typeof window !== "undefined" && window.__rapSimSettings) || defaultSettings;
  if (settings.mute || settings.masterVolume <= 0) return 0;
  const channel = kind === "sfx" ? settings.sfxVolume : settings.musicVolume;
  return (settings.masterVolume / 100) * (channel / 100);
}

function scheduleKick(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(60, time);
  osc.frequency.exponentialRampToValueAtTime(35, time + 0.15);
  gain.gain.setValueAtTime(0.28 * getAudioVolume("music"), time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.16);
}

function scheduleNoiseBurst(ctx, time, duration, highpass, volume) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(highpass, time);
  gain.gain.setValueAtTime(volume * getAudioVolume("music"), time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(time);
  source.stop(time + duration + 0.01);
}

function generateRhythmNotes({ selectedStyles, lyricsSkill }) {
  const rhythm = getRhythmStyle(selectedStyles);
  const secondsPerBeat = 60 / rhythm.bpm;
  const densityScale = clamp(0.7 + lyricsSkill / 200, 0.7, 2.5);
  const effectiveDensity = rhythm.density * densityScale;
  const step = secondsPerBeat / Math.max(0.25, effectiveDensity);
  const notes = [];
  const lastLaneTime = [-99, -99, -99, -99];
  for (let t = 0.8; t < rhythm.duration; t += step) {
    const roll = Math.random();
    const makeLane = () => {
      let lane = Math.floor(Math.random() * 4);
      let attempts = 0;
      while (t - lastLaneTime[lane] < 0.15 && attempts < 8) {
        lane = Math.floor(Math.random() * 4);
        attempts += 1;
      }
      lastLaneTime[lane] = t;
      return lane;
    };
    if (roll < 0.7) {
      notes.push({ id: makeId(), time: t, lane: makeLane(), hold: 0, hit: false, missed: false });
    } else if (roll < 0.85) {
      const laneA = makeLane();
      let laneB = makeLane();
      if (laneB === laneA) laneB = (laneA + 1) % 4;
      notes.push({ id: makeId(), time: t, lane: laneA, hold: 0, hit: false, missed: false }, { id: makeId(), time: t, lane: laneB, hold: 0, hit: false, missed: false });
    } else if (roll < 0.95) {
      notes.push({ id: makeId(), time: t, lane: makeLane(), hold: secondsPerBeat * (1 + Math.random()), hit: false, missed: false });
    } else {
      const lane = makeLane();
      notes.push({ id: makeId(), time: t, lane, hold: 0, hit: false, missed: false }, { id: makeId(), time: t + secondsPerBeat / 3, lane: (lane + 1) % 4, hold: 0, hit: false, missed: false }, { id: makeId(), time: t + (secondsPerBeat * 2) / 3, lane: (lane + 2) % 4, hold: 0, hit: false, missed: false });
    }
  }
  return { notes, bpm: rhythm.bpm, duration: rhythm.duration, secondsPerBeat, styleName: rhythm.name };
}

function takeMultiplierFromAccuracy(accuracy) {
  if (accuracy >= 0.95) return { multiplier: 1.3, label: "PERFECT TAKE" };
  if (accuracy >= 0.85) return { multiplier: 1.15, label: "GREAT TAKE" };
  if (accuracy >= 0.7) return { multiplier: 1, label: "SOLID TAKE" };
  if (accuracy >= 0.5) return { multiplier: 0.85, label: "OKAY TAKE" };
  return { multiplier: 0.7, label: "ROUGH TAKE" };
}

function RhythmMiniGame({ draft, player, studio, selectedStyles, onUseTake, onRetakeCost, onCancel, previewFinalQuality }) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // trigger initial voice load
    window.speechSynthesis.getVoices();

    // some browsers fire voiceschanged when voices become available
    const handler = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, []);
  const chart = useMemo(() => generateRhythmNotes({ selectedStyles, lyricsSkill: player.lyrics }), [selectedStyles, player.lyrics]);
  const [notes, setNotes] = useState(chart.notes);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [songStartTime, setSongStartTime] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [counts, setCounts] = useState({ perfects: 0, greats: 0, goods: 0, misses: 0 });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [ratingPopup, setRatingPopup] = useState("");
  const [laneFlash, setLaneFlash] = useState(null);
  const [result, setResult] = useState(null);
  const [bestTake, setBestTake] = useState(null);
  const [retakes, setRetakes] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const nextBeatRef = useRef(0);
  const beatIndexRef = useRef(0);
  const notesRef = useRef(notes);
  const pausedRef = useRef(false);
  const totalNotes = chart.notes.length || 1;
  const rawStressMultiplier = 1 - player.stress / 200;
  const stressMultiplier = Math.max(0.5, rawStressMultiplier);
  const studioBonus = getStudioTimingBonus(studio.name);
  const finalTimingMultiplier = stressMultiplier * studioBonus;
  const timingOffsetSeconds = (((typeof window !== "undefined" && window.__rapSimSettings?.timingOffset) || 0) / 1000);
  const timing = {
    perfect: RHYTHM_TIMING.perfect * finalTimingMultiplier,
    great: RHYTHM_TIMING.great * finalTimingMultiplier,
    good: RHYTHM_TIMING.good * finalTimingMultiplier,
  };
  const stressLabel = player.stress >= 80 ? "HIGH STRESS" : player.stress > 50 ? "STRESSED" : "FOCUSED";
  const studioBonusText = studioBonus === 0.9 ? "slightly worse timing" : studioBonus === 1 ? "no timing bonus" : studioBonus === 1.1 ? "slight timing bonus" : "strong timing bonus";
  const topHudHeight = 112;
  const bottomControlsHeight = 170;
  const playAreaHeight = Math.max(260, viewportHeight - topHudHeight - bottomControlsHeight);
  const hitZoneY = Math.max(150, playAreaHeight - 125);
  const scrollSpeedMultiplier = player.stress >= 80 ? 1.1 : 1;
  const scrollSpeed = Math.max(320, hitZoneY / 1.5) * scrollSpeedMultiplier;

  useEffect(() => {
    function onResize() {
      setViewportHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { notesRef.current = notes; }, [notes]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  function showRating(text, lane) {
    setRatingPopup(text);
    setLaneFlash(lane);
    setTimeout(() => setRatingPopup(""), 500);
    setTimeout(() => setLaneFlash(null), 180);
  }

  function finishGame(finalCounts) {
    const score = finalCounts.perfects * 1 + finalCounts.greats * 0.7 + finalCounts.goods * 0.4;
    const accuracy = totalNotes ? score / totalNotes : 0;
    const take = takeMultiplierFromAccuracy(accuracy);
    const summary = { ...finalCounts, totalNotes, accuracy, maxCombo, multiplier: take.multiplier, label: take.label, finalQuality: previewFinalQuality(take.multiplier) };
    setBestTake((prev) => !prev || summary.multiplier > prev.multiplier ? summary : prev);
    setResult(summary);
    if (rhythmSchedulerTimeoutId) clearTimeout(rhythmSchedulerTimeoutId);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function startTake() {
    const ctx = ensureRhythmAudio();
    if (!ctx) return;
    const startAt = ctx.currentTime + 0.12;
    startRef.current = startAt;
    nextBeatRef.current = startAt;
    beatIndexRef.current = 0;
    setSongStartTime(startAt);
    setNextBeatTime(startAt);
    setBeatIndex(0);
    setStarted(true);
    setPaused(false);
    setResult(null);
    setNotes(chart.notes.map((note) => ({ ...note, hit: false, missed: false })));
    setCounts({ perfects: 0, greats: 0, goods: 0, misses: 0 });
    setCombo(0);
    setMaxCombo(0);
  }

  useEffect(() => {
    if (!started || result) return undefined;
    const ctx = audioContext;
    if (!ctx) return undefined;
    function scheduler() {
      while (nextBeatRef.current < ctx.currentTime + 0.1) {
        const index = beatIndexRef.current;
        if (index % 4 === 0 || index % 4 === 2) scheduleKick(ctx, nextBeatRef.current);
        if (index % 4 === 1 || index % 4 === 3) scheduleNoiseBurst(ctx, nextBeatRef.current, 0.1, 900, 0.16);
        scheduleNoiseBurst(ctx, nextBeatRef.current, 0.03, 5000, 0.045);
        nextBeatRef.current += chart.secondsPerBeat / 2;
        beatIndexRef.current += 1;
        setNextBeatTime(nextBeatRef.current);
        setBeatIndex(beatIndexRef.current);
      }
      rhythmSchedulerTimeoutId = setTimeout(scheduler, 25);
    }
    scheduler();
    return () => { if (rhythmSchedulerTimeoutId) clearTimeout(rhythmSchedulerTimeoutId); };
  }, [started, result, chart.secondsPerBeat]);

  useEffect(() => {
    if (!started || result) return undefined;
    function frame() {
      if (!pausedRef.current && audioContext) {
        const time = audioContext.currentTime - startRef.current;
        setCurrentAudioTime(time);
        setNotes((prev) => {
          let misses = 0;
          const next = prev.map((note) => {
            if (!note.hit && !note.missed && time - note.time > timing.good) {
              misses += 1;
              return { ...note, missed: true };
            }
            return note;
          });
          if (misses) {
            setCounts((old) => ({ ...old, misses: old.misses + misses }));
            setCombo(0);
            showRating("MISS", null);
          }
          return next;
        });
        if (time >= chart.duration + 1) {
          const finalNotes = notesRef.current;
          const missedLeft = finalNotes.filter((note) => !note.hit && !note.missed).length;
          setCounts((old) => {
            const finalCounts = { ...old, misses: old.misses + missedLeft };
            finishGame(finalCounts);
            return finalCounts;
          });
          return;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, result, chart.duration, timing.good]);

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") setPaused(true);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function hitLane(lane) {
    if (!started || paused || result || !audioContext) return;
    const time = audioContext.currentTime - startRef.current - timingOffsetSeconds;
    const candidates = notesRef.current
      .filter((note) => note.lane === lane && !note.hit && !note.missed)
      .map((note) => ({ note, diff: Math.abs(time - note.time) }))
      .sort((a, b) => a.diff - b.diff || a.note.time - b.note.time);
    const closest = candidates[0];
    if (!closest || closest.diff > timing.good) {
      setLaneFlash(lane);
      setTimeout(() => setLaneFlash(null), 120);
      return;
    }
    const rating = closest.diff <= timing.perfect ? "perfects" : closest.diff <= timing.great ? "greats" : "goods";
    const label = rating === "perfects" ? "PERFECT" : rating === "greats" ? "GREAT" : "GOOD";
    setNotes((prev) => prev.map((note) => note.id === closest.note.id ? { ...note, hit: true } : note));
    setCounts((old) => ({ ...old, [rating]: old[rating] + 1 }));
    setCombo((old) => {
      const next = old + 1;
      setMaxCombo((max) => Math.max(max, next));
      return next;
    });
    showRating(label, closest.note.lane);
    playLaneAdlib(closest.note.lane);
    playTone(rating === "perfects" ? "success" : "click");
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") { setPaused((prev) => !prev); return; }
      if (event.key === "ArrowLeft") hitLane(0);
      if (event.key === "ArrowDown") hitLane(1);
      if (event.key === "ArrowUp") hitLane(2);
      if (event.key === "ArrowRight") hitLane(3);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function skipTake() {
    const summary = { perfects: 0, greats: 0, goods: 0, misses: totalNotes, totalNotes, accuracy: 0.5, maxCombo: 0, multiplier: 0.5, label: "SKIPPED TAKE", finalQuality: previewFinalQuality(0.5) };
    setBestTake((prev) => !prev || summary.multiplier > prev.multiplier ? summary : prev);
    setResult(summary);
  }

  function retake() {
    if (retakes >= 3) return;
    if (!onRetakeCost()) return;
    setRetakes((prev) => prev + 1);
    startTake();
  }

  const displayTake = bestTake || result;
  const progress = clamp((currentAudioTime / chart.duration) * 100, 0, 100);
  const accuracy = counts.perfects + counts.greats + counts.goods + counts.misses ? ((counts.perfects + counts.greats * 0.7 + counts.goods * 0.4) / totalNotes) * 100 : 0;

  return <div className={cx("fixed inset-0 z-[80] overflow-hidden bg-[#030814] text-white", ((typeof window !== "undefined" && window.__rapSimSettings?.reduceMotion) ? "" : player.stress >= 80 ? "animate-[stressShake_.14s_linear_infinite]" : player.stress > 50 ? "animate-[stressShakeSoft_.2s_linear_infinite]" : ""))}><div className={cx("absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.15),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,.15),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(251,191,36,.1),transparent_28%)]", (player.stress > 50 && !(typeof window !== "undefined" && window.__rapSimSettings?.reduceMotion) ? "animate-[stressPulse_.75s_ease-in-out_infinite]" : ""))} /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.035),transparent_45%,rgba(0,0,0,.35))]" />{player.stress > 50 ? <div className={cx("pointer-events-none absolute inset-0", player.stress >= 80 ? "bg-red-500/12" : "bg-red-500/6")} /> : null}<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,.9)]" />{result ? <div className="relative z-10 flex min-h-screen items-center justify-center p-4"><Card className="w-[min(38rem,94vw)] p-6 text-center"><div className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Best Take Kept</div><div className="mt-2 text-5xl font-black text-white">{displayTake.label}</div><div className="mt-2 text-sm text-zinc-400">Accuracy {Math.round(displayTake.accuracy * 100)}% • Max combo {displayTake.maxCombo} • Final tier preview {getQualityTier(displayTake.finalQuality)}</div><div className="mt-5 grid gap-2 sm:grid-cols-4"><InfoCard icon="P" color="gold" title={`${displayTake.perfects}`} text="perfects" /><InfoCard icon="G" color="lime" title={`${displayTake.greats}`} text="greats" /><InfoCard icon="O" color="blue" title={`${displayTake.goods}`} text="goods" /><InfoCard icon="M" color="coral" title={`${displayTake.misses}`} text="misses" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Button onClick={() => onUseTake(displayTake)} tone="success" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">Use This Take</Button><Button onClick={retake} disabled={retakes >= 3} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white hover:bg-white/10">{retakes >= 3 ? "No Retakes Left" : "Retake ($20, +10 stress)"}</Button></div></Card></div> : <><div className="relative z-10 grid h-screen grid-rows-[112px_1fr_170px]"><div className="flex items-start justify-between gap-4 p-4"><div><div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Recording Take</div><div className="mt-1 text-3xl font-black text-white">{draft.title}</div><div className="mt-1 text-xs text-zinc-500">{chart.styleName} • {chart.bpm} bpm • {studio.name}</div><div className={cx("mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]", player.stress >= 80 ? "border-red-300/40 bg-red-500/20 text-red-100" : player.stress > 50 ? "border-amber-300/40 bg-amber-500/15 text-amber-100" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100")}>{stressLabel}</div></div><div className="text-right text-xs text-zinc-400"><div>accuracy: {Math.round(accuracy)}%</div><div>score: {counts.perfects * 1000 + counts.greats * 700 + counts.goods * 400}</div><div>stress {player.stress} • timing {Math.round(finalTimingMultiplier * 100)}%</div><div>{studio.name}: {studioBonusText}</div></div></div><div className="relative mx-auto self-start overflow-hidden" style={{ width: 340, height: playAreaHeight, minHeight: playAreaHeight, maxHeight: playAreaHeight }}><div className="absolute inset-y-0 left-1/2 w-[340px] -translate-x-1/2 rounded-t-[2rem] border-x border-white/10 bg-black/25"><div className="grid h-full grid-cols-4">{[0, 1, 2, 3].map((lane) => <button type="button" key={lane} onTouchStart={() => hitLane(lane)} onMouseDown={() => hitLane(lane)} className={cx("relative border-r border-white/10 last:border-r-0", laneFlash === lane ? "bg-white/20" : "bg-white/[0.025]")}><div className="absolute inset-x-5 top-0 h-full bg-gradient-to-b from-white/5 via-transparent to-white/5 opacity-50" /></button>)}</div></div>{notes.filter((note) => !note.hit && !note.missed).map((note) => { const y = hitZoneY - ((note.time - currentAudioTime) * scrollSpeed); if (y < -100 || y > hitZoneY + 95) return null; const color = ((typeof window !== "undefined" && window.__rapSimSettings?.colorblindMode) ? ["red", "blue", "green", "yellow"] : LANE_COLORS)[note.lane]; return <div key={note.id} className={cx("absolute z-20 flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-6xl font-black drop-shadow-[0_0_18px_rgba(255,255,255,.25)]", color === "violet" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-violet-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-violet-200 bg-violet-500/25 text-violet-200 shadow-[0_0_26px_rgba(167,139,250,.4)]"), color === "cyan" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-cyan-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-cyan-100 bg-cyan-400/20 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,.4)]"), color === "pink" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-pink-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-pink-100 bg-pink-400/20 text-pink-100 shadow-[0_0_26px_rgba(244,114,182,.4)]"), color === "amber" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-amber-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-amber-100 bg-amber-300/20 text-amber-100 shadow-[0_0_26px_rgba(251,191,36,.4)]"), color === "red" && "border-red-100 bg-red-500/25 text-red-100 shadow-[0_0_26px_rgba(248,113,113,.45)]", color === "blue" && "border-blue-100 bg-blue-500/25 text-blue-100 shadow-[0_0_26px_rgba(96,165,250,.45)]", color === "green" && "border-green-100 bg-green-500/25 text-green-100 shadow-[0_0_26px_rgba(74,222,128,.45)]", color === "yellow" && "border-yellow-100 bg-yellow-400/25 text-yellow-100 shadow-[0_0_26px_rgba(250,204,21,.45)]")} style={{ left: `${note.lane * 85 + 2}px`, top: y }}><span className="absolute -top-10 h-10 w-2 rounded-full bg-white/15 blur-sm" />{LANE_ARROWS[note.lane]}</div>; })}<div className="absolute z-30 grid grid-cols-4 gap-1" style={{ width: 340, top: hitZoneY }}>{[0, 1, 2, 3].map((lane) => <button type="button" key={lane} onTouchStart={() => hitLane(lane)} onMouseDown={() => hitLane(lane)} className={cx("flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-black/45 text-6xl font-black transition", laneFlash === lane ? "scale-110 border-white text-white shadow-[0_0_30px_rgba(255,255,255,.7)]" : "border-white/45 text-white/45")}>{LANE_ARROWS[lane]}</button>)}</div>{ratingPopup ? <div className="pointer-events-none absolute left-1/2 top-[38%] z-40 -translate-x-1/2 animate-[floatUp_.5s_ease-out_forwards] text-6xl font-black text-white drop-shadow-[0_0_24px_rgba(255,255,255,.5)]">{ratingPopup}</div> : null}{combo > 1 ? <div className="pointer-events-none absolute left-1/2 top-[52%] z-40 -translate-x-1/2 text-5xl font-black text-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,.6)]">{combo}x</div> : null}{paused ? <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-6xl font-black text-white">PAUSED</div> : null}</div><div className="relative z-[120] border-t border-white/10 bg-[#030814]/95 p-4 shadow-[0_-18px_60px_rgba(0,0,0,.55)] backdrop-blur"><div className="mx-auto h-3 max-w-xl overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} /></div><div className="mx-auto mt-4 grid max-w-xl gap-3 sm:grid-cols-3"><Button onClick={() => setPaused((prev) => !prev)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Pause</Button>{!started ? <div><div className="mb-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-center text-[11px] font-bold text-zinc-300">stress: {player.stress} — timing windows reduced to {Math.round(stressMultiplier * 100)}% • studio: {studio.name} — {studioBonusText}</div><Button onClick={startTake} tone="success" className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">Start Take</Button></div> : <Button onClick={skipTake} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Skip</Button>}<Button onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Cancel</Button></div></div></div></>}</div>;
}

function FeedbackLayer({ floaters, progress, weekSplash, celebration, particles, milestone, modal }) {
  return <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">{floaters.map((item, index) => <div key={item.id} style={{ top: `${5 + index * 3.25}rem` }} className={cx("absolute left-1/2 -translate-x-1/2 animate-[floatUp_1.5s_ease-out_forwards] rounded-full border px-4 py-2 text-sm font-black shadow-2xl", item.kind === "loss" ? "border-rose-300/40 bg-rose-500/15 text-rose-200" : "border-lime-300/40 bg-lime-500/15 text-lime-200")}>{item.text}</div>)}{progress && <div className="absolute left-1/2 top-1/2 w-[min(24rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-cyan-300/25 bg-[#07111f]/95 p-5 shadow-2xl shadow-cyan-950/40 animate-[popIn_.18s_ease-out]"><div className="mb-3 text-center text-sm font-black uppercase tracking-[0.25em] text-cyan-200">{progress.label}</div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full animate-[loadBar_.75s_ease-in-out_forwards] rounded-full bg-cyan-300" /></div></div>}{weekSplash && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><div className="animate-[weekFlash_1.2s_ease-in-out_forwards] rounded-[2rem] border border-white/10 bg-[#07111f]/90 px-10 py-6 text-5xl font-black tracking-tight text-white shadow-2xl">WEEK {weekSplash}</div></div>}{celebration && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="relative w-[min(28rem,90vw)] rounded-[2rem] border border-amber-300/25 bg-[#07111f]/95 p-6 text-center shadow-2xl animate-[popIn_.22s_ease-out]">{particles.map((particle) => <span key={particle.id} className="absolute h-2 w-2 animate-[particle_1.4s_ease-out_forwards] rounded-full bg-cyan-300" style={{ left: `${particle.x}%`, top: `${particle.y}%`, animationDelay: `${particle.delay}ms` }} />)}<div className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Released</div><div className="mt-2 text-3xl font-black text-white">{celebration.title}</div><div className="mt-5 grid gap-2 sm:grid-cols-3">{celebration.stats.map((stat, index) => <div key={stat.label} className="animate-[statPop_.55s_ease-out_forwards] rounded-2xl border border-white/10 bg-white/[0.04] p-4 opacity-0" style={{ animationDelay: `${index * 220}ms` }}><div className="text-xl font-black text-lime-200">{stat.value}</div><div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{stat.label}</div></div>)}</div></div></div>}{milestone ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 px-4"><div className="animate-[weekFlash_2.4s_ease-in-out_forwards] rounded-[2rem] border border-amber-300/30 bg-[#07111f]/95 px-8 py-7 text-center shadow-2xl"><div className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">Fan Milestone</div><div className="mt-3 max-w-lg text-3xl font-black leading-tight text-white">{milestone}</div></div></div> : null}{modal ? <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/45 px-4">{modal}</div> : null}</div>;
}

function FeedbackStyles() {
  return <style>{`@keyframes stressShakeSoft{0%,100%{transform:translate(0,0)}50%{transform:translate(1px,-1px)}}@keyframes stressShake{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,-1px)}50%{transform:translate(-2px,1px)}75%{transform:translate(1px,2px)}}@keyframes stressPulse{0%,100%{opacity:.75;filter:brightness(1)}50%{opacity:1;filter:brightness(1.25)}}@keyframes floatUp{0%{opacity:0;transform:translate(-50%,18px) scale(.96)}15%{opacity:1}100%{opacity:0;transform:translate(-50%,-70px) scale(1.03)}}@keyframes popIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.94)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}@keyframes loadBar{0%{width:0%}100%{width:100%}}@keyframes weekFlash{0%{opacity:0;transform:scale(.9)}20%{opacity:1;transform:scale(1)}72%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.06)}}@keyframes statPop{0%{opacity:0;transform:translateY(12px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes particle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(20px,-70px) scale(.3)}}@keyframes tabFade{0%{opacity:.35;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes slideEntry{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}`}</style>;
}

function EventLogItem({ item }) {
  const tone = item.tone || "neutral";
  const look = tone === "good" ? "border-lime-300/20 bg-lime-300/10 text-lime-100" : tone === "bad" ? "border-rose-300/20 bg-rose-300/10 text-rose-100" : "border-white/10 bg-white/[0.04] text-zinc-300";
  const icon = tone === "good" ? "+" : tone === "bad" ? "!" : "•";
  return <div className={cx("flex items-start gap-3 rounded-2xl border p-3 text-sm animate-[slideEntry_.25s_ease-out]", look)}><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/20 text-xs font-black">{icon}</span><span>{item.text}</span></div>;
}

function Picker({ title, options, value, onChange }) {
  return <div><SectionTitle title={title} /><div className="grid gap-2">{options.map((option) => <OptionButton key={option} active={value === option} onClick={() => onChange(option)}>{option}</OptionButton>)}</div></div>;
}

function StartScreen({ stageName, setStageName, avatar, updateAvatar, startGame, settings = defaultSettings }) {
  const canStart = stageName.trim().length > 0;
  return <div className={cx("min-h-screen bg-[#030814] text-white", settings.highContrastText ? "contrast-125" : "")} style={{ fontSize: `${settings.uiScale}rem` }}><div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,.14),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,.12),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(251,191,36,.08),transparent_30%)]" /><main className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-5 px-4 py-8 lg:grid-cols-[0.85fr_1.15fr]"><AvatarCard stageName={stageName || "Your Name"} avatar={avatar} /><div className="space-y-5"><Card className="p-6"><div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">New Artist Setup</div><h1 className="bg-gradient-to-r from-cyan-200 via-white to-pink-200 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">Start from zero.</h1><p className="mt-4 text-sm leading-relaxed text-zinc-400">No fans. No money. Week 1. Just a bedroom, a notebook, and dangerous confidence.</p></Card><Card className="p-6"><TextInput label="Rapper Name" value={stageName} onChange={setStageName} placeholder="Enter your stage name" /><div className="mt-5 grid gap-4 md:grid-cols-3"><Picker title="Hair" options={hairOptions} value={avatar.hair} onChange={(v) => updateAvatar("hair", v)} /><Picker title="Hair Color" options={hairColorOptions.map((item) => item.name)} value={avatar.hairColor || "Black"} onChange={(v) => updateAvatar("hairColor", v)} /><Picker title="Skin Tone" options={skinToneOptions.map((i) => i.name)} value={avatar.skinTone} onChange={(v) => updateAvatar("skinTone", v)} /><Picker title="Starter Outfit" options={outfitOptions} value={avatar.outfit} onChange={(v) => updateAvatar("outfit", v)} /></div><div className="mt-5"><SectionTitle title="Backdrop" /><div className="grid gap-2 sm:grid-cols-2">{backdropOptions.map((option) => <OptionButton key={option} active={avatar.backdrop === option} onClick={() => updateAvatar("backdrop", option)}>{option}</OptionButton>)}</div></div><Button disabled={!canStart} onClick={startGame} tone="success" className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-lg font-black text-black hover:bg-cyan-200">Start Career</Button></Card></div></main></div>;
}

function StoreModal({ state, actions }) {
  const { money, fans, purchased, purchasedSkills, purchasedAccessories, activeSkills, storeTab, avatar } = state;
  const [previewAccessory, setPreviewAccessory] = useState(null);
  const previewAvatar = previewAccessory ? { ...avatar, accessories: [...new Set([...(avatar.accessories || []), previewAccessory])] } : avatar;
  return <div className="fixed inset-0 z-[135] flex items-center justify-center bg-black/60 px-3 py-5 backdrop-blur-sm"><Card className="max-h-[92vh] w-[min(62rem,96vw)] overflow-y-auto p-5"><div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Store</div><div className="mt-1 text-4xl font-black text-white">Store</div><div className="mt-1 text-xs text-zinc-500">Money: {formatMoney(money)} • Fans: {fans.toLocaleString()}</div></div><Button onClick={() => actions.setStoreOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Close</Button></div><div className="mb-3 grid grid-cols-3 gap-2">{[["gear", "Gear"], ["skills", "Skills"], ["accessories", "Accessories"]].map(([id, label]) => <Button key={id} onClick={() => actions.setStoreTab(id)} className={cx("rounded-2xl border px-4 py-3 text-sm font-black", storeTab === id ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10")}>{label}</Button>)}</div><div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-400"><span className="font-black text-amber-200">Gear</span> adds bonuses. <span className="font-black text-cyan-200">Skills</span> are perks. <span className="font-black text-pink-200">Accessories</span> are cosmetic.</div>{storeTab === "gear" ? <div className="grid gap-3 md:grid-cols-2">{studioUpgrades.map((item) => <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-white">{item.name}</div><div className="text-xs text-zinc-500">{item.detail}</div><div className="mt-2 text-xs text-cyan-200">Gear bonus: +{item.gain} {item.stat}</div><div className="text-xs text-zinc-500">{item.helps}</div></div><div className="text-right text-sm font-black text-amber-200">{formatMoney(item.cost)}</div></div><Button disabled={purchased.includes(item.name)} onClick={() => actions.buyUpgrade(item)} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white hover:bg-white/10">{purchased.includes(item.name) ? "Owned" : "Buy"}</Button></div>)}</div> : null}{storeTab === "skills" ? <div className="grid gap-3 md:grid-cols-2">{skills.map((skill) => <div key={skill.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-white">{skill.name}</div><div className="text-xs text-zinc-500">{skill.text}</div><div className="mt-2 text-xs text-cyan-200">Unlock: {skill.unlockFans.toLocaleString()} fans</div></div><div className="text-right text-sm font-black text-amber-200">{formatMoney(skill.cost)}</div></div><div className="mt-3 grid grid-cols-2 gap-2"><Button disabled={purchasedSkills.includes(skill.id) || fans < skill.unlockFans} onClick={() => actions.buySkill(skill)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white hover:bg-white/10">{purchasedSkills.includes(skill.id) ? "Owned" : "Buy"}</Button><Button disabled={!purchasedSkills.includes(skill.id)} onClick={() => actions.toggleSkill(skill)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white hover:bg-white/10">{activeSkills.includes(skill.id) ? "Equipped" : "Equip"}</Button></div></div>)}</div> : null}{storeTab === "accessories" ? <div className="grid gap-5 lg:grid-cols-[20rem_1fr]"><div className="sticky top-0 self-start"><AvatarCard stageName="Preview" avatar={previewAvatar} compact /><div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400">Click an accessory to preview it on your character. Buy it here, then equip it from the same card.</div></div><div className="grid gap-3 md:grid-cols-2">{accessoryOptions.map((item) => { const owned = purchasedAccessories.includes(item.name); const equipped = (avatar.accessories || []).includes(item.name); const locked = fans < item.unlockFans; return <div key={item.name} onMouseEnter={() => setPreviewAccessory(item.name)} onClick={() => setPreviewAccessory(item.name)} className={cx("cursor-pointer rounded-2xl border p-4 transition hover:-translate-y-0.5", previewAccessory === item.name ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/[0.035]")}><div className="flex items-start justify-between gap-3"><div><div className="font-black text-white">{item.name}</div><div className="text-xs text-zinc-500">Unlocks at {item.unlockFans.toLocaleString()} fans</div><div className="mt-1 text-xs text-amber-200">{previewAccessory === item.name ? "Previewing now" : "Click to preview"}</div></div><div className="text-right text-sm font-black text-amber-200">{formatMoney(item.cost)}</div></div><div className="mt-3 grid grid-cols-2 gap-2"><Button disabled={owned || locked} onClick={(event) => { event.stopPropagation(); actions.buyAccessory(item); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white hover:bg-white/10">{owned ? "Owned" : locked ? "Locked" : "Buy"}</Button><Button disabled={!owned} onClick={(event) => { event.stopPropagation(); actions.toggleAccessory(item.name); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white hover:bg-white/10">{equipped ? "Unequip" : "Equip"}</Button></div></div>; })}</div></div> : null}</Card></div>;
}

function SettingsButton({ onClick }) {
  return <Button onClick={onClick} className="fixed right-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#06101d]/95 text-2xl text-cyan-200 shadow-2xl backdrop-blur hover:bg-white/10">⚙</Button>;
}

function StoreButton({ onClick }) {
  return <Button onClick={onClick} className="fixed right-20 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#06101d]/95 text-xl text-amber-200 shadow-2xl backdrop-blur hover:bg-white/10">$</Button>;
}

function BottomNav({ tab, setTab }) {
  const items = [{ id: "home", label: "Home", icon: "⌂" }, { id: "music", label: "Music", icon: "♪" }, { id: "feed", label: "Feed", icon: "#" }, { id: "charts", label: "Charts", icon: "↗" }, { id: "career", label: "Career", icon: "★" }, { id: "profile", label: "Profile", icon: "●" }];
  return <div className="sticky bottom-4 z-30 mx-auto mt-5 max-w-7xl px-4"><div className="grid grid-cols-6 gap-2 rounded-[1.7rem] border border-white/10 bg-[#06101d]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">{items.map((item) => <Button key={item.id} onClick={() => setTab(item.id)} className={cx("rounded-[1.25rem] px-2 py-3 text-center text-xs font-black uppercase tracking-wide", tab === item.id ? "bg-cyan-300/15 text-cyan-200" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200")}><div className="text-xl leading-none">{item.icon}</div><div className="mt-1">{item.label}</div></Button>)}</div></div>;
}

function TopBar({ week, fans, money, rank }) {
  const items = [{ icon: "▣", color: "blue", main: `Week ${week}`, sub: "Bedroom era" }, { icon: "☷", color: "teal", main: <TopNumber value={fans} />, sub: "Fans" }, { icon: "$", color: "lime", main: <TopNumber value={money} type="money" />, sub: "Money" }, { icon: "♛", color: "gold", main: rank, sub: "Rank" }];
  return <Card className="grid gap-2 p-3 sm:grid-cols-4">{items.map((item) => <div key={item.sub} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3"><IconBubble label={item.icon} color={item.color} /><div className="min-w-0"><div className={cx("truncate text-sm font-black", item.color === "gold" ? "text-amber-200" : "text-white")}>{item.main}</div><div className="text-xs text-zinc-500">{item.sub}</div></div></div>)}</Card>;
}

function ActionButton({ color = "teal", icon, title, sub, onClick, disabled = false, tone = "click" }) {
  const colorMap = {
    teal: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    pink: "border-pink-300/25 bg-pink-300/10 text-pink-100",
    gold: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    purple: "border-violet-300/25 bg-violet-300/10 text-violet-100",
  };
  return <Button disabled={disabled} onClick={onClick} tone={tone} className={cx("w-full rounded-2xl border p-4 text-left hover:bg-white/10", colorMap[color] || colorMap.teal)}><div className="flex items-center gap-3"><IconBubble label={icon} color={color === "purple" ? "purple" : color === "gold" ? "gold" : color === "pink" ? "pink" : "teal"} /><div><div className="font-black text-white">{title}</div>{sub ? <div className="mt-1 text-xs text-zinc-400">{sub}</div> : null}</div></div></Button>;
}

function DraftCard({ draft, setSongTitle, setDraftCover }) {
  return <div className="space-y-4"><div className="flex gap-4"><ProjectCover project={{ title: draft.title, coverStyle: draft.coverStyle || "custom", coverA: draft.coverA, coverB: draft.coverB, customCoverImage: draft.customCoverImage }} small /><div className="min-w-0 flex-1"><TextInput label="Song Title" value={draft.title} onChange={setSongTitle} placeholder="Name the track" /><div className="mt-3 text-sm text-zinc-400">Concept: {draft.concept}</div><div className="mt-2 text-xs text-zinc-500">Beat: {draft.beat} • {draft.beatTier}</div><div className="mt-3 flex items-center gap-3 text-xs text-zinc-400"><span>Draft Grade</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all duration-500" style={{ width: `${clamp(draft.quality, 0, 100)}%` }} /></div><span className="font-black text-cyan-200">{getDraftGrade(draft.quality)}</span></div></div></div>{setDraftCover ? <CoverPicker draft={draft} setDraft={(next) => setDraftCover(next)} label="Song Cover" /> : null}</div>;
}

function DraftSummaryRow({ draft }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 animate-[slideEntry_.25s_ease-out]"><ProjectCover project={{ title: draft.title, coverStyle: draft.coverStyle || "custom", coverA: draft.coverA, coverB: draft.coverB, customCoverImage: draft.customCoverImage }} small /><div className="min-w-0 flex-1"><div className="truncate font-bold text-white">{draft.title}</div><div className="text-xs font-black uppercase text-blue-300">current draft</div><div className="text-xs text-zinc-500">{draft.beat} • {draft.beatTier} • draft grade {getDraftGrade(draft.quality)}</div></div><IconBubble label="✎" color="blue" /></div>;
}

function TrackRow({ song, onSelect, onDelete }) {
  const releasedText = song.released ? `${song.releasedAs === "project" ? "Project track" : "Single"} • ${(song.weeklyStreams || 0).toLocaleString()} plays this week • ${(song.lifetimeStreams || song.streams || 0).toLocaleString()} all-time plays` : song.releasedAs === "project" ? "Held for project" : "Ready to release";
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"><ProjectCover project={{ title: song.title, coverStyle: song.coverStyle || "custom", coverA: song.coverA, coverB: song.coverB, customCoverImage: song.customCoverImage }} small /><div className="min-w-0 flex-1"><div className="truncate font-black text-white">{song.title}</div><div className="text-xs text-zinc-500">{releasedText}</div><div className="mt-1 text-xs text-cyan-200">Final tier: {getQualityTier(song.quality)} {song.takeRating ? `• ${song.takeRating}` : ""}</div></div>{(onSelect || onDelete) ? <div className="grid gap-2">{onSelect ? <Button onClick={onSelect} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100">Select</Button> : null}{onDelete ? <Button onClick={onDelete} className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-xs font-black text-rose-100">Delete</Button> : null}</div> : null}</div>;
}

function ProjectCard({ project, songs, onRelease, onCancel, onRemove }) {
  const type = projectTypes[project.type] || projectTypes.mixtape;
  const projectSongs = songs.filter((song) => (project.songIds || []).includes(song.id));
  const ready = project.status === "in progress" && projectSongs.length >= type.minSongs;
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex gap-4"><ProjectCover project={project} small /><div className="min-w-0 flex-1"><div className="text-lg font-black text-white">{project.title}</div><div className="text-xs font-black uppercase text-cyan-200">{type.label} • {project.status}</div><div className="mt-1 text-xs text-zinc-500">{projectSongs.length}/{type.maxSongs} songs • release at {type.minSongs}+</div>{project.status === "released" ? <div className="mt-2 text-xs text-zinc-400">Week {project.releaseWeek} • {formatMoney(project.totalEarnings || 0)} earned</div> : <div className="mt-3 flex flex-wrap gap-2"><Button disabled={!ready} onClick={() => onRelease(project.id)} className="rounded-xl bg-amber-300 px-3 py-2 text-xs font-black text-black disabled:opacity-40">Release Project</Button><Button onClick={() => onCancel(project.id)} className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-xs font-black text-rose-100">Cancel</Button></div>}</div></div><div className="mt-3 grid gap-2">{projectSongs.length ? projectSongs.map((song) => <div key={song.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-2 text-xs"><span className="truncate text-zinc-300">{song.title}</span>{project.status === "in progress" ? <Button onClick={() => onRemove(project.id, song.id)} className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-black text-zinc-300">Remove</Button> : null}</div>) : <div className="text-xs text-zinc-500">No songs added yet.</div>}</div></div>;
}

function MusicVideoSection({ state, actions }) {
  const { songs, fans, money, activeShow, week } = state;
  const [selectedSongId, setSelectedSongId] = useState(null);
  const releasedSongs = songs.filter((song) => song.released);
  const availableSongs = releasedSongs.filter((song) => !song.video);
  const selectedSong = availableSongs.find((song) => song.id === selectedSongId) || null;
  const videos = releasedSongs.filter((song) => song.video);
  function closeMenu() { setSelectedSongId(null); }
  function makeVideo(videoId) { if (!selectedSong) return; actions.releaseVideoForSong(selectedSong.id, videoId); closeMenu(); }
  return <Card className="p-5"><SectionTitle title="Music Videos" right="pick a released song" />{releasedSongs.length ? <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><SectionTitle title="Make Music Video" right={activeShow ? "locked by show" : "choose track"} />{activeShow ? <div className="mb-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">You're booked for {activeShow.name}. Finish the show run before making videos.</div> : null}<div className="grid gap-3">{availableSongs.length ? availableSongs.map((song) => <Button key={song.id} disabled={Boolean(activeShow)} onClick={() => setSelectedSongId(song.id)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left hover:bg-white/10"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-white">{song.title}</div><div className="mt-1 text-xs text-zinc-500">{(song.weeklyStreams || 0).toLocaleString()} weekly plays • {getQualityTier(song.quality)}</div></div><div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">Make Video</div></div></Button>) : <EmptyState text="Every released song already has a video. Drop more songs." />}</div></div><div><SectionTitle title="Released Music Videos" right={`${videos.length} out`} />{videos.length ? <div className="grid gap-3">{videos.map((song) => { const weeksLeft = Math.max(0, song.video.boostWeeks - (week - song.video.releaseWeek)); const status = weeksLeft > 0 ? `${weeksLeft} video boost weeks left` : "video boost ended"; return <div key={song.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-white">{song.title}</div><div className="text-xs text-zinc-500">{song.video.maker || song.video.type} • {song.video.type} • {status}</div></div><div className="text-xs text-amber-200">Week {song.video.releaseWeek}</div></div></div>; })}</div> : <EmptyState text="No videos out yet. Pick a released song and make one." />}</div></div> : <EmptyState text="Release a song first, then make a video for it." />}{selectedSong ? <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"><Card className="max-h-[90vh] w-[min(42rem,96vw)] overflow-y-auto p-5"><div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Make Music Video</div><div className="mt-1 text-3xl font-black text-white">{selectedSong.title}</div><div className="mt-1 text-xs text-zinc-500">Pick who shoots the video. Every video helps, but better crews can push the song further.</div></div><Button onClick={closeMenu} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Close</Button></div><div className="grid gap-3 sm:grid-cols-2">{videoOptions.map((video) => { const locked = fans < video.unlockFans || money < video.cost; return <Button key={video.id} disabled={locked} onClick={() => makeVideo(video.id)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left hover:bg-white/10 disabled:text-zinc-600"><div className="flex items-start justify-between gap-3"><div><div className="text-lg font-black text-white">{video.maker}</div><div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{video.type}</div></div><div className="text-right text-sm font-black text-amber-200">{formatMoney(video.cost)}</div></div><div className="mt-3 text-xs leading-relaxed text-zinc-400">{video.description}</div><div className="mt-3 text-xs text-zinc-500">Boost lasts {video.boostWeeks} weeks. Better crews can make the song travel further.</div>{video.unlockFans ? <div className="mt-2 text-xs text-zinc-500">Unlock: {video.unlockFans.toLocaleString()} fans</div> : null}</Button>; })}</div></Card></div> : null}</Card>;
}

function HomeScreen({ state, actions }) {
  const { stageName, avatar, creativity, stress, setup, lyrics, beats, rep, draft, songs, log, lastCatalogEarnings, weeksSinceLastRelease, fans, currentJob, activeShow, projects } = state;
  const releasedProjects = projects.filter((project) => project.status === "released");
  const activeProjects = projects.filter((project) => project.status === "in progress");
  return <div className="space-y-5 animate-[tabFade_.22s_ease-out]"><div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]"><AvatarCard stageName={stageName} avatar={avatar} compact /><Card className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><SectionTitle title="Career Dashboard" right={`Week ${state.week}`} /><div className="text-4xl font-black tracking-tight text-white">{stageName}</div><div className="mt-2 text-sm text-zinc-400"><TopNumber value={fans} /> fans • <TopNumber value={rep} /> reputation • {setup} production skill</div></div><Button onClick={() => actions.setStoreOpen(true)} className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-black hover:bg-amber-200">Open Store</Button></div><div className="mt-6 grid gap-3 md:grid-cols-4"><StatBar label="Creativity" value={creativity} color="cyan" icon="C" /><StatBar label="Stress" value={stress} color="rose" icon="S" /><StatBar label="Lyrics" value={lyrics} color="purple" icon="L" max={null} /><StatBar label="Beats" value={beats} color="gold" icon="B" max={null} /></div><div className="mt-5 grid gap-3 md:grid-cols-3"><InfoCard icon="$" color="lime" title={`Streaming this week: ${(lastCatalogEarnings.streams || 0).toLocaleString()} plays`} text={`+${formatMoney(lastCatalogEarnings.money || 0)} stream revenue • +${lastCatalogEarnings.fans || 0} fans`} /><InfoCard icon="W" color={weeksSinceLastRelease >= 3 ? "gold" : "gray"} title={`Weeks since last release: ${weeksSinceLastRelease}`} text={weeksSinceLastRelease >= 3 ? "Fans are waiting on a new drop." : "Audience is still warm."} /><InfoCard icon="J" color={currentJob ? "gold" : activeShow ? "purple" : "gray"} title={activeShow ? `Booked: ${activeShow.name}` : currentJob ? `Work: ${currentJob.name}` : "No work or show"} text={activeShow ? `${activeShow.remainingWeeks} week${activeShow.remainingWeeks === 1 ? "" : "s"} left. Rest advances the run.` : currentJob ? `+${formatMoney(currentJob.weeklyPay)}/week • stress stays at least ${currentJob.stressFloor}` : "Jobs, side grind, and shows are in Career."} /></div><div className="mt-5"><ActionButton color="purple" icon="☾" title="Rest / Next Week" sub="Advances week, updates streams/charts, restores creativity" onClick={actions.rest} /></div></Card></div><div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><SectionTitle title="Current Draft" right={draft ? `${draft.rerollsLeft} rewrites left` : "empty"} />{draft ? <DraftSummaryRow draft={draft} /> : <EmptyState text="No draft yet. Write a song in the Music tab." />}</Card><Card className="p-5"><SectionTitle title="Recent Tracks" /><div className="space-y-3">{songs.length ? songs.slice(0, 3).map((song) => <TrackRow key={song.id} song={song} />) : <EmptyState text="No tracks yet." />}</div></Card></div><Card className="p-5"><div className="grid gap-3 md:grid-cols-2">{releasedProjects.length ? <InfoCard icon="P" color="gold" title={`Latest project: ${releasedProjects[0].title}`} text={`${projectTypes[releasedProjects[0].type].label} • week ${releasedProjects[0].releaseWeek}`} /> : <InfoCard icon="P" color="gray" title="Latest project: none" text="Start a mixtape or album in Music." />}{activeProjects.length ? <InfoCard icon="W" color="cyan" title={`In progress: ${activeProjects[0].title}`} text={`${activeProjects[0].songIds.length}/${projectTypes[activeProjects[0].type].maxSongs} songs`} /> : <InfoCard icon="W" color="gray" title="No active project" text="Singles still work normally." />}</div></Card><Card className="p-5"><SectionTitle title="Live World" /><div className="grid gap-3 md:grid-cols-2">{log.slice(0, 4).map((item, index) => <EventLogItem key={`${item.text}-${index}`} item={item} />)}</div></Card></div>;
}

function MusicScreen({ state, actions }) {
  const { songs, draft, recorded, selectedStyles, songTitleInput, unlockedStudios, currentStudio, producer, currentLyricsRecorded, creativity, beats, totalBeats, hoveredBeat, fans, projects, projectDraft, musicPanel } = state;
  const playerForBeat = { skills: { beats: totalBeats || beats }, creativity };
  const recordedDrafts = songs.filter((song) => !song.released && song.releasedAs !== "project");
  const queuedSongs = songs.filter((song) => song.releasedAs === "project" && !song.released);
  const releasedSingles = songs.filter((song) => song.released && song.releasedAs === "single");
  const inProgressProjects = projects.filter((project) => project.status === "in progress");
  const releasedProjects = projects.filter((project) => project.status === "released");
  const panels = [["create", "Create"], ["projects", "Projects"], ["videos", "Videos"], ["ready", "Ready"], ["catalog", "Catalog"]];
  return <div className="space-y-5 animate-[tabFade_.22s_ease-out]"><Card className="p-4"><SectionTitle title="Music" right="choose a menu" /><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{panels.map(([id, label]) => <Button key={id} onClick={() => actions.setMusicPanel(id)} className={cx("rounded-2xl border px-4 py-3 text-sm font-black", musicPanel === id ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10")}>{label}</Button>)}</div></Card>{musicPanel === "create" ? <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]"><Card className="p-5"><SectionTitle title="Create Track" right={draft ? `${draft.rerollsLeft} rewrites left` : "write first"} /><TextInput label="Song Title" value={songTitleInput} onChange={actions.setSongTitleInput} placeholder="Name the track before writing" /><div className="mt-4 grid gap-3 sm:grid-cols-2"><Button disabled={Boolean(state.activeShow) || (draft && draft.rerollsLeft <= 0)} onClick={actions.writeSong} className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-black hover:bg-cyan-200">{draft ? "Rewrite Lyrics" : "Write Song"}</Button><Button disabled={Boolean(state.activeShow) || currentLyricsRecorded || !draft} onClick={actions.recordSong} className="rounded-2xl bg-pink-400 px-4 py-3 text-sm font-black text-black hover:bg-pink-300">Record Track</Button></div>{draft ? <div className="mt-4"><DraftCard draft={draft} setSongTitle={actions.setSongTitle} setDraftCover={actions.setDraftCover} /></div> : <div className="mt-4"><EmptyState text="No draft loaded. Pick a beat source, name the song, then write." /></div>}</Card><Card className="p-5"><SectionTitle title="Recording Setup" right={currentStudio.name} /><div className="grid gap-4"><div><SectionTitle title="Beat Source" right={producer.name} /><div className="grid gap-2">{producers.map((item) => { const tier = beatTierForProducer(item, playerForBeat); return <Button key={item.id} onMouseEnter={() => actions.setHoveredBeat(item.id)} onMouseLeave={() => actions.setHoveredBeat(null)} onClick={() => actions.hireProducer(item)} className={cx("rounded-2xl border p-3 text-left text-sm", producer.id === item.id ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:bg-white/10")}><div className="flex justify-between gap-3"><span className="font-black">{item.name}</span><span className="text-amber-200">{formatMoney(item.price)}</span></div><div className="mt-1 text-xs text-zinc-500">{item.id === "own" ? `your beats: ${tier}` : `quality: ${tier}`}</div></Button>; })}</div>{hoveredBeat ? <div className="mt-2 text-xs text-zinc-500">Beat choice affects draft grade. Own beats use your Beats stat + gear bonus.</div> : null}</div><div><SectionTitle title="Studio" /><div className="grid gap-2">{studios.map((studio) => <Button key={studio.name} disabled={!unlockedStudios.includes(studio.name)} onClick={() => actions.setStudio(studio.name)} className={cx("rounded-2xl border p-3 text-left text-sm", currentStudio.name === studio.name ? "border-pink-300 bg-pink-300/15 text-pink-100" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:bg-white/10")}><div className="font-black">{studio.name}</div><div className="text-xs text-zinc-500">{studio.description} • +{studio.quality} recording quality</div></Button>)}</div></div></div></Card>{recorded ? <Card className="p-5 lg:col-span-2"><SectionTitle title="Recording Ready" right={recorded.title} /><div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{rolloutOptions.map((rollout) => { const selected = state.selectedRollout === rollout.id; const locked = fans < rollout.unlockFans || state.money < rollout.cost; return <Button key={rollout.id} disabled={locked} onClick={() => actions.setSelectedRollout(rollout.id)} className={cx("rounded-xl border p-3 text-left text-xs", selected ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10")}><div className="font-black">{rollout.name}</div><div>{rollout.text}</div>{rollout.cost ? <div className="mt-1 text-amber-200">{formatMoney(rollout.cost)}</div> : null}</Button>; })}</div><div className="grid gap-2 sm:grid-cols-2"><Button disabled={Boolean(state.activeShow)} onClick={() => actions.releaseRecordedAsSingle(recorded)} tone="success" className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-black">Release as Single</Button>{inProgressProjects.map((project) => <Button key={project.id} onClick={() => actions.addRecordedToProject(project.id, recorded)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10">Add to {project.title}</Button>)}</div></Card> : null}</div> : null}{musicPanel === "projects" ? <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><Card className="p-5"><SectionTitle title="Start Mixtape / Album" /><TextInput label="Project Title" value={projectDraft.title} onChange={(value) => actions.setProjectDraft({ ...projectDraft, title: value })} placeholder="Project name" /><div className="mt-4 grid gap-2 sm:grid-cols-2">{Object.entries(projectTypes).map(([id, type]) => <OptionButton key={id} active={projectDraft.type === id} onClick={() => actions.setProjectDraft({ ...projectDraft, type: id })}>{type.label}</OptionButton>)}</div><CoverPicker draft={projectDraft} setDraft={actions.setProjectDraft} label="Project Cover" /><Button onClick={actions.startProject} className="mt-4 w-full rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">Start Mixtape / Album</Button></Card><Card className="p-5"><SectionTitle title="Projects" right={`${projects.length} total`} /><div className="grid gap-3">{projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} songs={songs} onRelease={actions.releaseProject} onCancel={actions.cancelProject} onRemove={actions.removeSongFromProject} />) : <EmptyState text="No mixtapes or albums yet. Start one, add recorded songs, then release it." />}</div></Card></div> : null}{musicPanel === "videos" ? <MusicVideoSection state={state} actions={actions} /> : null}{musicPanel === "ready" ? <div className="grid gap-5 lg:grid-cols-2"><Card className="p-5"><SectionTitle title="Ready To Release" right={`${recordedDrafts.length} tracks`} />{recordedDrafts.length ? <div className="grid gap-3">{recordedDrafts.map((song) => <TrackRow key={song.id} song={song} onSelect={() => actions.selectRecordedDraft(song)} onDelete={() => actions.deleteRecordedDraft(song)} />)}</div> : <EmptyState text="No tracks ready to release yet. Record a song first." />}</Card><Card className="p-5"><SectionTitle title="Songs Held For Projects" right={`${queuedSongs.length} tracks`} />{queuedSongs.length ? <div className="grid gap-3">{queuedSongs.map((song) => <TrackRow key={song.id} song={song} />)}</div> : <EmptyState text="No songs held for a project yet. Add recorded songs to a mixtape or album." />}</Card></div> : null}{musicPanel === "catalog" ? <div className="grid gap-5 lg:grid-cols-2"><Card className="p-5"><SectionTitle title="Released Singles" right={`${releasedSingles.length} songs`} />{releasedSingles.length ? <div className="grid gap-3">{releasedSingles.map((song) => <TrackRow key={song.id} song={song} />)}</div> : <EmptyState text="No released singles yet." />}</Card><Card className="p-5"><SectionTitle title="Released Projects" right={`${releasedProjects.length} projects`} />{releasedProjects.length ? <div className="grid gap-3">{releasedProjects.map((project) => <ProjectCard key={project.id} project={project} songs={songs} onRelease={actions.releaseProject} onCancel={actions.cancelProject} onRemove={actions.removeSongFromProject} />)}</div> : <EmptyState text="No released projects yet." />}</Card></div> : null}</div>;
}

function FeedPost({ post }) {
  const look = post.type === "fan" ? "border-lime-300/20 bg-lime-300/10 text-lime-100" : post.type === "hater" ? "border-rose-300/20 bg-rose-300/10 text-rose-100" : post.type === "blog" ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : post.type === "industry" ? "border-amber-300/20 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.04] text-zinc-300";
  return <div className={cx("rounded-2xl border p-4 animate-[slideEntry_.25s_ease-out]", look)}><div className="flex items-center justify-between gap-3"><div className="text-sm font-black">{post.username}</div><div className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">Week {post.week}</div></div><div className="mt-2 text-sm leading-relaxed">{post.text}</div><div className="mt-3 flex gap-3 text-xs opacity-70"><span>{post.likes.toLocaleString()} likes</span><span>{post.reposts.toLocaleString()} reposts</span></div></div>;
}

function FeedScreen({ state }) {
  const { feedPosts, releaseReactions } = state;
  return <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] animate-[tabFade_.22s_ease-out]"><Card className="p-5"><SectionTitle title="The Feed" right={`${feedPosts.length}/100 posts`} />{feedPosts.length ? <div className="grid gap-3">{feedPosts.map((post) => <FeedPost key={post.id} post={post} />)}</div> : <EmptyState text="The world is quiet right now. Drop music, play shows, or hit milestones to get people talking." />}</Card><Card className="p-5"><SectionTitle title="Latest Reactions" />{releaseReactions ? <div><div className="mb-4 text-2xl font-black text-white">{releaseReactions.title}</div><div className="grid gap-3">{releaseReactions.reactions.map((reaction, index) => <FeedPost key={`${releaseReactions.id}-${index}`} post={{ id: `${releaseReactions.id}-${index}`, week: releaseReactions.week || 1, username: reaction.username || (feedUsers[reaction.type] || feedUsers.neutral)[0], text: reaction.text, type: reaction.type, likes: reaction.likes || 0, reposts: reaction.reposts || 0 }} />)}</div></div> : <EmptyState text="Release something and the world will react here." />}</Card></div>;
}

function ChartsScreen({ state }) {
  const { songs, fans } = state;
  const released = songs.filter((song) => song.released && song.chartName && song.chartPosition).sort((a, b) => a.chartPosition - b.chartPosition);
  return <div className="space-y-5 animate-[tabFade_.22s_ease-out]"><Card className="p-5"><SectionTitle title="Charts" right="updates every week" /><div className="grid gap-3 md:grid-cols-4">{chartDefs.map((chart) => <InfoCard key={chart.id} icon="#" color={fans >= chart.unlockFans ? "cyan" : "gray"} title={chart.name} text={fans >= chart.unlockFans ? "Unlocked" : `Unlocks at ${chart.unlockFans.toLocaleString()} fans`} />)}</div></Card><Card className="p-5"><SectionTitle title="Songs On Chart" right={`${released.length} charting`} />{released.length ? <div className="grid gap-3">{released.map((song) => { const movement = !song.lastChartPosition ? "NEW" : song.chartPosition < song.lastChartPosition ? "↗" : song.chartPosition > song.lastChartPosition ? "↘" : "—"; const peak = song.chartPosition === song.peakChartPosition ? "PEAK" : `peak #${song.peakChartPosition}`; return <div key={song.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xl font-black text-white">#{song.chartPosition} {song.title}</div><div className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{song.chartName} • {movement} • {peak}</div></div><div className="text-right text-xs text-zinc-500">{song.weeksOnChart || 0} weeks<br />{(song.weeklyStreams || 0).toLocaleString()} plays this week</div></div></div>; })}</div> : <EmptyState text="No songs on the charts yet. Build streams, fans, and release momentum." />}</Card></div>;
}

function CareerActionsPanel({ state, actions }) {
  const { sideHustleOpen, fans, currentJob, activeShow } = state;
  return (
    <Card className="p-5">
      <SectionTitle title="Work / Side Grind" right="early money + small moves" />
      <Button onClick={() => actions.setSideHustleOpen(!sideHustleOpen)} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white hover:bg-white/10">{sideHustleOpen ? "Hide Actions" : "Open Actions"}</Button>
      {currentJob ? <div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">work: {currentJob.name} (+{formatMoney(currentJob.weeklyPay)}/week, stress stays at least {currentJob.stressFloor})</div> : null}
      {activeShow ? <div className="mt-3 rounded-xl border border-violet-300/20 bg-violet-300/10 p-3 text-xs text-violet-100">Booked for {activeShow.name}. Jobs and side grind are paused until it wraps.</div> : null}
      {sideHustleOpen ? (
        <div className="mt-4 grid gap-4">
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Work</div>
            {currentJob ? (
              <div className="grid gap-2"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-zinc-300">Current work: <span className="font-black text-white">{currentJob.name}</span><br />{currentJob.description}</div><Button onClick={actions.quitJob} className="rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-xs font-black text-rose-100 hover:bg-rose-400/20">Quit Work</Button></div>
            ) : (
              <div className="grid gap-2">{sideHustles.map((hustle) => <Button key={hustle.id} disabled={Boolean(activeShow) || fans >= 5000} onClick={() => actions.doSideHustle(hustle)} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left text-xs text-zinc-300 hover:bg-white/10 disabled:text-zinc-600"><div className="font-black text-white">{hustle.name}</div><div>{fans >= 5000 ? "you're too big for that now" : `+${formatMoney(hustle.weeklyPay)}/week • stress floor ${hustle.stressFloor}`}</div><div className="mt-1 text-zinc-500">{hustle.description}</div></Button>)}</div>
            )}
          </div>
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Side Grind</div>
            <div className="grid gap-2">{sideActivities.map((activity) => <Button key={activity.id} disabled={Boolean(activeShow) || !actions.canDoActivity(activity)} onClick={() => actions.doActivity(activity)} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left text-xs text-zinc-300 hover:bg-white/10 disabled:text-zinc-600"><div className="font-black text-white">{activity.name}</div><div>{activity.description}</div><div className="mt-1 text-zinc-500">{activeShow ? "Paused during show run" : actions.activityLockText(activity)}</div></Button>)}</div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function ShowsPanel({ state, actions }) {
  const { fans, showHistory, activeShow } = state;

  return (
    <Card className="p-5">
      <SectionTitle title="Shows" right={activeShow ? `${activeShow.remainingWeeks} weeks left` : "book a run"} />
      {activeShow ? (
        <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          <div className="font-black">Currently booked: {activeShow.name}</div>
          <div className="mt-1 text-xs">{activeShow.remainingWeeks} week{activeShow.remainingWeeks === 1 ? "" : "s"} left • stress floor {activeShow.stressFloor}. Writing, recording, releasing, side grind, projects, and videos are paused. Rest advances the run.</div>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {showOptions.map((show) => {
          const locked = Boolean(activeShow) || fans < show.unlockFans;
          return (
            <Button
              key={show.id}
              disabled={locked}
              onClick={() => actions.performShow(show)}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left hover:bg-white/10 disabled:text-zinc-600"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="font-black text-white">{show.name}</div>
                  <div className="text-xs text-zinc-500">Requires {show.unlockFans.toLocaleString()} fans • lasts {show.weeks} week{show.weeks > 1 ? "s" : ""}</div>
                </div>
                <div className="text-right text-xs text-amber-200">
                  {formatMoney(show.payMin)}{show.payMax !== show.payMin ? `-${formatMoney(show.payMax)}` : ""}
                  <br />
                  stress floor {show.stressFloor}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {showHistory?.length ? (
        <div className="mt-5">
          <SectionTitle title="Recent Shows" />
          <div className="grid gap-2">
            {showHistory.slice(0, 5).map((show) => (
              <div key={show.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-400">
                Week {show.week}: {show.name} • +{show.fans.toLocaleString()} fans • +{formatMoney(show.money)}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function CareerScreen({ state }) {
  const { fans, rep, rank, week, log, setup, currentJob, activeShow } = state;
  const nextGoal = Math.max(100, Math.ceil((fans + 100) / 100) * 100);
  return <div className="grid gap-5 lg:grid-cols-3 animate-[tabFade_.22s_ease-out]"><Card className="p-5 lg:col-span-2"><SectionTitle title="Career Progress" right={`Week ${week}`} /><div className="text-3xl font-black text-white">{rank}</div><div className="mt-2 text-sm text-zinc-400"><TopNumber value={fans} /> fans • <TopNumber value={rep} /> reputation • {setup} production skill</div><div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-500" style={{ width: `${clamp((fans / nextGoal) * 100, 0, 100)}%` }} /></div><div className="mt-2 text-xs text-zinc-500">Next fan milestone: {nextGoal.toLocaleString()}</div></Card><Card className="p-5"><SectionTitle title="Career Notes" right="what to do next" /><div className="text-sm leading-relaxed text-zinc-400">Use jobs and side grind early, then book shows once your fanbase is ready. Releases, charts, and videos keep the career moving.</div></Card><Card className="p-5 lg:col-span-3"><SectionTitle title="Career Status" /><div className="mb-4 grid gap-3 md:grid-cols-2"><InfoCard icon="J" color={currentJob ? "gold" : "gray"} title={currentJob ? `Work: ${currentJob.name}` : "No work"} text={currentJob ? `Weekly pay: ${formatMoney(currentJob.weeklyPay)} • stress stays at least ${currentJob.stressFloor}` : "Use jobs only when money is tight early."} /><InfoCard icon="S" color={activeShow ? "purple" : "gray"} title={activeShow ? `Booked: ${activeShow.name}` : "No show booked"} text={activeShow ? `${activeShow.remainingWeeks} week${activeShow.remainingWeeks === 1 ? "" : "s"} left. Rest advances the run.` : "Book shows once your fanbase is ready."} /></div><SectionTitle title="World Events" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{log.map((item, index) => <EventLogItem key={`${item.text}-${index}`} item={item} />)}</div></Card></div>;
}

function ArtistStatUpgradeCard({ title, icon, color, value, gearBonus = 0, hint, onUpgrade }) {
  const cost = artistStatCost(value);
  const gain = artistStatGain(cost);
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><IconBubble label={icon} color={color} /><div><div className="font-black text-white">{title}: {value}</div>{gearBonus ? <div className="text-xs text-amber-200">gear bonus: +{gearBonus}</div> : <div className="text-xs text-zinc-500">raw stat from training</div>}</div></div><div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-zinc-300">uncapped</div></div><div className="mt-3 text-xs leading-relaxed text-zinc-400">{hint}</div><Button onClick={onUpgrade} className="mt-4 w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-black hover:bg-cyan-200">Train +{gain} • {formatMoney(cost)}</Button></div>;
}

function ProfileScreen({ state, actions }) {
  const { stageName, avatar, setup, lyrics, beats, purchasedAccessories } = state;
  const gearBoosts = state.gearBoosts || { lyrics: 0, beats: 0, production: 0 };
  const equippedAccessories = avatar.accessories || [];
  return <div className="grid gap-5 xl:grid-cols-[0.95fr_1.25fr] animate-[tabFade_.22s_ease-out]"><AvatarCard stageName={stageName} avatar={avatar} /><div className="space-y-5"><Card className="p-5"><SectionTitle title="Identity" right="editable" /><TextInput label="Rapper Name" value={stageName} onChange={actions.setStageName} placeholder="Enter stage name" /></Card><Card className="p-5"><SectionTitle title="Train Artist Stats" right="raw talent" /><div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-400"><span className="font-black text-cyan-200">Training</span> is raw talent. <span className="font-black text-amber-200">Gear</span> is a separate bonus. <span className="font-black text-pink-200">Studio</span> affects recording quality.</div><div className="grid gap-4 md:grid-cols-3"><ArtistStatUpgradeCard title="Lyrics" icon="L" color="blue" value={lyrics} gearBonus={gearBoosts.lyrics} hint="Raw writing talent. Gear adds a separate bonus." onUpgrade={() => actions.trainArtistStat("lyrics")} /><ArtistStatUpgradeCard title="Beats" icon="B" color="gold" value={beats} gearBonus={gearBoosts.beats} hint="Raw beat-making talent. Gear only helps when making your own beats." onUpgrade={() => actions.trainArtistStat("beats")} /><ArtistStatUpgradeCard title="Production" icon="P" color="pink" value={setup} gearBonus={gearBoosts.production} hint="Raw engineering skill. Gear adds separate production support." onUpgrade={() => actions.trainArtistStat("production")} /></div></Card><Card className="p-5"><SectionTitle title="Appearance" right="live preview" /><div className="grid gap-3 sm:grid-cols-2"><CustomizerGroup title="Hair" options={hairOptions} value={avatar.hair} onChange={(value) => actions.updateAvatar("hair", value)} /><CustomizerGroup title="Hair Color" options={hairColorOptions.map((item) => item.name)} value={avatar.hairColor || "Black"} onChange={(value) => actions.updateAvatar("hairColor", value)} /><CustomizerGroup title="Skin Tone" options={skinToneOptions.map((item) => item.name)} value={avatar.skinTone} onChange={(value) => actions.updateAvatar("skinTone", value)} /><CustomizerGroup title="Outfit" options={outfitOptions} value={avatar.outfit} onChange={(value) => actions.updateAvatar("outfit", value)} /><CustomizerGroup title="Backdrop" options={backdropOptions} value={avatar.backdrop} onChange={(value) => actions.updateAvatar("backdrop", value)} /><div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Accessories</div><div className="mt-2 text-sm text-zinc-400">Accessories are bought, previewed, and equipped in the Store now.</div>{equippedAccessories.length ? <div className="mt-2 text-xs text-amber-200">Equipped: {equippedAccessories.join(", ")}</div> : <div className="mt-2 text-xs text-zinc-600">None equipped.</div>}</div><Button onClick={() => { actions.setStoreTab("accessories"); actions.setStoreOpen(true); }} className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-black hover:bg-amber-200">Open Accessory Store</Button></div>{purchasedAccessories.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{purchasedAccessories.map((name) => <Button key={name} onClick={() => actions.toggleAccessory(name)} className={cx("rounded-2xl border p-3 text-left text-sm", equippedAccessories.includes(name) ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:bg-white/10")}><div className="font-black">{name}</div><div className="mt-1 text-xs opacity-70">{equippedAccessories.includes(name) ? "Equipped" : "Tap to equip"}</div></Button>)}</div> : null}</div></div></Card></div></div>;
}

function CustomizerGroup({ title, options, value, onChange }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{title}</div><div className="grid gap-2">{options.map((option) => <OptionButton key={option} active={value === option} onClick={() => onChange(option)}>{option}</OptionButton>)}</div></div>;
}

export default function RapSimulatorPrototype() {
  const [started, setStarted] = useState(false);
  const [tab, setTabRaw] = useState("home");
  const [stageName, setStageName] = useState("");
  const [week, setWeek] = useState(1);
  const [fans, setFans] = useState(0);
  const [money, setMoney] = useState(0);
  const [rep, setRep] = useState(0);
  const [creativity, setCreativity] = useState(55);
  const [stress, setStress] = useState(10);
  const [lyrics, setLyrics] = useState(1);
  const [beats, setBeats] = useState(1);
  const [setup, setSetup] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState([styles[0]]);
  const [producer, setProducer] = useState(producers[0]);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [currentStudioName, setCurrentStudioName] = useState("Bedroom");
  const [songTitleInput, setSongTitleInput] = useState("");
  const [draft, setDraft] = useState(null);
  const [recorded, setRecorded] = useState(null);
  const [songs, setSongs] = useState([]);
  const [log, setLog] = useState([{ text: "Week 1. No fans, no money, just a bedroom and dangerous confidence.", tone: "neutral" }]);
  const [purchased, setPurchased] = useState([]);
  const [purchasedSkills, setPurchasedSkills] = useState([]);
  const [purchasedAccessories, setPurchasedAccessories] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [labelContract, setLabelContract] = useState(null);
  const [labelCooldown, setLabelCooldown] = useState(0);
  const [activeRival, setActiveRival] = useState(null);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [rhythmSession, setRhythmSession] = useState(null);
  const [shownMilestones, setShownMilestones] = useState([]);
  const [milestoneMessage, setMilestoneMessage] = useState(null);
  const [peakFans, setPeakFans] = useState(0);
  const [lastReleaseWeek, setLastReleaseWeek] = useState(1);
  const [lastCatalogEarnings, setLastCatalogEarnings] = useState({ money: 0, fans: 0, streams: 0, lifetimeStreams: 0 });
  const [sideHustleOpen, setSideHustleOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [storeTab, setStoreTab] = useState("gear");
  const [musicPanel, setMusicPanel] = useState("create");
  const [currentJob, setCurrentJob] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectDraft, setProjectDraft] = useState({ title: "", type: "mixtape", coverStyle: "custom", coverA: "#22d3ee", coverB: "#a78bfa", customCoverImage: null });
  const [shownProjectMilestones, setShownProjectMilestones] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [releaseReactions, setReleaseReactions] = useState(null);
  const [selectedRollout, setSelectedRollout] = useState("quiet");
  const [showHistory, setShowHistory] = useState([]);
  const [activeShow, setActiveShow] = useState(null);
  const [floaters, setFloaters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weekSplash, setWeekSplash] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [particles, setParticles] = useState([]);
  const [avatar, setAvatar] = useState({ hair: "Buzz Cut / Short Fade", hairColor: "Black", skinTone: "Medium Dark", outfit: "Plain Hoodie", backdrop: "Bedroom Studio", accessories: [] });
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [fps, setFps] = useState(0);
  const saveReadyRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch (error) {}
  }, []);

  useEffect(() => {
    window.__rapSimSettings = settings;
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) {}
  }, [settings]);

  useEffect(() => {
    if (!settings.showFps) return undefined;
    let frames = 0;
    let last = performance.now();
    let raf;
    function tick(now) {
      frames += 1;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [settings.showFps]);

  function buildSaveObject() {
    return {
      started,
      tab,
      stageName,
      week,
      fans,
      money,
      rep,
      creativity,
      stress,
      lyrics,
      beats,
      setup,
      selectedStyles,
      producer,
      currentStudioName,
      songTitleInput,
      draft,
      recorded,
      songs,
      log,
      purchased,
      purchasedSkills,
      purchasedAccessories,
      activeSkills,
      labelContract,
      labelCooldown,
      activeRival,
      currentJob,
      projects,
      projectDraft,
      shownProjectMilestones,
      feedPosts,
      releaseReactions,
      selectedRollout,
      showHistory,
      activeShow,
      shownMilestones,
      peakFans,
      lastReleaseWeek,
      lastCatalogEarnings,
      avatar,
    };
  }

  function applySaveObject(save) {
    if (!save) return false;
    try {
      if (typeof save.started === "boolean") setStarted(save.started);
      if (save.tab) setTabRaw(save.tab);
      if (save.stageName !== undefined) setStageName(save.stageName);
      if (save.week !== undefined) setWeek(save.week);
      if (save.fans !== undefined) setFans(save.fans);
      if (save.money !== undefined) setMoney(save.money);
      if (save.rep !== undefined) setRep(save.rep);
      if (save.creativity !== undefined) setCreativity(save.creativity);
      if (save.stress !== undefined) setStress(save.stress);
      if (save.lyrics !== undefined) setLyrics(save.lyrics);
      if (save.beats !== undefined) setBeats(save.beats);
      if (save.setup !== undefined) setSetup(save.setup);
      if (save.selectedStyles) setSelectedStyles(save.selectedStyles);
      if (save.producer) setProducer(save.producer);
      if (save.currentStudioName) setCurrentStudioName(save.currentStudioName);
      if (save.songTitleInput !== undefined) setSongTitleInput(save.songTitleInput);
      if (save.draft !== undefined) setDraft(save.draft);
      if (save.recorded !== undefined) setRecorded(save.recorded);
      if (save.songs) setSongs(save.songs);
      if (save.log) setLog(save.log);
      if (save.purchased) setPurchased(save.purchased);
      if (save.purchasedSkills) setPurchasedSkills(save.purchasedSkills);
        if (save.purchasedAccessories) setPurchasedAccessories(save.purchasedAccessories);
      if (save.activeSkills) setActiveSkills(save.activeSkills);
      if (save.labelContract !== undefined) setLabelContract(save.labelContract);
      if (save.labelCooldown !== undefined) setLabelCooldown(save.labelCooldown);
      if (save.activeRival !== undefined) setActiveRival(save.activeRival);
      if (save.currentJob !== undefined) setCurrentJob(save.currentJob);
      if (save.projects) setProjects(save.projects);
      if (save.projectDraft) setProjectDraft(save.projectDraft);
      if (save.shownProjectMilestones) setShownProjectMilestones(save.shownProjectMilestones);
      if (save.feedPosts) setFeedPosts(save.feedPosts);
      if (save.releaseReactions) setReleaseReactions(save.releaseReactions);
      if (save.selectedRollout) setSelectedRollout(save.selectedRollout);
      if (save.showHistory) setShowHistory(save.showHistory);
      if (save.activeShow !== undefined) setActiveShow(save.activeShow);
      if (save.shownMilestones) setShownMilestones(save.shownMilestones);
      if (save.peakFans !== undefined) setPeakFans(save.peakFans);
      if (save.lastReleaseWeek !== undefined) setLastReleaseWeek(save.lastReleaseWeek);
      if (save.lastCatalogEarnings) setLastCatalogEarnings(save.lastCatalogEarnings);
      if (save.avatar) setAvatar(save.avatar);
      return true;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      const hashSave = hash.includes(SAVE_HASH_PREFIX) ? decodeSaveData(hash) : null;
      const raw = window.localStorage.getItem(SAVE_KEY);
      const localSave = raw ? JSON.parse(raw) : null;
      applySaveObject(hashSave || localSave);
    } catch (error) {}
    setTimeout(() => { saveReadyRef.current = true; }, 0);
  }, []);

  useEffect(() => {
    if (!saveReadyRef.current || !settings.autosave) return;
    const saveTimeout = setTimeout(() => {
      try {
        const save = buildSaveObject();
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      } catch (error) {
        alert("running out of save space. consider removing some custom covers.");
      }
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [started, tab, stageName, week, fans, money, rep, creativity, stress, lyrics, beats, setup, selectedStyles, producer, currentStudioName, songTitleInput, draft, recorded, songs, log, purchased, purchasedSkills, purchasedAccessories, activeSkills, labelContract, labelCooldown, activeRival, currentJob, projects, projectDraft, shownProjectMilestones, feedPosts, releaseReactions, selectedRollout, showHistory, activeShow, shownMilestones, peakFans, lastReleaseWeek, lastCatalogEarnings, avatar, settings.autosave]);

  const unlockedStudios = useMemo(() => {
    const unlockedNames = new Set(["Bedroom"]);
    studioUpgrades.forEach((item) => {
      if (item.studioName && purchased.includes(item.name)) unlockedNames.add(item.studioName);
    });
    return studios.filter((studio) => unlockedNames.has(studio.name)).map((studio) => studio.name);
  }, [purchased]);
  const gearBoosts = useMemo(() => {
    const boosts = { lyrics: 0, beats: 0, production: 0 };
    studioUpgrades.forEach((item) => {
      if (purchased.includes(item.name) && boosts[item.stat] !== undefined) boosts[item.stat] += item.gain;
    });
    return boosts;
  }, [purchased]);
  const totalLyrics = lyrics + gearBoosts.lyrics;
  const totalBeats = beats + gearBoosts.beats;
  const totalProduction = setup + gearBoosts.production;
  const currentStudio = studios.find((studio) => studio.name === currentStudioName && unlockedStudios.includes(studio.name)) || studios[0];
  const hasSkill = (id) => activeSkills.includes(id);
  const mix = useMemo(() => {
    const base = { craft: 0, viral: 0, underground: 0, mainstream: 0 };
    selectedStyles.forEach((style) => Object.entries(style.stats).forEach(([key, value]) => { base[key] += value; }));
    Object.entries(producer.bonus).forEach(([key, value]) => { base[key] += value; });
    const count = Math.max(1, selectedStyles.length);
    Object.keys(base).forEach((key) => { base[key] = base[key] / count; });
    return base;
  }, [selectedStyles, producer]);
  const careerScore = fans + rep * 65 + setup * 20;
  const rank = careerScore >= 18000 ? "Breakout Artist" : careerScore >= 9000 ? "Playlist Menace" : careerScore >= 4000 ? "Cult Fanbase Builder" : careerScore >= 1500 ? "Underground Favorite" : careerScore >= 500 ? "Local Internet Rumor" : "Unknown Bedroom Artist";

  function addFloater(text, delta) {
    if (!delta) return;
    const id = makeId();
    setFloaters((prev) => [...prev, { id, text, kind: delta < 0 ? "loss" : "gain" }]);
    setTimeout(() => setFloaters((prev) => prev.filter((item) => item.id !== id)), 1500);
  }

  function applyStressFloor(value) {
    let floored = value;
    if (currentJob?.stressFloor !== undefined) floored = Math.max(floored, currentJob.stressFloor);
    if (activeShow?.stressFloor !== undefined) floored = Math.max(floored, activeShow.stressFloor);
    return floored;
  }

  function statChange(label, delta, setter, formatter = (value) => `${value}`) {
    setter((prev) => {
      const next = Math.max(0, prev + delta);
      return label === "stress" ? applyStressFloor(next) : next;
    });
    addFloater(`${delta > 0 ? "+" : ""}${formatter(delta)} ${label}`, delta);
  }

  function checkFanMilestones(nextFans) {
    const newlyHit = fanMilestones.find((milestone) => nextFans >= milestone.value && !shownMilestones.includes(milestone.value));
    if (!newlyHit) return;
    setShownMilestones((prev) => [...prev, newlyHit.value]);
    setMilestoneMessage(newlyHit.text);
    playTone("success");
    setTimeout(() => setMilestoneMessage(null), 2400);
  }

  function changeFans(delta) {
    if (!delta) return;
    setFans((prev) => {
      const next = Math.max(0, prev + delta);
      checkFanMilestones(next);
      fanMilestones.forEach((milestone) => {
        if (next >= milestone.value && prev < milestone.value) addFeedPost({ type: "fan", text: milestone.text });
      });
      setPeakFans((peak) => Math.max(peak, next));
      if (next >= 5000 && currentJob) {
        addLog({ text: `you finally walked out of ${currentJob.name}. you don't need it anymore.`, tone: "neutral" });
        setCurrentJob(null);
      }
      return next;
    });
    addFloater(`${delta > 0 ? "+" : ""}${delta.toLocaleString()} fans`, delta);
  }

  function addLog(entry) {
    setLog((prev) => [entry, ...prev].slice(0, 8));
    playTone(entry.tone === "good" ? "ping" : entry.tone === "bad" ? "soft" : "click");
  }

  function addFeedPost({ type = "neutral", text, username }) {
    const users = feedUsers[type] || feedUsers.neutral;
    const pickedUser = username || users[Math.floor(Math.random() * users.length)];
    setFeedPosts((prev) => [{ id: makeId(), week, username: pickedUser, text, type, likes: Math.floor(Math.random() * 900) + Math.max(1, fans), reposts: Math.floor(Math.random() * 80) }, ...prev].slice(0, 100));
  }

  function addFeedBurst(posts) {
    posts.forEach((post, index) => setTimeout(() => addFeedPost(post), index * 60));
  }

  function generateReleaseReactions(target, quality, isProject = false) {
    const name = target.title || "the drop";
    const artist = stageName || "this artist";
    let reactions;
    if (quality < 25) {
      reactions = [
        { type: "fan", text: `still rocking with ${artist}, but ${name} sound rough` },
        { type: "hater", text: `${artist} gotta stop recording in that microwave` },
        { type: "blog", text: `${name} has raw ideas, but the execution needs work` },
      ];
    } else if (quality < 45) {
      reactions = [
        { type: "fan", text: `been replaying parts of ${name}, potential is there` },
        { type: "hater", text: `${name} got moments but relax with the hype` },
        { type: "blog", text: `there's something raw about ${artist}'s new ${isProject ? "project" : "drop"}` },
      ];
    } else if (quality < 65) {
      reactions = [
        { type: "fan", text: `${name} is clean, hook been stuck all morning` },
        { type: "blog", text: `${artist} keeps leveling up with ${name}` },
        { type: "hater", text: `not bad but y'all overrating ${name}` },
      ];
    } else {
      reactions = [
        { type: "fan", text: `${name} is the one. this sounds different` },
        { type: "blog", text: `${artist} might have a real moment with ${name}` },
        { type: "industry", text: `keeping an eye on ${artist}` },
        { type: "fan", text: `nah ${name} needs to be everywhere` },
      ];
    }
    setReleaseReactions({ id: makeId(), title: name, week, reactions });
    addFeedBurst([{ type: "neutral", text: `new music from ${artist} just dropped` }, ...reactions]);
  }

  function runProgress(label, callback) {
    setProgress({ label });
    playTone("soft");
    setTimeout(() => { setProgress(null); callback(); }, 650);
  }

  function setTab(value) {
    playTone("click");
    setTabRaw(value);
  }

  function startGame() {
    if (!stageName.trim()) return;
    playTone("success");
    setStarted(true);
  }

  function updateAvatar(key, value) {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAccessory(item) {
    const name = typeof item === "string" ? item : item?.name;
    if (!name) return;
    if (!purchasedAccessories.includes(name)) {
      addLog({ text: `${name} has to be bought in the store first.`, tone: "bad" });
      return;
    }
    setAvatar((prev) => {
      const current = prev.accessories || [];
      return { ...prev, accessories: current.includes(name) ? current.filter((value) => value !== name) : [...current, name] };
    });
  }

  function updateStreamingCatalog(nextWeek) {
    let totalWeeklyStreams = 0;
    let totalLifetimeStreams = 0;
    let streamMoney = 0;
    let streamFans = 0;
    const newLogs = [];
    setSongs((prevSongs) => prevSongs.map((song) => {
      if (!song.released) {
        totalLifetimeStreams += song.lifetimeStreams || 0;
        return song;
      }
      const releaseWeek = song.releasedAs === "project" && song.projectId ? (projects.find((project) => project.id === song.projectId)?.releaseWeek || song.releaseWeek || week) : (song.releaseWeek || week);
      const baseSong = {
        ...song,
        releaseWeek,
        peakWeeklyStreams: song.peakWeeklyStreams || createStreamingStats({ ...song, releaseWeek }, fans).peakWeeklyStreams,
        weeklyStreams: song.weeklyStreams || 0,
        lifetimeStreams: song.lifetimeStreams || 0,
        streamsHistory: song.streamsHistory || [],
        decayRate: song.decayRate || getSongDecayRate(song),
        peakHoldUntilWeek: song.peakHoldUntilWeek || getSongPeakHoldUntil({ ...song, releaseWeek }),
        lastSpikeWeek: song.lastSpikeWeek || releaseWeek,
        streamMilestonesHit: song.streamMilestonesHit || [],
      };
      const weeksSincePeakHold = nextWeek - baseSong.peakHoldUntilWeek;
      let baseStreams;
      if (nextWeek <= baseSong.peakHoldUntilWeek) {
        baseStreams = baseSong.peakWeeklyStreams * (0.9 + Math.random() * 0.15);
      } else {
        const decayedStreams = baseSong.peakWeeklyStreams * Math.exp(-baseSong.decayRate * weeksSincePeakHold);
        baseStreams = decayedStreams * (0.9 + Math.random() * 0.2);
      }
      const longTailFloor = baseSong.peakWeeklyStreams * 0.005;
      let weeklyStreams = Math.max(Math.floor(baseStreams), Math.floor(longTailFloor));
      if (baseSong.video && nextWeek - baseSong.video.releaseWeek < baseSong.video.boostWeeks) {
        weeklyStreams = Math.floor(weeklyStreams * baseSong.video.streamBoost);
      }
      let peakWeeklyStreams = baseSong.peakWeeklyStreams;
      let lastSpikeWeek = baseSong.lastSpikeWeek;
      const oldLifetime = baseSong.lifetimeStreams;
      const canSpike = nextWeek - releaseWeek > 3 && nextWeek - lastSpikeWeek >= 4;
      if (canSpike) {
        const finalSpikeChance = 0.015 + (baseSong.quality / 100) * 0.025;
        if (Math.random() < finalSpikeChance) {
          const spikeMagnitude = 3 + Math.random() * (baseSong.quality / 100) * 12;
          weeklyStreams = Math.floor(weeklyStreams * spikeMagnitude);
          if (weeklyStreams > peakWeeklyStreams) peakWeeklyStreams = weeklyStreams;
          lastSpikeWeek = nextWeek;
          const reasons = [
            `${baseSong.title} got added to a big playlist`,
            `${baseSong.title} started trending on tiktok`,
            `someone famous tweeted about ${baseSong.title}`,
            `${baseSong.title} is having a moment on social media`,
            `${baseSong.title} got picked up by a youtuber`,
          ];
          const spikeText = reasons[Math.floor(Math.random() * reasons.length)];
          newLogs.push({ text: spikeText, tone: "good", feed: { type: "blog", text: spikeText } });
        }
      }
      const lifetimeStreams = oldLifetime + weeklyStreams;
      const streamsHistory = [...(baseSong.streamsHistory || []), weeklyStreams].slice(-12);
      const streamMilestonesHit = [...(baseSong.streamMilestonesHit || [])];
      streamMilestones.forEach((milestone) => {
        if (lifetimeStreams >= milestone && !streamMilestonesHit.includes(milestone)) {
          streamMilestonesHit.push(milestone);
          newLogs.push({ text: getStreamMilestoneText(baseSong, milestone), tone: "good" });
        }
      });
      totalWeeklyStreams += weeklyStreams;
      totalLifetimeStreams += lifetimeStreams;
      let moneyFromStreams = weeklyStreams * 0.003;
      if (fans < 1000) moneyFromStreams *= 2.5;
      else if (fans < 10000) moneyFromStreams *= 1.5;
      streamMoney += moneyFromStreams;
      streamFans += Math.floor(weeklyStreams * 0.0008);
      return { ...baseSong, weeklyStreams, lifetimeStreams, streamsHistory, peakWeeklyStreams, lastSpikeWeek, streamMilestonesHit };
    }));
    const roundedMoney = Math.round(streamMoney);
    setLastCatalogEarnings({ money: roundedMoney, fans: streamFans, streams: totalWeeklyStreams, lifetimeStreams: totalLifetimeStreams });
    if (roundedMoney > 0) statChange("stream money", roundedMoney, setMoney, (v) => formatMoney(Math.abs(v)));
    if (streamFans > 0) changeFans(streamFans);
    if (totalWeeklyStreams > 0) addLog({ text: `streaming recap: ${Math.round(totalWeeklyStreams).toLocaleString()} plays this week, +${formatMoney(roundedMoney)}, +${streamFans} fans.`, tone: "good" });
    newLogs.forEach((entry) => { addLog(entry); if (entry.feed) addFeedPost(entry.feed); });
  }

  function updateCharts(nextWeek) {
    const chartLogs = [];
    setSongs((prevSongs) => prevSongs.map((song) => {
      if (!song.released) return song;
      const availableCharts = chartDefs.filter((chart) => fans >= chart.unlockFans);
      if (!availableCharts.length) return song;
      const age = Math.max(0, nextWeek - (song.releaseWeek || nextWeek));
      const score = (song.weeklyStreams || 0) / 50 + song.quality * 0.55 + rep * 0.015 + Math.min(fans / 1500, 70) - age * 0.9;
      const chart = [...availableCharts].reverse().find((item) => score >= item.entryScore) || availableCharts[0];
      if (score < chart.entryScore) {
        if (song.chartName) return { ...song, lastChartPosition: song.chartPosition, chartName: null, chartPosition: null };
        return song;
      }
      const position = clamp(Math.round(101 - score + Math.random() * 8), 1, 100);
      const lastChartPosition = song.chartPosition || null;
      const peakChartPosition = song.peakChartPosition ? Math.min(song.peakChartPosition, position) : position;
      const weeksOnChart = (song.weeksOnChart || 0) + 1;
      const bigMove = !lastChartPosition || position <= 10 || position < peakChartPosition || (lastChartPosition - position >= 15);
      if (bigMove) {
        const movement = !lastChartPosition ? "entered" : position < lastChartPosition ? "jumped" : "held";
        chartLogs.push({ text: `${song.title} ${movement} to #${position} on the ${chart.name}`, tone: "good", feed: { type: "blog", text: `${song.title} is now #${position} on the ${chart.name}` } });
      }
      return { ...song, chartName: chart.name, chartPosition: position, lastChartPosition, peakChartPosition, weeksOnChart };
    }));
    chartLogs.forEach((entry) => { addLog(entry); addFeedPost(entry.feed); });
  }

  function applyAudienceDecay(nextWeek) {
    const weeksSinceLastRelease = nextWeek - lastReleaseWeek;
    if (weeksSinceLastRelease < 3) return;
    addLog({ text: "fans are waiting on a new drop.", tone: "neutral" });
    const rate = weeksSinceLastRelease >= 10 ? 0.03 : weeksSinceLastRelease >= 5 ? 0.02 : 0.01;
    setFans((prev) => {
      const floor = Math.floor(peakFans * 0.8);
      const loss = Math.floor(prev * rate);
      const next = Math.max(floor, prev - loss);
      const actualLoss = prev - next;
      if (actualLoss > 0) addFloater(`-${actualLoss.toLocaleString()} fans`, -actualLoss);
      return next;
    });
  }

  function advanceWeek(extraStress = 0) {
    const nextWeek = week + 1;
    setWeek(nextWeek);
    setWeekSplash(nextWeek);
    setTimeout(() => setWeekSplash(null), 1200);
    const creativityDelta = Math.floor(Math.random() * 13) - 4;
    setCreativity((prev) => clamp(prev + creativityDelta, 0, 100));
    setStress((prev) => applyStressFloor(clamp(prev + extraStress - 4 + (activeShow ? Math.ceil(activeShow.stress / Math.max(1, activeShow.weeks)) : 0), 0, 100)));
    if (currentJob) {
      statChange("money", currentJob.weeklyPay, setMoney, (v) => formatMoney(Math.abs(v)));
      addLog({ text: `weekly check from ${currentJob.name}: +${formatMoney(currentJob.weeklyPay)}`, tone: "good" });
    }
    updateStreamingCatalog(nextWeek);
    updateCharts(nextWeek);
    processActiveShow(nextWeek);
    applyAudienceDecay(nextWeek);
  }

  function createDraftTitle() {
    return songTitleInput.trim() || titlePool[Math.floor(Math.random() * titlePool.length)];
  }

  function writeSong() {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before writing.`, tone: "bad" }); setTabRaw("career"); return; }
    runProgress(draft ? "Rewriting lyrics" : "Writing song", () => {
      if (draft && draft.rerollsLeft <= 0) { addLog({ text: "No rewrites left on this song. Record it or live with the lyrics.", tone: "bad" }); setTabRaw("music"); return; }
      if (!draft && producer.price > money) { addLog({ text: `${producer.name} costs ${formatMoney(producer.price)}. Pick a cheaper beat first.`, tone: "bad" }); setTabRaw("music"); return; }
      const title = draft ? draft.title : createDraftTitle();
      const concept = concepts[Math.floor(Math.random() * concepts.length)];
      const style = selectedStyles[Math.floor(Math.random() * selectedStyles.length)] || styles[0];
      const draftParts = calculateDraftQuality({ lyricsSkill: totalLyrics, beatsSkill: totalBeats, creativity, producer });
      const maxRolls = hasSkill("perfectionist") ? 4 : 3;
      const quality = Math.max(1, Math.round(draftParts.draftQuality + Math.random() * 4));
      if (!draft && producer.price > 0) statChange("money", -producer.price, setMoney, (v) => formatMoney(Math.abs(v)));
      setDraft((prev) => ({ id: prev?.id || makeId(), title, concept, style: style.name, beat: producer.name, beatQuality: draftParts.beatQuality, beatTier: draftParts.beatTier, quality, rerollsLeft: prev ? prev.rerollsLeft - 1 : maxRolls - 1, lyricVersion: (prev?.lyricVersion || 0) + 1, coverStyle: "custom", coverA: prev?.coverA || "#22d3ee", coverB: prev?.coverB || "#a78bfa", customCoverImage: prev?.customCoverImage || null }));
      setRecorded(null);
      setSongTitleInput(title);
      statChange("creativity", currentJob?.id === "babysitter" ? -5 : -10, setCreativity);
      addLog({ text: `Wrote ${title} with ${producer.name} (${draftParts.beatTier}). Draft grade: ${getDraftGrade(quality)}. ${draft ? "Rewrite used." : "First draft locked in."}`, tone: "neutral" });
      setTabRaw("music");
    });
  }

  function setSongTitle(value) {
    setDraft((prev) => prev ? { ...prev, title: value } : prev);
    setSongTitleInput(value);
  }

  function setDraftCover(nextDraft) {
    setDraft((prev) => prev ? { ...prev, coverStyle: nextDraft.coverStyle, coverA: nextDraft.coverA, coverB: nextDraft.coverB, customCoverImage: nextDraft.customCoverImage || null } : prev);
  }

  function recordSong() {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before recording.`, tone: "bad" }); setTabRaw("career"); return; }
    if (!draft) { addLog({ text: "No draft loaded. Write a song first.", tone: "bad" }); setTabRaw("music"); return; }
    if (recorded && recorded.draftId === draft.id && recorded.lyricVersion === draft.lyricVersion) { addLog({ text: "These exact lyrics are already recorded. Rewrite or release the take.", tone: "bad" }); setTabRaw("music"); return; }
    setRhythmSession({ draft: { ...draft }, startedAt: Date.now() });
  }

  function finishRecordingTake(summary) {
    if (!rhythmSession?.draft) return;
    const sourceDraft = rhythmSession.draft;
    const finalQuality = clamp(Math.round(calculateFinalSongQuality({ draftQuality: sourceDraft.quality, productionSkill: totalProduction, stress, studioQuality: currentStudio.quality, recordingMultiplier: summary.multiplier * (currentJob?.id === "delivery" ? 0.9 : 1) })), 1, 100);
    const take = { ...sourceDraft, id: makeId(), draftId: sourceDraft.id, lyricVersion: sourceDraft.lyricVersion, quality: finalQuality, takeRating: summary.label, takeAccuracy: summary.accuracy, released: false, streams: 0, studio: currentStudio.name };
    setRecorded(take);
    setSongs((prev) => [take, ...prev].slice(0, 12));
    setDraft(null);
    setSongTitleInput("");
    setRhythmSession(null);
    statChange("stress", 8, setStress);
    addLog({ text: `Recorded ${take.title}. ${summary.label}. Final tier: ${getQualityTier(finalQuality)}. Saved to Ready To Release.`, tone: "neutral" });
    setTabRaw("music");
  }

  function payForRhythmRetake() {
    if (money < 20) { addLog({ text: "Need $20 for a retake.", tone: "bad" }); return false; }
    statChange("money", -20, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("stress", 10, setStress);
    return true;
  }

  function startProject() {
    const type = projectTypes[projectDraft.type];
    if (fans < type.unlockFans) { addLog({ text: `${type.label} unlocks at ${type.unlockFans.toLocaleString()} fans.`, tone: "bad" }); return; }
    const title = projectDraft.title.trim();
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before starting projects.`, tone: "bad" }); return; }
    if (!title) { addLog({ text: "Name the project first.", tone: "bad" }); return; }
    const project = { id: makeId(), title, type: projectDraft.type, coverStyle: projectDraft.coverStyle, coverA: projectDraft.coverA, coverB: projectDraft.coverB, customCoverImage: projectDraft.customCoverImage || null, songIds: [], status: "in progress", createdWeek: week, totalStreams: 0, totalEarnings: 0 };
    setProjects((prev) => [project, ...prev]);
    setProjectDraft({ title: "", type: "mixtape", coverStyle: "custom", coverA: "#22d3ee", coverB: "#a78bfa", customCoverImage: null });
    addLog({ text: `Started ${type.label.toLowerCase()} project: ${title}.`, tone: "good" });
  }

  function removeSongFromProject(projectId, songId) {
    const project = projects.find((item) => item.id === projectId);
    const song = songs.find((item) => item.id === songId);
    if (!project || !song || project.status !== "in progress") return;
    setProjects((prev) => prev.map((item) => item.id === projectId ? { ...item, songIds: (item.songIds || []).filter((id) => id !== songId) } : item));
    setSongs((prev) => prev.map((item) => item.id === songId ? { ...item, releasedAs: null, projectId: null, released: false } : item));
    addLog({ text: `${song.title} removed from ${project.title}.`, tone: "neutral" });
  }

  function cancelProject(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project || project.status !== "in progress") return;
    setSongs((prev) => prev.map((song) => (project.songIds || []).includes(song.id) ? { ...song, releasedAs: null, projectId: null, released: false } : song));
    setProjects((prev) => prev.filter((item) => item.id !== projectId));
    addLog({ text: `${project.title} canceled. Songs returned to ready.`, tone: "neutral" });
  }

  function releaseProject(projectId) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before releasing a project.`, tone: "bad" }); return; }
    const project = projects.find((item) => item.id === projectId);
    if (!project || project.status !== "in progress") return;
    const type = projectTypes[project.type];
    const projectSongs = songs.filter((song) => (project.songIds || []).includes(song.id));
    if (projectSongs.length < type.minSongs) { addLog({ text: `${project.title} needs at least ${type.minSongs} songs.`, tone: "bad" }); return; }
    const qualitySum = projectSongs.reduce((sum, song) => sum + song.quality, 0);
    const avgQuality = qualitySum / Math.max(1, projectSongs.length);
    const baseFanGain = Math.max(10, Math.round(qualitySum * (0.22 + mix.viral * 0.035 + mix.mainstream * 0.025)));
    const fanGain = Math.round(baseFanGain * type.fanMultiplier);
    const moneyGain = Math.round((baseFanGain * (0.15 + mix.mainstream * 0.025) + qualitySum * 0.15) * type.payoutMultiplier);
    const repGain = Math.max(3, Math.round(avgQuality / 6 + mix.craft + mix.underground * 0.6 + type.repBonus));
    setSongs((prev) => prev.map((song) => {
      if (!(project.songIds || []).includes(song.id)) return song;
      const projectMultiplier = type.payoutMultiplier;
      const streamingStats = createStreamingStats({ ...song, releaseWeek: week }, fans, projectMultiplier);
      return { ...song, released: true, releasedAs: "project", projectId: project.id, releaseWeek: week, streams: streamingStats.lifetimeStreams, ...streamingStats };
    }));
    setProjects((prev) => prev.map((item) => item.id === projectId ? { ...item, status: "released", releaseWeek: week, totalStreams: fanGain * 12, totalEarnings: moneyGain } : item));
    changeFans(fanGain);
    statChange("money", moneyGain, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", repGain, setRep);
    statChange("stress", type.stressCost, setStress);
    setLastReleaseWeek(week);
    if (!shownProjectMilestones.includes(project.type)) {
      setShownProjectMilestones((prev) => [...prev, project.type]);
      setMilestoneMessage(project.type === "mixtape" ? "your first project. the streets remember" : "your first album. legacy mode activated");
      setTimeout(() => setMilestoneMessage(null), 2400);
    }
    setCelebration({ title: project.title, stats: [{ label: "project", value: type.label }, { label: "fans", value: `+${fanGain}` }, { label: "money", value: `+${formatMoney(moneyGain)}` }] });
    setTimeout(() => setCelebration(null), 2800);
    addLog({ text: `Released ${project.title}. ${projectSongs.length} songs, +${fanGain} fans, +${formatMoney(moneyGain)}.`, tone: "good" });
    generateReleaseReactions(project, avgQuality, true);
    setSongs((prev) => prev.map((song) => song.releasedAs === "single" && week - (song.releaseWeek || 0) <= 8 ? { ...song, weeklyStreams: Math.floor((song.weeklyStreams || 0) * 1.5), lifetimeStreams: (song.lifetimeStreams || 0) + Math.floor((song.weeklyStreams || 0) * 0.5) } : song));
    addLog({ text: "fans are checking your older tracks since the new drop", tone: "good" });
    if (Math.random() < 0.4) addLog({ text: "The project picked up extra buzz from blogs and playlists.", tone: "good" });
    if (Math.random() < 0.2) maybeRivalTrigger();
    if (fans >= 50000 && Math.random() < 0.1) addLog({ text: "Industry people are paying attention to the project rollout.", tone: "good" });
  }

  function releaseVideoForSong(songId, videoId) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before making videos.`, tone: "bad" }); return; }
    const video = videoOptions.find((item) => item.id === videoId);
    const song = songs.find((item) => item.id === songId);
    if (!video || !song) return;
    if (song.video) { addLog({ text: `${song.title} already has a music video.`, tone: "bad" }); return; }
    if (fans < video.unlockFans) { addLog({ text: `${video.type} unlocks at ${video.unlockFans.toLocaleString()} fans.`, tone: "bad" }); return; }
    if (money < video.cost) { addLog({ text: `Need ${formatMoney(video.cost - money)} more for ${video.type}.`, tone: "bad" }); return; }
    statChange("money", -video.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("stress", Math.ceil(video.cost / 500), setStress);
    const rolledBoost = Number((video.boostMin + Math.random() * (video.boostMax - video.boostMin)).toFixed(2));
    const videoData = { type: video.type, maker: video.maker, releaseWeek: week, streamBoost: rolledBoost, boostWeeks: video.boostWeeks };
    setSongs((prev) => prev.map((item) => item.id === songId ? { ...item, video: videoData } : item));
    const fanGain = randomInt(video.fanMin, video.fanMax);
    changeFans(fanGain);
    addLog({ text: `${video.maker} finished a ${video.type} for ${song.title}. +${fanGain} fans. The video is giving the song a boost for ${video.boostWeeks} weeks.`, tone: "good" });
    addFeedPost({ type: "fan", text: `${song.title} video just dropped` });
    addFeedPost({ type: "blog", text: `${song.title} has a new video out now` });
  }

  function processActiveShow(nextWeek) {
    if (!activeShow) return;
    const remaining = activeShow.remainingWeeks - 1;
    if (remaining > 0) {
      setActiveShow((prev) => prev ? { ...prev, remainingWeeks: remaining } : null);
      addLog({ text: `${activeShow.name} continues. ${remaining} week${remaining === 1 ? "" : "s"} left.`, tone: "neutral" });
      return;
    }
    const fanGain = activeShow.finalFans;
    const pay = activeShow.finalPay;
    setActiveShow(null);
    changeFans(fanGain);
    statChange("money", pay, setMoney, (v) => formatMoney(Math.abs(v)));
    const history = { id: makeId(), week: nextWeek, name: activeShow.name, fans: fanGain, money: pay };
    setShowHistory((prev) => [history, ...prev].slice(0, 20));
    addLog({ text: `${activeShow.name} wrapped. +${fanGain.toLocaleString()} fans, +${formatMoney(pay)}.`, tone: "good" });
    addFeedPost({ type: "fan", text: `${stageName || "this artist"} wrapped ${activeShow.name}` });
  }

  function performShow(show) {
    if (activeShow) { addLog({ text: `Already booked for ${activeShow.name}.`, tone: "bad" }); return; }
    if (currentJob) { addLog({ text: `Quit ${currentJob.name} before booking shows. You can't work shifts and tour at the same time.`, tone: "bad" }); return; }
    if (fans < show.unlockFans) { addLog({ text: `${show.name} needs ${show.unlockFans.toLocaleString()} fans.`, tone: "bad" }); return; }
    const bestQuality = Math.max(10, ...songs.filter((song) => song.released).map((song) => song.quality));
    const qualityMult = clamp(bestQuality / 50, 0.5, 2);
    const repMult = clamp(1 + rep / 5000, 1, 1.8);
    const stressMult = clamp(1 - stress / 180, 0.45, 1);
    const fanGain = Math.round(randomInt(show.fanMin, show.fanMax) * qualityMult * repMult * stressMult);
    const pay = Math.round(randomInt(show.payMin, show.payMax) * qualityMult * stressMult);
    const booking = { ...show, remainingWeeks: show.weeks, finalFans: fanGain, finalPay: pay, startedWeek: week };
    setActiveShow(booking);
    setStress((prev) => Math.max(prev, show.stressFloor));
    addLog({ text: `${show.name} booked for ${show.weeks} week${show.weeks === 1 ? "" : "s"}. Music work is paused until the run wraps. Rest advances the schedule.`, tone: "neutral" });
    addFeedPost({ type: "neutral", text: `${stageName || "this artist"} announced ${show.name}` });
  }

  function applyRandomReleaseEvent() {
    if (fans < 1000) return;
    const viralChance = hasSkill("trendsetter") ? 0.375 : 0.25;
    if (Math.random() > viralChance) return;
    const event = { text: "A clip got a tiny push. Not viral, but not invisible either.", fans: 80, money: 18, rep: 6, stress: 6, tone: "good" };
    changeFans(event.fans);
    statChange("money", event.money, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", event.rep, setRep);
    statChange("stress", event.stress, setStress);
    addLog(event);
  }

  function maybeRivalTrigger() {
    if (fans < 10000 || activeRival) return;
    if (Math.random() > 0.03) return;
    const rival = { name: rivalNames[Math.floor(Math.random() * rivalNames.length)], heat: 1 };
    setActiveRival(rival);
    setPendingChoice({ kind: "rival", rival });
  }

  function releaseRecordedAsSingle(song = recorded) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before releasing.`, tone: "bad" }); setTabRaw("career"); return; }
    if (!song) { addLog({ text: "No recorded draft selected. Record or select one first.", tone: "bad" }); setTabRaw("music"); return; }
    const quality = song.quality;
    let fanGain = Math.max(3, Math.round(quality * (0.35 + mix.viral * 0.08 + mix.mainstream * 0.05) + Math.random() * 25));
    fanGain = Math.round(fanGain * ((rolloutOptions.find((item) => item.id === selectedRollout) || rolloutOptions[0]).fanMultiplier || 1));
    if (hasSkill("marketing")) fanGain = Math.round(fanGain * 1.2);
    if (fans >= 10000 && Math.random() < 0.12) { fanGain = Math.round(fanGain * 1.35); addLog({ text: "A playlist placement pushed the release farther than expected.", tone: "good" }); }
    let moneyGain = Math.round(fanGain * (0.15 + mix.mainstream * 0.025) + quality * 0.15);
    if (fans < 1000) moneyGain = Math.round(moneyGain * 2.5);
    else if (fans < 10000) moneyGain = Math.round(moneyGain * 1.5);
    const repGain = Math.max(1, Math.round(quality / 24 + mix.craft * 0.5 + mix.underground * 0.35));
    const releaseWeek = week;
    const rollout = rolloutOptions.find((item) => item.id === selectedRollout) || rolloutOptions[0];
    if (fans < rollout.unlockFans) { addLog({ text: `${rollout.name} is locked.`, tone: "bad" }); return; }
    if (money < rollout.cost) { addLog({ text: `Need ${formatMoney(rollout.cost - money)} more for ${rollout.name}.`, tone: "bad" }); return; }
    if (rollout.cost) statChange("money", -rollout.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    if (rollout.stress) statChange("stress", rollout.stress, setStress);
    const streamingStats = createStreamingStats({ ...song, title: song.title.trim() || "Untitled Demo", quality, releaseWeek }, fans, rollout.streamMultiplier || 1);
    let releaseVideoData = song.video || null;
    const releasedSong = { ...song, title: song.title.trim() || "Untitled Demo", released: true, releasedAs: "single", projectId: null, releaseWeek, streams: streamingStats.lifetimeStreams, rollout: selectedRollout, video: releaseVideoData, ...streamingStats };
    setSongs((prev) => [releasedSong, ...prev.filter((item) => item.id !== song.id)].slice(0, 40));
    changeFans(fanGain);
    statChange("money", moneyGain, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", repGain, setRep);
    setDraft(null);
    setRecorded((prev) => prev?.id === song.id ? null : prev);
    setLastReleaseWeek(week);
    const burst = Array.from({ length: 18 }, (_, index) => ({ id: makeId(), x: 20 + Math.random() * 60, y: 25 + Math.random() * 45, delay: index * 22 }));
    setParticles(burst);
    setCelebration({ title: releasedSong.title, stats: [{ label: "fans", value: `+${fanGain}` }, { label: "money", value: `+${formatMoney(moneyGain)}` }, { label: "rep", value: `+${repGain}` }] });
    [0, 220, 440].forEach((delay) => setTimeout(() => playTone("success"), delay));
    setTimeout(() => { setCelebration(null); setParticles([]); }, 2600);
    addLog({ text: `Released ${releasedSong.title}. +${fanGain} fans, +${formatMoney(moneyGain)}, +${repGain} rep.`, tone: "good" });
    generateReleaseReactions(releasedSong, quality, false);
    if (selectedRollout === "controversy") {
      if (Math.random() < 0.3) { statChange("rep", -5, setRep); addFeedPost({ type: "hater", text: `${releasedSong.title} promo got messy and people are arguing` }); }
      if (Math.random() < 0.3) { addFeedPost({ type: "blog", text: `${releasedSong.title} is getting talked about everywhere` }); }
    }
    
    applyRandomReleaseEvent();
    maybeRivalTrigger();
    setTabRaw("home");
  }

  function releaseSong() {
    runProgress("Uploading release", () => releaseRecordedAsSingle(recorded));
  }

  function addRecordedToProject(projectId, song = recorded) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before adding songs to projects.`, tone: "bad" }); return; }
    if (!song) return;
    const project = projects.find((item) => item.id === projectId && item.status === "in progress");
    if (!project) return;
    const type = projectTypes[project.type];
    if ((project.songIds || []).length >= type.maxSongs) { addLog({ text: `${project.title} is already full.`, tone: "bad" }); return; }
    const queuedSong = { ...song, released: false, releasedAs: "project", projectId };
    setSongs((prev) => [queuedSong, ...prev.filter((item) => item.id !== song.id)].slice(0, 40));
    setProjects((prev) => prev.map((item) => item.id === projectId ? { ...item, songIds: [...(item.songIds || []), song.id] } : item));
    setRecorded((prev) => prev?.id === song.id ? null : prev);
    addLog({ text: `${song.title} added to ${project.title}.`, tone: "good" });
    setTabRaw("music");
  }

  function selectRecordedDraft(song) {
    setRecorded(song);
    addLog({ text: `${song.title} selected as the draft to release.`, tone: "neutral" });
    setTabRaw("music");
  }

  function deleteRecordedDraft(song) {
    setSongs((prev) => prev.filter((item) => item.id !== song.id));
    setRecorded((prev) => prev?.id === song.id ? null : prev);
    addLog({ text: `${song.title} deleted from Ready To Release.`, tone: "neutral" });
  }

  function currentRestPool() {
    if (fans >= 50000) return restPools.big;
    if (fans >= 10000) return restPools.mid;
    if (fans >= 1000) return restPools.small;
    return [];
  }

  function maybeRestEvent() {
    if (fans < 1000) return;
    if (Math.random() > 0.4) { addLog({ text: "Quiet week. Nothing major happened.", tone: "neutral" }); return; }
    const pool = currentRestPool();
    const event = pool[Math.floor(Math.random() * pool.length)];
    const stressEffect = event.stress > 0 && event.tone === "bad" && hasSkill("thickSkin") ? Math.round(event.stress / 2) : event.stress;
    changeFans(event.fans || 0);
    statChange("money", event.money || 0, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", event.rep || 0, setRep);
    statChange("stress", stressEffect || 0, setStress);
    addLog(event);
  }

  function doSideHustle(hustle) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Finish the show run before starting a job.`, tone: "bad" }); return; }
    if (fans >= 5000) { addLog({ text: "you're too big for that now.", tone: "neutral" }); return; }
    setCurrentJob(hustle);
    setStress((prev) => Math.max(prev, hustle.stressFloor));
    addLog({ text: `started working as ${hustle.name}. money coming in but the dream's on hold.`, tone: "neutral" });
    setSideHustleOpen(false);
  }

  function quitJob() {
    if (!currentJob) return;
    addLog({ text: `quit ${currentJob.name}. back to focusing on music.`, tone: "neutral" });
    setCurrentJob(null);
  }

  function rest() {
    if (activeShow) addLog({ text: `${activeShow.name} is still active. Resting advances the show run.`, tone: "neutral" });
    runProgress("Taking a reset night", () => {
      statChange("creativity", 24, setCreativity);
      statChange("stress", -22, setStress);
      addLog({ text: "Reset night. A new week starts after this.", tone: "neutral" });
      advanceWeek(-10);
      setLabelCooldown((prev) => Math.max(0, prev - 1));
      if (labelContract) {
        const royalty = Math.max(100, Math.round(fans * 0.002 * (labelContract.royalties / 100)));
        statChange("money", royalty, setMoney, (v) => formatMoney(Math.abs(v)));
        addLog({ text: `${labelContract.type} royalty check came in: ${formatMoney(royalty)}.`, tone: "good" });
      }
      maybeRestEvent();
    });
  }

  function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function releasedSongs() {
    return songs.filter((song) => song.released);
  }

  function canDoActivity(activity) {
    const releases = releasedSongs();
    if (activity.id === "busking") return releases.length > 0;
    if (activity.id === "soundcloud") return fans < 5000 && releases.length > 0;
    if (activity.id === "battle") return fans >= 100 && fans < 2000;
    if (activity.id === "ghostwrite") return fans < 10000 && lyrics >= 30;
    if (activity.id === "studioHelp") return fans >= 500;
    return false;
  }

  function activityLockText(activity) {
    const releases = releasedSongs();
    if (activity.id === "busking") return releases.length ? "Available" : "Needs 1 released song";
    if (activity.id === "soundcloud") return fans >= 5000 ? "Locked at 5k+ fans" : releases.length ? "Available" : "Needs 1 released song";
    if (activity.id === "battle") return fans < 100 ? "Needs 100 fans" : fans >= 2000 ? "Locked once shows become your main performance lane" : "Available";
    if (activity.id === "ghostwrite") return fans >= 10000 ? "Locked at 10k+ fans" : lyrics < 30 ? "Needs Lyrics 30+" : "Available";
    if (activity.id === "studioHelp") return fans >= 500 ? "Available" : "Needs 500 fans";
    return "Unavailable";
  }

  function doActivity(activity) {
    if (activeShow) { addLog({ text: `You're booked for ${activeShow.name}. Side activities are paused until it wraps.`, tone: "bad" }); return; }
    if (!canDoActivity(activity)) { addLog({ text: activityLockText(activity), tone: "bad" }); return; }
    runProgress(activity.name, () => {
      if (activity.id === "busking") {
        const pay = randomInt(10, 30);
        const fanGain = randomInt(1, 3);
        statChange("money", pay, setMoney, (v) => formatMoney(Math.abs(v)));
        changeFans(fanGain);
        statChange("stress", 5, setStress);
        addLog({ text: "set up on the corner, played some tracks for tips.", tone: "neutral" });
        if (Math.random() < 0.05) { changeFans(30); addLog({ text: "someone clipped you busking, it blew up.", tone: "good" }); }
        advanceWeek(0);
      }
      if (activity.id === "soundcloud") {
        changeFans(randomInt(5, 15));
        statChange("stress", 3, setStress);
        addLog({ text: "spent the week promoting your music online.", tone: "neutral" });
        advanceWeek(0);
      }
      if (activity.id === "battle") {
        const effective = getEffectiveSkill(lyrics);
        const win = Math.random() < effective / (effective + 30);
        statChange("stress", win ? 15 : 20, setStress);
        if (win) {
          changeFans(10);
          statChange("rep", 5, setRep);
          statChange("money", 30, setMoney, (v) => formatMoney(Math.abs(v)));
          addLog({ text: "you won the rap battle. crowd was hype.", tone: "good" });
        } else {
          changeFans(-5);
          statChange("rep", -5, setRep);
          addLog({ text: "you got bodied in the battle. take the L.", tone: "bad" });
        }
        advanceWeek(0);
      }
      if (activity.id === "ghostwrite") {
        const pay = randomInt(100, 200);
        statChange("money", pay, setMoney, (v) => formatMoney(Math.abs(v)));
        statChange("rep", -3, setRep);
        statChange("stress", 10, setStress);
        addLog({ text: "you wrote bars for another artist. anonymous money.", tone: "neutral" });
        advanceWeek(0);
      }
      if (activity.id === "studioHelp") {
        statChange("money", 50, setMoney, (v) => formatMoney(Math.abs(v)));
        statChange("stress", 8, setStress);
        addLog({ text: "you helped record for another artist. solid session.", tone: "neutral" });
        if (Math.random() < 0.1) changeFans(20);
        advanceWeek(0);
      }
      setSideHustleOpen(false);
    });
  }

  function buyAccessory(item) {
    if (purchasedAccessories.includes(item.name)) return;
    if (fans < item.unlockFans) { addLog({ text: `${item.name} unlocks at ${item.unlockFans.toLocaleString()} fans.`, tone: "bad" }); return; }
    if (money < item.cost) { addLog({ text: `Need ${formatMoney(item.cost - money)} more for ${item.name}.`, tone: "bad" }); return; }
    statChange("money", -item.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    setPurchasedAccessories((prev) => [...prev, item.name]);
    addLog({ text: `Bought ${item.name}.`, tone: "good" });
  }

  function buyUpgrade(item) {
    if (purchased.includes(item.name)) return;
    if (money < item.cost) { addLog({ text: `Need ${formatMoney(item.cost - money)} more for ${item.name}.`, tone: "bad" }); return; }
    statChange("money", -item.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    setPurchased((prev) => [...prev, item.name]);
    if (item.studioName) setCurrentStudioName(item.studioName);
    addLog({ text: `Bought ${item.name}. Gear bonus: +${item.gain} ${item.stat}.`, tone: "good" });
  }

  function trainArtistStat(type) {
    const config = {
      lyrics: { label: "lyrics", value: lyrics, setter: setLyrics },
      beats: { label: "beats", value: beats, setter: setBeats },
      production: { label: "production", value: setup, setter: setSetup },
    }[type];
    const cost = artistStatCost(config.value);
    const gain = artistStatGain(cost);
    if (money < cost) { addLog({ text: `Need ${formatMoney(cost - money)} more to upgrade ${config.label}.`, tone: "bad" }); return; }
    statChange("money", -cost, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange(config.label, gain, config.setter);
    addLog({ text: `${config.label} trained by +${gain}.`, tone: "good" });
  }

  function hireProducer(item) {
    if (producer.id === item.id) { addLog({ text: `${item.name} is already selected.`, tone: "neutral" }); return; }
    setProducer(item);
    const tier = beatTierForProducer(item, { skills: { beats: totalBeats || beats }, creativity });
    addLog({ text: `${item.name} selected. Beat quality: ${tier}.`, tone: "neutral" });
  }

  function buySkill(skill) {
    if (fans < skill.unlockFans || purchasedSkills.includes(skill.id)) return;
    if (money < skill.cost) { addLog({ text: `${skill.name} costs ${formatMoney(skill.cost)}. Not enough money yet.`, tone: "bad" }); return; }
    statChange("money", -skill.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    setPurchasedSkills((prev) => [...prev, skill.id]);
    setActiveSkills((prev) => prev.length < 3 ? [...prev, skill.id] : prev);
    addLog({ text: `${skill.name} learned. ${skill.text}`, tone: "good" });
  }

  function toggleSkill(skill) {
    if (!purchasedSkills.includes(skill.id)) return;
    setActiveSkills((prev) => {
      if (prev.includes(skill.id)) return prev.filter((id) => id !== skill.id);
      if (prev.length >= 3) { addLog({ text: "Only 3 skills can be active at once.", tone: "bad" }); return prev; }
      return [...prev, skill.id];
    });
  }

  function toggleStyle(style) {
    setSelectedStyles((prev) => {
      const exists = prev.some((item) => item.name === style.name);
      if (exists) return prev.length === 1 ? prev : prev.filter((item) => item.name !== style.name);
      if (prev.length >= 3) return [prev[1], prev[2], style];
      return [...prev, style];
    });
  }

  function setStudio(name) {
    if (!unlockedStudios.includes(name)) return;
    setCurrentStudioName(name);
    addLog({ text: `Recording studio set to ${name}.`, tone: "neutral" });
  }

  function handleRival(choice) {
    if (!pendingChoice?.rival) return;
    const rival = pendingChoice.rival;
    setPendingChoice(null);
    if (choice === "diss") {
      const hit = Math.random() < 0.48;
      if (hit) { changeFans(Math.round(fans * 0.5)); statChange("rep", 20, setRep); addLog({ text: `Your diss at ${rival.name} hit hard.`, tone: "good" }); }
      else { changeFans(-Math.round(fans * 0.2)); statChange("stress", 18, setStress); addLog({ text: `The diss at ${rival.name} flopped.`, tone: "bad" }); }
    }
    if (choice === "social") { changeFans(Math.round(fans * 0.05)); statChange("rep", 4, setRep); addLog({ text: `You responded to ${rival.name} online.`, tone: "neutral" }); }
    if (choice === "ignore") { statChange("rep", -5, setRep); addLog({ text: `You ignored ${rival.name}.`, tone: "neutral" }); }
    setActiveRival(null);
  }

  function saveNow() {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(buildSaveObject()));
      setToast("Game saved.");
      setTimeout(() => setToast(""), 1400);
    } catch (error) {
      alert("running out of save space. consider removing some custom covers.");
      setToast("Save failed.");
      setTimeout(() => setToast(""), 1400);
    }
  }

  function exportSaveJson() {
    const blob = new Blob([JSON.stringify(buildSaveObject(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rap-sim-save.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importSaveJson(text) {
    try {
      const save = JSON.parse(text);
      const loaded = applySaveObject(save);
      if (!loaded) throw new Error("bad save");
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      setToast("Save imported.");
    } catch (error) {
      setToast("Import failed.");
    }
    setTimeout(() => setToast(""), 1400);
  }

  function resetGame() {
    try {
      window.localStorage.removeItem(SAVE_KEY);
      window.location.hash = "";
    } catch (error) {}
    setStarted(false);
    setTabRaw("home");
    setStageName("");
    setWeek(1);
    setFans(0);
    setMoney(0);
    setRep(0);
    setCreativity(55);
    setStress(10);
    setLyrics(1);
    setBeats(1);
    setSetup(1);
    setSelectedStyles([styles[0]]);
    setProducer(producers[0]);
    setCurrentStudioName("Bedroom");
    setSongTitleInput("");
    setDraft(null);
    setRecorded(null);
    setSongs([]);
    setLog([{ text: "Week 1. No fans, no money, just a bedroom and dangerous confidence.", tone: "neutral" }]);
    setPurchased([]);
    setPurchasedSkills([]);
    setPurchasedAccessories([]);
    setActiveSkills([]);
    setLabelContract(null);
    setLabelCooldown(0);
    setActiveRival(null);
    setCurrentJob(null);
    setProjects([]);
    setProjectDraft({ title: "", type: "mixtape", coverStyle: "custom", coverA: "#22d3ee", coverB: "#a78bfa", customCoverImage: null });
    setShownProjectMilestones([]);
    setFeedPosts([]);
    setReleaseReactions(null);
    setSelectedRollout("quiet");
    setShowHistory([]);
    setActiveShow(null);
    setShownMilestones([]);
    setPeakFans(0);
    setLastReleaseWeek(1);
    setLastCatalogEarnings({ money: 0, fans: 0, streams: 0, lifetimeStreams: 0 });
    setAvatar({ hair: "Buzz Cut / Short Fade", hairColor: "Black", skinTone: "Medium Dark", outfit: "Plain Hoodie", backdrop: "Bedroom Studio", accessories: [] });
    setSettingsOpen(false);
  }

  const currentLyricsRecorded = Boolean(draft && recorded && recorded.draftId === draft.id && recorded.lyricVersion === draft.lyricVersion);
  const rhythmModal = rhythmSession ? <RhythmMiniGame draft={rhythmSession.draft} player={{ lyrics, stress, creativity }} studio={currentStudio} selectedStyles={selectedStyles} onUseTake={finishRecordingTake} onRetakeCost={payForRhythmRetake} onCancel={() => setRhythmSession(null)} previewFinalQuality={(multiplier) => clamp(Math.round(calculateFinalSongQuality({ draftQuality: rhythmSession.draft.quality, productionSkill: totalProduction, stress, studioQuality: currentStudio.quality, recordingMultiplier: multiplier })), 1, 100)} /> : null;
  const eventModal = pendingChoice?.kind === "rival" ? <ChoiceModal title={`${pendingChoice.rival.name} just dissed you`} text="Pick how to respond." options={[{ label: "Drop Diss Track", sub: "High risk: lose 20% fans or gain 50% fans + rep", onClick: () => handleRival("diss"), tone: "bad" }, { label: "Respond on Social", sub: "Smaller swing, no song needed", onClick: () => handleRival("social"), tone: "neutral" }, { label: "Ignore", sub: "Small rep loss, no risk", onClick: () => handleRival("ignore"), tone: "neutral" }]} /> : null;
  const modal = rhythmModal || eventModal;
  const weeksSinceLastRelease = week - lastReleaseWeek;
  const state = { stageName, avatar, week, fans, money, rank, selectedStyles, creativity, stress, setup, lyrics, beats, rep, gearBoosts: gearBoosts || { lyrics: 0, beats: 0, production: 0 }, totalLyrics: totalLyrics || lyrics, totalBeats: totalBeats || beats, totalProduction: totalProduction || setup, draft, recorded, producer, songs, log, feedPosts, releaseReactions, selectedRollout, showHistory, activeShow, mix, purchased, songTitleInput, unlockedStudios, currentStudio, currentLyricsRecorded, purchasedSkills, purchasedAccessories, activeSkills, hoveredBeat, labelContract, activeRival, currentJob, projects, projectDraft, lastCatalogEarnings, weeksSinceLastRelease, sideHustleOpen, storeOpen, storeTab, musicPanel }; 
  const actions = { setTab, writeSong, recordSong, releaseSong, releaseRecordedAsSingle, addRecordedToProject, rest, buyUpgrade, buyAccessory, trainArtistStat, hireProducer, toggleStyle, updateAvatar, toggleAccessory, setStageName, setSongTitleInput, setSongTitle, setDraftCover, setStudio, selectRecordedDraft, deleteRecordedDraft, startProject, releaseProject, cancelProject, removeSongFromProject, setProjectDraft, buySkill, toggleSkill, setHoveredBeat, setSideHustleOpen, doSideHustle, quitJob, doActivity, canDoActivity, activityLockText, releaseVideoForSong, performShow, setSelectedRollout, setStoreOpen, setStoreTab, setMusicPanel };

  if (!started) return <><FeedbackStyles /><StartScreen stageName={stageName} setStageName={setStageName} avatar={avatar} updateAvatar={updateAvatar} startGame={startGame} settings={settings} /></>;

  return <div className="min-h-screen bg-[#030814] text-white"><FeedbackStyles /><div className="fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,.14),transparent_32%),radial-gradient(circle_at_45%_92%,rgba(251,191,36,.08),transparent_30%)]" /><div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" /><main className="relative mx-auto max-w-7xl px-4 py-5 pb-28"><TopBar week={week} fans={fans} money={money} rank={rank} /><div className="mt-5">{tab === "home" && <HomeScreen state={state} actions={actions} />}{tab === "music" && <MusicScreen state={state} actions={actions} />}{tab === "feed" && <FeedScreen state={state} />}{tab === "charts" && <ChartsScreen state={state} />}{tab === "career" && <><CareerScreen state={state} /><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><CareerActionsPanel state={state} actions={actions} /><ShowsPanel state={state} actions={actions} /></div></>}{tab === "profile" && <ProfileScreen state={state} actions={actions} />}</div></main><StoreButton onClick={() => setStoreOpen(true)} /><SettingsButton onClick={() => setSettingsOpen(true)} /><BottomNav tab={tab} setTab={setTab} />{storeOpen ? <StoreModal state={state} actions={actions} /> : null}{settingsOpen ? <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onSaveNow={saveNow} onExportJson={exportSaveJson} onImportJson={importSaveJson} onResetGame={resetGame} playerName={stageName} version="0.4.0" fps={fps} /> : null}{toast ? <div className="fixed bottom-24 left-1/2 z-[160] -translate-x-1/2 rounded-2xl border border-cyan-300/30 bg-[#06101d]/95 px-5 py-3 text-sm font-black text-cyan-100 shadow-2xl">{toast}</div> : null}<FeedbackLayer floaters={floaters} progress={progress} weekSplash={weekSplash} celebration={celebration} particles={particles} milestone={milestoneMessage} modal={modal} /></div>;
}
