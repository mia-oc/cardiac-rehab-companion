import { describe, expect, it } from 'vitest'
import {
  getRpeGuidance,
  getSafetyStatus,
  initialSymptoms,
  type SymptomState,
} from './clinicalSafety'

const symptoms = (override: Partial<SymptomState>) => ({
  ...initialSymptoms,
  ...override,
})

describe('clinical safety guardrails', () => {
  it('escalates emergency red flags before exercise starts', () => {
    expect(getSafetyStatus(symptoms({ chestPain: true }))).toBe('emergency')
    expect(getSafetyStatus(symptoms({ breathlessAtRest: true }))).toBe(
      'emergency',
    )
    expect(getSafetyStatus(symptoms({ dizzyOrFaint: true }))).toBe('emergency')
  })

  it('pauses sessions for symptoms requiring clinician advice', () => {
    expect(getSafetyStatus(symptoms({ palpitations: true }))).toBe('pause')
    expect(getSafetyStatus(symptoms({ unwellOrFever: true }))).toBe('pause')
    expect(getSafetyStatus(symptoms({ newSwelling: true }))).toBe('pause')
  })

  it('allows a ready state only when no symptoms are selected', () => {
    expect(getSafetyStatus(initialSymptoms)).toBe('ready')
  })

  it('keeps high RPE guidance conservative', () => {
    expect(getRpeGuidance(16).tone).toBe('stop')
    expect(getRpeGuidance(16).action).toContain('Stop')
  })
})
