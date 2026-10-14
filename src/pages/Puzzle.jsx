

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const imageSrc = "/whole image.jpeg";
const GRID = 3;
const TOTAL = GRID * GRID;
const VIEW_SIZE = 100;

const SHARD_NAMES = [
  "First Shard",
  "Second Shard",
  "Third Shard",
  "Fourth Shard",
  "Fifth Shard",
  "Sixth Shard",
  "Seventh Shard",
  "Eighth Shard",
  "Ninth Shard",
];

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function edgeSign(axis, row, col) {
  const value = (row * 17 + col * 31 + (axis === "h" ? 7 : 13)) % 2;
  return value === 0 ? 1 : -1;
}

function horizontalEdge(row, col) {
  const xs = [0, 24, 38, 48, 57, 73, 100];

  if (row === 0 || row === GRID) {
    return xs.map((x) => [x, row === 0 ? 0 : 100]);
  }

  const sign = edgeSign("h", row, col);
  const ys = [0, 0, sign * 11, -sign * 8, sign * 12, 0, 0];

  return xs.map((x, i) => [x, ys[i]]);
}

function verticalEdge(row, col) {
  const ys = [0, 24, 39, 49, 60, 76, 100];

  if (col === 0 || col === GRID) {
    return ys.map((y) => [col === 0 ? 0 : 100, y]);
  }

  const sign = edgeSign("v", row, col);
  const xs = [0, 0, sign * 11, -sign * 8, sign * 12, 0, 0];

  return ys.map((y, i) => [xs[i], y]);
}

function getShardPoints(id) {
  const row = Math.floor(id / GRID);
  const col = id % GRID;

  const top = horizontalEdge(row, col).map(([x, y]) => [
    x,
    row === 0 ? 0 : y,
  ]);

  const right = verticalEdge(row, col + 1).map(([x, y]) => [
    col === GRID - 1 ? 100 : 100 + x,
    y,
  ]);

  const bottom = horizontalEdge(row + 1, col)
    .slice()
    .reverse()
    .map(([x, y]) => [
      x,
      row === GRID - 1 ? 100 : 100 + y,
    ]);

  const left = verticalEdge(row, col)
    .slice()
    .reverse()
    .map(([x, y]) => [
      col === 0 ? 0 : x,
      y,
    ]);

  const points = [
    ...top,
    ...right.slice(1),
    ...bottom.slice(1),
    ...left.slice(1),
  ];

  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function ShardArtwork({ id, size, showImage = true }) {
  const row = Math.floor(id / GRID);
  const col = id % GRID;

  const clipId = `shard-${id}-${showImage ? "image" : "slot"}`;

  return (
    <svg
      className="shard-svg"
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      preserveAspectRatio="none"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <polygon points={getShardPoints(id)} />
        </clipPath>
      </defs>

      {showImage ? (
        <image
          href={imageSrc}
          x={-col * VIEW_SIZE}
          y={-row * VIEW_SIZE}
          width={GRID * VIEW_SIZE}
          height={GRID * VIEW_SIZE}
          preserveAspectRatio="none"
          clipPath={`url(#${clipId})`}
        />
      ) : (
        <polygon
          points={getShardPoints(id)}
          fill="rgba(255, 190, 215, 0.035)"
          stroke="rgba(255, 190, 215, 0.38)"
          strokeWidth="0.8"
        />
      )}
    </svg>
  );
}

function Puzzle({ onNext }) {
  const [pieceSize, setPieceSize] = useState(100);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [placed, setPlaced] = useState({});
  const [shuffledPieces, setShuffledPieces] = useState(() =>
    shuffleArray(Array.from({ length: TOTAL }, (_, id) => id))
  );
  const [wrongSlot, setWrongSlot] = useState(null);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width <= 380) {
        setPieceSize(82);
      } else if (width <= 480) {
        setPieceSize(92);
      } else if (width <= 768) {
        setPieceSize(105);
      } else {
        setPieceSize(120);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const pieces = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, id) => ({
        id,
        name: SHARD_NAMES[id],
        row: Math.floor(id / GRID),
        col: id % GRID,
      })),
    []
  );

  const boardSize = pieceSize * GRID;

  // Small pieces fit in one horizontal scrolling tray.
  const trayPieceSize = Math.min(76, Math.max(58, pieceSize * 0.65));

  const placedIds = Object.values(placed);
  const completedCount = placedIds.length;
  const isComplete = completedCount === TOTAL;

  const handlePieceTap = (id) => {
    if (placedIds.includes(id)) return;

    setSelectedPiece((previous) => (previous === id ? null : id));
    setWrongSlot(null);
  };

  const handleSlotTap = (id) => {
    if (selectedPiece === null) return;
    if (placedIds.includes(id)) return;

    if (selectedPiece !== id) {
      setWrongSlot(id);
      window.setTimeout(() => setWrongSlot(null), 400);
      return;
    }

    setPlaced((previous) => ({
      ...previous,
      [id]: id,
    }));

    setSelectedPiece(null);
    setWrongSlot(null);
  };

  const restartPuzzle = () => {
    setPlaced({});
    setSelectedPiece(null);
    setWrongSlot(null);
    setShuffledPieces(
      shuffleArray(Array.from({ length: TOTAL }, (_, id) => id))
    );
  };

  return (
    <section className="page heart-puzzle-page shattered-puzzle-page">
      <div className="puzzle-hearts" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            style={{ "--heart-index": index }}
          >
            {index % 3 === 0 ? "♡" : "♥"}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="puzzle"
            className="puzzle-main"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <header className="puzzle-header">
              <p className="eyebrow">SURPRISE 02</p>

              <h1>
                Shattered Memories <span>✦</span>
              </h1>

              <p className="puzzle-subtitle">
                Rebuild the picture, one shard at a time.
              </p>
            </header>

            <div className="puzzle-progress">
              <div className="progress-text">
                <span>MEMORY PROGRESS</span>
                <strong>{completedCount} / {TOTAL}</strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={TOTAL}
              >
                <motion.div
                  className="progress-fill"
                  animate={{
                    width: `${(completedCount / TOTAL) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="board-frame">
              <div className="board-heading">
                <span>✧</span>
                <span>THE MEMORY BOARD</span>
                <span>✧</span>
              </div>

              <div
                className="shattered-board"
                style={{
                  width: boardSize,
                  height: boardSize,
                }}
              >
                {pieces.map((piece) => {
                  const isPlaced = placed[piece.id] !== undefined;

                  return (
                    <button
                      key={piece.id}
                      type="button"
                      className={[
                        "shard-slot",
                        isPlaced ? "filled" : "",
                        wrongSlot === piece.id ? "wrong-slot" : "",
                      ].join(" ")}
                      style={{
                        left: piece.col * pieceSize,
                        top: piece.row * pieceSize,
                        width: pieceSize,
                        height: pieceSize,
                      }}
                      onClick={() => handleSlotTap(piece.id)}
                      aria-label={
                        isPlaced
                          ? `${piece.name}, placed`
                          : "Empty puzzle space"
                      }
                    >
                      {isPlaced ? (
                        <ShardArtwork
                          id={piece.id}
                          size={pieceSize}
                        />
                      ) : (
                        <ShardArtwork
                          id={piece.id}
                          size={pieceSize}
                          showImage={false}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="board-caption">
                A little memory, piece by piece
              </p>
            </div>

            <div className="puzzle-instruction">
              <span className="instruction-icon">♡</span>
              <p>
                Select a piece below, then tap its matching place.
              </p>
            </div>

            <section className="pieces-section">
              <div className="pieces-heading">
                <h2>Missing pieces</h2>
                <span>{TOTAL - completedCount} remaining</span>
              </div>

              <div className="pieces-container">
                {shuffledPieces.map((id) => {
                  if (placedIds.includes(id)) return null;

                  const isSelected = selectedPiece === id;

                  return (
                    <motion.button
                      key={id}
                      type="button"
                      className={[
                        "loose-piece",
                        isSelected ? "selected-piece" : "",
                      ].join(" ")}
                      style={{
                        width: trayPieceSize,
                        height: trayPieceSize,
                      }}
                      title={SHARD_NAMES[id]}
                      aria-label={`Select ${SHARD_NAMES[id]}`}
                      aria-pressed={isSelected}
                      onClick={() => handlePieceTap(id)}
                      layout
                      whileTap={{ scale: 0.92 }}
                      animate={
                        isSelected
                          ? { y: -5, scale: 1.04 }
                          : { y: 0, scale: 1 }
                      }
                    >
                      <ShardArtwork
                        id={id}
                        size={trayPieceSize}
                      />
                    </motion.button>
                  );
                })}
              </div>

              <p className="tray-hint">
                <span>←</span> Swipe to explore all pieces <span>→</span>
              </p>
            </section>

            <AnimatePresence mode="wait">
              {selectedPiece !== null && (
                <motion.p
                  key={selectedPiece}
                  className="selected-message"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✨ {SHARD_NAMES[selectedPiece]} selected.
                  <br />
                  Find its matching place on the board.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="button"
              className="puzzle-restart-btn"
              onClick={restartPuzzle}
            >
              <span>↻</span> Restart Puzzle
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            className="puzzle-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="heart-photo"
              initial={{ scale: 0.65, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img src={imageSrc} alt="Our special memory" />
            </motion.div>

            <p className="completed-label">YOU DID IT ✨</p>

            <h2>
              Every piece
              <br />
              found its place
            </h2>

            <p className="complete-text">
              Nine shards, one beautiful memory.
              <br />
              Some memories are worth rebuilding.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={onNext}
            >
              Next Surprise <span>→</span>
            </button>

            <button
              type="button"
              className="puzzle-restart-btn"
              onClick={restartPuzzle}
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Puzzle;
