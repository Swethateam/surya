
import { useState } from "react";


function Login({ onNext }) {
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = () => {
    const enteredName = name.trim().toLowerCase();

    if (enteredName === "kannu") {
      setShowError(false);
      onNext();
    } else {
      setShowError(true);
    }
  };

  return (
    <section className="page login-page">
      {/* Floating Hearts Background */}
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            className="floating-heart"
            key={i}
            style={{
              left: `${(i * 37 + 8) % 100}%`,
              animationDelay: `${-((i * 1.7) % 18)}s`,
              animationDuration: `${10 + (i % 6) * 2}s`,
              fontSize: `${14 + (i % 4) * 7}px`,
              "--sway": `${i % 2 === 0 ? 25 : -25}px`,
            }}
          >
            {i % 3 === 0 ? "♥" : "♡"}
          </span>
        ))}
      </div>

      {/* Background Decoration */}
      <div className="login-decoration decoration-one" aria-hidden="true">
        ✦
      </div>

      <div className="login-decoration decoration-two" aria-hidden="true">
        ♡
      </div>

      <div className="login-decoration decoration-three" aria-hidden="true">
        ✧
      </div>

      {/* Main Content */}
      <div className="content login-content">
        <p className="eyebrow">
          A LITTLE SURPRISE
        </p>

        <h1 className="login-heading">
          Just for You <span>♡</span>
        </h1>

        <p className="login-subtitle">
          A little memory, a little love, and something special...
        </p>

        {/* Photo */}
        <div className="photo-container">
          <div className="photo-glow">
            <img
              src="/login.jpeg"
              alt="A special memory"
              className="login-photo"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="login-extra">
          <p className="description">
            ENTER YOUR NAME HOW I CALL YOU?
          </p>

          <input
            type="text"
            placeholder="Enter your name ♡"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="name-input"
            autoComplete="off"
            aria-label="Enter your special name"
          />

          <button
            type="button"
            className="primary-btn"
            onClick={handleLogin}
          >
            Unlock My Surprise <span>♡</span>
          </button>

          <p className="login-hint">
            A tiny secret is waiting for you ✨
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <p className="bottom-text">
        Made with love <span>♥</span>
      </p>

      {/* Wrong Name Popup */}
      {showError && (
        <div
          className="error-overlay"
          onClick={() => setShowError(false)}
        >
          <div
            className="error-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="error-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="error-icon">
              ♡
            </div>

            <p className="popup-eyebrow">
              OOPS... ONE LITTLE MISTAKE
            </p>

            <h2 id="error-title">
              Name Wrong!
            </h2>

            <p>
              Hmm... that's not the name I call you 💔
              <br />
              If you want to know, go and check our chat.
            </p>

            <button
              type="button"
              onClick={() => setShowError(false)}
              className="error-btn"
            >
              Try Again ♡
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
