# Cardiac Rehab Companion

A static, mobile-first React prototype for people already enrolled in cardiac rehabilitation.

It is intentionally conservative: the app supports preparation, symptom checking, Borg RPE reflection, recovery goals and medication adherence tracking. It does not diagnose, prescribe exercise, set heart-rate zones, change medicines, or replace a clinician.

## Clinical Safety Posture

- Emergency red flags are surfaced before exercise, with clear 999 escalation language.
- Non-emergency symptoms pause the session and direct the user back to their cardiac rehab team, GP, NHS 111, or their agreed care plan.
- Session content is framed as clinician-plan support, not individual medical advice.
- Borg RPE guidance is conservative and avoids unprescribed target heart-rate zones.
- Medicines are tracked for adherence only.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run test
npm run build
```

The app is static/client-side and ready to deploy on Vercel using the Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`
