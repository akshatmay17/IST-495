import { NextRequest, NextResponse } from 'next/server'

// Rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

// The SHAP-derived model knowledge baked into the prompt
const MODEL_KNOWLEDGE = `You are WiseCard's Credit Score Optimizer AI. You have access to a Gradient Boosting model trained on 150,000 real consumer credit profiles (Kaggle "Give Me Some Credit" dataset). The model achieves AUC 0.87.

CRITICAL MODEL FINDINGS FROM SHAP ANALYSIS:
1. Revolving Utilization (credit card balance / limit) is the #1 risk driver (SHAP importance: 0.42). Risk increases sharply above 30%, and exponentially above 70%.
2. Late payments carry heavy weight: 90+ day lates (SHAP: 0.04) are 3x worse than 30-59 day lates (SHAP: 0.03). Even one 90-day late dramatically increases default probability.
3. Debt-to-Income ratio (SHAP: 0.21) — risk accelerates above 40%.
4. Age provides protective effect — older borrowers have lower risk. Each decade above 30 reduces risk meaningfully.
5. Monthly Income (SHAP: 0.04) — below $3,000/mo significantly increases risk.
6. The interaction between delinquency and utilization is multiplicative — having BOTH high utilization AND late payments is far worse than either alone.
7. Number of open credit lines has a U-shaped effect — too few (<3) or too many (>15) increases risk.

SCORE CALIBRATION (mapped to FICO-like scale):
- 750-850: Excellent (default prob < 5%)
- 700-749: Good (5-15%)
- 650-699: Fair (15-30%)
- 600-649: Poor (30-50%)
- 300-599: Very Poor (>50%)

RESPONSE FORMAT: You MUST respond with ONLY a raw JSON object. No markdown, no backticks, no text before or after the JSON. Start your response with { and end with }. This is critical — any text outside the JSON will break the parser.`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
    if (!checkRate(ip)) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }

    const { profile, score, riskLevel, defaultProb, factors } = await req.json()

    const userPrompt = `Analyze this credit profile and provide personalized recommendations:

PROFILE:
- Credit Utilization: ${(profile.utilization * 100).toFixed(1)}%
- Age: ${profile.age}
- 30-59 Day Late Payments: ${profile.late30}
- 60-89 Day Late Payments: ${profile.late60}
- 90+ Day Late Payments: ${profile.late90}
- Debt-to-Income Ratio: ${(profile.debtRatio * 100).toFixed(1)}%
- Monthly Income: $${profile.income.toLocaleString()}
- Open Credit Lines: ${profile.openLoans}
- Real Estate Loans: ${profile.realEstate}
- Dependents: ${profile.dependents}

MODEL OUTPUT:
- Estimated Credit Score: ${score}
- Risk Level: ${riskLevel}
- Default Probability: ${(defaultProb * 100).toFixed(1)}%

TOP SHAP FACTORS (positive = increases risk, negative = decreases risk):
${factors.map((f: any) => `- ${f.feature}: impact ${f.impact > 0 ? '+' : ''}${f.impact.toFixed(4)}, current value: ${f.value}`).join('\n')}

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence overall assessment of this person's credit health",
  "recommendations": [
    {
      "title": "specific actionable title",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "impact": "estimated score improvement e.g. +30-50 points",
      "why": "1-2 sentences explaining why this matters based on the SHAP analysis",
      "steps": ["step 1", "step 2", "step 3"],
      "timeframe": "how long this takes to show results"
    }
  ],
  "insights": [
    "interesting pattern or non-obvious finding from their profile"
  ],
  "three_month_plan": "a concise 3-month action plan prioritized by impact"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1536,
        system: MODEL_KNOWLEDGE,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Claude API error:', data)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const text = Array.isArray(data.content)
      ? data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
      : ''

    // Robustly extract JSON from Claude's response
    try {
      // Strip markdown fences and any surrounding text
      let clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      // If there's text before the first {, strip it
      const firstBrace = clean.indexOf('{')
      const lastBrace = clean.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.slice(firstBrace, lastBrace + 1)
      }
      const parsed = JSON.parse(clean)
      return NextResponse.json(parsed)
    } catch (parseErr) {
      // Fallback: generate a structured response from the raw text
      return NextResponse.json({
        summary: text.slice(0, 500) || 'AI analysis completed but response format was unexpected.',
        recommendations: [{
          title: 'Review your full analysis',
          priority: 'MEDIUM',
          impact: 'See details above',
          why: 'The AI provided insights in text format rather than structured data.',
          steps: ['Review the summary above', 'Check the SHAP Analysis tab for detailed factor breakdown', 'Adjust your profile sliders to explore what-if scenarios'],
          timeframe: 'Ongoing'
        }],
        insights: ['AI response was received but could not be fully structured. The SHAP analysis on the Results tab provides accurate factor-by-factor breakdown.'],
        three_month_plan: 'Focus on the highest-impact factors shown in your SHAP analysis: reduce utilization below 30%, eliminate late payments, and lower your debt-to-income ratio.'
      })
    }

  } catch (error) {
    console.error('Credit analyze error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
