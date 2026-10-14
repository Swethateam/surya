import { useState } from "react";


function FinalMessage() {
  const [opened, setOpened] = useState(false);

  return (
    <section className="page final-page">
      <div className="final-bg-glow"></div>
      <div className="final-grid"></div>

      {/* Animated particles */}
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="final-particle"
          style={{
            "--i": i,
            "--x": `${(i * 37 + 11) % 100}%`,
            "--delay": `${(i % 7) * -0.8}s`,
            "--duration": `${5 + (i % 5)}s`,
          }}
        >
          {i % 3 === 0 ? "✦" : i % 3 === 1 ? "♡" : "·"}
        </span>
      ))}

      <div className="final-content">
        <div className="final-top-label">
          <span className="label-line"></span>
          <span>A LITTLE SURPRISE</span>
          <span className="label-line"></span>
        </div>

        <div className="final-photo-scene">
          <div className="photo-orbit orbit-outer"></div>
          <div className="photo-orbit orbit-inner"></div>

          <div className="final-photo-frame">
            <div className="photo-shine"></div>
            <img
              src="/whole image.jpeg"
              alt="A special memory"
              className="final-photo-img"
            />
          </div>

          <span className="photo-floating-heart">♡</span>
          <span className="photo-floating-star">✦</span>
          <span className="photo-small-star">✧</span>
        </div>

        <p className="final-caption">
          a little memory, a lot of love
        </p>

        <h1 className="final-title">
          You are
          <br />
          <span className="final-gradient-text">
            truly special
          </span>
          <span className="final-title-heart">♡</span>
        </h1>

        <div className="final-divider">
          <span></span>
          <span className="divider-icon">✦</span>
          <span></span>
        </div>

        <p className="final-message">
          Some people make the world feel
          <br />
          a little softer just by being in it.
          <br /><br />
          No gift could ever be enough to show
          how special you are. I hope this little
          surprise makes you smile and gives
          you one more beautiful memory to keep.
        </p>

        <div className="final-quote">
          <span className="quote-mark">“</span>
          <p>
            You deserve beautiful things,
            <br />
            beautiful moments, and endless smiles.
          </p>
        </div>

        <div className="final-signature">
          <span>With love,</span>
          <strong>Someone who cares about you ♡</strong>
        </div>

        <button
          className={`final-gift-button ${opened ? "is-open" : ""}`}
          onClick={() => setOpened(!opened)}
          aria-label={opened ? "Close final surprise" : "Open final surprise"}
        >
          <span className="gift-aura"></span>
          <span className="final-gift-emoji">
            {opened ? "💖" : "🎁"}
          </span>
          <span className="gift-button-text">
            {opened ? "A little love, just for you" : "One last little surprise"}
          </span>
        </button>

        {opened && (
          <div className="gift-reveal-message">
            <span>♡</span>
            <p>
              No matter how ordinary today feels,
              <br />
              I hope you always remember how special you are.
            </p>
          </div>
        )}

        <p className="final-footer">
          MADE WITH LOVE <span>♥</span>
        </p>
      </div>
    </section>
  );
}

export default FinalMessage;