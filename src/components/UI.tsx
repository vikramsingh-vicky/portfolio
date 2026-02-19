import { useState, useEffect } from "react";
import { cv } from "../data/cv";
import "./UI.css";

const SECTIONS = ["home", "about", "projects", "experience", "tools", "contact"] as const;

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="contact-linkedin-svg"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || "";

export function UI() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", company: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!FORMSPREE_FORM_ID) {
      setFormStatus("error");
      return;
    }
    setFormStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          _replyto: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", company: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const navLabels: Record<(typeof SECTIONS)[number], string> = {
    home: "Home",
    about: "About",
    experience: "Experience",
    projects: "Projects",
    tools: "Tools",
    contact: "Contact",
  };

  return (
    <>
      <nav className="nav">
        <button
          type="button"
          className="nav-brand"
          onClick={() => scrollTo("home")}
          aria-label="Home"
        >
          VS
        </button>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {SECTIONS.map((id) => (
            <li key={id}>
              <button
                type="button"
                className={activeSection === id ? "active" : ""}
                onClick={() => scrollTo(id)}
              >
                {navLabels[id]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="main">
        {/* Hero */}
        <section id="home" className="hero">
          <div className="hero-overlay" aria-hidden />
          {/* <div className="hero-glow" aria-hidden /> */}
          <div className="hero-inner">
            <div className="hero-content glass">
              <span className="hero-accent" aria-hidden />
              <p className="hero-intro">
                {/* <span className="hero-intro-dot" aria-hidden /> */}
                Automation & Full Stack Developer
              </p>
              <h1 className="hero-name">{cv.name}</h1>
              <p className="hero-tagline">{cv.tagline}</p>
              <div className="hero-cta">
                <button type="button" onClick={() => scrollTo("contact")}>
                  Get in touch
                  <span className="hero-cta-arrow" aria-hidden>→</span>
                </button>
                <a href={cv.linkedIn} target="_blank" rel="noopener noreferrer" className="hero-linkedin-link" aria-label="LinkedIn profile">
                  <LinkedInIcon />
                </a>
              </div>
            </div>
            <aside className="hero-roles glass">
              <div className="hero-roles-block">
                <h3 className="hero-roles-title">Open to roles</h3>
                <div className="hero-roles-wrap">
                  {cv.openToRoles.map((role, i) => (
                    <span key={i} className="hero-role-tag">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-roles-divider" aria-hidden />
              {/* Stats strip - Sawad style */}
              <div className="hero-roles-stats">
                {cv.stats.map((stat, i) => (
                  <div key={i} className="hero-stat">
                    <span className="hero-stat-value">{stat.value}</span>
                    <span className="hero-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
          <div
            className="hero-scroll-cue"
            role="button"
            tabIndex={0}
            onClick={() => scrollTo("about")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollTo("about");
              }
            }}
            aria-label="Scroll to About"
          >
            {/* Tech lines - Sawad style keyword strips */}
            <div className="tech-lines">
              {cv.techLines.map((line, i) => (
                <p key={i} className="tech-line">
                  {line}
                </p>
              ))}
            </div>
            <span>Scroll</span>
            <span className="hero-scroll-line" />
          </div>
        </section>       

        {/* About */}
        <section id="about" className="section">
          <h2 className="section-head">
            <span className="section-head-main">About</span>
          </h2>
          <p className="section-lead">{cv.profile}</p>
        </section>

        {/* Recent Projects - Sawad style */}
        <section id="projects" className="section">
          <h2 className="section-head">
            <span className="section-head-main">Recent</span>
            <span className="section-head-sub">Projects</span>
          </h2>
          <div className="cards">
            {cv.projects.map((proj, i) => (
              <article key={i} className="card glass">
                <h3>{proj.name}</h3>
                <span className="card-role">
                  {proj.role}
                  {"summary" in proj && proj.summary && ` · ${proj.summary}`}
                  {"url" in proj && proj.url && (
                    <>
                      {" · "}
                      <a href={(proj as { url: string }).url} target="_blank" rel="noopener noreferrer" className="card-url">
                        {(proj as { url: string }).url.replace(/^https?:\/\//, "")}
                      </a>
                    </>
                  )}
                </span>
                <ul className="card-points">
                  {proj.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
                {"url" in proj && proj.url && (
                  <a href={(proj as { url: string }).url} target="_blank" rel="noopener noreferrer" className="card-visit">
                    Visit →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Experience - Sawad style "Years of Experience" */}
        <section id="experience" className="section">
          <h2 className="section-head">
            <span className="section-head-main">{cv.stats[0].value} Years of</span>
            <span className="section-head-sub">Experience</span>
          </h2>
          <div className="timeline">
            {cv.experience.map((job, i) => (
              <article key={i} className="timeline-item glass">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <span className="timeline-period">{job.period}</span>
                  <h3>{job.role}</h3>
                  <p className="timeline-company">
                    {job.company}
                    {job.location && ` · ${job.location}`}
                  </p>
                  <ul>
                    {job.points.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tools & Skills - by category with ratings */}
        <section id="tools" className="section">
          <h2 className="section-head">
            <span className="section-head-main">Tools &</span>
            <span className="section-head-sub">Skills</span>
          </h2>
          <div className="skill-categories">
            {cv.skillCategories.map((category, i) => (
              <div key={i} className="skill-category glass">
                <h3 className="skill-category-name">{category.name}</h3>
                <ul className="skill-category-list">
                  {category.items.map((item, j) => (
                    <li key={j} className="skill-with-rating">
                      <span className="skill-with-rating-name">{item.name}</span>
                      <div className="skill-rating" title={`${item.rating}/5`}>
                        <div
                          className="skill-rating-fill"
                          style={{ width: `${(item.rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="skill-rating-label">{item.rating}/5</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Thoughts / Interests - Sawad style */}
        <section className="section thoughts-section">
          <h2 className="section-head">
            <span className="section-head-main">Beyond</span>
            <span className="section-head-sub">Work</span>
          </h2>
          <div className="thoughts-grid">
            {cv.interests.map((interest, i) => (
              <div key={i} className="thought-card glass">
                <span className="thought-title">{interest}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact - Let's Work Together with form + WhatsApp QR */}
        <section id="contact" className="section contact">
          <h2 className="section-head">
            <span className="section-head-main">Let&apos;s Work</span>
            <span className="section-head-sub">Together</span>
          </h2>
          <p className="section-lead">Reach out for automation, full-stack, or MIS projects. I’ll get back to you soon.</p>

          <div className="contact-inner">
            <form className="contact-form glass" onSubmit={handleContactSubmit} noValidate>
              <div className="contact-form-row">
                <label className="contact-label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="contact-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  disabled={formStatus === "sending"}
                />
              </div>
              <div className="contact-form-row">
                <label className="contact-label" htmlFor="contact-company">
                  Company
                </label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  className="contact-input"
                  placeholder="Your organization"
                  value={formData.company}
                  onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                  disabled={formStatus === "sending"}
                />
              </div>
              <div className="contact-form-row">
                <label className="contact-label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="contact-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  disabled={formStatus === "sending"}
                />
              </div>
              <div className="contact-form-row">
                <label className="contact-label" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="contact-input"
                  placeholder="e.g. Project inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  disabled={formStatus === "sending"}
                />
              </div>
              <div className="contact-form-row">
                <label className="contact-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact-input contact-textarea"
                  placeholder="Tell me about your project or question..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  required
                  disabled={formStatus === "sending"}
                />
              </div>
              {formStatus === "success" && (
                <p className="contact-form-message success">Thanks! I’ll reply to your email soon.</p>
              )}
              {formStatus === "error" && (
                <p className="contact-form-message error">
                  {FORMSPREE_FORM_ID
                    ? "Something went wrong. Please try again or reach out via LinkedIn."
                    : "Contact form is not configured. Please reach out via LinkedIn."}
                </p>
              )}
              <button type="submit" className="contact-submit" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>

            <aside className="contact-side">
              <div className="contact-qr-wrap">
                <a
                  href={cv.whatsAppQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-qr-link"
                  aria-label="Chat on WhatsApp"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(cv.whatsAppQrUrl)}`}
                    alt="WhatsApp QR – Scan to chat"
                    className="contact-qr-img"
                    width={320}
                    height={320}
                  />
                </a>
                <p className="contact-qr-label">Scan to chat on WhatsApp</p>
              </div>
              <div className="contact-side-links">
                <a
                  href={cv.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-linkedin-icon"
                  aria-label="LinkedIn profile"
                >
                  <LinkedInIcon />
                  <span className="contact-linkedin-text">&nbsp;LinkedIn</span>
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Vikram Singh · Automation & Full Stack Developer · Built with React & Three.js</p>
      </footer>
    </>
  );
}
