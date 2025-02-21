'use client'

import { useState, useEffect } from 'react'
import { MoodEntry, MoodRating, getMoodEmoji } from '@/types'

interface MoodFormProps {
  selectedMood: MoodRating
  onSubmit: (entry: Omit<MoodEntry, 'id'> & { id?: string }) => void
  onCancel: () => void
  initialValues?: MoodEntry | null
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
  const [formData, setFormData] = useState<Omit<MoodEntry, 'id'>>({
    timestamp: initialValues?.timestamp || new Date().toISOString(),
    moodRating: selectedMood,
    sleepQuality: initialValues?.sleepQuality || 5,
    hadDream: initialValues?.hadDream || false,
    hasPeriod: initialValues?.hasPeriod || false,
    hasOvulation: initialValues?.hasOvulation || false,
    description: initialValues?.description || '',
    motivation: initialValues?.motivation ?? 5,
    energyLevel: initialValues?.energyLevel ?? 5,
    productivity: initialValues?.productivity ?? 5,
    emotionalStability: initialValues?.emotionalStability ?? 5,
    appetite: initialValues?.appetite ?? 5,
    sexDrive: initialValues?.sexDrive ?? 5,
    cravings: initialValues?.cravings ?? 5,
    mindClarity: initialValues?.mindClarity || 5,
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      moodRating: selectedMood,
    }))
  }, [selectedMood])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...(initialValues?.id ? { id: initialValues.id } : {}),
      timestamp: initialValues?.timestamp || new Date().toISOString(),
      moodRating: formData.moodRating,
      sleepQuality: formData.sleepQuality,
      hadDream: formData.hadDream,
      description: formData.description,
      hasPeriod: formData.hasPeriod,
      hasOvulation: formData.hasOvulation,
      motivation: formData.motivation,
      energyLevel: formData.energyLevel,
      productivity: formData.productivity,
      emotionalStability: formData.emotionalStability,
      appetite: formData.appetite,
      sexDrive: formData.sexDrive,
      cravings: formData.cravings,
      mindClarity: formData.mindClarity,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-pink-dark rounded-3xl p-6 w-full max-w-md space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-white">Add Mood Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-6xl">
                {getMoodEmoji(formData.moodRating)}
              </span>
            </div>
            <ScaleInput
              label="Mood"
              value={formData.moodRating}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  moodRating: value as MoodRating,
                }))
              }
            />

            <div className="space-y-4 pt-4">
              <ScaleInput
                label="Motivation"
                value={formData.motivation}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, motivation: value }))
                }
              />
              <ScaleInput
                label="Energy Level"
                value={formData.energyLevel}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, energyLevel: value }))
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
                value={formData.emotionalStability}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    emotionalStability: value,
                  }))
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
                value={formData.sexDrive}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, sexDrive: value }))
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
              value={formData.sleepQuality}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  sleepQuality: value,
                }))
              }
            />

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.hadDream}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hadDream: e.target.checked,
                  }))
                }
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
                  checked={formData.hasPeriod}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasPeriod: e.target.checked,
                    }))
                  }
                  className="rounded border-pink-600 bg-pink-900/50 text-pink-600 focus:ring-pink-600"
                />
                <span className="text-white">Period Day</span>
              </div>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasOvulation"
                checked={formData.hasOvulation}
                disabled={formData.hasPeriod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hasOvulation: e.target.checked,
                    hasPeriod: e.target.checked ? false : prev.hasPeriod,
                  }))
                }
                className="rounded border-pink-light text-pink-600 focus:ring-pink-500"
              />
              <label htmlFor="hasOvulation" className="text-white text-sm">
                Ovulation Day
              </label>
            </div>

            <label className="block">
              <span className="text-white/90 text-sm mb-2 block font-medium">
                Description
              </span>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-pink-medium/30 text-white rounded-lg p-3 border border-pink-light min-h-[100px]
                  placeholder:text-white/70"
                placeholder="How are you feeling? What's on your mind?"
              />
            </label>

            <div>
              <label className="block text-white text-sm mb-2">
                Mind Clarity
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mindClarity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mindClarity: Number(e.target.value),
                  }))
                }
                className="w-full accent-pink-600"
              />
              <div className="flex justify-between text-white/60 text-xs">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
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
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MoodForm
