
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import VoiceMessage from "./pages/VoiceMessage";
import Birthday from "./pages/Birthday";
import Puzzle from "./pages/Puzzle";
import GiftFinder from "./pages/GiftFinder";
import FinalMessage from "./pages/FinalMessage";

function App() {
  const [page, setPage] = useState("login");
  const [musicStarted, setMusicStarted] = useState(false);

  const musicRef = useRef(null);

  const goTo = (nextPage) => {
    setPage(nextPage);
  };

  // Background music starts only when called by the There's More button
  const startMusic = async () => {
    const audio = musicRef.current;

    if (!audio) return;

    // Prevent restarting music if it is already playing
    if (!audio.paused && musicStarted) return;

    try {
      audio.volume = 0.35;
      await audio.play();
      setMusicStarted(true);
    } catch (error) {
      console.error("Background music playback failed:", error);
    }
  };

  return (
    <div className="app">

      {/* Persistent background music across all pages */}
      <audio
        ref={musicRef}
        src="/bgsong.mp3"
        loop
        preload="auto"
      />

      <AnimatePresence mode="wait">

        {page === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <Login onNext={() => goTo("voice")} />
          </motion.div>
        )}

        {page === "voice" && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <VoiceMessage onNext={() => goTo("birthday")} />
          </motion.div>
        )}

        {page === "birthday" && (
          <motion.div
            key="birthday"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <Birthday
              onNext={() => goTo("puzzle")}
              startMusic={startMusic}
            />
          </motion.div>
        )}

        {page === "puzzle" && (
          <motion.div
            key="puzzle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <Puzzle onNext={() => goTo("finder")} />
          </motion.div>
        )}

        {page === "finder" && (
          <motion.div
            key="finder"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <GiftFinder onNext={() => goTo("final")} />
          </motion.div>
        )}

        {page === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <FinalMessage />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
