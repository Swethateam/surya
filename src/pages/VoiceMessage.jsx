import { useRef, useState, useEffect } from "react";

function VoiceMessage({ onNext }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Floating hearts generator for background attraction
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-15), // keep max 15 hearts
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 14 + 10,
          duration: Math.random() * 3 + 3,
        },
      ]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleVoice = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio could not be played:", error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <section className="page voice-page">
      {/* Background Image */}
      <img className="background-video" src="/bg voice.png" alt="Background" />

      {/* Pink Glowing Overlay */}
      <div className="video-overlay"></div>

      {/* Floating Hearts Container */}
      <div className="floating-hearts-container">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/voice .ogg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />

      {/* Main Content */}
      <div className="voice-content">
        <div className="surprise-header">
          <span className="eyebrow-line"></span>
          <p className="eyebrow">SURPRISE 01</p>
          <span className="eyebrow-line"></span>
        </div>
        <div className="heart-icon-small">♥</div>

        <h2>Before we begin...</h2>

        <p className="description">There is something I want you to hear first.</p>

        {/* Pink Glassmorphism Voice Card */}
        <div className="voice-card">
          <div className="voice-top-row">
            <div className="voice-icon">🎙️</div>
            <div className="voice-info">
              <strong>
                A little message <span className="card-heart">♥</span>
              </strong>
              <span>Someone special sent this for you</span>
            </div>
          </div>

          {/* Audio Waveform Animation Visualizer */}
          <div className="waveform">
            {[...Array(26)].map((_, i) => (
              <span
                key={i}
                className={`wave-bar ${isPlaying ? "active" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></span>
            ))}
          </div>

          {/* Audio Controls */}
          <div className="player-controls">
            <button
              className="skip-btn"
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime -= 5;
              }}
            >
              ⏮
            </button>
            <button
              className="play-btn"
              onClick={handleVoice}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button
              className="skip-btn"
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime += 5;
              }}
            >
              ⏭
            </button>
          </div>

          {/* Progress Bar & Timestamps */}
          <div className="progress-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            ></div>
            <div className="progress-thumb" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Continue Button */}
        <button className="primary-btn pink-continue-btn" onClick={onNext}>
          Continue <span>→</span>
        </button>
      </div>
    </section>
  );
}

export default VoiceMessage;