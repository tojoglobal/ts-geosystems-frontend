/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

// SVG icons for design
const PlayIcon = ({ playing }) =>
  playing ? (
    <svg width="28" height="28" viewBox="0 0 20 20">
      <rect x="4" y="3" width="4" height="14" rx="1.5" fill="#222" />
      <rect x="12" y="3" width="4" height="14" rx="1.5" fill="#222" />
    </svg>
  ) : (
    <svg width="28" height="28" viewBox="0 0 20 20">
      <polygon points="5,3 17,10 5,17" fill="#222" />
    </svg>
  );

const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginLeft: 2 }}>
    <rect width="3" height="8" x="2" y="8" rx="1.5" fill="#bdbdbd" />
    <rect width="3" height="12" x="7" y="6" rx="1.5" fill="#bdbdbd" />
    <rect width="3" height="16" x="12" y="4" rx="1.5" fill="#bdbdbd" />
    <rect width="3" height="12" x="17" y="6" rx="1.5" fill="#bdbdbd" />
  </svg>
);

const SkipIcon = ({ seconds }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    style={{
      transform: seconds > 0 ? "" : "scaleX(-1)",
      background: "#fff",
      borderRadius: "50%",
      boxShadow: "0 2px 8px 0 rgba(40,40,73,0.10)",
      padding: 3,
      display: "block",
    }}
  >
    <path
      d="M18 7v3a8 8 0 1 1-7.938 8.86"
      stroke="#222"
      strokeWidth="1.7"
      fill="none"
    />
    <polygon points="18,2 23,10 13,10" fill="#222" />
    <text
      x="18"
      y="31"
      fontSize="11"
      fill="#222"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontWeight="bold"
    >
      {Math.abs(seconds)}
    </text>
  </svg>
);

function formatSeconds(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const estimateDuration = (txt, speed = 1) => {
  const wpm = 150 * speed;
  const words = txt ? txt.trim().split(/\s+/).length : 0;
  return words > 0 ? Math.ceil((words / wpm) * 60) : 0;
};

export function getDescriptionTextFromHtml(html) {
  if (!html) return "";
  const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (matches && matches.length > 0) {
    const tempDiv = document.createElement("div");
    const filtered = matches.filter((p) => {
      tempDiv.innerHTML = p;
      return (
        (tempDiv.textContent || tempDiv.innerText || "").trim().length > 10
      );
    });
    const text = filtered.length
      ? filtered
          .map((p) => {
            tempDiv.innerHTML = p;
            return tempDiv.textContent || tempDiv.innerText || "";
          })
          .join(" ")
      : matches
          .map((p) => {
            tempDiv.innerHTML = p;
            return tempDiv.textContent || tempDiv.innerText || "";
          })
          .join(" ");
    return text;
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

const AudioPlayer = ({ text }) => {
  const { supported, voices } = useSpeechSynthesis();
  const [isPlaying, setIsPlaying] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const speed = 1;

  const selectedVoice =
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.gender === "female" ||
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("woman"))
    ) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];

  const utteranceRef = useRef(null);

  useEffect(() => {
    setCharIndex(0);
    setPosition(0);
    setIsPlaying(false);
    setDuration(estimateDuration(text, speed));
    window.speechSynthesis.cancel();
  }, [text]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text.slice(charIndex));
    utter.voice = selectedVoice;
    utter.rate = speed;
    utter.onend = () => {
      setIsPlaying(false);
      setCharIndex(0);
      setPosition(duration);
    };
    utter.onboundary = (event) => {
      if (event.name === "word" && event.charIndex !== undefined) {
        const charsRead = charIndex + event.charIndex;
        setCharIndex(charsRead);
        const pct = charsRead / text.length;
        setPosition(Math.floor(duration * pct));
      }
    };
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else if (window.speechSynthesis.paused) {
      handleResume();
    } else {
      handlePlay();
    }
  };

  const handleSeek = (seconds) => {
    if (!text) return;
    let newPos = position + seconds;
    if (newPos < 0) newPos = 0;
    if (newPos > duration) newPos = duration;
    const pct = duration > 0 ? newPos / duration : 0;
    const newChar = Math.floor(text.length * pct);
    setCharIndex(newChar);
    setPosition(newPos);
    window.speechSynthesis.cancel();
    setTimeout(() => handlePlay(), 100);
  };

  if (!supported) {
    return (
      <div className="my-4 p-2 bg-red-100 text-red-700 rounded">
        Sorry, your browser does not support speech synthesis.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 3px 16px 0 rgba(40,40,73,0.11)",
        display: "flex",
        alignItems: "center",
        padding: "12px 24px",
        gap: 18,
        width: "100%",
        maxWidth: "100%",
        margin: "24px 0 16px 0",
      }}
    >
      <button
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={handlePlayPause}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PlayIcon playing={isPlaying} />
        <WaveIcon />
      </button>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          color: "#222",
          fontWeight: 500,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Listen to article
      </div>
      <div
        style={{
          minWidth: 36,
          textAlign: "center",
          color: "#222",
          fontSize: 15,
        }}
      >
        1x
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <button
          aria-label="Replay 10 seconds"
          onClick={() => handleSeek(-10)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            boxShadow: "none",
          }}
        >
          <SkipIcon seconds={-10} />
        </button>
        <button
          aria-label="Forward 30 seconds"
          onClick={() => handleSeek(30)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            boxShadow: "none",
          }}
        >
          <SkipIcon seconds={30} />
        </button>
      </div>
      <div
        style={{
          minWidth: 48,
          textAlign: "right",
          color: "#222",
          fontSize: 15,
          marginLeft: 4,
        }}
      >
        {formatSeconds(isPlaying ? position : duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;
