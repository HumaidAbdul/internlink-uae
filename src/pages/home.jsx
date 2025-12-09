// src/pages/Home.jsx
import React from "react";
import { Link } from 'react-router-dom';

import "./home.css";
import heroImg from "./img/hero.jpg"; // path is relative to Home.jsx

export default function Home() {
  return (
    <div className="home">
      {/* Top Bar */}
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/internships" className="sl-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#2563eb" strokeWidth="1.6" fill="none"/>
            </svg>
            <strong>InternLink UAE</strong>
          </Link>

          <nav className="nav">
            <a href="#roles" className="nav__link">Roles</a>
            <a href="/login" className="btn btn--small btn--ghost">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__left">
            <h1 className="hero__title">
              Connecting Talent with <span className="accent">Opportunity</span>
            </h1>
            <p className="hero__subtitle">
              Empowering Students and Employers across the UAE.
            </p>
            <div className="hero__actions">
              <a href="/register" className="btn">Get Started</a>
            </div>
          </div>

          <div className="hero__right">
            {/* Put your illustration at public/img/hero.png (or change src) */}
            <img
                src={heroImg}
                alt="Student reviewing internship profile"
                className="hero__img"
                />
         </div>
        </div>
      </section>

      {/* Platform For Everyone */}
      <section className="for-all" id="roles">
        <div className="container">
          <h2 className="section__title">Platform For Everyone</h2>
          <div className="cards">
            <article className="card">
              <div className="card__icon" aria-hidden>🎓</div>
              <h3 className="card__title">Students</h3>
              <p className="card__text">
                Find and apply to internships, track progress, and build your future career profile.
              </p>
            </article>

            <article className="card">
              <div className="card__icon" aria-hidden>🏢</div>
              <h3 className="card__title">Employers</h3>
              <p className="card__text">
                Post internship openings and connect with qualified university students in the UAE.
              </p>
            </article>

            <article className="card">
              <div className="card__icon" aria-hidden>🛡️</div>
              <h3 className="card__title">Admins</h3>
              <p className="card__text">
                Manage the platform, validate listings, and ensure quality connections.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container footer__inner">
          <div>© 2025 InternLink UAE</div>
          <a href="mailto:contact@internlink.ae" className="footer__link">
            contact@internlink.ae
          </a>
        </div>
      </footer>
    </div>
  );
} 