
import { useState } from "react";
import { motion } from "framer-motion";

function Birthday({ onNext, startMusic }) {
  const [isOpen, setIsOpen] = useState(false);

  // Cover open only — no background music
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Start background music when clicking There's More
  const handleNext = async () => {
    if (startMusic) {
      await startMusic();
    }

    onNext();
  };

  return (
    <section className="page birthday-page">

      {/* Floating Hearts */}
      <div className="floating-hearts">
        <span>♡</span>
        <span>♥</span>
        <span>♡</span>
        <span>♥</span>
        <span>♡</span>
        <span>♥</span>
        <span>♡</span>
      </div>

      {/* Confetti */}
      <div className="confetti">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* Eyebrow */}
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        TODAY IS YOUR DAY
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        Happy
        <br />
        Birthday <span>♡</span>
      </motion.h1>

      {/* Interactive Video Cover */}
      <motion.div
        className={`birthday-photo ${isOpen ? "opened" : ""}`}
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        onClick={!isOpen ? handleOpen : undefined}
      >

        {/* Birthday Video */}
        <video
          src="/surya video.mp4"
          className="birthday-image"
          controls
          playsInline
          preload="metadata"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "inherit",
          }}
        />

        {/* Cover */}
        <motion.div
          className="photo-cover"
          animate={{
            rotateY: isOpen ? -115 : 0,
            opacity: isOpen ? 0 : 1,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "left center",
          }}
        >
          <span className="cover-heart">♡</span>

          <h2>
            A Little
            <br />
            Surprise
          </h2>

          <p>Tap to open ✨</p>
        </motion.div>

      </motion.div>

      {/* Description */}
      <motion.p
        className="description"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        May your day be filled with
        beautiful moments, endless smiles
        and everything you wish for.
      </motion.p>

      {/* Next Button */}
      <motion.button
        className="primary-btn"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleNext}
      >
        There's More <span>✨</span>
      </motion.button>

    </section>
  );
}

export default Birthday;
