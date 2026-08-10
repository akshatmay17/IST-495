"use client";

import { useState } from "react";

interface Recommendation {
  id: string;
  type: "hobby" | "gig" | "certification";
  title: string;
  reason: string;
  timeToGoal: string;
  roleCount?: number; // static for now -- swap for a live job-search API later
}

const HOBBY_IDEAS: Record<string, { title: string; reason: string; payRange: string }> = {
  carpentry: {
    title: "Sell garage-built furniture",
    reason: "List on Etsy or Facebook Marketplace \u2014 local buyers pay a premium for handmade pieces",
    payRange: "$200\u2013600 per piece, based on materials and time",
  },
  woodworking: {
    title: "Sell garage-built furniture",
    reason: "List on Etsy or Facebook Marketplace \u2014 local buyers pay a premium for handmade pieces",
    payRange: "$200\u2013600 per piece, based on materials and time",
  },
  cooking: {
    title: "Home cooking and meal prep sales",
    reason: "Check your state's cottage food laws first, then list through local pickup groups",
    payRange: "$8\u201315 per meal, 10\u201320 orders a week to start",
  },
  photography: {
    title: "Weekend event photography",
    reason: "Local families and small businesses often need affordable photographers",
    payRange: "$100\u2013300 per session",
  },
  gaming: {
    title: "Game coaching or content creation",
    reason: "Platforms like Fiverr have a coaching category; streaming takes longer to monetize",
    payRange: "$15\u201340/hr for coaching",
  },
  sewing: {
    title: "Alterations and custom sewing",
    reason: "Dry cleaners and local Facebook groups regularly need alteration referrals",
    payRange: "$15\u201360 per garment",
  },
  writing: {
    title: "Freelance writing and editing",
    reason: "Upwork and Fiverr both show consistent demand for short-form content",
    payRange: "$20\u201360 per article",
  },
};

const CERTIFICATION_CATALOG = [
  {
    id: "aws-ccp",
    name: "AWS Certified Cloud Practitioner",
    keywords: ["aws", "cloud", "python", "sql", "developer", "engineer"],
    studyTime: "~2 weeks",
    cost: "$100 exam fee",
    issuer: "Amazon Web Services",
    roleCount: 340,
  },
  {
    id: "google-data-analytics",
    name: "Google Data Analytics Certificate",
    keywords: ["sql", "excel", "data", "python", "tableau", "analyst"],
    studyTime: "~6 weeks",
    cost: "$49/month (Coursera)",
    issuer: "Google Career Certificates",
    roleCount: 520,
  },
  {
    id: "comptia-security",
    name: "CompTIA Security+",
    keywords: ["security", "networking", "it", "cyber"],
    studyTime: "~8 weeks",
    cost: "$392 exam fee",
    issuer: "CompTIA",
    roleCount: 410,
  },
  {
    id: "capm",
    name: "CAPM (entry-level project management)",
    keywords: ["project", "management", "agile", "scrum", "coordinator"],
    studyTime: "~4 weeks",
    cost: "$300 exam fee",
    issuer: "Project Management Institute",
    roleCount: 275,
  },
];

function mockAnalyzeResumeText(text: string) {
  const lower = text.toLowerCase();
  const allKeywords = Array.from(new Set(CERTIFICATION_CATALOG.flatMap((c) => c.keywords)));
  const detected = allKeywords.filter((k) => lower.includes(k));
  return {
    detectedKeywords: detected,
    summary:
      detected.length > 0
        ? `Detected: ${detected.slice(0, 5).join(", ")}`
        : "No specific skills detected \u2014 try pasting more detail, or skip and use hobbies + goal only",
  };
}

function estimateTimeframe(gap: number, payRange: string): string {
  const numbers = payRange.match(/\d+/g)?.map(Number) ?? [];
  const avg = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 100;
  const unitsNeeded = Math.ceil(gap / avg);
  if (unitsNeeded <= 2) return "under a month";
  if (unitsNeeded <= 6) return "1\u20132 months";
  return "2\u20133 months";
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 13,
  padding: 10,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontFamily: "inherit",
};

export default function SkillsAdvisor() {
  const [step, setStep] = useState<"intake" | "results">("intake");
  const [resumeText, setResumeText] = useState("");
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalTimeframe, setGoalTimeframe] = useState("");
  const [monthlySurplus, setMonthlySurplus] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const analyzeResume = () => {
    if (!resumeText.trim()) return;
    const { detectedKeywords, summary } = mockAnalyzeResumeText(resumeText);
    setDetectedKeywords(detectedKeywords);
    setAnalysisSummary(summary);
  };

  const addHobby = () => {
    const trimmed = hobbyInput.trim().toLowerCase();
    if (trimmed && !hobbies.includes(trimmed)) setHobbies([...hobbies, trimmed]);
    setHobbyInput("");
  };

  const buildRecommendations = () => {
    const amount = parseFloat(goalAmount.replace(/[^0-9.]/g, "")) || 0;
    const surplus = parseFloat(monthlySurplus.replace(/[^0-9.]/g, "")) || 0;
    const gap = Math.max(amount - surplus, 0);
    const recs: Recommendation[] = [];

    hobbies.forEach((h) => {
      const idea = HOBBY_IDEAS[h];
      if (idea) {
        recs.push({
          id: `hobby-${h}`,
          type: "hobby",
          title: idea.title,
          reason: idea.reason,
          timeToGoal: gap > 0 ? estimateTimeframe(gap, idea.payRange) : "flexible",
        });
      }
    });

    if (detectedKeywords.length > 0) {
      recs.push({
        id: "gig-freelance",
        type: "gig",
        title: `Freelance ${detectedKeywords.slice(0, 2).join(" and ")} gigs`,
        reason: "Matches skills from your resume \u2014 Upwork and Fiverr both show active demand",
        timeToGoal: gap > 0 ? "a few weeks, depending on hours" : "flexible",
      });
    }

    const matched = CERTIFICATION_CATALOG.filter((c) =>
      c.keywords.some((k) => detectedKeywords.includes(k))
    ).slice(0, 3);

    matched.forEach((cert) => {
      recs.push({
        id: cert.id,
        type: "certification",
        title: cert.name,
        reason: `${cert.studyTime} \u00b7 ${cert.cost} \u00b7 issued by ${cert.issuer}`,
        timeToGoal: "longer-term \u2014 opens future roles",
        roleCount: cert.roleCount,
      });
    });

    setRecommendations(recs);
    setStep("results");
  };

  if (step === "results") {
    return (
      <ResultsView
        recommendations={recommendations}
        goalName={goalName}
        onBack={() => setStep("intake")}
      />
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        Opportunities
      </h1>
      <p style={{ fontSize: 13, color: "var(--text2)", margin: "0 0 20px" }}>
        Tell us about your skills, hobbies, and goal \u2014 we'll rank the fastest legitimate ways to close the gap.
      </p>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>
            Paste your resume text
          </p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste the text of your resume here (skills, tools, experience)\u2026"
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <button onClick={analyzeResume} className="press" style={{ fontSize: 13, marginTop: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>
            Analyze
          </button>
          {analysisSummary && (
            <p style={{ fontSize: 12, color: "var(--text2)", margin: "8px 0 0" }}>{analysisSummary}</p>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>
            Hobbies and interests
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {hobbies.map((h) => (
              <span
                key={h}
                onClick={() => setHobbies(hobbies.filter((x) => x !== h))}
                style={{
                  background: "var(--accent)",
                  opacity: 0.9,
                  color: "#fff",
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                {h} \u2715
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHobby()}
              placeholder="e.g. carpentry, cooking, photography"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addHobby} className="press" style={{ fontSize: 13, padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>
              Add
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>
            What are you saving for?
          </p>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g. New MacBook Pro"
            style={{ ...inputStyle, marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="Total cost, e.g. 2400"
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              type="text"
              value={goalTimeframe}
              onChange={(e) => setGoalTimeframe(e.target.value)}
              placeholder="Timeframe, e.g. 3 months"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <input
            type="text"
            value={monthlySurplus}
            onChange={(e) => setMonthlySurplus(e.target.value)}
            placeholder="What your income already covers toward this, e.g. 140/month"
            style={inputStyle}
          />
        </div>

        <button
          onClick={buildRecommendations}
          disabled={!goalName || !goalAmount || hobbies.length === 0}
          className="press"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            padding: 13,
            borderRadius: 12,
            cursor: "pointer",
            opacity: !goalName || !goalAmount || hobbies.length === 0 ? 0.5 : 1,
          }}
        >
          Get my options
        </button>
      </div>
    </div>
  );
}

function ResultsView({
  recommendations,
  goalName,
  onBack,
}: {
  recommendations: Recommendation[];
  goalName: string;
  onBack: () => void;
}) {
  const sorted = [...recommendations].sort((a, b) => {
    const order = { hobby: 0, gig: 1, certification: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
      <button onClick={onBack} className="press" style={{ fontSize: 13, marginBottom: 16, background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", padding: 0 }}>
        \u2190 Back
      </button>
      <p style={{ fontSize: 13, color: "var(--text2)", margin: "0 0 12px", fontWeight: 600 }}>
        Ranked for you {goalName ? `\u2014 toward "${goalName}"` : ""}
      </p>
      {sorted.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text2)" }}>
          No matches yet \u2014 try adding a hobby from the list (carpentry, cooking, photography,
          gaming, sewing, writing) or pasting more resume detail.
        </p>
      )}
      {sorted.map((rec, i) => (
        <div
          key={rec.id}
          style={{
            background: "var(--surface)",
            border: i === 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
            borderRadius: 16,
            padding: "16px 18px",
            marginBottom: 10,
          }}
        >
          {i === 0 && (
            <span style={{ background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
              Best match
            </span>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginTop: i === 0 ? 10 : 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>{rec.title}</p>
            {rec.type === "certification" && rec.roleCount != null && (
              <span style={{ background: "rgba(34,197,94,.15)", color: "#22C55E", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
                +{rec.roleCount} roles
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: "4px 0 0" }}>{rec.reason}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", margin: "8px 0 0" }}>{rec.timeToGoal}</p>
        </div>
      ))}
      {sorted.some((r) => r.type === "certification") && (
        <p style={{ fontSize: 11, color: "var(--text3)", margin: "8px 0 0", fontStyle: "italic" }}>
          Role counts shown are estimates for now \u2014 will connect to live job data later.
        </p>
      )}
    </div>
  );
}
