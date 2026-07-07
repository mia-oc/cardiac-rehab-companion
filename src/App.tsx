import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CalendarCheck2,
  Check,
  ChevronRight,
  ClipboardCheck,
  HeartPulse,
  Info,
  Medal,
  PhoneCall,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TimerReset,
} from 'lucide-react'
import './App.css'
import {
  getRpeGuidance,
  getSafetyStatus,
  initialSymptoms,
  type SymptomKey,
  type SymptomState,
} from './clinicalSafety'

type SessionType = 'breathing' | 'walk' | 'strength'

const symptomOptions: Array<{
  key: SymptomKey
  label: string
  helper: string
}> = [
  {
    key: 'chestPain',
    label: 'Chest pain, pressure, tightness, heaviness, or pain spreading to your arm, jaw, neck, back, or stomach',
    helper: 'Especially if new, severe, worsening, or not settling with rest.',
  },
  {
    key: 'breathlessAtRest',
    label: 'Breathless at rest or unusually short of breath',
    helper: 'More than expected before starting today.',
  },
  {
    key: 'dizzyOrFaint',
    label: 'Dizzy, faint, confused, or clammy',
    helper: 'Do not start exercise while this is present.',
  },
  {
    key: 'palpitations',
    label: 'New palpitations or irregular heartbeat',
    helper: "Pause and follow your rehab team's advice.",
  },
  {
    key: 'unwellOrFever',
    label: 'Fever, infection, sickness, or feeling acutely unwell',
    helper: 'Recovery takes priority over training.',
  },
  {
    key: 'newSwelling',
    label: 'New ankle swelling or sudden weight change',
    helper: 'Track it and contact your clinical team.',
  },
]

const sessions: Array<{
  key: SessionType
  title: string
  time: string
  focus: string
  steps: string[]
}> = [
  {
    key: 'breathing',
    title: 'Reset and breathing',
    time: '8 min',
    focus: 'Recovery',
    steps: ['Settle seated', 'Slow breathing', 'Gentle mobility'],
  },
  {
    key: 'walk',
    title: 'Clinician-plan walk',
    time: '18 min',
    focus: 'Aerobic',
    steps: ['Warm up', 'Steady RPE check', 'Cool down'],
  },
  {
    key: 'strength',
    title: 'Light strength circuit',
    time: '14 min',
    focus: 'Confidence',
    steps: ['Chair stands', 'Wall press', 'Balance hold'],
  },
]

const recoveryGoals = [
  'Walk to the corner shop without stopping',
  'Climb one flight of stairs with confidence',
  'Return to gardening in short, paced blocks',
]

const medications = ['Morning tablets', 'Lunchtime dose', 'Evening tablets']

function App() {
  const [symptoms, setSymptoms] = useState<SymptomState>(initialSymptoms)
  const [sessionType, setSessionType] = useState<SessionType>('walk')
  const [rpe, setRpe] = useState(12)
  const [checkedMedication, setCheckedMedication] = useState<string[]>([
    'Morning tablets',
  ])
  const [completedGoals, setCompletedGoals] = useState<string[]>([
    recoveryGoals[0],
  ])

  const safetyStatus = useMemo(() => getSafetyStatus(symptoms), [symptoms])
  const rpeGuidance = getRpeGuidance(rpe)
  const selectedSession = sessions.find((session) => session.key === sessionType)

  const toggleSymptom = (key: SymptomKey) => {
    setSymptoms((current) => ({ ...current, [key]: !current[key] }))
  }

  const toggleMedication = (name: string) => {
    setCheckedMedication((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    )
  }

  const toggleGoal = (goal: string) => {
    setCompletedGoals((current) =>
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal],
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-band" aria-labelledby="page-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <ShieldCheck size={16} aria-hidden="true" />
            Clinically cautious rehab companion
          </div>
          <h1 id="page-title">Cardiac rehab, paced around your care plan.</h1>
          <p>
            A supportive daily companion for people already enrolled in cardiac
            rehabilitation. It tracks preparation, effort, recovery and
            medicines without diagnosing, prescribing, or replacing clinicians.
          </p>
        </div>

        <div className="phone-preview" aria-label="Today's recovery summary">
          <div className="phone-header">
            <HeartPulse size={22} aria-hidden="true" />
            <span>Today</span>
          </div>
          <div className="progress-ring" aria-hidden="true">
            <span>Plan</span>
          </div>
          <p>Clinician-approved plan loaded</p>
          <div className="mini-metrics">
            <span>3 check-ins</span>
            <span>RPE guided</span>
          </div>
        </div>
      </section>

      <section className={`safety-panel ${safetyStatus}`}>
        <div className="section-heading">
          <div>
            <span className="kicker">Before exercise</span>
            <h2>Safety check</h2>
          </div>
          <Stethoscope aria-hidden="true" />
        </div>

        <div className="symptom-list">
          {symptomOptions.map((symptom) => (
            <button
              className={symptoms[symptom.key] ? 'symptom active' : 'symptom'}
              key={symptom.key}
              onClick={() => toggleSymptom(symptom.key)}
              type="button"
            >
              <span className="check-dot" aria-hidden="true">
                {symptoms[symptom.key] ? <Check size={15} /> : null}
              </span>
              <span>
                <strong>{symptom.label}</strong>
                <small>{symptom.helper}</small>
              </span>
            </button>
          ))}
        </div>

        <SafetyAdvice status={safetyStatus} />
      </section>

      <section className="dashboard-grid">
        <article className="panel session-panel">
          <div className="section-heading">
            <div>
              <span className="kicker">Today's session</span>
              <h2>Choose from your rehab plan</h2>
            </div>
            <Activity aria-hidden="true" />
          </div>

          <div className="segmented" aria-label="Session type">
            {sessions.map((session) => (
              <button
                className={sessionType === session.key ? 'selected' : ''}
                key={session.key}
                onClick={() => setSessionType(session.key)}
                type="button"
              >
                {session.focus}
              </button>
            ))}
          </div>

          {selectedSession ? (
            <div className="session-card">
              <div>
                <h3>{selectedSession.title}</h3>
                <p>{selectedSession.time}</p>
              </div>
              <ul>
                {selectedSession.steps.map((step) => (
                  <li key={step}>
                    <ChevronRight size={16} aria-hidden="true" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rpe-control">
            <div className="rpe-topline">
              <span>Borg RPE</span>
              <strong>{rpe}</strong>
            </div>
            <input
              aria-label="Borg rating of perceived exertion"
              max="20"
              min="6"
              onChange={(event) => setRpe(Number(event.target.value))}
              type="range"
              value={rpe}
            />
            <div className={`rpe-guidance ${rpeGuidance.tone}`}>
              <strong>{rpeGuidance.label}</strong>
              <span>{rpeGuidance.action}</span>
            </div>
          </div>
        </article>

        <article className="panel recovery-panel">
          <div className="section-heading">
            <div>
              <span className="kicker">Recovery goals</span>
              <h2>Clinician-set milestones</h2>
            </div>
            <Medal aria-hidden="true" />
          </div>
          <div className="goal-list">
            {recoveryGoals.map((goal) => (
              <label key={goal}>
                <input
                  checked={completedGoals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                  type="checkbox"
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
          <div className="recovery-note">
            <Sparkles size={17} aria-hidden="true" />
            <span>
              Use these as prompts for your next rehab review, not as a target
              to push through symptoms.
            </span>
          </div>
        </article>

        <article className="panel medication-panel">
          <div className="section-heading">
            <div>
              <span className="kicker">Medicines</span>
              <h2>Tracking only</h2>
            </div>
            <Pill aria-hidden="true" />
          </div>
          <div className="medication-list">
            {medications.map((medicine) => (
              <button
                className={
                  checkedMedication.includes(medicine) ? 'taken' : undefined
                }
                key={medicine}
                onClick={() => toggleMedication(medicine)}
                type="button"
              >
                <span>{medicine}</span>
                <Check size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="caption">
            This records adherence. It does not change medicines or advise dose
            timing.
          </p>
        </article>

        <article className="panel escalation-panel">
          <div className="section-heading">
            <div>
              <span className="kicker">Escalation</span>
              <h2>When to seek help</h2>
            </div>
            <PhoneCall aria-hidden="true" />
          </div>
          <div className="escalation-list">
            <div>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>
                Call 999 for severe chest pain, collapse, stroke symptoms, or
                severe breathlessness.
              </span>
            </div>
            <div>
              <ClipboardCheck size={18} aria-hidden="true" />
              <span>
                Contact your cardiac rehab team for new symptoms, repeated high
                RPE, or uncertainty about your plan.
              </span>
            </div>
            <div>
              <Info size={18} aria-hidden="true" />
              <span>
                Use NHS 111 when urgent advice is needed but it is not an
                emergency.
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="timeline-band">
        <div className="section-heading">
          <div>
            <span className="kicker">Session rhythm</span>
            <h2>Warm up, check effort, recover</h2>
          </div>
          <TimerReset aria-hidden="true" />
        </div>
        <div className="timeline">
          <div>
            <CalendarCheck2 size={18} aria-hidden="true" />
            <strong>Plan</strong>
            <span>Follow the activity agreed with your clinical team.</span>
          </div>
          <div>
            <Activity size={18} aria-hidden="true" />
            <strong>Pace</strong>
            <span>
              Use symptoms and Borg RPE rather than unprescribed heart-rate
              zones.
            </span>
          </div>
          <div>
            <ShieldCheck size={18} aria-hidden="true" />
            <strong>Recover</strong>
            <span>Log how you felt and bring concerns to your next review.</span>
          </div>
        </div>
      </section>
    </main>
  )
}

function SafetyAdvice({ status }: { status: ReturnType<typeof getSafetyStatus> }) {
  if (status === 'emergency') {
    return (
      <div className="advice emergency-advice" role="alert">
        <PhoneCall size={20} aria-hidden="true" />
        <div>
          <strong>Do not exercise. Seek urgent help now.</strong>
          <span>
            If symptoms are severe, sudden, or not settling, call 999. Follow
            your discharge or cardiac rehab safety plan.
          </span>
        </div>
      </div>
    )
  }

  if (status === 'pause') {
    return (
      <div className="advice pause-advice" role="status">
        <AlertTriangle size={20} aria-hidden="true" />
        <div>
          <strong>Pause today's session.</strong>
          <span>
            Rest, record what changed, and contact your cardiac rehab team or GP
            according to your care plan.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="advice ready-advice" role="status">
      <ShieldCheck size={20} aria-hidden="true" />
      <div>
          <strong>Ready to consider a planned session.</strong>
          <span>
          You have not reported symptoms this prototype flags. This does not
          confirm exercise is safe. Keep checking symptoms and follow your
          clinician-approved plan.
          </span>
      </div>
    </div>
  )
}

export default App
