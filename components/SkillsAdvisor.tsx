"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* ============================================================
   OPPORTUNITIES
   Resume PDF + hobbies in. Out: certifications with the steps and
   courses to earn them, hobby income with a launch plan, and one
   search that opens every major job and freelance site.
   Analysis happens in /api/opportunities.
   ============================================================ */

type Range = { low: number; high: number } | null;

interface Cert {
  name: string; issuer: string; issuerDomain: string | null; fitReason: string; pay: Range;
  rolesOpened: string[]; cost: string; studyTime: string; difficulty: string; prerequisites: string;
  courseSearch: string; steps: string[]; lookupUrl: string; jobsUrl: string;
}
interface Freelance { title: string; how: string; rate: string; searchTerm: string; plan: string[] }
interface CareerData {
  currencySymbol: string;
  profile: { headline: string; role: string; jobTitles: string[]; pay: Range; payBasis: string };
  certifications: Cert[];
  freelance: Freelance[];
}
interface HobbyIdea {
  title: string; howItWorks: string; hourly: Range; earningBasis: string; startupCost: string;
  timeToFirstIncome: string; effort: string; plan: { phase: string; steps: string[] }[];
  findCustomers: string[]; checkFirst: string;
}
interface HobbyGroup { hobby: string; ideas: HobbyIdea[]; note: string }
interface HobbyData { currencySymbol: string; hobbies: HobbyGroup[] }
interface Load<T> { status: "idle" | "loading" | "done" | "error"; data?: T; error?: string }
type Tab = "certs" | "hobby" | "work";

const MAX_PDF_BYTES = 3 * 1024 * 1024;
const MAX_HOBBIES = 6;
const STORAGE_KEY = "wisecard.opportunities.v3";
const HOBBY_CHOICES = ["Cooking", "Baking", "Guitar", "Singing", "Dancing", "Carpentry", "Photography", "Fitness", "Painting", "Sewing", "Gardening", "Writing"];

/* ---------- Sites: one search term opens all of them ---------- */

const enc = encodeURIComponent;
type Site = { name: string; note: string; url: (q: string, l: string) => string };

const JOB_SITES: Site[] = [
  { name: "LinkedIn", note: "Largest network", url: (q, l) => `https://www.linkedin.com/jobs/search/?keywords=${enc(q)}&location=${enc(l)}` },
  { name: "Indeed", note: "Most listings", url: (q, l) => `https://www.indeed.com/jobs?q=${enc(q)}&l=${enc(l)}` },
  { name: "Google Jobs", note: "Searches every board", url: (q, l) => `https://www.google.com/search?q=${enc(`${q} jobs ${l}`.trim())}&ibp=htl;jobs` },
  { name: "Glassdoor", note: "Pay and reviews", url: (q) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${enc(q)}` },
  { name: "ZipRecruiter", note: "One-tap apply", url: (q, l) => `https://www.ziprecruiter.com/jobs-search?search=${enc(q)}&location=${enc(l)}` },
  { name: "SimplyHired", note: "Local roles", url: (q, l) => `https://www.simplyhired.com/search?q=${enc(q)}&l=${enc(l)}` },
  { name: "Dice", note: "Tech roles", url: (q, l) => `https://www.dice.com/jobs?q=${enc(q)}&location=${enc(l)}` },
  { name: "We Work Remotely", note: "Remote only", url: (q) => `https://weworkremotely.com/remote-jobs/search?term=${enc(q)}` },
];

const FREELANCE_SITES: Site[] = [
  { name: "Upwork", note: "Hourly and project work", url: (q) => `https://www.upwork.com/nx/search/jobs/?q=${enc(q)}` },
  { name: "Fiverr", note: "Sell fixed-price gigs", url: (q) => `https://www.fiverr.com/search/gigs?query=${enc(q)}` },
  { name: "Freelancer", note: "Bid on projects", url: (q) => `https://www.freelancer.com/jobs/?keyword=${enc(q)}` },
  { name: "PeoplePerHour", note: "Short projects", url: (q) => `https://www.peopleperhour.com/freelance-jobs?q=${enc(q)}` },
  { name: "Guru", note: "Long-term clients", url: (q) => `https://www.guru.com/d/jobs/q/${enc(q.toLowerCase())}/` },
];

function courseLinks(c: Cert) {
  const q = enc(c.courseSearch || c.name);
  return [
    { name: c.issuerDomain || "Official requirements", url: c.lookupUrl },
    { name: "Coursera", url: `https://www.coursera.org/search?query=${q}` },
    { name: "Udemy", url: `https://www.udemy.com/courses/search/?q=${q}` },
    { name: "LinkedIn Learning", url: `https://www.linkedin.com/learning/search?keywords=${q}` },
    { name: "edX", url: `https://www.edx.org/search?q=${q}` },
    { name: "YouTube (free)", url: `https://www.youtube.com/results?search_query=${enc(`${c.courseSearch || c.name} full course`)}` },
  ];
}

/* ---------- Formatting ---------- */

function fmtMoney(n: number, symbol: string, compact = false): string {
  const locale = symbol === "₹" ? "en-IN" : "en-US";
  const opts: Intl.NumberFormatOptions =
    compact && n >= 10000 ? { notation: "compact", maximumFractionDigits: 1 } : n < 100 && n % 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 };
  return symbol + new Intl.NumberFormat(locale, opts).format(n);
}
function fmtRange(r: { low: number; high: number }, symbol: string, compact = false): string {
  return r.low === r.high ? fmtMoney(r.low, symbol, compact) : `${fmtMoney(r.low, symbol, compact)}–${fmtMoney(r.high, symbol, compact)}`;
}
const fmtBytes = (n: number) => (n < 1048576 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1048576).toFixed(1)} MB`);
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const mid = (r: { low: number; high: number }) => (r.low + r.high) / 2;
const tidy = (n: number) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 10) * 10);

/* Monthly take-home at a given number of hours a week (4.33 weeks in a month). */
function monthlyAt(hourly: Range, hours: number): Range {
  if (!hourly) return null;
  return { low: tidy(hourly.low * hours * 4.33), high: tidy(hourly.high * hours * 4.33) };
}
function monthsToGoal(amount: number, m: { low: number; high: number }): string {
  const fast = Math.max(1, Math.ceil(amount / Math.max(m.high, 1)));
  const slow = Math.max(1, Math.ceil(amount / Math.max(m.low, 1)));
  if (fast > 24) return "over two years";
  if (slow > 24) return `${fast}+ months`;
  return fast === slow ? `${fast} ${fast === 1 ? "month" : "months"}` : `${fast}–${slow} months`;
}

/* ---------- File and network ---------- */

async function checkPdf(file: File): Promise<string | null> {
  const name = file.name.toLowerCase();
  if (/\.(docx?|pages|rtf|odt)$/.test(name)) return "That's a Word-type file. Export it as a PDF and upload that.";
  if (/\.(png|jpe?g|heic|webp)$/.test(name)) return "That's an image. Upload the PDF of your resume.";
  if (file.type !== "application/pdf" && !name.endsWith(".pdf")) return "Only PDF files can be read.";
  if (file.size > MAX_PDF_BYTES) return `That PDF is ${fmtBytes(file.size)}. The limit is 3 MB.`;
  if (file.size < 200) return "That PDF is empty.";
  try {
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...Array.from(head)) !== "%PDF-") return "That file isn't a real PDF. Export your resume as a PDF again.";
  } catch {
    return "We couldn't open that file. Choose it again.";
  }
  return null;
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function postJson<T>(payload: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch("/api/opportunities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch {
    throw new Error("We couldn't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 413) throw new Error("That PDF is too large to send. Export a copy under 3 MB.");
    throw new Error(data?.error || "Something went wrong. Try again.");
  }
  return data as T;
}

/* ---------- Icons ---------- */

function Ico({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const I = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  out: "M8 7h9v9M17 7L7 17",
  plus: "M12 5v14M5 12h14",
  alert: "M12 8v5m0 3.5v.01M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z",
};

/* ============================================================
   PAGE
   ============================================================ */

export default function SkillsAdvisor() {
  const [view, setView] = useState<"intake" | "results">("intake");

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [location, setLocation] = useState("");

  const [career, setCareer] = useState<Load<CareerData>>({ status: "idle" });
  const [hobby, setHobby] = useState<Load<HobbyData>>({ status: "idle" });
  const [tab, setTab] = useState<Tab>("certs");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [hours, setHours] = useState(8);
  const [goal, setGoal] = useState("");
  const [query, setQuery] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  /* Restore the last analysis and its ticked steps. The resume file itself is never saved. */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || (!saved.career && !saved.hobby)) return;
      if (saved.career) setCareer({ status: "done", data: saved.career });
      if (saved.hobby) setHobby({ status: "done", data: saved.hobby });
      setChecks(saved.checks || {});
      setHours(saved.hours || 8);
      setGoal(saved.goal || "");
      setLocation(saved.location || "");
      setQuery(saved.query || "");
      setTab(saved.career ? "certs" : "hobby");
      setView("results");
    } catch {
      /* nothing saved */
    }
  }, []);

  useEffect(() => {
    if (view !== "results" || career.status === "loading" || hobby.status === "loading") return;
    if (career.status !== "done" && hobby.status !== "done") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        career: career.status === "done" ? career.data : null,
        hobby: hobby.status === "done" ? hobby.data : null,
        checks, hours, goal, location, query,
      }));
    } catch {
      /* storage unavailable */
    }
  }, [view, career, hobby, checks, hours, goal, location, query]);

  /* Start the job search on the first suggested title. */
  useEffect(() => {
    if (!query && career.data) setQuery(career.data.profile.jobTitles[0] || career.data.profile.role || "");
  }, [career.data]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Intake ---------- */

  const acceptFile = async (f: File | undefined | null) => {
    if (!f) return;
    const problem = await checkPdf(f);
    setFile(problem ? null : f);
    setFileError(problem || "");
    if (fileInput.current) fileInput.current.value = "";
  };

  const toggleHobby = (h: string) => {
    const key = h.trim().toLowerCase();
    if (!key) return;
    setHobbies((cur) =>
      cur.some((x) => x.toLowerCase() === key) ? cur.filter((x) => x.toLowerCase() !== key) : cur.length >= MAX_HOBBIES ? cur : [...cur, h.trim()]
    );
  };

  const addCustomHobby = () => {
    const parts = hobbyInput.split(",").map((s) => s.trim().slice(0, 40)).filter(Boolean);
    if (!parts.length) return;
    setHobbies((cur) => {
      const next = [...cur];
      for (const p of parts) {
        if (next.length >= MAX_HOBBIES) break;
        if (!next.some((x) => x.toLowerCase() === p.toLowerCase())) next.push(titleCase(p));
      }
      return next;
    });
    setHobbyInput("");
  };

  /* ---------- Analysis ---------- */

  const runCareer = async (f: File, id: number) => {
    setCareer({ status: "loading" });
    try {
      const data = await postJson<CareerData>({ kind: "career", resumePdf: await toBase64(f), location });
      if (runId.current === id) setCareer({ status: "done", data });
    } catch (e: any) {
      if (runId.current === id) setCareer({ status: "error", error: e?.message });
    }
  };

  const runHobbies = async (list: string[], id: number) => {
    setHobby({ status: "loading" });
    try {
      const data = await postJson<HobbyData>({ kind: "hobbies", hobbies: list, location });
      if (runId.current === id) setHobby({ status: "done", data });
    } catch (e: any) {
      if (runId.current === id) setHobby({ status: "error", error: e?.message });
    }
  };

  const canRun = !!file || hobbies.length > 0;

  const start = () => {
    if (!canRun) return;
    const id = ++runId.current;
    setCareer({ status: "idle" });
    setHobby({ status: "idle" });
    setOpen({});
    setChecks({});
    setQuery("");
    setTab(file ? "certs" : "hobby");
    setView("results");
    window.scrollTo({ top: 0 });
    if (file) runCareer(file, id);
    if (hobbies.length) runHobbies(hobbies, id);
  };

  const startOver = () => {
    runId.current++;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    setCareer({ status: "idle" });
    setHobby({ status: "idle" });
    setView("intake");
    window.scrollTo({ top: 0 });
  };

  const isOpen = (id: string, fallback = false) => open[id] ?? fallback;
  const toggleOpen = (id: string, fallback = false) => setOpen((o) => ({ ...o, [id]: !(o[id] ?? fallback) }));
  const toggleCheck = (id: string) => setChecks((c) => ({ ...c, [id]: !c[id] }));
  const doneCount = (prefix: string, total: number) => Array.from({ length: total }, (_, i) => checks[`${prefix}:${i}`]).filter(Boolean).length;

  /* ---------- Headline figures (also the section switcher) ---------- */

  const sym = career.data?.currencySymbol || hobby.data?.currencySymbol || "$";
  const figures = useMemo(() => {
    const c = career.data;
    const now = c?.profile.pay || null;
    const lift = c && now ? Math.max(0, ...c.certifications.map((x) => (x.pay ? mid(x.pay) - mid(now) : 0))) : 0;
    const ideas = hobby.data ? hobby.data.hobbies.flatMap((g) => g.ideas) : [];
    const best = Math.max(0, ...ideas.map((i) => monthlyAt(i.hourly, hours)?.high || 0));
    return { lift, certCount: c?.certifications.length || 0, best, ideaCount: ideas.length };
  }, [career.data, hobby.data, hours]);

  /* ============================================================
     INTAKE VIEW
     ============================================================ */

  if (view === "intake") {
    const custom = hobbies.filter((h) => !HOBBY_CHOICES.some((s) => s.toLowerCase() === h.toLowerCase()));
    const full = hobbies.length >= MAX_HOBBIES;

    return (
      <div className="screen desktop-content screen-enter">
        <style>{CSS}</style>
        <div className="px opp opp-intake">
          <header>
            <h1 className="opp-h1">Opportunities</h1>
            <p className="opp-lede">Your resume and your hobbies, turned into ways to earn more.</p>
          </header>

          <div className="opp-form">
            <section>
              <h2 className="opp-label">Resume</h2>
              <input
                ref={fileInput}
                className="opp-vh"
                type="file"
                accept="application/pdf,.pdf"
                aria-label="Upload your resume as a PDF"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="opp-file">
                  <span className="opp-file-mark"><Ico d={I.check} size={16} /></span>
                  <div>
                    <strong>{file.name}</strong>
                    <span>{fmtBytes(file.size)}</span>
                  </div>
                  <button type="button" className="opp-text-btn" onClick={() => fileInput.current?.click()}>Replace</button>
                  <button type="button" className="opp-text-btn" onClick={() => setFile(null)}>Remove</button>
                </div>
              ) : (
                <div
                  className={`opp-drop${dragging ? " is-drag" : ""}${fileError ? " is-error" : ""}`}
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]); }}
                >
                  <span className="opp-drop-title">Drop your resume here</span>
                  <span className="opp-drop-sub">PDF, up to 3 MB</span>
                  <span className="opp-drop-btn">Choose file</span>
                </div>
              )}
              {fileError && <p className="opp-error" role="alert"><Ico d={I.alert} size={15} /> {fileError}</p>}
            </section>

            <section>
              <h2 className="opp-label">Hobbies <span>{hobbies.length ? `${hobbies.length} of ${MAX_HOBBIES}` : `up to ${MAX_HOBBIES}`}</span></h2>
              <div className="opp-pills">
                {HOBBY_CHOICES.map((h) => {
                  const on = hobbies.some((x) => x.toLowerCase() === h.toLowerCase());
                  return (
                    <button key={h} type="button" className={`opp-pill${on ? " is-on" : ""}`} aria-pressed={on} disabled={!on && full} onClick={() => toggleHobby(h)}>
                      {h}
                    </button>
                  );
                })}
                {custom.map((h) => (
                  <button key={h} type="button" className="opp-pill is-on" aria-pressed={true} aria-label={`Remove ${h}`} onClick={() => toggleHobby(h)}>
                    {h} <Ico d={I.x} size={12} />
                  </button>
                ))}
                {!full && (
                  <input
                    className="opp-pill-input"
                    type="text"
                    value={hobbyInput}
                    maxLength={80}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomHobby(); } }}
                    onBlur={addCustomHobby}
                    placeholder="Add your own"
                    aria-label="Add your own hobby"
                  />
                )}
              </div>
            </section>

            <section>
              <label className="opp-label" htmlFor="opp-location">Location <span>optional</span></label>
              <input id="opp-location" className="opp-line-input" type="text" value={location} maxLength={80} onChange={(e) => setLocation(e.target.value)} placeholder="City or country" />
            </section>

            <button type="button" className="opp-btn" disabled={!canRun} onClick={start}>Show my opportunities</button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RESULTS VIEW
     ============================================================ */

  const hasCareer = career.status !== "idle";
  const hasHobby = hobby.status !== "idle";
  const tabs: { id: Tab; label: string; figure: string; note: string }[] = [];
  if (hasCareer) {
    tabs.push({
      id: "certs",
      label: "Certifications",
      figure: !career.data ? "" : figures.lift > 0 ? `+${fmtMoney(figures.lift, sym, true)}` : String(figures.certCount),
      note: figures.lift > 0 ? "a year, biggest pay jump" : "to consider",
    });
  }
  if (hasHobby) {
    tabs.push({
      id: "hobby",
      label: "Hobby income",
      figure: !hobby.data ? "" : figures.best > 0 ? fmtMoney(figures.best, sym) : String(figures.ideaCount),
      note: figures.best > 0 ? `a month at ${hours} hrs a week` : "ideas",
    });
  }
  if (hasCareer) {
    tabs.push({ id: "work", label: "Find work", figure: !career.data ? "" : String(JOB_SITES.length + FREELANCE_SITES.length), note: "sites, one search" });
  }
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  const retryCareer = file ? () => runCareer(file, runId.current) : undefined;
  const retryHobby = hobbies.length ? () => runHobbies(hobbies, runId.current) : undefined;
  const goalAmount = parseFloat(goal.replace(/[^0-9.]/g, "")) || 0;
  const searchFor = query.trim() || career.data?.profile.role || "";
  const suggestions = career.data
    ? Array.from(new Set([...career.data.profile.jobTitles, ...career.data.freelance.map((f) => f.searchTerm)].filter(Boolean))).slice(0, 6)
    : [];

  return (
    <div className="screen desktop-content screen-enter">
      <style>{CSS}</style>
      <div className="px opp">
        <header className="opp-top">
          <div>
            <h1 className="opp-h1">Your opportunities</h1>
            {career.data?.profile.headline && <p className="opp-lede">{career.data.profile.headline}</p>}
          </div>
          <button type="button" className="opp-text-btn" onClick={startOver}>Start over</button>
        </header>

        <div className="opp-band" role="tablist" aria-label="Sections" style={{ ["--n" as any]: tabs.length }}>
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={active === t.id} className={active === t.id ? "is-on" : ""} onClick={() => setTab(t.id)}>
              <span>{t.label}</span>
              <b className={t.figure ? "" : "is-wait"}>{t.figure || "\u00A0"}</b>
              <small>{t.figure ? t.note : "working"}</small>
            </button>
          ))}
        </div>

        {/* ---------- Certifications ---------- */}
        {active === "certs" && (
          <div role="tabpanel">
            {career.status === "loading" && <Wait text="Reading your resume" />}
            {career.status === "error" && <Failed message={career.error} onRetry={retryCareer} onBack={startOver} />}
            {career.data && (
              <>
                {career.data.profile.pay && (
                  <p className="opp-base">
                    Roles like yours pay <strong>{fmtRange(career.data.profile.pay, sym, true)}</strong> today
                    {career.data.profile.payBasis && <span> ({career.data.profile.payBasis})</span>}
                  </p>
                )}
                {career.data.certifications.length === 0 && (
                  <p className="opp-empty">No trusted certification clearly raises pay for this resume. Your field rewards experience more than credentials.</p>
                )}
                {career.data.certifications.map((c, i) => {
                  const id = `c:${c.name}`;
                  const done = doneCount(id, c.steps.length);
                  return (
                    <Row
                      key={id}
                      open={isOpen(id, i === 0)}
                      onToggle={() => toggleOpen(id, i === 0)}
                      rank={i + 1}
                      title={c.name}
                      sub={done > 0 ? `${c.issuer}, ${done} of ${c.steps.length} steps done` : c.issuer}
                      figure={c.pay ? fmtRange(c.pay, sym, true) : ""}
                      figureNote={c.pay ? "roles it opens" : ""}
                    >
                      <div>
                        <p className="opp-body">{c.fitReason}</p>
                        {c.pay && <PayShift now={career.data!.profile.pay} after={c.pay} symbol={sym} />}
                        <dl className="opp-facts">
                          <div><dt>Cost</dt><dd>{c.cost || "See issuer"}</dd></div>
                          <div><dt>Study time</dt><dd>{c.studyTime || "Varies"}</dd></div>
                          <div><dt>Level</dt><dd>{c.difficulty}</dd></div>
                        </dl>
                        {c.rolesOpened.length > 0 && <p className="opp-note"><strong>Opens</strong> {c.rolesOpened.join(", ")}</p>}
                        {c.prerequisites && c.prerequisites.toLowerCase() !== "none" && <p className="opp-note"><strong>Before you sit it</strong> {c.prerequisites}</p>}
                      </div>
                      <div>
                        {c.steps.length > 0 && (
                          <>
                            <h4 className="opp-h4">How to get it</h4>
                            <Steps id={id} steps={c.steps} checks={checks} onToggle={toggleCheck} />
                          </>
                        )}
                        <h4 className="opp-h4">Courses</h4>
                        <div className="opp-links">
                          {courseLinks(c).map((l) => (
                            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">{l.name} <Ico d={I.out} size={12} /></a>
                          ))}
                        </div>
                        <h4 className="opp-h4">Jobs asking for it</h4>
                        <div className="opp-links">
                          <a href={c.jobsUrl} target="_blank" rel="noopener noreferrer">LinkedIn <Ico d={I.out} size={12} /></a>
                          <a href={JOB_SITES[1].url(c.courseSearch || c.name, location)} target="_blank" rel="noopener noreferrer">Indeed <Ico d={I.out} size={12} /></a>
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ---------- Hobby income ---------- */}
        {active === "hobby" && (
          <div role="tabpanel">
            {hobby.status === "loading" && <Wait text="Pricing your hobbies" />}
            {hobby.status === "error" && <Failed message={hobby.error} onRetry={retryHobby} onBack={startOver} />}
            {hobby.data && (
              <>
                <div className="opp-dial">
                  <label htmlFor="opp-hours">Hours a week</label>
                  <input id="opp-hours" type="range" min={2} max={30} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
                  <output htmlFor="opp-hours">{hours}</output>
                  <label htmlFor="opp-goal" className="opp-dial-goal">Saving for</label>
                  <span className="opp-goal-field">
                    {sym}
                    <input id="opp-goal" type="text" inputMode="decimal" value={goal} maxLength={10} onChange={(e) => setGoal(e.target.value)} placeholder="amount" />
                  </span>
                </div>
                {hobby.data.hobbies.map((g) => (
                  <section key={g.hobby} className="opp-group">
                    <h2 className="opp-h2">{titleCase(g.hobby)}</h2>
                    {g.ideas.length === 0 && <p className="opp-empty">{g.note}</p>}
                    {g.ideas.map((idea) => {
                      const id = `h:${g.hobby}:${idea.title}`;
                      const m = monthlyAt(idea.hourly, hours);
                      const total = idea.plan.reduce((n, p) => n + p.steps.length, 0);
                      const done = idea.plan.reduce((n, p, pi) => n + doneCount(`${id}:${pi}`, p.steps.length), 0);
                      return (
                        <Row
                          key={id}
                          open={isOpen(id)}
                          onToggle={() => toggleOpen(id)}
                          title={idea.title}
                          sub={done > 0 ? `${done} of ${total} steps done` : idea.effort}
                          figure={m ? fmtRange(m, hobby.data!.currencySymbol) : ""}
                          figureNote={m ? (goalAmount > 0 ? `a month, goal in ${monthsToGoal(goalAmount, m)}` : "a month") : ""}
                        >
                          <div>
                            <p className="opp-body">{idea.howItWorks}</p>
                            <dl className="opp-facts">
                              {idea.hourly && <div><dt>Per hour, after costs</dt><dd>{fmtRange(idea.hourly, hobby.data!.currencySymbol)}</dd></div>}
                              <div><dt>To start</dt><dd>{idea.startupCost || "Varies"}</dd></div>
                              <div><dt>First income</dt><dd>{idea.timeToFirstIncome || "Varies"}</dd></div>
                            </dl>
                            {idea.earningBasis && <p className="opp-note"><strong>How we got that</strong> {idea.earningBasis}</p>}
                            {idea.findCustomers.length > 0 && <p className="opp-note"><strong>Find customers</strong> {idea.findCustomers.join(", ")}</p>}
                            {idea.checkFirst && <p className="opp-caution"><Ico d={I.alert} size={15} /> <span>{idea.checkFirst}</span></p>}
                          </div>
                          <div>
                            {idea.plan.map((p, pi) => (
                              <div key={p.phase} className="opp-phase">
                                <h4 className="opp-h4">{p.phase}</h4>
                                <Steps id={`${id}:${pi}`} steps={p.steps} checks={checks} onToggle={toggleCheck} />
                              </div>
                            ))}
                          </div>
                        </Row>
                      );
                    })}
                  </section>
                ))}
              </>
            )}
          </div>
        )}

        {/* ---------- Find work ---------- */}
        {active === "work" && (
          <div role="tabpanel">
            {career.status === "loading" && <Wait text="Reading your resume" />}
            {career.status === "error" && <Failed message={career.error} onRetry={retryCareer} onBack={startOver} />}
            {career.data && (
              <>
                <div className="opp-search">
                  <label htmlFor="opp-q">Search for</label>
                  <input id="opp-q" className="opp-q" type="text" value={query} maxLength={60} onChange={(e) => setQuery(e.target.value)} placeholder="Job title or skill" />
                  <div className="opp-search-row">
                    <div className="opp-pills is-small">
                      {suggestions.map((s) => (
                        <button key={s} type="button" className={`opp-pill${s === query ? " is-on" : ""}`} aria-pressed={s === query} onClick={() => setQuery(s)}>{s}</button>
                      ))}
                    </div>
                    <input className="opp-line-input is-small" type="text" value={location} maxLength={80} onChange={(e) => setLocation(e.target.value)} placeholder="Anywhere" aria-label="Location" />
                  </div>
                </div>

                <div className="opp-sites">
                  <SiteList title="Job boards" sites={JOB_SITES} q={searchFor} l={location} />
                  <SiteList title="Freelance marketplaces" sites={FREELANCE_SITES} q={searchFor} l={location} />
                </div>

                {career.data.freelance.length > 0 && (
                  <section className="opp-group">
                    <h2 className="opp-h2">Services you could sell</h2>
                    {career.data.freelance.map((f) => {
                      const id = `f:${f.title}`;
                      const done = doneCount(id, f.plan.length);
                      return (
                        <Row key={id} open={isOpen(id)} onToggle={() => toggleOpen(id)} title={f.title} sub={done > 0 ? `${done} of ${f.plan.length} steps done` : ""} figure={f.rate} figureNote="">
                          <div>
                            <p className="opp-body">{f.how}</p>
                            {f.searchTerm && (
                              <button type="button" className="opp-text-btn is-ink" onClick={() => { setQuery(f.searchTerm); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                                Search every site for “{f.searchTerm}”
                              </button>
                            )}
                          </div>
                          <div>
                            <h4 className="opp-h4">Your first client</h4>
                            <Steps id={id} steps={f.plan} checks={checks} onToggle={toggleCheck} />
                          </div>
                        </Row>
                      );
                    })}
                  </section>
                )}
              </>
            )}
          </div>
        )}

        <p className="opp-fine">Estimates, not guarantees. Confirm fees with the issuer. On a student or work visa, check that side income is allowed.</p>
      </div>
    </div>
  );
}

/* ============================================================
   PIECES
   ============================================================ */

/* A ledger line that opens to show its detail. */
function Row(props: { open: boolean; onToggle: () => void; rank?: number; title: string; sub: string; figure: string; figureNote: string; children: ReactNode }) {
  return (
    <article className={`opp-row${props.open ? " is-open" : ""}${props.rank ? " has-rank" : ""}`}>
      <button type="button" className="opp-row-head" aria-expanded={props.open} onClick={props.onToggle}>
        {props.rank && <span className="opp-rank">{props.rank}</span>}
        <span className="opp-row-main">
          <span className="opp-row-title">{props.title}</span>
          {props.sub && <span className="opp-row-sub">{props.sub}</span>}
        </span>
        {props.figure && (
          <span className="opp-row-fig">
            {props.figure}
            {props.figureNote && <small>{props.figureNote}</small>}
          </span>
        )}
        <span className="opp-row-toggle"><Ico d={I.plus} size={18} /></span>
      </button>
      <div className="opp-panel">
        <div>
          <div className="opp-panel-in">{props.children}</div>
        </div>
      </div>
    </article>
  );
}

/* Ordered steps that can be ticked off. Progress is saved on this device. */
function Steps({ id, steps, checks, onToggle }: { id: string; steps: string[]; checks: Record<string, boolean>; onToggle: (id: string) => void }) {
  return (
    <ol className="opp-steps">
      {steps.map((s, i) => {
        const key = `${id}:${i}`;
        return (
          <li key={key}>
            <label className={checks[key] ? "is-done" : ""}>
              <input type="checkbox" className="opp-vh" checked={!!checks[key]} onChange={() => onToggle(key)} />
              <span className="opp-tick"><Ico d={I.check} size={12} /></span>
              <span>{s}</span>
            </label>
          </li>
        );
      })}
    </ol>
  );
}

/* Two bars on one scale: pay today, and pay for the roles a certification opens. */
function PayShift({ now, after, symbol }: { now: Range; after: { low: number; high: number }; symbol: string }) {
  const min = Math.min(after.low, now ? now.low : after.low) * 0.82;
  const max = Math.max(after.high, now ? now.high : after.high) * 1.04;
  const span = Math.max(max - min, 1);
  const pos = (r: { low: number; high: number }) => ({ left: `${((r.low - min) / span) * 100}%`, width: `${Math.max(((r.high - r.low) / span) * 100, 2)}%` });
  return (
    <div className="opp-pay">
      {now && (
        <div>
          <span>Today</span>
          <i><b style={pos(now)} /></i>
          <em>{fmtRange(now, symbol, true)}</em>
        </div>
      )}
      <div className="is-after">
        <span>With it</span>
        <i><b style={pos(after)} /></i>
        <em>{fmtRange(after, symbol, true)}</em>
      </div>
    </div>
  );
}

function SiteList({ title, sites, q, l }: { title: string; sites: Site[]; q: string; l: string }) {
  return (
    <div>
      <h4 className="opp-h4">{title}</h4>
      {sites.map((s) => (
        <a key={s.name} className="opp-site" href={s.url(q, l)} target="_blank" rel="noopener noreferrer">
          <span>{s.name}</span>
          <small>{s.note}</small>
          <Ico d={I.out} size={15} />
        </a>
      ))}
    </div>
  );
}

function Wait({ text }: { text: string }) {
  return (
    <div className="opp-wait" role="status">
      <p>{text}</p>
      <i />
    </div>
  );
}

function Failed({ message, onRetry, onBack }: { message?: string; onRetry?: () => void; onBack: () => void }) {
  return (
    <div className="opp-failed" role="alert">
      <p><Ico d={I.alert} size={16} /> {message || "Something went wrong. Try again."}</p>
      <div>
        {onRetry && <button type="button" className="opp-text-btn is-ink" onClick={onRetry}>Try again</button>}
        <button type="button" className="opp-text-btn" onClick={onBack}>Change my answers</button>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES
   Scoped under .opp. Ink and paper come from the app's tokens;
   the one added colour is a muted gold reserved for money.
   ============================================================ */

const CSS = `
.opp { --gold: #8A6A2F; --gold-wash: rgba(138,106,47,.08); --line: var(--border2); max-width: 860px; margin: 0 auto; padding-top: 24px; color: var(--text); }
:root.dark .opp { --gold: #D9BC82; --gold-wash: rgba(217,188,130,.09); }
.opp button, .opp input { font-family: var(--sans); }
.opp :focus-visible, .opp-vh:focus-visible + * { outline: 2px solid var(--text); outline-offset: 3px; border-radius: 4px; }
.opp-vh { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; clip: rect(0 0 0 0); }

.opp-h1 { font-family: var(--serif); font-weight: 400; font-size: clamp(36px, 6vw, 54px); line-height: 1.02; letter-spacing: -.03em; }
.opp-h2 { font-family: var(--serif); font-weight: 400; font-size: 26px; letter-spacing: -.02em; padding-bottom: 14px; border-bottom: 1px solid var(--text); }
.opp-h4 { font-size: 13px; font-weight: 600; margin: 0 0 8px; }
.opp-h4:not(:first-child) { margin-top: 24px; }
.opp-lede { font-size: 15px; line-height: 1.6; color: var(--text2); max-width: 46ch; margin-top: 14px; }
.opp-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
.opp-label span { font-weight: 400; color: var(--text2); }
.opp-text-btn { background: none; border: 0; padding: 4px 0; font-size: 13px; color: var(--text2); cursor: pointer; text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 4px; white-space: nowrap; }
.opp-text-btn:hover, .opp-text-btn.is-ink { color: var(--text); text-decoration-color: var(--text); }
.opp-body + .opp-text-btn { margin-top: 14px; }

/* Intake */
.opp-intake { display: grid; gap: 40px; }
.opp-form { display: grid; gap: 36px; }
.opp-drop { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 40px 20px 34px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); cursor: pointer; transition: border-color .2s ease, background .2s ease; }
.opp-drop:hover, .opp-drop.is-drag { border-color: var(--text); background: var(--gold-wash); }
.opp-drop.is-error { border-color: var(--red); }
.opp-drop-title { font-family: var(--serif); font-size: 24px; letter-spacing: -.02em; }
.opp-drop-sub { font-size: 13px; color: var(--text2); }
.opp-drop-btn { margin-top: 14px; padding: 9px 18px; font-size: 13px; font-weight: 500; border: 1px solid var(--text); border-radius: 999px; }
.opp-file { display: flex; align-items: center; gap: 14px; padding: 18px 20px; border: 1px solid var(--text); border-radius: 14px; background: var(--surface); }
.opp-file-mark { width: 30px; height: 30px; flex: none; display: grid; place-items: center; border-radius: 50%; background: var(--text); color: var(--bg); }
.opp-file div { flex: 1; min-width: 0; }
.opp-file strong { display: block; font-family: var(--serif); font-weight: 400; font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.opp-file div span { font-size: 12.5px; color: var(--text2); }
.opp-error { display: flex; gap: 8px; align-items: flex-start; margin-top: 12px; font-size: 13px; line-height: 1.5; color: var(--red); }
.opp-error svg { flex: none; margin-top: 2px; }

.opp-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.opp-pill { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; font-size: 14px; border: 1px solid var(--line); border-radius: 999px; background: none; color: var(--text); cursor: pointer; transition: border-color .15s ease, background .15s ease, color .15s ease; }
.opp-pill:hover:not(:disabled) { border-color: var(--text); }
.opp-pill.is-on { background: var(--text); border-color: var(--text); color: var(--bg); }
.opp-pill:disabled { opacity: .35; cursor: not-allowed; }
.opp-pills.is-small .opp-pill { padding: 6px 12px; font-size: 13px; }
.opp-pill-input { width: 132px; padding: 9px 16px; font-size: 14px; border: 1px dashed var(--line); border-radius: 999px; background: none; color: var(--text); cursor: text; }
.opp-pill-input::placeholder, .opp-line-input::placeholder, .opp-q::placeholder, .opp-goal-field input::placeholder { color: var(--text2); opacity: .7; }
.opp-pill-input:focus { outline: none; border-style: solid; border-color: var(--text); }
.opp-line-input { width: 100%; padding: 8px 0 10px; font-size: 16px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: none; color: var(--text); cursor: text; }
.opp-line-input:focus, .opp-q:focus, .opp-goal-field input:focus { outline: none; border-bottom-color: var(--text); }
.opp-line-input.is-small { width: 150px; flex: none; font-size: 14px; padding: 6px 0; }
.opp-btn { width: 100%; padding: 17px 24px; font-size: 15px; font-weight: 500; letter-spacing: .01em; border: 0; border-radius: 12px; background: var(--text); color: var(--bg); cursor: pointer; transition: opacity .15s ease; }
.opp-btn:hover:not(:disabled) { opacity: .86; }
.opp-btn:disabled { background: var(--border2); color: var(--text2); cursor: not-allowed; }

/* Results header and the figures that switch sections */
.opp-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.opp-band { display: grid; grid-template-columns: repeat(var(--n, 3), 1fr); margin: 36px 0 12px; border-top: 1px solid var(--text); border-bottom: 1px solid var(--line); }
.opp-band button { position: relative; padding: 18px 16px 20px; text-align: left; background: none; border: 0; border-left: 1px solid var(--line); color: var(--text2); cursor: pointer; transition: color .15s ease, background .15s ease; }
.opp-band button:first-child { border-left: 0; padding-left: 2px; }
.opp-band button span { font-size: 13px; font-weight: 500; }
.opp-band button b { display: block; margin: 10px 0 6px; font-family: var(--serif); font-weight: 400; font-size: clamp(26px, 5vw, 40px); line-height: 1; letter-spacing: -.02em; font-variant-numeric: lining-nums; }
.opp-band button small { display: block; font-size: 12.5px; line-height: 1.35; }
.opp-band button:hover { color: var(--text); }
.opp-band button.is-on { color: var(--text); }
.opp-band button.is-on b { color: var(--gold); }
.opp-band button.is-on::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--text); }
.opp-band b.is-wait { width: 64px; height: 26px; border-radius: 4px; background: var(--line); animation: oppPulse 1.4s ease-in-out infinite; }

.opp-base { padding: 20px 0 16px; font-size: 14px; color: var(--text2); }
.opp-base strong { font-family: var(--serif); font-weight: 400; font-size: 19px; color: var(--text); }
.opp-group { margin-top: 44px; }

/* Ledger rows */
.opp-row { border-bottom: 1px solid var(--line); }
.opp-row-head { width: 100%; display: flex; align-items: center; gap: 18px; padding: 22px 2px; text-align: left; background: none; border: 0; color: inherit; cursor: pointer; }
.opp-rank { width: 20px; flex: none; align-self: flex-start; padding-top: 3px; font-family: var(--serif); font-size: 17px; color: var(--gold); font-variant-numeric: lining-nums; }
.opp-row-main { flex: 1; min-width: 0; }
.opp-row-title { display: block; font-family: var(--serif); font-size: 21px; line-height: 1.25; letter-spacing: -.015em; text-decoration: underline transparent 1px; text-underline-offset: 5px; transition: text-decoration-color .2s ease; }
.opp-row-head:hover .opp-row-title { text-decoration-color: var(--gold); }
.opp-row-sub { display: block; margin-top: 5px; font-size: 13px; color: var(--text2); }
.opp-row-fig { flex: none; text-align: right; font-family: var(--serif); font-size: 19px; color: var(--gold); white-space: nowrap; font-variant-numeric: lining-nums tabular-nums; }
.opp-row-fig small { display: block; margin-top: 3px; font-family: var(--sans); font-size: 12px; color: var(--text2); }
.opp-row-toggle { flex: none; display: grid; place-items: center; color: var(--text2); transition: transform .3s cubic-bezier(.2,.7,.2,1); }
.opp-row.is-open .opp-row-toggle { transform: rotate(45deg); color: var(--text); }
.opp-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .34s cubic-bezier(.2,.7,.2,1); }
.opp-row.is-open .opp-panel { grid-template-rows: 1fr; }
.opp-panel > div { min-height: 0; overflow: hidden; visibility: hidden; transition: visibility 0s .34s; }
.opp-row.is-open .opp-panel > div { visibility: visible; transition-delay: 0s; }
.opp-panel-in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 44px; padding: 4px 2px 32px; }
.opp-row.has-rank .opp-panel-in { padding-left: 40px; }

.opp-body { font-size: 14.5px; line-height: 1.65; }
.opp-note { margin-top: 14px; font-size: 13.5px; line-height: 1.6; color: var(--text2); }
.opp-note strong { display: block; font-size: 12.5px; font-weight: 600; color: var(--text); }
.opp-facts { display: flex; flex-wrap: wrap; gap: 14px 30px; margin-top: 20px; }
.opp-facts dt { font-size: 12.5px; color: var(--text2); margin-bottom: 3px; }
.opp-facts dd { font-size: 14px; font-weight: 500; }
.opp-caution { display: flex; gap: 10px; align-items: flex-start; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 13px; line-height: 1.6; }
.opp-caution svg { flex: none; margin-top: 3px; color: var(--amber); }

.opp-pay { margin-top: 22px; display: grid; gap: 12px; }
.opp-pay div { display: grid; grid-template-columns: 54px 1fr auto; align-items: center; gap: 12px; font-size: 12.5px; color: var(--text2); }
.opp-pay i { position: relative; height: 5px; border-radius: 3px; background: var(--border); }
.opp-pay b { position: absolute; top: 0; bottom: 0; border-radius: 3px; background: var(--text2); opacity: .5; }
.opp-pay em { font-style: normal; font-variant-numeric: tabular-nums; white-space: nowrap; }
.opp-pay .is-after b { background: var(--gold); opacity: 1; }
.opp-pay .is-after em, .opp-pay .is-after span { color: var(--text); font-weight: 500; }

.opp-steps { list-style: none; margin: 0; padding: 0; }
.opp-steps label { display: grid; grid-template-columns: 20px 1fr; gap: 12px; padding: 8px 0; font-size: 14px; line-height: 1.5; cursor: pointer; }
.opp-tick { width: 20px; height: 20px; margin-top: 1px; display: grid; place-items: center; border: 1px solid var(--text2); border-radius: 50%; color: transparent; transition: background .15s ease, border-color .15s ease; }
.opp-steps label:hover .opp-tick { border-color: var(--text); }
.opp-steps .is-done .opp-tick { background: var(--text); border-color: var(--text); color: var(--bg); }
.opp-steps .is-done > span:last-child { color: var(--text2); text-decoration: line-through; text-decoration-color: var(--line); }
.opp-phase + .opp-phase { margin-top: 20px; }

.opp-links { display: flex; flex-wrap: wrap; gap: 8px; }
.opp-links a { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; font-size: 13px; border: 1px solid var(--line); border-radius: 999px; color: var(--text); text-decoration: none; transition: border-color .15s ease; }
.opp-links a:hover { border-color: var(--text); }
.opp-links svg { color: var(--text2); }

/* Hobby controls */
.opp-dial { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 22px 0 0; font-size: 13px; font-weight: 500; }
.opp-dial input[type=range] { flex: 1; min-width: 140px; max-width: 280px; accent-color: var(--text); cursor: pointer; }
.opp-dial output { min-width: 34px; font-family: var(--serif); font-size: 28px; font-weight: 400; line-height: 1; color: var(--gold); font-variant-numeric: lining-nums tabular-nums; }
.opp-dial-goal { margin-left: auto; }
.opp-goal-field { display: inline-flex; align-items: baseline; gap: 4px; font-family: var(--serif); font-size: 18px; font-weight: 400; }
.opp-goal-field input { width: 84px; padding: 4px 0 6px; font-family: var(--serif); font-size: 18px; border: 0; border-bottom: 1px solid var(--line); background: none; color: var(--text); cursor: text; }

/* Find work */
.opp-search { padding-top: 22px; }
.opp-search > label { font-size: 13px; font-weight: 500; color: var(--text2); }
.opp-q { display: block; width: 100%; margin-top: 4px; padding: 4px 0 12px; font-family: var(--serif); font-size: clamp(24px, 4.4vw, 34px); letter-spacing: -.02em; border: 0; border-bottom: 1px solid var(--text); border-radius: 0; background: none; color: var(--text); cursor: text; }
.opp-search-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-top: 14px; }
.opp-sites { display: grid; grid-template-columns: 1fr 1fr; gap: 0 44px; margin-top: 36px; align-items: start; }
.opp-site { display: grid; grid-template-columns: 1fr auto 18px; align-items: baseline; gap: 12px; padding: 13px 0; border-top: 1px solid var(--line); color: var(--text); text-decoration: none; }
.opp-site span { font-size: 15px; font-weight: 500; }
.opp-site small { font-size: 12.5px; color: var(--text2); }
.opp-site svg { align-self: center; color: var(--text2); transition: transform .2s ease, color .2s ease; }
.opp-site:hover span { color: var(--gold); }
.opp-site:hover svg { transform: translate(2px, -2px); color: var(--gold); }

/* States */
.opp-wait { padding: 28px 0; }
.opp-wait p { font-family: var(--serif); font-size: 20px; color: var(--text2); }
.opp-wait i { display: block; position: relative; height: 1px; margin-top: 18px; background: var(--line); overflow: hidden; }
.opp-wait i::after { content: ""; position: absolute; top: 0; bottom: 0; left: -30%; width: 30%; background: var(--gold); animation: oppSlide 1.5s cubic-bezier(.4,0,.2,1) infinite; }
@keyframes oppSlide { to { left: 100%; } }
@keyframes oppPulse { 50% { opacity: .4; } }
.opp-failed { padding: 24px 0; }
.opp-failed p { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; }
.opp-failed p svg { flex: none; margin-top: 3px; color: var(--red); }
.opp-failed div { display: flex; gap: 20px; margin-top: 12px; padding-left: 26px; }
.opp-empty { padding: 20px 0; font-size: 14.5px; line-height: 1.6; color: var(--text2); max-width: 58ch; }
.opp-fine { margin-top: 48px; font-size: 12.5px; line-height: 1.6; color: var(--text2); }

@media (min-width: 1100px) {
  .opp-intake { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; padding-top: 48px; }
  .opp-intake > header { position: sticky; top: 48px; }
}
@media (max-width: 720px) {
  .opp { padding-top: 4px; }
  .opp-panel-in { grid-template-columns: 1fr; gap: 28px; }
  .opp-row.has-rank .opp-panel-in { padding-left: 2px; }
  .opp-row-head { gap: 12px; padding: 18px 2px; }
  .opp-row-title { font-size: 18px; }
  .opp-row-fig { font-size: 16px; }
  .opp-band button { padding: 14px 10px 16px; }
  .opp-sites { grid-template-columns: 1fr; gap: 32px; }
  .opp-search-row { flex-direction: column; }
  .opp-dial-goal { margin-left: 0; }
  .opp-file { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .opp-panel, .opp-row-toggle, .opp-panel > div { transition: none; }
  .opp-wait i::after, .opp-band b.is-wait { animation: none; }
}
`;
