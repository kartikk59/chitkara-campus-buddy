import { Link } from "react-router-dom";
import Aurora from "./components/Aurora";
import BrandLogo from "./components/BrandLogo";
import "./Landing.css";

const TRUSTED = ["Registrar", "Admissions", "Library", "Housing", "Scholarships", "IT Helpdesk"];

const FEATURES = [
  {
    title: "Instant campus answers",
    copy: "Ask about courses, deadlines, fees, and services and get a clear reply in one place.",
  },
  {
    title: "Guided conversation paths",
    copy: "The assistant keeps context across follow-up questions, the same way a counselor would.",
  },
  {
    title: "Always-on support",
    copy: "Students can get help after hours without waiting in a queue or hunting through PDFs.",
  },
];

const USE_CASES = [
  { label: "Admissions", detail: "Application steps, documents, and intake windows." },
  { label: "Academics", detail: "Course info, exam schedules, and department contacts." },
  { label: "Campus life", detail: "Housing, clubs, events, and student services." },
];

function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <a className="logo" href="#top">
          <BrandLogo />
          Campus Buddy
        </a>
        <nav>
          <a href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#use-cases">Use-Cases</a>
          <a href="#start">Start</a>
        </nav>
        <Link className="nav-cta" to="/chat">
          Ask Campus
        </Link>
      </header>

      <section className="hero" id="top">
        <div className="hero-aurora" aria-hidden="true">
          <Aurora
            colorStops={["#2dd4bf", "#f5c542", "#6366f1"]}
            amplitude={1.15}
            blend={0.55}
            speed={0.85}
          />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">University support agent</p>
          <h1>
            Campus answers that
            <br />
            guide, support &amp; engage
          </h1>
          <p className="lede">
            A dark, focused assistant for students and staff. Ask about courses,
            scholarships, housing, and campus services without leaving the chat.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/chat">
              Get Started
            </Link>
            <a className="btn-ghost" href="#features">
              ▶ See how it works
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="device-card">
            <div className="device-top">
              <span className="dot" />
              <strong>Campus Support Chat</strong>
            </div>
            <div className="device-tabs">
              <span className="active">Conversation</span>
              <span>History</span>
            </div>
            <div className="device-thread">
              <div className="bubble bot">I can help with admissions, exams, and campus services.</div>
              <div className="bubble user">When does the scholarship window close?</div>
              <div className="bubble bot">The current merit scholarship deadline is 30 September.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="trusted" id="about">
        <p>Trusted across campus offices</p>
        <div className="logo-row">
          {TRUSTED.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <p className="eyebrow center">Main features</p>
        <h2>Empower students with intuitive campus support</h2>
        <p className="section-copy">
          No hunting through portals. Ask, follow up, and get the next step.
        </p>
        <div className="feature-grid">
          {FEATURES.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platforms">
        <p className="eyebrow">Integration</p>
        <h2>Connect campus questions in one place</h2>
        <p className="section-copy">
          Built to sit in front of the knowledge students already need from
          academic, housing, and student-life teams.
        </p>
        <div className="platform-row">
          <div className="platform-card">Registrar</div>
          <div className="platform-card">LMS</div>
          <div className="platform-card">Helpdesk</div>
        </div>
      </section>

      <section className="use-cases" id="use-cases">
        <p className="eyebrow center">Use-cases</p>
        <h2>Built for everyday campus questions</h2>
        <div className="use-grid">
          {USE_CASES.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="plans" id="start">
        <p className="eyebrow center">Get started</p>
        <h2>Choose how you want to talk to campus</h2>
        <div className="plan-grid">
          <article className="plan-card">
            <p className="plan-kicker">Students</p>
            <h3>Ask anything</h3>
            <p>Courses, deadlines, scholarships, housing, and campus life.</p>
            <ul>
              <li>Chat history on the left sidebar</li>
              <li>Follow-up questions in the same thread</li>
              <li>Available whenever you need it</li>
            </ul>
            <Link className="btn-ghost wide" to="/chat">
              Open chat
            </Link>
          </article>
          <article className="plan-card featured">
            <p className="plan-kicker">Staff &amp; advisors</p>
            <h3>Guide faster</h3>
            <p>Give students a first-line assistant before they book an office visit.</p>
            <ul>
              <li>Consistent answers from one agent</li>
              <li>Less repetitive inbox traffic</li>
              <li>Students arrive with better context</li>
            </ul>
            <Link className="btn-primary wide" to="/chat">
              Try the assistant
            </Link>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <span>Campus Buddy · University support agent</span>
        <Link to="/chat">Start a conversation</Link>
      </footer>
    </div>
  );
}

export default Landing;
