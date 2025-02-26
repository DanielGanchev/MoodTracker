'use client'

import { useState, useEffect } from 'react'
import { MoodEntry, MoodRating, getMoodEmoji } from '@/types'

// Define a type for MoodEntry with camelCase variations
interface ExtendedMoodEntry extends MoodEntry {
  hadDream?: boolean
  hasPeriod?: boolean
  hasOvulation?: boolean
  // Add camelCase alternatives for numeric fields
  mindClarity?: number
  emotionalStability?: number
  sexDrive?: number
  sleepQuality?: number
}

interface MoodFormProps {
  selectedMood: MoodRating
  onSubmit: (entry: Omit<MoodEntry, 'id'> & { id?: string }) => void
  onCancel: () => void
  initialValues?: ExtendedMoodEntry | null
}

// Helper to ensure a value is a valid MoodRating
const ensureMoodRating = (value: number): MoodRating => {
  const validValue = Math.min(Math.max(1, Math.round(value)), 10) as MoodRating
  return validValue
}

const ScaleInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) => (
  <label className="block">
    <div className="flex justify-between text-white text-sm mb-2">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-pink-light"
    />
  </label>
)

const MoodForm = ({
  selectedMood,
  onSubmit,
  onCancel,
  initialValues,
}: MoodFormProps) => {
  // Debug what's coming in from initialValues
  useEffect(() => {
    if (initialValues) {
      console.log('InitialValues received in MoodForm:', initialValues)
      // Check for both formats
      console.log('mind_clarity:', initialValues.mind_clarity)
      console.log('mindClarity:', (initialValues as any).mindClarity)
      console.log('emotional_stability:', initialValues.emotional_stability)
      console.log(
        'emotionalStability:',
        (initialValues as any).emotionalStability
      )
      console.log('focus:', initialValues.focus)
      console.log('sex_drive:', initialValues.sex_drive)
      console.log('sexDrive:', (initialValues as any).sexDrive)
      console.log('sleep_quality:', initialValues.sleep_quality)
      console.log('sleepQuality:', (initialValues as any).sleepQuality)
    }
  }, [initialValues])

  // Use initial state without date values that cause hydration issues
  const [formData, setFormData] = useState<Omit<MoodEntry, 'id'>>({
    profile_id: initialValues?.profile_id || '',
    date: initialValues?.date || '',
    mood: selectedMood,
    // Handle both snake_case and camelCase versions
    mind_clarity:
      initialValues?.mind_clarity ??
      (initialValues as ExtendedMoodEntry)?.mindClarity ??
      5,
    motivation: initialValues?.motivation ?? 5,
    energy: initialValues?.energy ?? 5,
    productivity: initialValues?.productivity ?? 5,
    emotional_stability:
      initialValues?.emotional_stability ??
      (initialValues as ExtendedMoodEntry)?.emotionalStability ??
      5,
    focus: initialValues?.focus ?? 5,
    appetite: initialValues?.appetite ?? 5,
    sex_drive:
      initialValues?.sex_drive ??
      (initialValues as ExtendedMoodEntry)?.sexDrive ??
      5,
    cravings: initialValues?.cravings ?? 5,
    sleep_quality:
      initialValues?.sleep_quality ??
      (initialValues as ExtendedMoodEntry)?.sleepQuality ??
      5,
    notes: initialValues?.notes || '',
    created_at: initialValues?.created_at || '',
    updated_at: initialValues?.updated_at || '',
    // Add boolean fields explicitly with more explicit checks
    had_dream:
      initialValues?.had_dream === true || initialValues?.hadDream === true,
    has_period:
      initialValues?.has_period === true || initialValues?.hasPeriod === true,
    has_ovulation:
      initialValues?.has_ovulation === true ||
      initialValues?.hasOvulation === true,
  })

  // Initialize checkbox state with boolean values from initialValues, checking both property formats
  const [hadDream, setHadDream] = useState(
    initialValues?.had_dream === true || initialValues?.hadDream === true
  )
  const [hasPeriod, setHasPeriod] = useState(
    initialValues?.has_period === true || initialValues?.hasPeriod === true
  )
  const [hasOvulation, setHasOvulation] = useState(
    initialValues?.has_ovulation === true ||
      initialValues?.hasOvulation === true
  )

  // Client-side only effect to set date values
  useEffect(() => {
    // Fill in date values on client side only to prevent hydration issues
    const now = new Date().toISOString()
    setFormData((prev) => ({
      ...prev,
      date: prev.date || now,
      created_at: prev.created_at || now,
      updated_at: prev.updated_at || now,
    }))
  }, [])

  useEffect(() => {
    // Update formData when selectedMood changes
    setFormData((prev) => ({
      ...prev,
      mood: selectedMood,
    }))
  }, [selectedMood])

  useEffect(() => {
    // Update checkbox state if initialValues change
    if (initialValues) {
      // Check both property naming styles (snake_case and camelCase)
      const hadDreamValue =
        initialValues.had_dream === true || initialValues.hadDream === true
      const hasPeriodValue =
        initialValues.has_period === true || initialValues.hasPeriod === true
      const hasOvulationValue =
        initialValues.has_ovulation === true ||
        initialValues.hasOvulation === true

      setHadDream(hadDreamValue)
      setHasPeriod(hasPeriodValue)
      setHasOvulation(hasOvulationValue)

      // Also handle numeric fields with potential different formats
      const mindClarityValue =
        initialValues.mind_clarity ??
        (initialValues as ExtendedMoodEntry)?.mindClarity ??
        5
      const emotionalStabilityValue =
        initialValues.emotional_stability ??
        (initialValues as ExtendedMoodEntry)?.emotionalStability ??
        5
      const sexDriveValue =
        initialValues.sex_drive ??
        (initialValues as ExtendedMoodEntry)?.sexDrive ??
        5
      const sleepQualityValue =
        initialValues.sleep_quality ??
        (initialValues as ExtendedMoodEntry)?.sleepQuality ??
        5
      const focusValue = initialValues.focus ?? 5

      // Update all form data
      setFormData((prev) => ({
        ...prev,
        // Update the boolean fields
        had_dream: hadDreamValue,
        has_period: hasPeriodValue,
        has_ovulation: hasOvulationValue,
        // Update the numeric fields
        mind_clarity: mindClarityValue,
        emotional_stability: emotionalStabilityValue,
        sex_drive: sexDriveValue,
        sleep_quality: sleepQualityValue,
        focus: focusValue,
      }))

      console.log('Updated form data with initialValues:', {
        mind_clarity: mindClarityValue,
        emotional_stability: emotionalStabilityValue,
        sex_drive: sexDriveValue,
        sleep_quality: sleepQualityValue,
        focus: focusValue,
      })
    }
  }, [initialValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get notes text directly without modification
    const notesText = formData.notes || ''

    // Log the formData values before submission for debugging
    console.log('Form data values before submit:', {
      mind_clarity: formData.mind_clarity,
      emotional_stability: formData.emotional_stability,
      focus: formData.focus,
      sex_drive: formData.sex_drive,
      sleep_quality: formData.sleep_quality,
    })

    // Ensure booleans are passed as true/false, not truthy/falsy values
    const formDataToSubmit = {
      ...(initialValues?.id ? { id: initialValues.id } : {}),
      profile_id: formData.profile_id,
      date: formData.date,
      mood: formData.mood,
      mind_clarity: formData.mind_clarity ?? 5,
      motivation: formData.motivation ?? 5,
      energy: formData.energy ?? 5,
      productivity: formData.productivity ?? 5,
      emotional_stability: formData.emotional_stability ?? 5,
      appetite: formData.appetite ?? 5,
      sex_drive: formData.sex_drive ?? 5,
      cravings: formData.cravings ?? 5,
      sleep_quality: formData.sleep_quality ?? 5,
      focus: formData.focus ?? 5,
      notes: notesText,
      created_at: formData.created_at,
      updated_at: formData.updated_at,
      had_dream: hadDream === true, // Ensure it's a proper boolean
      has_period: hasPeriod === true, // Ensure it's a proper boolean
      has_ovulation: hasOvulation === true, // Ensure it's a proper boolean
    }

    // Update the timestamp on client side only
    if (typeof window !== 'undefined') {
      formDataToSubmit.updated_at = new Date().toISOString()
    }

    // Log the data being submitted for debugging
    console.log('Submitting form data:', formDataToSubmit)

    onSubmit(formDataToSubmit)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-pink-dark rounded-3xl p-6 w-full max-w-md space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-white">
          {initialValues?.id ? 'Update Mood Details' : 'Add Mood Details'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-6xl">
                {getMoodEmoji(formData.mood as MoodRating)}
              </span>
            </div>
            <ScaleInput
              label="Mood"
              value={formData.mood}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  mood: ensureMoodRating(value),
                }))
              }
            />

            <div className="space-y-4 pt-4">
              <ScaleInput
                label="Mind Clarity"
                value={formData.mind_clarity}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, mind_clarity: value }))
                }
              />
              <ScaleInput
                label="Motivation"
                value={formData.motivation}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, motivation: value }))
                }
              />
              <ScaleInput
                label="Energy Level"
                value={formData.energy}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, energy: value }))
                }
              />
              <ScaleInput
                label="Productivity"
                value={formData.productivity}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, productivity: value }))
                }
              />
              <ScaleInput
                label="Emotional Stability"
                value={formData.emotional_stability}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    emotional_stability: value,
                  }))
                }
              />
              <ScaleInput
                label="Focus"
                value={formData.focus ?? 5}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, focus: value }))
                }
              />
              <ScaleInput
                label="Appetite"
                value={formData.appetite}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, appetite: value }))
                }
              />
              <ScaleInput
                label="Sex Drive"
                value={formData.sex_drive}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, sex_drive: value }))
                }
              />
              <ScaleInput
                label="Cravings"
                value={formData.cravings}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, cravings: value }))
                }
              />
            </div>

            <ScaleInput
              label="Sleep Quality"
              value={formData.sleep_quality}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  sleep_quality: value,
                }))
              }
            />

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hadDream}
                onChange={(e) => setHadDream(e.target.checked)}
                className="w-5 h-5 rounded bg-pink-medium/30 border-pink-light"
              />
              <span className="text-white/90 text-sm font-medium">
                I had a dream
              </span>
            </label>

            <label className="block">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasPeriod}
                  onChange={(e) => {
                    setHasPeriod(e.target.checked)
                    if (e.target.checked) setHasOvulation(false)
                  }}
                  className="rounded border-pink-600 bg-pink-900/50 text-pink-600 focus:ring-pink-600"
                />
                <span className="text-white">Period Day</span>
              </div>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasOvulation"
                checked={hasOvulation}
                disabled={hasPeriod}
                onChange={(e) => {
                  setHasOvulation(e.target.checked)
                  if (e.target.checked) setHasPeriod(false)
                }}
                className="rounded border-pink-light text-pink-600 focus:ring-pink-500"
              />
              <label htmlFor="hasOvulation" className="text-white text-sm">
                Ovulation Day
              </label>
            </div>

            <label className="block">
              <span className="text-white/90 text-sm mb-2 block font-medium">
                Notes
              </span>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full bg-pink-medium/30 text-white rounded-lg p-3 border border-pink-light min-h-[100px]
                  placeholder:text-white/70"
                placeholder="How are you feeling? What's on your mind?"
              />
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-pink-light text-white font-semibold
                hover:bg-pink-medium transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-pink-medium text-white font-semibold
                hover:bg-pink-light transition-colors"
            >
              {initialValues?.id ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MoodForm
