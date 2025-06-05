import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useSpeechSynthesis } from "react-speech-kit";
import "./audioplayerStyle.css";

// Animated Wave SVG for premium look
const WaveIcon = ({ playing }) =>
  playing ? (
    <svg width="35" height="35" viewBox="0 0 35 35">
      <g>
        <rect width="4" height="18" x="4" y="9" rx="2" fill="#63a4ff">
          <animate
            attributeName="height"
            values="8;18;8"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="y"
            values="14;9;14"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0s"
          />
        </rect>
        <rect width="4" height="24" x="12" y="6" rx="2" fill="#1976d2">
          <animate
            attributeName="height"
            values="10;24;10"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
          <animate
            attributeName="y"
            values="13;6;13"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </rect>
        <rect width="4" height="28" x="20" y="4" rx="2" fill="#1976d2">
          <animate
            attributeName="height"
            values="12;28;12"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.4s"
          />
          <animate
            attributeName="y"
            values="12;4;12"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </rect>
        <rect width="4" height="18" x="28" y="9" rx="2" fill="#63a4ff">
          <animate
            attributeName="height"
            values="8;18;8"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.6s"
          />
          <animate
            attributeName="y"
            values="14;9;14"
            dur="1.1s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </rect>
      </g>
    </svg>
  ) : (
    <svg width="35" height="35" viewBox="0 0 35 35">
      <rect x="4" y="14" width="4" height="8" rx="2" fill="#c5c5c5" />
      <rect x="10" y="10" width="4" height="14" rx="2" fill="#bdbdbd" />
      <rect x="16" y="6" width="4" height="22" rx="2" fill="#bdbdbd" />
      <rect x="22" y="10" width="4" height="14" rx="2" fill="#bdbdbd" />
      <rect x="28" y="14" width="4" height="8" rx="2" fill="#c5c5c5" />
    </svg>
  );

const PlayIcon = ({ playing }) =>
  playing ? <FaPause size={30} /> : <FaPlay size={30} />;

const SkipIcon = ({ seconds }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    style={{
      transform: seconds > 0 ? "" : "scaleX(-1)",
      background: "#f3f6fa",
      borderRadius: "50%",
      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.07)",
      padding: "3px",
      display: "block",
      border: "1.5px solid #dde7f3",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 6v2a12 12 0 1 1 -9 9"
      stroke="#1976d2"
      strokeWidth="1.7"
      fill="none"
    />
    <polygon points="18,5 22,11 14,11" fill="#1976d2" />
    <text
      x="21"
      y="20"
      fontSize="10"
      fill="#1976d2"
      textAnchor="middle"
      dominantBaseline="middle"
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

const estimateDuration = (txt, rate = 1) => {
  const wpm = 150 * rate;
  const words = txt ? txt.trim().split(/\s+/).length : 0;
  return words > 0 ? Math.ceil((words / wpm) * 60) : 0;
};

const speedSteps = [1, 1.5, 2];

const AudioPlayer = ({ text }) => {
  const { supported, voices } = useSpeechSynthesis();
  const [isPlaying, setIsPlaying] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const speed = speedSteps[speedIdx];

  // Timer state
  const [duration, setDuration] = useState(0);
  const [remaining, setRemaining] = useState(0);

  // Progress State
  const progressRef = useRef();
  const [progress, setProgress] = useState(0); // 0..1

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
  const timerRef = useRef(null);

  useEffect(() => {
    const est = estimateDuration(text, speed);
    setDuration(est);
    setRemaining(est);
    setCharIndex(0);
    setIsPlaying(false);
    setProgress(0);
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
  }, [text, speed]);

  useEffect(
    () => () => {
      window.speechSynthesis.cancel();
      clearInterval(timerRef.current);
    },
    []
  );

  useEffect(() => {
    clearInterval(timerRef.current);
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setRemaining((rem) => {
          const newRem = rem - 0.2 * speed;
          if (newRem > 0) return newRem;
          clearInterval(timerRef.current);
          return 0;
        });
      }, 200);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed]);

  // Progress effect
  useEffect(() => {
    if (!duration) setProgress(0);
    else setProgress(1 - remaining / duration);
  }, [remaining, duration]);

  // Seek by clicking progress bar
  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.touches
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setRemaining(duration * (1 - pct));
    setCharIndex(Math.floor(text.length * pct));
    window.speechSynthesis.cancel();
    handlePlay(true); // removed setTimeout here
    // setTimeout(() => handlePlay(true), 100);
  };

  const handlePlay = (preserveCharIndex = false) => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const currentChar = preserveCharIndex ? charIndex : 0;
    const utter = new window.SpeechSynthesisUtterance(text.slice(currentChar));
    utter.voice = selectedVoice;
    utter.rate = speed;
    utter.onend = () => {
      setIsPlaying(false);
      setCharIndex(0);
      setRemaining(0);
    };
    utter.onboundary = (event) => {
      if (event.name === "word" && event.charIndex !== undefined) {
        const charsRead = currentChar + event.charIndex;
        setCharIndex(charsRead);
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
    let newRem = remaining - seconds;
    const newRemaining = Math.max(0, Math.min(duration, newRem));
    setRemaining(newRemaining);
    const pct = duration ? (duration - newRemaining) / duration : 0;
    const newChar = Math.floor(text.length * pct);
    setCharIndex(newChar);
    window.speechSynthesis.cancel();
    handlePlay(true); // removed setTimeout here
  };

  const handleCycleSpeed = () => {
    let nextIdx = (speedIdx + 1) % speedSteps.length;
    setSpeedIdx(nextIdx);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      handlePlay(true); // removed setTimeout here
    }
  };

  if (!supported) {
    return (
      <div className="my-4 p-2 bg-red-100 text-red-700 rounded">
        Sorry, your browser does not support speech synthesis.
      </div>
    );
  }

  return (
    <div className="ap-container">
      {/* Controls */}
      <div className="ap-controls">
        <div className="ap-flex-center">
          <button
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={handlePlayPause}
            className="play-button"
          >
            <PlayIcon playing={isPlaying} />
          </button>
          <div>
            <WaveIcon playing={isPlaying} />
          </div>
        </div>
        <div className="ap-title">Listen to article</div>
        <button
          onClick={handleCycleSpeed}
          aria-label="Change speed"
          className="ap-speed"
        >
          {speed}x
        </button>
        <div className="ap-skip-group">
          <button
            aria-label="Replay 10 seconds"
            onClick={() => handleSeek(-10)}
            className="ap-skip"
          >
            <SkipIcon seconds={-10} />
          </button>
          <button
            aria-label="Forward 30 seconds"
            onClick={() => handleSeek(30)}
            className="ap-skip"
          >
            <SkipIcon seconds={30} />
          </button>
        </div>
        <div className="ap-timer">
          {formatSeconds(isPlaying ? remaining : duration)}
        </div>
      </div>

      {/* progress */}
      <div
        ref={progressRef}
        className="ap-progress-bar"
        onClick={handleProgressClick}
        onTouchStart={handleProgressClick}
      >
        <div
          className="ap-progress-inner"
          style={{
            width: `${(progress * 100).toFixed(2)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
