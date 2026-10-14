
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const gifts = [
  {
    id: 1,
    image: "/1st.png",
    letter: "krithi ",
    department: "II Physical education",
    task: "Go to krithi and tell her the first letter of your name. 🤫",
    clueLetter: "N",
  },
  {
    id: 2,
    image: "/2nd.png",
    letter: "ranji",
    department: "II Physical education",
    task: "Go to ranji and tell her the second letter of your name. 💌",
    clueLetter: "I",
  },
  {
    id: 3,
    image: "/3rd.png",
    letter: "priya",
    department: "I Chemistry",
    task: "Go to priya and tell her the third letter of your name. 💌",
    clueLetter: "T",
  },
  {
    id: 4,
    image: "/4th.png",
    letter: "viji",
    department: "I Fsc",
    task: "Go to viji and tell her the fourth letter of your name. 💌",
    clueLetter: "H",
  },
  {
    id: 5,
    image: "/5th.png",
    letter: "velmayil",
    department: "II Tamil",
    task: "Go to velmayil and tell her the fifth letter of your name. 💌",
    clueLetter: "Y",
  },
  {
    id: 6,
    image: "/7th.png",
    letter: "chlm",
    department: "Computer Science",
    task: "Come to me and tell the last letter of your name. 💌",
    clueLetter: "A",
  },
];

function GiftFinder({ onNext }) {
  const [selectedGift, setSelectedGift] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [collected, setCollected] = useState([]);

  const canvasRef = useRef(null);
  const isScratching = useRef(false);

  useEffect(() => {
    if (!selectedGift || revealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#f6b7d2");
    gradient.addColorStop(0.5, "#c783b6");
    gradient.addColorStop(1, "#8d5bb5");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 16px sans-serif";

    ctx.fillText(
      "✦  SCRATCH HERE  ✦",
      rect.width / 2,
      rect.height / 2
    );

    ctx.globalCompositeOperation = "destination-out";
  }, [selectedGift, revealed]);

  const scratch = (event) => {
    if (!isScratching.current || revealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 23, 0, Math.PI * 2);
    ctx.fill();

    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparent = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      total++;

      if (pixels[i] < 20) {
        transparent++;
      }
    }

    if (total > 0 && transparent / total > 0.38) {
      setRevealed(true);
      isScratching.current = false;
    }
  };

  const collectGift = () => {
    if (!selectedGift) return;

    setCollected((previous) =>
      previous.includes(selectedGift.id)
        ? previous
        : [...previous, selectedGift.id]
    );

    setSelectedGift(null);
    setRevealed(false);
    isScratching.current = false;
  };

  const closeGift = () => {
    setSelectedGift(null);
    setRevealed(false);
    isScratching.current = false;
  };

  return (
    <main className="finder-page">
      <div className="finder-orb finder-orb-one" />
      <div className="finder-orb finder-orb-two" />
      <div className="finder-stars">✦　·　✧　·　✦　·　✧</div>

      <motion.section
        className="finder-content"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="finder-eyebrow">
          A LITTLE SURPRISE FOR YOU
        </div>

        <h1>Collect Your Gift</h1>

        <p className="finder-subtitle">
          Scratch. Discover. Smile. ♡
        </p>

        <div className="finder-progress">
          <div className="finder-progress-track">
            <motion.div
              className="finder-progress-fill"
              animate={{
                width: `${(collected.length / gifts.length) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <span>
            {collected.length} / {gifts.length}
          </span>
        </div>

        <div className="finder-grid">
          {gifts.map((gift, index) => {
            const isCollected = collected.includes(gift.id);

            return (
              <motion.button
                type="button"
                className={`finder-card ${
                  isCollected ? "is-collected" : ""
                }`}
                key={gift.id}
                onClick={() => {
                  if (!isCollected) {
                    setSelectedGift(gift);
                    setRevealed(false);
                  }
                }}
                whileHover={
                  !isCollected
                    ? { y: -7, scale: 1.025 }
                    : undefined
                }
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                aria-label={`Gift ${gift.id}${
                  isCollected ? ", collected" : ", open gift"
                }`}
                disabled={isCollected}
              >
                <div className="finder-card-image">
                  <img src={gift.image} alt="" loading="lazy" />

                  <div className="finder-image-shade" />

                  <span className="finder-card-number">
                    {String(gift.id).padStart(2, "0")}
                  </span>

                  <span className="finder-card-icon">
                    {isCollected ? "✓" : "♡"}
                  </span>

                  {isCollected && (
                    <div className="finder-collected-overlay">
                      <span>✦</span>
                      Collected
                    </div>
                  )}
                </div>

                <div className="finder-card-footer">
                  <span>
                    Gift {String(gift.id).padStart(2, "0")}
                  </span>

                  <span className="finder-card-arrow">
                    {isCollected ? "♥" : "↗"}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {collected.length === gifts.length && (
            <motion.div
              className="finder-finish"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p>Every little piece is yours 💖</p>

              <button
                type="button"
                onClick={onNext}
                className="finder-next-button"
              >
                Your Final Surprise <span>→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <AnimatePresence>
        {selectedGift && (
          <motion.div
            className="finder-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGift}
          >
            <motion.div
              className="finder-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Scratch to reveal your gift"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="finder-close"
                onClick={closeGift}
                aria-label="Close"
              >
                ×
              </button>

              <div className="finder-modal-image">
                <img src={selectedGift.image} alt="" />
              </div>

              <div className="finder-reveal-area">
                <AnimatePresence mode="wait">
                  {!revealed ? (
                    <motion.div
                      key="scratch"
                      className="finder-scratch-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="finder-modal-kicker">
                        YOUR LITTLE SECRET
                      </p>

                      <h2>A surprise awaits ✨</h2>

                      <p className="finder-scratch-hint">
                        Use your finger to scratch
                      </p>

                      <canvas
                        ref={canvasRef}
                        className="finder-scratch-canvas"
                        onPointerDown={(event) => {
                          isScratching.current = true;

                          event.currentTarget.setPointerCapture(
                            event.pointerId
                          );

                          scratch(event);
                        }}
                        onPointerMove={scratch}
                        onPointerUp={() => {
                          isScratching.current = false;
                        }}
                        onPointerCancel={() => {
                          isScratching.current = false;
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="revealed"
                      className="finder-revealed"
                      initial={{ opacity: 0, scale: 0.8, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="finder-reveal-sparkle">
                        ✦
                      </span>

                      <p className="finder-modal-kicker">
                        YOU FOUND IT!
                      </p>

                      <p className="finder-task-title">
                        IT'S YOUR TASK!
                      </p>

                      <div className="finder-letter">
                        <div>{selectedGift.letter}</div>
                        <div>{selectedGift.department}</div>
                      </div>

                      <p className="finder-clue">
                        {selectedGift.task}
                      </p>

                      <div className="finder-clue-letter">
                        {selectedGift.clueLetter}
                      </div>

                      <p className="finder-collect-hint">
                        After collecting your gift, click the
                        button below. ♡
                      </p>

                      <button
                        type="button"
                        className="finder-collect-button"
                        onClick={collectGift}
                      >
                        Collect Gift <span>♡</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default GiftFinder;
