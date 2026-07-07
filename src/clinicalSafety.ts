export type SymptomKey =
  | 'chestPain'
  | 'breathlessAtRest'
  | 'dizzyOrFaint'
  | 'palpitations'
  | 'unwellOrFever'
  | 'newSwelling'

export type SymptomState = Record<SymptomKey, boolean>

export type SafetyStatus = 'emergency' | 'pause' | 'ready'

const emergencySymptoms: SymptomKey[] = [
  'chestPain',
  'breathlessAtRest',
  'dizzyOrFaint',
]

const pauseSymptoms: SymptomKey[] = ['palpitations', 'unwellOrFever', 'newSwelling']

export const initialSymptoms: SymptomState = {
  chestPain: false,
  breathlessAtRest: false,
  dizzyOrFaint: false,
  palpitations: false,
  unwellOrFever: false,
  newSwelling: false,
}

export function getSafetyStatus(symptoms: SymptomState): SafetyStatus {
  if (emergencySymptoms.some((symptom) => symptoms[symptom])) {
    return 'emergency'
  }

  if (pauseSymptoms.some((symptom) => symptoms[symptom])) {
    return 'pause'
  }

  return 'ready'
}

export function getRpeGuidance(rpe: number) {
  if (rpe <= 10) {
    return {
      tone: 'low',
      label: 'Very light',
      action: 'Useful for warm-up, cool-down, or an easier recovery day.',
    }
  }

  if (rpe <= 13) {
    return {
      tone: 'steady',
      label: 'Light to somewhat hard',
      action:
        'A common supervised rehab effort range when it matches your clinician plan.',
    }
  }

  if (rpe <= 15) {
    return {
      tone: 'caution',
      label: 'Hard',
      action:
        'Ease back and check this level is within your agreed cardiac rehab plan.',
    }
  }

  return {
    tone: 'stop',
    label: 'Very hard',
    action:
      'Stop, recover, and seek clinical advice before repeating this effort.',
  }
}
