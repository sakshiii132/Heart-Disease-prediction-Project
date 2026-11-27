import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const API_URL = "http://127.0.0.1:8000/predict";

const INITIAL_FORM = {
  Age: "",
  Sex: "",
  ChestPainType: "",
  RestingBP: "",
  Cholesterol: "",
  FastingBS: "",
  RestingECG: "",
  MaxHR: "",
  ExerciseAngina: "",
  Oldpeak: "",
  ST_Slope: "",
};

// Optional helper so you can quickly try the form (this is only input data;
// the prediction itself always comes from your real API).
const SAMPLE_INPUT = {
  Age: "54",
  Sex: "M",
  ChestPainType: "ASY",
  RestingBP: "140",
  Cholesterol: "239",
  FastingBS: "0",
  RestingECG: "Normal",
  MaxHR: "160",
  ExerciseAngina: "N",
  Oldpeak: "1.2",
  ST_Slope: "Flat",
};

const NUMBER_RULES = {
  Age: { label: "Age", min: 1, max: 100, step: 1, integer: true },
  RestingBP: { label: "Resting BP", min: 0, max: 300, step: 1, integer: true },
  Cholesterol: { label: "Cholesterol", min: 0, max: 700, step: 1, integer: true },
  MaxHR: { label: "Max heart rate", min: 30, max: 250, step: 1, integer: true },
  Oldpeak: { label: "Oldpeak", min: -5, max: 10, step: 0.1, integer: false },
};

const CHEST_PAIN_OPTIONS = [
  { value: "ATA", label: "ATA — Atypical Angina" },
  { value: "NAP", label: "NAP — Non-Anginal Pain" },
  { value: "TA", label: "TA — Typical Angina" },
  { value: "ASY", label: "ASY — Asymptomatic" },
];

const RESTING_ECG_OPTIONS = [
  { value: "Normal", label: "Normal" },
  { value: "ST", label: "ST — ST-T wave abnormality" },
  { value: "LVH", label: "LVH — Left ventricular hypertrophy" },
];

const ST_SLOPE_OPTIONS = [
  { value: "Up", label: "Up — Upsloping" },
  { value: "Flat", label: "Flat" },
  { value: "Down", label: "Down — Downsloping" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function validateForm(form) {
  const errors = {};

  Object.keys(NUMBER_RULES).forEach((key) => {
    const rule = NUMBER_RULES[key];
    const raw = form[key];
    if (raw === "" || raw === null) {
      errors[key] = "This field is required.";
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) {
      errors[key] = "Enter a valid number.";
    } else if (rule.integer && !Number.isInteger(num)) {
      errors[key] = "Enter a whole number.";
    } else if (num < rule.min || num > rule.max) {
      errors[key] = `Enter a value between ${rule.min} and ${rule.max}.`;
    }
  });

  ["Sex", "ChestPainType", "FastingBS", "RestingECG", "ExerciseAngina", "ST_Slope"].forEach(
    (key) => {
      if (form[key] === "") errors[key] = "Please select an option.";
    }
  );

  return errors;
}

// Builds the exact JSON structure the backend expects (11 fields).
function buildPayload(form) {
  return {
    Age: Number(form.Age),
    Sex: form.Sex,
    ChestPainType: form.ChestPainType,
    RestingBP: Number(form.RestingBP),
    Cholesterol: Number(form.Cholesterol),
    FastingBS: Number(form.FastingBS),
    RestingECG: form.RestingECG,
    MaxHR: Number(form.MaxHR),
    ExerciseAngina: form.ExerciseAngina,
    Oldpeak: Number(form.Oldpeak),
    ST_Slope: form.ST_Slope,
  };
}

// Backend already returns the probability as a percentage (0-100).
function toPercent(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
}
async function extractErrorMessage(response) {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((d) => `${(d.loc || []).slice(1).join(".") || "field"}: ${d.msg}`)
        .join(" • ");
    }
    if (data.message) return data.message;
  } catch (e) {
    /* ignore JSON parse errors */
  }
  return `The server responded with status ${response.status}.`;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, no extra dependencies)                          */
/* ------------------------------------------------------------------ */

const ICON_PATHS = {
  heart: [
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  ],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  alert: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"],
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],
  close: ["M18 6L6 18", "M6 6l12 12"],
  zap: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  clipboard: [
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
    "M9 2h6v4H9z",
  ],
  droplet: ["M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"],
  lock: [
    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z",
    "M7 11V7a5 5 0 0 1 10 0v4",
  ],
  arrow: ["M5 12h14", "M12 5l7 7-7 7"],
  refresh: [
    "M23 4v6h-6",
    "M1 20v-6h6",
    "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  ],
  layers: ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(ICON_PATHS[name] || []).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable form components                                           */
/* ------------------------------------------------------------------ */

function Field({ label, hint, error, htmlFor, children }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="field__error">{error}</p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

function NumberField({ name, label, unit, placeholder, hint, value, error, onChange }) {
  const rule = NUMBER_RULES[name];
  return (
    <Field label={label} hint={hint} error={error} htmlFor={name}>
      <div className="input-wrap">
        <input
          id={name}
          name={name}
          type="number"
          inputMode="decimal"
          step={rule.step}
          min={rule.min}
          max={rule.max}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {unit && <span className="input-wrap__unit">{unit}</span>}
      </div>
    </Field>
  );
}

function SelectField({ name, label, hint, options, value, error, onChange }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={name}>
      <div className="input-wrap input-wrap--select">
        <select id={name} name={name} value={value} onChange={onChange}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

function SegmentedField({ name, label, hint, options, value, error, onSelect }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={name}>
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            type="button"
            key={o.value}
            role="radio"
            aria-checked={value === o.value}
            className={`segmented__btn ${value === o.value ? "is-active" : ""}`}
            onClick={() => onSelect(name, o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

function FormSection({ icon, title, subtitle, children }) {
  return (
    <fieldset className="form-section">
      <legend className="form-section__legend">
        <span className="form-section__icon">
          <Icon name={icon} size={18} />
        </span>
        <span>
          <span className="form-section__title">{title}</span>
          <span className="form-section__subtitle">{subtitle}</span>
        </span>
      </legend>
      <div className="form-section__grid">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout components                                                  */
/* ------------------------------------------------------------------ */

function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "prediction", label: "Prediction" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#dashboard" className="brand">
          <span className="brand__mark">
            <Icon name="heart" size={20} />
          </span>
          <span className="brand__name">
            HeartCare <span>AI</span>
          </span>
        </a>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
    </header>
  );
}

function HeartVisual() {
  return (
    <div className="heart-visual" aria-hidden="true">
      <div className="heart-visual__ring heart-visual__ring--1" />
      <div className="heart-visual__ring heart-visual__ring--2" />
      <div className="heart-visual__ring heart-visual__ring--3" />

      <svg className="heart-visual__svg" viewBox="0 0 240 220">
        <defs>
          <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <g className="heart-visual__heart">
          <path
            d="M120 200 C 30 140, 10 80, 55 45 C 85 22, 112 40, 120 62 C 128 40, 155 22, 185 45 C 230 80, 210 140, 120 200 Z"
            fill="url(#heartGrad)"
            opacity="0.95"
          />
        </g>
        <polyline
          className="heart-visual__ecg"
          points="10,110 70,110 88,110 102,70 120,150 136,95 148,110 230,110"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="chip chip--1">
        <Icon name="zap" size={14} /> AI Powered
      </div>
      <div className="chip chip--2">
        <Icon name="activity" size={14} /> Real-time analysis
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="dashboard" className="hero">
      <div className="hero__glow" />
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">
            <span className="badge__dot" />
            AI-powered clinical decision support
          </span>
          <h1>
            Heart Disease <span className="gradient-text">Risk Assessment</span>
          </h1>
          <p className="hero__lead">
            Enter a patient&apos;s clinical measurements and receive an instant,
            machine-learning-based estimate of heart disease risk, powered by a
            trained Random Forest model.
          </p>
          <div className="hero__actions">
            <a href="#prediction" className="btn btn--primary">
              Start assessment <Icon name="arrow" size={18} />
            </a>
            <a href="#about" className="btn btn--ghost">
              Learn more
            </a>
          </div>

          <div className="hero__stats">
            <div>
              <strong>11</strong>
              <span>Clinical inputs</span>
            </div>
            <div>
              <strong>RF</strong>
              <span>Random Forest model</span>
            </div>
            <div>
              <strong>Instant</strong>
              <span>Risk estimate</span>
            </div>
          </div>
        </div>

        <HeartVisual />
      </div>
    </section>
  );
}

function FeatureStrip() {
  const items = [
    {
      icon: "clipboard",
      title: "Structured intake",
      text: "A guided form organised into patient profile, vitals and cardiac tests.",
    },
    {
      icon: "layers",
      title: "Trained ML model",
      text: "Predictions come from your Random Forest model through the FastAPI backend.",
    },
    {
      icon: "shield",
      title: "Clear results",
      text: "A prediction and heart disease probability, presented at a glance.",
    },
  ];
  return (
    <div className="container feature-strip">
      {items.map((item) => (
        <div className="feature-card" key={item.title}>
          <span className="feature-card__icon">
            <Icon name={item.icon} size={22} />
          </span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Result panel                                                       */
/* ------------------------------------------------------------------ */

function ResultPanel({ loading, error, result, onReset }) {
  if (loading) {
    return (
      <div className="result-card result-card--loading" aria-live="polite">
        <div className="pulse-heart">
          <Icon name="heart" size={34} />
        </div>
        <h3>Analysing patient data…</h3>
        <p>The model is evaluating the clinical features.</p>
        <div className="skeleton skeleton--lg" />
        <div className="skeleton" />
        <div className="skeleton skeleton--sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-card result-card--error" role="alert">
        <span className="result-card__badge result-card__badge--error">
          <Icon name="alert" size={16} /> Request failed
        </span>
        <h3>We couldn&apos;t get a prediction</h3>
        <p className="result-card__error-text">{error}</p>
        <ul className="tips">
          <li>Make sure the FastAPI server is running on port 8000.</li>
          <li>Check that all fields contain valid values.</li>
        </ul>
      </div>
    );
  }

  if (result) {
    const positive = Number(result.prediction) === 1;
    const pct = toPercent(result.heart_disease_probability);
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div
        className={`result-card result-card--${positive ? "positive" : "negative"}`}
        aria-live="polite"
      >
        <span className={`result-card__badge ${positive ? "is-risk" : "is-safe"}`}>
          <Icon name={positive ? "alert" : "check"} size={16} />
          {positive ? "Elevated risk detected" : "Low risk indicated"}
        </span>

        <h3 className="result-card__title">{result.result}</h3>

        <div className="gauge">
          <svg viewBox="0 0 140 140" className="gauge__svg">
            <circle className="gauge__track" cx="70" cy="70" r={radius} />
            <circle
              className="gauge__value"
              cx="70"
              cy="70"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="gauge__label">
            <strong>{pct.toFixed(1)}%</strong>
            <span>Heart disease probability</span>
          </div>
        </div>

        <div className="meter">
          <div className="meter__bar">
            <div className="meter__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="meter__scale">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <p className="result-card__note">
          {positive
            ? "The model suggests this profile is associated with heart disease. Please consult a qualified cardiologist for evaluation."
            : "The model suggests this profile is less likely to be associated with heart disease. Continue regular check-ups and a healthy lifestyle."}
        </p>

        <button type="button" className="btn btn--outline btn--block" onClick={onReset}>
          <Icon name="refresh" size={16} /> New assessment
        </button>
      </div>
    );
  }

  return (
    <div className="result-card result-card--empty">
      <div className="empty-art">
        <Icon name="heart" size={38} />
      </div>
      <h3>Awaiting patient data</h3>
      <p>
        Complete the form and press <strong>Predict Heart Disease</strong>. Your
        result and probability will appear here.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const resultRef = useRef(null);

  // Highlight nav link of the section currently in view
  useEffect(() => {
    const ids = ["dashboard", "prediction", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const clearError = (name) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setResult(null);
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      const first = document.querySelector(".field--error");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setApiError("");
    setResult(null);

    if (window.innerWidth < 1024 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });

      if (!response.ok) {
        throw new Error(await extractErrorMessage(response));
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof TypeError) {
        setApiError(
          "Unable to reach the prediction server at http://127.0.0.1:8000. Please make sure the backend is running."
        );
      } else {
        setApiError(err.message || "Something went wrong while contacting the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const common = (name) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: handleChange,
  });

  return (
    <div className="app">
      <Navbar active={activeSection} />
      <Hero />
      <FeatureStrip />

      {/* ------------------------- Prediction ------------------------- */}
      <section id="prediction" className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Prediction</span>
            <h2>Patient information</h2>
            <p>
              Fill in all 11 clinical fields below. Every value is sent securely to
              your local prediction API.
            </p>
          </div>

          <div className="prediction-layout">
            <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
              <div className="form-panel__top">
                <div>
                  <h3>Clinical assessment form</h3>
                  <p>All fields are required.</p>
                </div>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setForm(SAMPLE_INPUT);
                    setErrors({});
                  }}
                >
                  Fill sample values
                </button>
              </div>

              <FormSection
                icon="user"
                title="Patient profile"
                subtitle="Basic demographic details"
              >
                <NumberField
                  {...common("Age")}
                  label="Age"
                  unit="years"
                  placeholder="e.g. 54"
                  hint="Patient age in years"
                />
                <SegmentedField
                  name="Sex"
                  label="Sex"
                  hint="Biological sex"
                  value={form.Sex}
                  error={errors.Sex}
                  onSelect={handleSelect}
                  options={[
                    { value: "M", label: "Male (M)" },
                    { value: "F", label: "Female (F)" },
                  ]}
                />
              </FormSection>

              <FormSection
                icon="droplet"
                title="Vitals & blood work"
                subtitle="Resting measurements and lab values"
              >
                <NumberField
                  {...common("RestingBP")}
                  label="RestingBP"
                  unit="mm Hg"
                  placeholder="e.g. 130"
                  hint="Resting blood pressure"
                />
                <NumberField
                  {...common("Cholesterol")}
                  label="Cholesterol"
                  unit="mg/dl"
                  placeholder="e.g. 240"
                  hint="Serum cholesterol"
                />
                <SegmentedField
                  name="FastingBS"
                  label="FastingBS"
                  hint="Fasting blood sugar > 120 mg/dl?"
                  value={form.FastingBS}
                  error={errors.FastingBS}
                  onSelect={handleSelect}
                  options={[
                    { value: "0", label: "0 — No" },
                    { value: "1", label: "1 — Yes" },
                  ]}
                />
                <NumberField
                  {...common("MaxHR")}
                  label="MaxHR"
                  unit="bpm"
                  placeholder="e.g. 150"
                  hint="Maximum heart rate achieved"
                />
              </FormSection>

              <FormSection
                icon="activity"
                title="Cardiac tests & symptoms"
                subtitle="ECG, exercise response and chest pain"
              >
                <SelectField
                  {...common("ChestPainType")}
                  label="ChestPainType"
                  hint="Type of chest pain experienced"
                  options={CHEST_PAIN_OPTIONS}
                />
                <SelectField
                  {...common("RestingECG")}
                  label="RestingECG"
                  hint="Resting electrocardiogram result"
                  options={RESTING_ECG_OPTIONS}
                />
                <SegmentedField
                  name="ExerciseAngina"
                  label="ExerciseAngina"
                  hint="Exercise-induced angina?"
                  value={form.ExerciseAngina}
                  error={errors.ExerciseAngina}
                  onSelect={handleSelect}
                  options={[
                    { value: "Y", label: "Yes (Y)" },
                    { value: "N", label: "No (N)" },
                  ]}
                />
                <NumberField
                  {...common("Oldpeak")}
                  label="Oldpeak"
                  placeholder="e.g. 1.2"
                  hint="ST depression induced by exercise (decimal)"
                />
                <SelectField
                  {...common("ST_Slope")}
                  label="ST_Slope"
                  hint="Slope of the peak exercise ST segment"
                  options={ST_SLOPE_OPTIONS}
                />
              </FormSection>

              <div className="form-actions">
                <button type="submit" className="btn btn--predict" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" /> Analysing…
                    </>
                  ) : (
                    <>
                      <Icon name="heart" size={20} /> Predict Heart Disease
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
              <p className="privacy-note">
                <Icon name="lock" size={14} /> Data is sent only to your local API at 127.0.0.1.
              </p>
            </form>

            <aside className="result-col" ref={resultRef}>
              <ResultPanel
                loading={loading}
                error={apiError}
                result={result}
                onReset={handleReset}
              />
            </aside>
          </div>
        </div>
      </section>

      {/* --------------------------- About --------------------------- */}
      <section id="about" className="section section--alt">
        <div className="container about">
          <div className="about__text">
            <span className="eyebrow">About</span>
            <h2>Built for clear, fast clinical insight</h2>
            <p>
              HeartCare AI uses a Random Forest machine-learning model trained on
              clinical heart disease data. A React interface collects eleven
              patient attributes and sends them to a FastAPI service, which returns
              a prediction and the probability of heart disease.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={18} /> Eleven standard clinical features
              </li>
              <li>
                <Icon name="check" size={18} /> Random Forest classification
              </li>
              <li>
                <Icon name="check" size={18} /> Probability-based risk output
              </li>
            </ul>
          </div>

          <div className="about__note">
            <span className="about__note-icon">
              <Icon name="shield" size={24} />
            </span>
            <h3>Medical disclaimer</h3>
            <p>
              This tool is for educational and decision-support purposes only. It
              is not a medical diagnosis and does not replace professional medical
              advice. Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <span className="brand brand--footer">
            <span className="brand__mark">
              <Icon name="heart" size={16} />
            </span>
            HeartCare AI
          </span>
          <span>© {new Date().getFullYear()} HeartCare AI. For informational use only.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;