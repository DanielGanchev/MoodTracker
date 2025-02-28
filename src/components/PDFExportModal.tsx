'use client'

import React, { useState } from 'react'
import { usePDFGenerator } from './PDFGenerator'
import { MoodEntry } from '@/types'
import { Dialog } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/utils/supabaseClient'

interface PDFExportModalProps {
  isOpen: boolean
  onClose: () => void
}

const PDFExportModal: React.FC<PDFExportModalProps> = ({ isOpen, onClose }) => {
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Use our custom PDF generator hook
  const { generatePDF, isLoading: isPDFGenerating } = usePDFGenerator()

  const handleExport = async () => {
    // Reset error state
    setError('')

    // Validate dates
    if (!fromDate || !toDate) {
      setError('Please select both start and end dates.')
      return
    }

    const from = new Date(fromDate)
    const to = new Date(toDate)

    if (from > to) {
      setError('Start date must be before end date.')
      return
    }

    try {
      setIsLoading(true)

      // Fetch mood entries for the selected date range
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .gte('date', fromDate)
        .lte('date', toDate)
        .order('date', { ascending: false })

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        setError('No mood entries found for the selected date range.')
        setIsLoading(false)
        return
      }

      // Generate PDF using our client-side generator
      await generatePDF(data as MoodEntry[], fromDate, toDate)

      // Close modal after successful export
      onClose()
    } catch (err) {
      console.error('Error exporting PDF:', err)
      setError('An error occurred while generating the PDF. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Export Mood Data to PDF
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-4">
              Select a date range to export your mood data to a PDF report.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              key="cancel-button"
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              key="generate-button"
              type="button"
              onClick={handleExport}
              disabled={isLoading || isPDFGenerating}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isLoading || isPDFGenerating ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default PDFExportModal
