"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   OPPORTUNITIES
   Upload a resume PDF and pick hobbies. The page returns:
     - certifications that raise earning power (trusted issuers only)
     - ways to earn from each hobby
     - freelance work for skills already on the resume
   All analysis happens in /api/opportunities.
   ============================================================ */

type Range = { low: number; high: number } | null;

interface Cert {
  name: string;
  issuer: string;
  issuerDomain: string | null;
  fitReason: string;
  pay: Range;
  rolesOpened: string[];
  cost: string;
  studyTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string;
  lookupUrl: string;
  jobsUrl: string;
}

interface Freelance {
  title: string;
  how: string;
  platforms: string[];
  rate: string;
}

interface CareerData {
  currencySymbol: string;
  profile: {
    headline: string;
    role: string;
    level: string;
    topSkills: string[];
    pay: Range;
    payBasis: string;
  };
  certifications: Cert[];
  freelance: Freelance[];
}

interface HobbyIdea {
  title: string;
  howItWorks: string;
  monthly: Range;
  earningBasis: string;
  startupCost: string;
  timeToFirstIncome: string;
  effort: string;
  firstSteps: string[];
  findCustomers: string[];
  checkFirst: string;
}

interface HobbyGroup {
  hobby: string;
  ideas: HobbyIdea[];
  note: string;
  failed?: boolean;
}

interface HobbyData {
  currencySymbol: string;
  hobbies: HobbyGroup[];
}

interface Load<T> {
  status: "idle" | "loading" | "done" | "error";
  data?: T;
  error?: string;
}

interface Meta {
  fileName: string;
  hoursLabel: string;
  goalName: string;
  goalAmount: number;
}

type Tab = "certs" | "hobby" | "freelance";

const MAX_PDF_BYTES = 3 * 1024 * 1024;
const MAX_HOBBIES = 6;
const STORAGE_KEY = "wisecard.opportunities.v2";

const SUGGESTED_HOBBIES = [
  "Cooking", "Baking", "Guitar", "Singing", "Dancing", "Carpentry",
  "Photography", "Fitness", "Painting", "Sewing", "Gardening", "Writing",
];

const HOURS = [
  { value: "2 to 5", label: "2–5" },
  { value: "5 to 10", label: "5–10" },
  { value: "10 to 20", label: "10–20" },
  { value: "20 or more", label: "20+" },
];

/* ---------- Formatting ---------- */

function fmtMoney(n: number, symbol: string, compact = false): string {
  const locale = symbol === "₹" ? "en-IN" : "en-US";
  const opts: Intl.NumberFormatOptions =
    compact && n >= 10000 ? { notation: "compact", maximumFractionDigits: 1 } : { maximumFractionDigits: 0 };
  return symbol + new Intl.NumberFormat(locale, opts).format(n);
}

function fmtRange(r: { low: number; high: number }, symbol: string, compact = false): string {
  if (r.low === r.high) return fmtMoney(r.low, symbol, compact);
  return `${fmtMoney(r.low, symbol, compact)}–${fmtMoney(r.high, symbol, compact)}`;
}

function fmtBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function monthsToGoal(amount: number, monthly: { low: number; high: number }): string {
  const fast = Math.max(1, Math.ceil(amount / monthly.high));
  const slow = Math.max(1, Math.ceil(amount / monthly.low));
  if (fast > 24) return "more than two years";
  if (slow > 24) return `${fast} months or more`;
  if (fast === slow) return fast === 1 ? "about a month" : `about ${fast} months`;
  return `${fast} to ${slow} months`;
}

/* ---------- File handling ---------- */

async function checkPdf(file: File): Promise<string | null> {
  const name = file.name.toLowerCase();
  if (/\.(docx?|pages|rtf|odt)$/.test(name)) {
    return "That's a word-processor file. Export it as a PDF (File, then Download or Export, then PDF) and upload that.";
  }
  if (/\.(png|jpe?g|heic|webp)$/.test(name)) {
    return "That's an image. Upload the PDF version of your resume.";
  }
  if (file.type !== "application/pdf" && !name.endsWith(".pdf")) {
    return "Upload a PDF. Other file types can't be read.";
  }
  if (file.size > MAX_PDF_BYTES) {
    return `That PDF is ${fmtBytes(file.size)}. The limit is 3 MB, so export a smaller copy.`;
  }
  if (file.size < 200) {
    return "That PDF is empty.";
  }
  try {
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    const sig = String.fromCharCode(...Array.from(head));
    if (sig !== "%PDF-") return "That file has a .pdf name but isn't a real PDF. Export your resume as a PDF again.";
  } catch {
    return "We couldn't open that file. Try choosing it again.";
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
    res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("We couldn't reach the server. Check your connection and try again.");
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* fall through */
  }
  if (!res.ok) {
    if (res.status === 413) throw new Error("That PDF is too large to send. Export a smaller copy (under 3 MB).");
    throw new Error(data?.error || "Something went wrong. Try again.");
  }
  return data as T;
}

/* ---------- Icons ---------- */

function Ico({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const I = {
  upload: "M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3",
  file: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zm0 0v5h5M9 13h6M9 17h4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  out: "M8 7h9v9M17 7L7 17",
  alert: "M12 8v5m0 3.5v.01M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z",
  plus: "M12 5v14M5 12h14",
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function SkillsAdvisor() {
  const [view, setView] = useState<"intake" | "results">("intake");

  // Intake
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [hours, setHours] = useState(HOURS[1].value);
  const [location, setLocation] = useState("");
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  // Results
  const [career, setCareer] = useState<Load<CareerData>>({ status: "idle" });
  const [hobby, setHobby] = useState<Load<HobbyData>>({ status: "idle" });
  const [meta, setMeta] = useState<Meta>({ fileName: "", hoursLabel: "5–10", goalName: "", goalAmount: 0 });
  const [tab, setTab] = useState<Tab>("certs");

  const fileInput = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  /* Restore the last finished analysis so it survives switching screens. The resume itself is never saved. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || (!saved.career && !saved.hobby)) return;
      if (saved.career) setCareer({ status: "done", data: saved.career });
      if (saved.hobby) setHobby({ status: "done", data: saved.hobby });
      if (saved.meta) setMeta(saved.meta);
      setTab(saved.career ? "certs" : "hobby");
      setView("results");
    } catch {
      /* nothing saved, or storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (view !== "results") return;
    if (career.status === "loading" || hobby.status === "loading") return;
    if (career.status !== "done" && hobby.status !== "done") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          career: career.status === "done" ? career.data : null,
          hobby: hobby.status === "done" ? hobby.data : null,
          meta,
        })
      );
    } catch {
      /* storage unavailable */
    }
  }, [view, career, hobby, meta]);

  /* ---------- Intake handlers ---------- */

  const acceptFile = useCallback(async (f: File | undefined | null) => {
    if (!f) return;
    const problem = await checkPdf(f);
    if (problem) {
      setFile(null);
      setFileError(problem);
    } else {
      setFile(f);
      setFileError("");
    }
    if (fileInput.current) fileInput.current.value = "";
  }, []);

  const toggleHobby = (h: string) => {
    const key = h.trim().toLowerCase();
    if (!key) return;
    setHobbies((cur) => {
      if (cur.some((x) => x.toLowerCase() === key)) return cur.filter((x) => x.toLowerCase() !== key);
      if (cur.length >= MAX_HOBBIES) return cur;
      return [...cur, h.trim()];
    });
  };

  const addCustomHobby = () => {
    const parts = hobbyInput.split(",").map((s) => s.trim().slice(0, 40)).filter(Boolean);
    if (parts.length === 0) return;
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
      const resumePdf = await toBase64(f);
      const data = await postJson<CareerData>({ kind: "career", resumePdf, location, hoursPerWeek: hours });
      if (runId.current === id) setCareer({ status: "done", data });
    } catch (e: any) {
      if (runId.current === id) setCareer({ status: "error", error: e?.message || "Something went wrong. Try again." });
    }
  };

  const runHobbies = async (list: string[], id: number) => {
    setHobby({ status: "loading" });
    try {
      const data = await postJson<HobbyData>({ kind: "hobbies", hobbies: list, location, hoursPerWeek: hours });
      if (runId.current === id) setHobby({ status: "done", data });
    } catch (e: any) {
      if (runId.current === id) setHobby({ status: "error", error: e?.message || "Something went wrong. Try again." });
    }
  };

  const canRun = !!file || hobbies.length > 0;

  const start = () => {
    if (!canRun) return;
    const id = ++runId.current;
    const amount = parseFloat(goalAmount.replace(/[^0-9.]/g, "")) || 0;
    setMeta({
      fileName: file?.name || "",
      hoursLabel: HOURS.find((h) => h.value === hours)?.label || "5–10",
      goalName: goalOpen ? goalName.trim() : "",
      goalAmount: goalOpen ? amount : 0,
    });
    setCareer({ status: "idle" });
    setHobby({ status: "idle" });
    setTab(file ? "certs" : "hobby");
    setView("results");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    if (file) runCareer(file, id);
    if (hobbies.length > 0) runHobbies(hobbies, id);
  };

  const newAnalysis = () => {
    runId.current++;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    setCareer({ status: "idle" });
    setHobby({ status: "idle" });
    setView("intake");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  /* ============================================================
     INTAKE
     ============================================================ */

  if (view === "intake") {
    const customHobbies = hobbies.filter((h) => !SUGGESTED_HOBBIES.some((s) => s.toLowerCase() === h.toLowerCase()));
    const full = hobbies.length >= MAX_HOBBIES;

    return (
      <div className="screen desktop-content screen-enter">
        <style>{CSS}</style>
        <div className="px opp">
          <header className="opp-head">
            <h1 className="serif">Opportunities</h1>
            <p>
              Upload your resume and tell us what you enjoy. You&apos;ll get certifications that raise your pay range and
              ways to earn from your hobbies.
            </p>
          </header>

          {/* Resume */}
          <section className="opp-sec">
            <h2>Your resume</h2>
            {file ? (
              <div className="opp-file">
                <span className="opp-file-ico"><Ico d={I.file} size={20} /></span>
                <div className="opp-file-text">
                  <strong>{file.name}</strong>
                  <span>PDF, {fmtBytes(file.size)}</span>
                </div>
                <button type="button" className="opp-link" onClick={() => fileInput.current?.click()}>Replace</button>
                <button type="button" className="opp-icon-btn" aria-label="Remove resume" onClick={() => setFile(null)}>
                  <Ico d={I.x} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="opp-resume"
                className={`opp-drop${dragging ? " is-drag" : ""}${fileError ? " is-error" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]); }}
              >
                <span className="opp-drop-ico"><Ico d={I.upload} size={22} /></span>
                <span className="opp-drop-title">Drop your resume PDF here</span>
                <span className="opp-drop-sub">or <u>choose a file</u>. PDF only, up to 3 MB.</span>
              </label>
            )}
            <input
              ref={fileInput}
              id="opp-resume"
              className="opp-file-input"
              type="file"
              tabIndex={-1}
              accept="application/pdf,.pdf"
              aria-label="Upload your resume as a PDF"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
            {!file && (
              <button type="button" className="opp-sr-btn" onClick={() => fileInput.current?.click()}>
                Choose a PDF
              </button>
            )}
            {fileError && (
              <p className="opp-error" role="alert"><Ico d={I.alert} size={15} /> {fileError}</p>
            )}
            <p className="opp-hint">Your resume is read once to build your results. WiseCard doesn&apos;t store the file.</p>
          </section>

          {/* Hobbies */}
          <section className="opp-sec">
            <h2>What you enjoy doing</h2>
            <p className="opp-sub">Pick up to {MAX_HOBBIES}. Each one gets its own ways to earn.</p>
            <div className="opp-chips">
              {SUGGESTED_HOBBIES.map((h) => {
                const on = hobbies.some((x) => x.toLowerCase() === h.toLowerCase());
                return (
                  <button
                    key={h}
                    type="button"
                    className={`opp-chip${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    disabled={!on && full}
                    onClick={() => toggleHobby(h)}
                  >
                    {on && <Ico d={I.check} size={13} />}
                    {h}
                  </button>
                );
              })}
              {customHobbies.map((h) => (
                <button key={h} type="button" className="opp-chip is-on" aria-pressed={true} onClick={() => toggleHobby(h)} aria-label={`Remove ${h}`}>
                  {h}
                  <Ico d={I.x} size={12} />
                </button>
              ))}
            </div>
            <div className="opp-row">
              <input
                className="field"
                type="text"
                value={hobbyInput}
                maxLength={80}
                disabled={full}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomHobby(); } }}
                placeholder={full ? "You've picked 6" : "Something else, like pottery or tabla"}
                aria-label="Add another hobby"
              />
              <button type="button" className="btn-ghost press opp-add" onClick={addCustomHobby} disabled={full || !hobbyInput.trim()}>
                Add
              </button>
            </div>
          </section>

          {/* Time and place */}
          <section className="opp-sec">
            <h2>Time and place</h2>
            <div className="opp-grid2">
              <div>
                <span className="opp-label" id="opp-hours-label">Hours a week you can spare</span>
                <div className="opp-seg" role="group" aria-labelledby="opp-hours-label">
                  {HOURS.map((h) => (
                    <button key={h.value} type="button" className={hours === h.value ? "is-on" : ""} aria-pressed={hours === h.value} onClick={() => setHours(h.value)}>
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="opp-label" htmlFor="opp-location">Where you live</label>
                <input
                  id="opp-location"
                  className="field"
                  type="text"
                  value={location}
                  maxLength={80}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City and state, or country"
                />
              </div>
            </div>
            <p className="opp-hint">Location sets the currency, local pay ranges and which permits apply. Left blank, we use the United States.</p>
          </section>

          {/* Goal (optional) */}
          <section className="opp-sec">
            {goalOpen ? (
              <>
                <div className="opp-sec-row">
                  <h2>Saving for something</h2>
                  <button type="button" className="opp-link" onClick={() => setGoalOpen(false)}>Remove</button>
                </div>
                <p className="opp-sub">We&apos;ll show how quickly each idea could cover it.</p>
                <div className="opp-grid2">
                  <div>
                    <label className="opp-label" htmlFor="opp-goal-name">What it is</label>
                    <input id="opp-goal-name" className="field" type="text" value={goalName} maxLength={60} onChange={(e) => setGoalName(e.target.value)} placeholder="New laptop" />
                  </div>
                  <div>
                    <label className="opp-label" htmlFor="opp-goal-amount">What it costs</label>
                    <input id="opp-goal-amount" className="field" type="text" inputMode="decimal" value={goalAmount} maxLength={12} onChange={(e) => setGoalAmount(e.target.value)} placeholder="2400" />
                  </div>
                </div>
              </>
            ) : (
              <button type="button" className="opp-link opp-goal-toggle" onClick={() => setGoalOpen(true)}>
                <Ico d={I.plus} size={14} /> Add something you&apos;re saving for
              </button>
            )}
          </section>

          <div className="opp-cta">
            <button type="button" className="btn-gold press" disabled={!canRun} onClick={start}>
              Find my opportunities
            </button>
            {!canRun && <p className="opp-hint">Upload your resume or pick a hobby to continue.</p>}
            {canRun && !file && <p className="opp-hint">Without a resume you&apos;ll get hobby ideas only.</p>}
            {canRun && file && hobbies.length === 0 && <p className="opp-hint">Without hobbies you&apos;ll get certifications and freelance work only.</p>}
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RESULTS
     ============================================================ */

  const hasCareer = career.status !== "idle";
  const hasHobby = hobby.status !== "idle";
  const tabs: { id: Tab; label: string; count: number | null }[] = [];
  if (hasCareer) tabs.push({ id: "certs", label: "Certifications", count: career.data ? career.data.certifications.length : null });
  if (hasHobby) tabs.push({ id: "hobby", label: "Hobby income", count: hobby.data ? hobby.data.hobbies.reduce((n, h) => n + h.ideas.length, 0) : null });
  if (hasCareer) tabs.push({ id: "freelance", label: "Freelance", count: career.data ? career.data.freelance.length : null });
  const activeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  const retryCareer = file ? () => runCareer(file, runId.current) : undefined;
  const retryHobby = hobbies.length > 0 ? () => runHobbies(hobbies, runId.current) : undefined;

  return (
    <div className="screen desktop-content screen-enter">
      <style>{CSS}</style>
      <div className="px opp">
        <header className="opp-head opp-head-row">
          <div>
            <h1 className="serif">Your opportunities</h1>
            <p>{meta.fileName ? `Based on ${meta.fileName}` : "Based on your hobbies"}{meta.fileName && hasHobby ? " and your hobbies" : ""}</p>
          </div>
          <button type="button" className="btn-ghost press" onClick={newAnalysis}>New analysis</button>
        </header>

        {tabs.length > 1 && (
          <div className="opp-tabs" role="tablist" aria-label="Results">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={activeTab === t.id} className={activeTab === t.id ? "is-on" : ""} onClick={() => setTab(t.id)}>
                {t.label}
                {t.count != null && <span>{t.count}</span>}
              </button>
            ))}
          </div>
        )}

        {/* ---------- Certifications ---------- */}
        {activeTab === "certs" && (
          <div role="tabpanel">
            {career.status === "loading" && <Loading text="Reading your resume and matching certifications. This usually takes 20 to 40 seconds." />}
            {career.status === "error" && <Failed message={career.error} onRetry={retryCareer} onBack={newAnalysis} />}
            {career.status === "done" && career.data && (
              <>
                <ProfileStrip data={career.data} />
                {career.data.certifications.length === 0 ? (
                  <p className="opp-empty">
                    No certification from our trusted issuers would clearly raise your pay range. That usually means your
                    field rewards experience or a degree more than credentials. The Freelance tab still has options.
                  </p>
                ) : (
                  career.data.certifications.map((c, i) => (
                    <CertCard key={c.name} cert={c} first={i === 0} now={career.data!.profile.pay} symbol={career.data!.currencySymbol} />
                  ))
                )}
              </>
            )}
          </div>
        )}

        {/* ---------- Hobby income ---------- */}
        {activeTab === "hobby" && (
          <div role="tabpanel">
            {hobby.status === "loading" && <Loading text="Working out what each hobby could earn in the time you have." />}
            {hobby.status === "error" && <Failed message={hobby.error} onRetry={retryHobby} onBack={newAnalysis} />}
            {hobby.status === "done" && hobby.data && hobby.data.hobbies.map((g) => (
              <section key={g.hobby} className="opp-group">
                <h2>{titleCase(g.hobby)}</h2>
                {g.ideas.length === 0 ? (
                  <p className="opp-empty">{g.note}</p>
                ) : (
                  g.ideas.map((idea) => <IdeaCard key={idea.title} idea={idea} symbol={hobby.data!.currencySymbol} meta={meta} />)
                )}
              </section>
            ))}
          </div>
        )}

        {/* ---------- Freelance ---------- */}
        {activeTab === "freelance" && (
          <div role="tabpanel">
            {career.status === "loading" && <Loading text="Finding freelance work that fits the skills on your resume." />}
            {career.status === "error" && <Failed message={career.error} onRetry={retryCareer} onBack={newAnalysis} />}
            {career.status === "done" && career.data && (
              career.data.freelance.length === 0 ? (
                <p className="opp-empty">Nothing on this resume maps cleanly to freelance work yet.</p>
              ) : (
                career.data.freelance.map((f) => (
                  <article key={f.title} className="opp-card">
                    <div className="opp-card-top">
                      <h3>{f.title}</h3>
                      {f.rate && <span className="opp-rate">{f.rate}</span>}
                    </div>
                    <p className="opp-body">{f.how}</p>
                    {f.platforms.length > 0 && (
                      <div className="opp-tags" aria-label="Where to find work">
                        {f.platforms.map((p) => <span key={p}>{p}</span>)}
                      </div>
                    )}
                  </article>
                ))
              )
            )}
          </div>
        )}

        <p className="opp-fine">
          Pay ranges and earnings are AI estimates based on typical market figures. They are not offers or guarantees.
          Confirm fees and requirements on the issuer&apos;s site before paying for anything. If you&apos;re on a student
          or work visa, check that side income is allowed before you start.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   RESULT PIECES
   ============================================================ */

function Loading({ text }: { text: string }) {
  return (
    <div className="opp-loading" role="status">
      <p><span className="opp-spin" aria-hidden="true" /> {text}</p>
      <div className="opp-skel" style={{ height: 132 }} />
      <div className="opp-skel" style={{ height: 96 }} />
    </div>
  );
}

function Failed({ message, onRetry, onBack }: { message?: string; onRetry?: () => void; onBack: () => void }) {
  return (
    <div className="opp-failed" role="alert">
      <p><Ico d={I.alert} size={16} /> {message || "Something went wrong. Try again."}</p>
      <div>
        {onRetry && <button type="button" className="btn-ghost press" onClick={onRetry}>Try again</button>}
        <button type="button" className="opp-link" onClick={onBack}>Change my answers</button>
      </div>
    </div>
  );
}

function ProfileStrip({ data }: { data: CareerData }) {
  const p = data.profile;
  return (
    <section className="opp-profile">
      <div className="opp-profile-main">
        <p className="opp-profile-headline">{p.headline}</p>
        {p.topSkills.length > 0 && (
          <div className="opp-tags" aria-label="Skills found on your resume">
            {p.topSkills.map((s) => <span key={s}>{s}</span>)}
          </div>
        )}
      </div>
      {p.pay && (
        <div className="opp-profile-pay">
          <span>Typical pay now</span>
          <strong>{fmtRange(p.pay, data.currencySymbol, true)}</strong>
          <span>{p.payBasis || `${p.role}, per year`}</span>
        </div>
      )}
    </section>
  );
}

/* Two bars on one shared scale: where the person's pay sits now, and the range of the roles a certification opens. */
function PayShift({ now, after, symbol }: { now: Range; after: { low: number; high: number }; symbol: string }) {
  const lows = [after.low, now ? now.low : after.low];
  const highs = [after.high, now ? now.high : after.high];
  const min = Math.min(...lows) * 0.82;
  const max = Math.max(...highs) * 1.04;
  const span = Math.max(max - min, 1);
  const pos = (r: { low: number; high: number }) => ({
    left: `${((r.low - min) / span) * 100}%`,
    width: `${Math.max(((r.high - r.low) / span) * 100, 2)}%`,
  });
  const nowMid = now ? (now.low + now.high) / 2 : 0;
  const rawLift = now ? (after.low + after.high) / 2 - nowMid : 0;
  // Only call out a lift when it is clearly more than noise (5% of current midpoint).
  const lift = now && rawLift >= nowMid * 0.05 ? Math.round(rawLift) : 0;

  return (
    <div className="opp-pay">
      {now && (
        <div className="opp-pay-row">
          <span className="opp-pay-label">Now</span>
          <div className="opp-pay-track"><div className="opp-pay-bar is-now" style={pos(now)} /></div>
          <span className="opp-pay-value">{fmtRange(now, symbol, true)}</span>
        </div>
      )}
      <div className="opp-pay-row">
        <span className="opp-pay-label">Roles it opens</span>
        <div className="opp-pay-track"><div className="opp-pay-bar is-after" style={pos(after)} /></div>
        <span className="opp-pay-value is-after">{fmtRange(after, symbol, true)}</span>
      </div>
      {lift > 0 && (
        <p className="opp-pay-lift">Midpoint about {fmtMoney(lift, symbol, true)} a year higher</p>
      )}
    </div>
  );
}

function CertCard({ cert, first, now, symbol }: { cert: Cert; first: boolean; now: Range; symbol: string }) {
  return (
    <article className={`opp-card${first ? " is-first" : ""}`}>
      <div className="opp-card-top">
        <h3>{cert.name}</h3>
        {first && <span className="opp-pill">Start here</span>}
      </div>
      <p className="opp-issuer">
        <Ico d={I.check} size={14} /> Issued by {cert.issuer}
        {cert.issuerDomain && <span> ({cert.issuerDomain})</span>}
      </p>
      <p className="opp-body">{cert.fitReason}</p>

      {cert.pay && <PayShift now={now} after={cert.pay} symbol={symbol} />}

      <dl className="opp-facts">
        <div><dt>Cost</dt><dd>{cert.cost || "Check with issuer"}</dd></div>
        <div><dt>Study time</dt><dd>{cert.studyTime || "Varies"}</dd></div>
        <div><dt>Level</dt><dd>{cert.difficulty}</dd></div>
      </dl>

      {cert.rolesOpened.length > 0 && (
        <div className="opp-roles">
          <span className="opp-label">Roles that ask for it</span>
          <div className="opp-tags">{cert.rolesOpened.map((r) => <span key={r}>{r}</span>)}</div>
        </div>
      )}

      {cert.prerequisites && cert.prerequisites.toLowerCase() !== "none" && (
        <p className="opp-prereq"><strong>Before you sit it:</strong> {cert.prerequisites}</p>
      )}

      <div className="opp-actions">
        <a href={cert.lookupUrl} target="_blank" rel="noopener noreferrer">
          {cert.issuerDomain ? `Look it up on ${cert.issuerDomain}` : "Look up the requirements"} <Ico d={I.out} size={13} />
        </a>
        <a href={cert.jobsUrl} target="_blank" rel="noopener noreferrer">
          See open roles on LinkedIn <Ico d={I.out} size={13} />
        </a>
      </div>
    </article>
  );
}

function IdeaCard({ idea, symbol, meta }: { idea: HobbyIdea; symbol: string; meta: Meta }) {
  return (
    <article className="opp-card">
      <div className="opp-card-top">
        <h3>{idea.title}</h3>
        <span className="opp-pill is-quiet">{idea.effort}</span>
      </div>
      <p className="opp-body">{idea.howItWorks}</p>

      {idea.monthly && (
        <div className="opp-earn">
          <div>
            <strong>{fmtRange(idea.monthly, symbol)}</strong>
            <span> a month, at {meta.hoursLabel} hours a week</span>
          </div>
          {idea.earningBasis && <p>{idea.earningBasis}</p>}
          {meta.goalAmount > 0 && (
            <p className="opp-goal">
              Covers {meta.goalName ? `your ${meta.goalName}` : "your goal"} ({fmtMoney(meta.goalAmount, symbol)}) in{" "}
              {monthsToGoal(meta.goalAmount, idea.monthly)} at this pace.
            </p>
          )}
        </div>
      )}

      <dl className="opp-facts is-two">
        <div><dt>To get started</dt><dd>{idea.startupCost || "Varies"}</dd></div>
        <div><dt>First income in</dt><dd>{idea.timeToFirstIncome || "Varies"}</dd></div>
      </dl>

      {idea.firstSteps.length > 0 && (
        <div className="opp-steps">
          <span className="opp-label">First three steps</span>
          <ol>{idea.firstSteps.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
      )}

      {idea.findCustomers.length > 0 && (
        <div className="opp-roles">
          <span className="opp-label">Where to find customers</span>
          <div className="opp-tags">{idea.findCustomers.map((c) => <span key={c}>{c}</span>)}</div>
        </div>
      )}

      {idea.checkFirst && (
        <p className="opp-check"><Ico d={I.alert} size={15} /> <span><strong>Check first:</strong> {idea.checkFirst}</span></p>
      )}
    </article>
  );
}

/* ============================================================
   STYLES (scoped under .opp, built on the app's design tokens)
   ============================================================ */

const CSS = `
.opp { max-width: 760px; margin: 0 auto; padding-top: 28px; color: var(--text); }
.opp :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
.opp h2 { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.opp h3 { font-size: 17px; font-weight: 600; letter-spacing: -.01em; line-height: 1.3; }

.opp-head { margin-bottom: 32px; }
.opp-head h1 { font-size: 32px; font-weight: 600; line-height: 1.15; letter-spacing: -.5px; margin-bottom: 6px; }
.opp-head p { font-size: 14px; line-height: 1.55; color: var(--text2); max-width: 56ch; overflow-wrap: anywhere; }
.opp-head-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.opp-head-row .btn-ghost { padding: 9px 16px; font-size: 13px; }

.opp-sec { padding: 24px 0; border-top: 1px solid var(--border); }
.opp-sec h2 { margin-bottom: 12px; }
.opp-sec-row { display: flex; justify-content: space-between; align-items: baseline; }
.opp-sub { font-size: 13px; color: var(--text2); margin: -6px 0 14px; line-height: 1.5; }
.opp-hint { font-size: 12.5px; color: var(--text2); margin-top: 10px; line-height: 1.5; }
.opp-label { display: block; font-size: 12.5px; font-weight: 500; color: var(--text2); margin-bottom: 8px; }
.opp-error { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; line-height: 1.45; color: var(--red); background: var(--redbg); padding: 10px 12px; border-radius: var(--radius-sm); margin-top: 10px; }
.opp-error svg { flex: none; margin-top: 2px; }
.opp-link { background: none; border: 0; color: var(--accent); font-size: 13px; font-weight: 500; padding: 4px 2px; cursor: pointer; }
.opp-link:hover { text-decoration: underline; }

/* Resume upload */
.opp-drop { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 34px 20px; border: 1.5px dashed var(--border2); border-radius: var(--radius-lg); background: var(--surface); cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.opp-drop:hover, .opp-drop.is-drag { border-color: var(--accent); background: var(--accentbg); }
.opp-drop.is-error { border-color: var(--red); }
.opp-drop-ico { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--accentbg); color: var(--accent); margin-bottom: 6px; }
.opp-drop-title { font-size: 15px; font-weight: 600; }
.opp-drop-sub { font-size: 13px; color: var(--text2); }
.opp-drop-sub u { color: var(--accent); text-underline-offset: 3px; }
.opp-file-input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.opp-sr-btn { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; padding: 0; }
.opp-sr-btn:focus-visible { position: static; width: auto; height: auto; clip: auto; margin-top: 10px; padding: 8px 14px; border: 1px solid var(--border2); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); font-size: 13px; }
.opp-file { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid var(--border2); border-radius: var(--radius-md); background: var(--surface); }
.opp-file-ico { width: 40px; height: 40px; flex: none; border-radius: 10px; display: grid; place-items: center; background: var(--greenbg); color: var(--green); }
.opp-file-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.opp-file-text strong { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.opp-file-text span { font-size: 12.5px; color: var(--text2); }
.opp-icon-btn { width: 32px; height: 32px; flex: none; display: grid; place-items: center; border: 0; border-radius: 8px; background: none; color: var(--text2); cursor: pointer; }
.opp-icon-btn:hover { background: var(--surface2); color: var(--text); }

/* Hobby chips */
.opp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.opp-chip { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 13.5px; font-weight: 500; border-radius: var(--radius-full); border: 1px solid var(--border2); background: var(--surface); color: var(--text); cursor: pointer; transition: border-color .15s ease, background .15s ease, color .15s ease; }
.opp-chip:hover:not(:disabled) { border-color: var(--accent); }
.opp-chip.is-on { background: var(--accent); border-color: var(--accent); color: #fff; }
.opp-chip:disabled { opacity: .45; cursor: not-allowed; }
.opp-row { display: flex; gap: 8px; }
.opp-row .field { flex: 1; min-width: 0; cursor: text; }
.opp-add { padding: 0 18px; font-size: 13.5px; flex: none; }
.opp-add:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.opp .field { cursor: text; }

.opp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.opp-seg { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--border2); border-radius: 10px; overflow: hidden; background: var(--surface); }
.opp-seg button { padding: 12px 4px; font-size: 13.5px; font-weight: 500; border: 0; border-left: 1px solid var(--border); background: none; color: var(--text2); cursor: pointer; font-variant-numeric: tabular-nums; }
.opp-seg button:first-child { border-left: 0; }
.opp-seg button.is-on { background: var(--accentbg); color: var(--accent); font-weight: 600; }
.opp-goal-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 0; }

.opp-cta { padding-top: 8px; }
.opp-cta .btn-gold { width: 100%; padding: 15px 20px; font-size: 15px; }

/* Tabs */
.opp-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; overflow-x: auto; }
.opp-tabs button { display: inline-flex; align-items: center; gap: 8px; padding: 12px 14px; font-size: 14px; font-weight: 500; white-space: nowrap; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; background: none; color: var(--text2); cursor: pointer; }
.opp-tabs button:hover { color: var(--text); }
.opp-tabs button.is-on { color: var(--text); border-bottom-color: var(--accent); font-weight: 600; }
.opp-tabs button span { font-size: 12px; font-weight: 600; padding: 1px 7px; border-radius: var(--radius-full); background: var(--surface2); border: 1px solid var(--border); color: var(--text2); font-variant-numeric: tabular-nums; }
.opp-tabs button.is-on span { background: var(--accentbg); color: var(--accent); border-color: transparent; }

/* Profile summary */
.opp-profile { display: flex; gap: 24px; align-items: flex-start; justify-content: space-between; padding: 4px 0 24px; }
.opp-profile-main { min-width: 0; }
.opp-profile-headline { font-size: 15.5px; line-height: 1.55; margin-bottom: 12px; max-width: 52ch; }
.opp-profile-pay { flex: none; display: flex; flex-direction: column; gap: 2px; text-align: right; max-width: 200px; }
.opp-profile-pay span { font-size: 12.5px; color: var(--text2); line-height: 1.4; }
.opp-profile-pay strong { font-size: 22px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }

/* Cards */
.opp-card { padding: 20px; margin-bottom: 12px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
.opp-card.is-first { border-color: var(--accent); }
.opp-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.opp-pill { flex: none; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); background: var(--accent); color: #fff; white-space: nowrap; }
.opp-pill.is-quiet { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); font-weight: 500; }
.opp-rate { flex: none; font-size: 14px; font-weight: 600; color: var(--green); white-space: nowrap; }
.opp-issuer { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 13px; color: var(--green); margin-top: 6px; font-weight: 500; }
.opp-issuer span { color: var(--text2); font-weight: 400; }
.opp-body { font-size: 14px; line-height: 1.6; color: var(--text); margin-top: 12px; max-width: 68ch; }
.opp-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.opp-tags span { font-size: 12.5px; padding: 4px 10px; border-radius: var(--radius-full); background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
.opp-roles { margin-top: 16px; }
.opp-prereq { font-size: 13px; line-height: 1.55; color: var(--text2); margin-top: 14px; }
.opp-prereq strong { color: var(--text); font-weight: 600; }

/* Pay shift: the one loud element on the page */
.opp-pay { margin-top: 18px; padding: 16px; border-radius: var(--radius-sm); background: var(--bg2); }
.opp-pay-row { display: grid; grid-template-columns: 96px 1fr 112px; align-items: center; gap: 12px; }
.opp-pay-row + .opp-pay-row { margin-top: 10px; }
.opp-pay-label { font-size: 12.5px; color: var(--text2); }
.opp-pay-track { position: relative; height: 12px; border-radius: 6px; background: var(--border); }
.opp-pay-bar { position: absolute; top: 0; bottom: 0; border-radius: 6px; transform-origin: left center; animation: oppGrow .7s cubic-bezier(.16,1,.3,1) both; }
.opp-pay-bar.is-now { background: var(--text2); opacity: .55; }
.opp-pay-bar.is-after { background: var(--accent); animation-delay: .15s; }
.opp-pay-value { font-size: 13px; font-weight: 500; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.opp-pay-value.is-after { color: var(--accent); font-weight: 600; }
.opp-pay-lift { font-size: 12.5px; font-weight: 500; color: var(--green); margin-top: 12px; }
@keyframes oppGrow { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); } }

.opp-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
.opp-facts.is-two { grid-template-columns: repeat(2, 1fr); }
.opp-facts dt { font-size: 12.5px; color: var(--text2); margin-bottom: 3px; }
.opp-facts dd { font-size: 14px; font-weight: 500; line-height: 1.4; }

.opp-actions { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); }
.opp-actions a { display: inline-flex; align-items: center; gap: 5px; font-size: 13.5px; font-weight: 500; color: var(--accent); text-decoration: none; }
.opp-actions a:hover { text-decoration: underline; }

/* Hobby ideas */
.opp-group { margin-bottom: 28px; }
.opp-group > h2 { font-size: 18px; margin-bottom: 12px; }
.opp-earn { margin-top: 16px; padding: 14px 16px; border-radius: var(--radius-sm); background: var(--greenbg); }
.opp-earn strong { font-size: 20px; font-weight: 600; letter-spacing: -.02em; color: var(--green); font-variant-numeric: tabular-nums; }
.opp-earn span { font-size: 13px; color: var(--text2); }
.opp-earn p { font-size: 13px; line-height: 1.5; color: var(--text2); margin-top: 4px; }
.opp-earn .opp-goal { color: var(--text); font-weight: 500; margin-top: 8px; }
.opp-steps { margin-top: 16px; }
.opp-steps ol { margin: 0; padding-left: 20px; }
.opp-steps li { font-size: 14px; line-height: 1.55; padding-left: 4px; }
.opp-steps li + li { margin-top: 6px; }
.opp-steps li::marker { color: var(--accent); font-weight: 600; }
.opp-check { display: flex; gap: 10px; align-items: flex-start; margin-top: 16px; padding: 12px 14px; border-radius: var(--radius-sm); background: var(--amberbg); font-size: 13px; line-height: 1.55; }
.opp-check svg { flex: none; margin-top: 2px; color: var(--amber); }
.opp-check strong { font-weight: 600; }

/* States */
.opp-loading p { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text2); margin-bottom: 16px; line-height: 1.5; }
.opp-spin { width: 16px; height: 16px; flex: none; border-radius: 50%; border: 2px solid var(--border2); border-top-color: var(--accent); animation: oppSpin .8s linear infinite; }
@keyframes oppSpin { to { transform: rotate(360deg); } }
.opp-skel { border-radius: var(--radius-md); background: var(--surface2); margin-bottom: 12px; animation: oppPulse 1.6s ease-in-out infinite; }
@keyframes oppPulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
.opp-failed { padding: 18px 20px; border: 1px solid var(--red); border-radius: var(--radius-md); background: var(--redbg); }
.opp-failed p { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; }
.opp-failed p svg { flex: none; margin-top: 2px; color: var(--red); }
.opp-failed div { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
.opp-failed .btn-ghost { padding: 9px 16px; font-size: 13px; }
.opp-empty { font-size: 14px; line-height: 1.6; color: var(--text2); padding: 16px 0; max-width: 60ch; }
.opp-fine { font-size: 12.5px; line-height: 1.6; color: var(--text2); margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--border); max-width: 72ch; }

@media (max-width: 600px) {
  .opp { padding-top: 8px; }
  .opp-head h1 { font-size: 27px; }
  .opp-grid2 { grid-template-columns: 1fr; }
  .opp-profile { flex-direction: column; gap: 16px; }
  .opp-profile-pay { text-align: left; max-width: none; }
  .opp-card { padding: 16px; }
  .opp-pay { padding: 14px 12px; }
  .opp-pay-row { grid-template-columns: 1fr auto; gap: 6px 10px; }
  .opp-pay-track { grid-column: 1 / -1; grid-row: 2; }
  .opp-facts { grid-template-columns: 1fr 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .opp-pay-bar, .opp-skel { animation: none; }
  .opp-spin { animation-duration: 2.4s; }
}
`;
