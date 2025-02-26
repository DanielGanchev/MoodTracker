'use client'

import { MoodEntry } from '@/types'
import { getMoodLabel } from '@/types'
import jsPDF from 'jspdf'
// @ts-ignore - Import jspdf-autotable directly
import autoTable from 'jspdf-autotable'

// The actual PDF generation function
export const generatePDF = async (
  entries: MoodEntry[],
  fromDate: string,
  toDate: string
): Promise<boolean> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF('landscape')

    // Add title
    doc.setFontSize(18)
    doc.text('Mood Tracker Report', 14, 22)

    // Add date range
    doc.setFontSize(12)
    doc.text(
      `Date Range: ${new Date(fromDate).toLocaleDateString()} - ${new Date(
        toDate
      ).toLocaleDateString()}`,
      14,
      32
    )

    // Format entries for the table
    const tableRows = entries.map((entry) => [
      new Date(entry.date).toLocaleDateString(),
      getMoodLabel(entry.mood as any),
      entry.mood,
      entry.mind_clarity,
      entry.motivation,
      entry.energy,
      entry.productivity,
      entry.emotional_stability,
      entry.focus || 'N/A',
      entry.appetite,
      entry.sex_drive,
      entry.cravings,
      entry.sleep_quality,
      entry.had_dream ? 'Yes' : 'No',
      entry.has_period ? 'Yes' : 'No',
      entry.has_ovulation ? 'Yes' : 'No',
      entry.notes || '',
    ])

    // Create the table with improved column headers
    autoTable(doc, {
      head: [
        [
          'Date',
          'Mood',
          'Rating',
          'Mind\nClarity',
          'Motivation',
          'Energy',
          'Productivity',
          'Emotional\nStability',
          'Focus',
          'Appetite',
          'Sex\nDrive',
          'Cravings',
          'Sleep\nQuality',
          'Dream',
          'Period',
          'Ovulation',
          'Notes',
        ],
      ],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Date
        1: { cellWidth: 20 }, // Mood label
        2: { cellWidth: 12 }, // Rating
        3: { cellWidth: 15 }, // Mind Clarity
        4: { cellWidth: 15 }, // Motivation
        5: { cellWidth: 12 }, // Energy
        6: { cellWidth: 17 }, // Productivity
        7: { cellWidth: 17 }, // Emotional Stability
        8: { cellWidth: 12 }, // Focus
        9: { cellWidth: 15 }, // Appetite
        10: { cellWidth: 12 }, // Sex Drive
        11: { cellWidth: 15 }, // Cravings
        12: { cellWidth: 15 }, // Sleep Quality
        13: { cellWidth: 12 }, // Dream
        14: { cellWidth: 12 }, // Period
        15: { cellWidth: 15 }, // Ovulation
        16: { cellWidth: 'auto' }, // Notes - auto width for remaining space
      },
      margin: { top: 10 },
    })

    // Generate summary statistics
    if (entries.length > 0) {
      const avgMood =
        entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length
      const avgClarity =
        entries.reduce((sum, entry) => sum + entry.mind_clarity, 0) /
        entries.length
      const avgMotivation =
        entries.reduce((sum, entry) => sum + entry.motivation, 0) /
        entries.length
      const avgEnergy =
        entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length
      const avgFocus =
        entries.reduce((sum, entry) => sum + (entry.focus || 5), 0) /
        entries.length

      // Add summary section after the table
      // @ts-ignore - This property exists but TypeScript doesn't know about it
      const finalY = doc.lastAutoTable.finalY + 10

      doc.setFontSize(14)
      doc.text('Summary Statistics', 14, finalY)

      doc.setFontSize(10)
      doc.text(`Average Mood: ${avgMood.toFixed(1)}`, 14, finalY + 10)
      doc.text(
        `Average Mind Clarity: ${avgClarity.toFixed(1)}`,
        14,
        finalY + 16
      )
      doc.text(
        `Average Motivation: ${avgMotivation.toFixed(1)}`,
        14,
        finalY + 22
      )
      doc.text(`Average Energy: ${avgEnergy.toFixed(1)}`, 14, finalY + 28)
      doc.text(`Average Focus: ${avgFocus.toFixed(1)}`, 14, finalY + 34)
    }

    // Download the PDF
    doc.save(`mood-tracker-report-${fromDate}-to-${toDate}.pdf`)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
