'use client'

import { MoodEntry } from '@/types'
import { getMoodLabel } from '@/types'
import jsPDF from 'jspdf'
// @ts-ignore - Import jspdf-autotable directly
import autoTable from 'jspdf-autotable'

// Define types for jspdf-autotable
interface AutoTableData {
  pageNumber: number
  pageCount: number
  settings: any
  cursor: any
  [key: string]: any
}

// Define metric colors for consistent use in the chart
const metricColors = {
  mood: [41, 128, 185], // Blue
  mind_clarity: [46, 204, 113], // Green
  motivation: [155, 89, 182], // Purple
  energy: [230, 126, 34], // Orange
  productivity: [52, 152, 219], // Light Blue
  emotional_stability: [231, 76, 60], // Red
  focus: [241, 196, 15], // Yellow
  appetite: [26, 188, 156], // Teal
  sex_drive: [243, 156, 18], // Amber
  cravings: [211, 84, 0], // Dark Orange
  sleep_quality: [142, 68, 173], // Dark Purple
}

// The actual PDF generation function
export const generatePDF = async (
  entries: MoodEntry[],
  fromDate: string,
  toDate: string
): Promise<boolean> => {
  try {
    // Create a new PDF document in landscape orientation for more space
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Cast to any to avoid TypeScript errors with jsPDF methods
    const pdfDoc = doc as any

    // Set document properties
    pdfDoc.setProperties({
      title: 'Mood Tracker Report',
      subject: `Mood data from ${new Date(
        fromDate
      ).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`,
      creator: 'Mood Tracker App',
    })

    // Define colors
    const primaryColor = [41, 128, 185] // Blue
    const secondaryColor = [52, 152, 219] // Lighter blue
    const accentColor = [26, 188, 156] // Teal

    // Page dimensions
    const pageWidth = pdfDoc.internal.pageSize.getWidth()
    const pageHeight = pdfDoc.internal.pageSize.getHeight()

    // Add header with gradient background
    pdfDoc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdfDoc.rect(0, 0, pageWidth, 20, 'F')

    // Add title
    pdfDoc.setTextColor(255, 255, 255)
    pdfDoc.setFontSize(18)
    pdfDoc.setFont('helvetica', 'bold')
    pdfDoc.text('Mood Tracker Report', pageWidth / 2, 12, { align: 'center' })

    // Add date range
    pdfDoc.setFontSize(10)
    pdfDoc.setFont('helvetica', 'normal')
    pdfDoc.text(
      `Date Range: ${new Date(fromDate).toLocaleDateString()} - ${new Date(
        toDate
      ).toLocaleDateString()}`,
      pageWidth - 15,
      12,
      { align: 'right' }
    )

    // Reset text color for the rest of the document
    pdfDoc.setTextColor(0, 0, 0)

    // Sort entries by date for consistent display
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Format entries for the table - include all metrics
    const tableRows = sortedEntries.map((entry) => {
      return [
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
      ]
    })

    // Create the table with improved styling
    autoTable(pdfDoc, {
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
      startY: 25,
      styles: {
        fontSize: 7,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: secondaryColor,
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 18 }, // Date
        1: { cellWidth: 18 }, // Mood label
        2: { cellWidth: 10 }, // Rating
        3: { cellWidth: 12 }, // Mind Clarity
        4: { cellWidth: 12 }, // Motivation
        5: { cellWidth: 10 }, // Energy
        6: { cellWidth: 14 }, // Productivity
        7: { cellWidth: 14 }, // Emotional Stability
        8: { cellWidth: 10 }, // Focus
        9: { cellWidth: 10 }, // Appetite
        10: { cellWidth: 10 }, // Sex Drive
        11: { cellWidth: 10 }, // Cravings
        12: { cellWidth: 12 }, // Sleep Quality
        13: { cellWidth: 10 }, // Dream
        14: { cellWidth: 10 }, // Period
        15: { cellWidth: 10 }, // Ovulation
        16: { cellWidth: 'auto' }, // Notes - auto width for remaining space
      },
      alternateRowStyles: {
        fillColor: [245, 250, 255],
      },
      margin: { top: 25 },
      didDrawPage: (data: AutoTableData) => {
        // Add page number at the bottom
        pdfDoc.setFontSize(8)
        pdfDoc.text(
          `Page ${data.pageNumber} of ${pdfDoc.internal.getNumberOfPages()}`,
          pageWidth - 10,
          pageHeight - 5,
          { align: 'right' }
        )
      },
    })

    // Get the final Y position after the table
    const finalY = pdfDoc.lastAutoTable.finalY + 5

    // Calculate summary statistics
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
      const avgProductivity =
        entries.reduce((sum, entry) => sum + entry.productivity, 0) /
        entries.length
      const avgEmotionalStability =
        entries.reduce((sum, entry) => sum + entry.emotional_stability, 0) /
        entries.length
      const avgFocus =
        entries.reduce((sum, entry) => sum + (entry.focus || 5), 0) /
        entries.length
      const avgAppetite =
        entries.reduce((sum, entry) => sum + entry.appetite, 0) / entries.length
      const avgSexDrive =
        entries.reduce((sum, entry) => sum + entry.sex_drive, 0) /
        entries.length
      const avgCravings =
        entries.reduce((sum, entry) => sum + entry.cravings, 0) / entries.length
      const avgSleepQuality =
        entries.reduce((sum, entry) => sum + entry.sleep_quality, 0) /
        entries.length

      // Add summary section with a nice box
      pdfDoc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      pdfDoc.setFillColor(250, 250, 250)
      pdfDoc.setLineWidth(0.5)
      pdfDoc.roundedRect(10, finalY, 80, 80, 2, 2, 'FD')

      // Add summary title
      pdfDoc.setFontSize(11)
      pdfDoc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text('Summary Statistics', 15, finalY + 7)

      // Add summary data in two columns
      pdfDoc.setFontSize(8)
      pdfDoc.setTextColor(60, 60, 60)
      pdfDoc.setFont('helvetica', 'normal')

      // First column
      pdfDoc.text(`Average Mood: ${avgMood.toFixed(1)}`, 15, finalY + 14)
      pdfDoc.text(
        `Average Mind Clarity: ${avgClarity.toFixed(1)}`,
        15,
        finalY + 21
      )
      pdfDoc.text(
        `Average Motivation: ${avgMotivation.toFixed(1)}`,
        15,
        finalY + 28
      )
      pdfDoc.text(`Average Energy: ${avgEnergy.toFixed(1)}`, 15, finalY + 35)
      pdfDoc.text(
        `Average Productivity: ${avgProductivity.toFixed(1)}`,
        15,
        finalY + 42
      )
      pdfDoc.text(
        `Average Emotional Stability: ${avgEmotionalStability.toFixed(1)}`,
        15,
        finalY + 49
      )

      // Second column
      pdfDoc.text(`Average Focus: ${avgFocus.toFixed(1)}`, 15, finalY + 56)
      pdfDoc.text(
        `Average Appetite: ${avgAppetite.toFixed(1)}`,
        15,
        finalY + 63
      )
      pdfDoc.text(
        `Average Sex Drive: ${avgSexDrive.toFixed(1)}`,
        15,
        finalY + 70
      )
      pdfDoc.text(
        `Average Cravings: ${avgCravings.toFixed(1)}`,
        50,
        finalY + 56
      )
      pdfDoc.text(
        `Average Sleep Quality: ${avgSleepQuality.toFixed(1)}`,
        50,
        finalY + 63
      )

      // Only create chart if we have at least 2 entries
      if (entries.length >= 2) {
        try {
          // Chart dimensions and position
          const chartX = 100
          const chartY = finalY
          const chartWidth = pageWidth - chartX - 10
          const chartHeight = 80
          const yScale = chartHeight / 10 // Scale based on 1-10 mood range
          const xScale = chartWidth / (sortedEntries.length - 1 || 1)

          // Extract dates and metric values
          const dates = sortedEntries.map((entry) =>
            new Date(entry.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          )

          // Extract all metrics for the chart
          const metricValues = {
            mood: sortedEntries.map((entry) => entry.mood),
            mind_clarity: sortedEntries.map((entry) => entry.mind_clarity),
            motivation: sortedEntries.map((entry) => entry.motivation),
            energy: sortedEntries.map((entry) => entry.energy),
            productivity: sortedEntries.map((entry) => entry.productivity),
            emotional_stability: sortedEntries.map(
              (entry) => entry.emotional_stability
            ),
            focus: sortedEntries.map((entry) => entry.focus || 5),
            appetite: sortedEntries.map((entry) => entry.appetite),
            sex_drive: sortedEntries.map((entry) => entry.sex_drive),
            cravings: sortedEntries.map((entry) => entry.cravings),
            sleep_quality: sortedEntries.map((entry) => entry.sleep_quality),
          }

          // Draw chart title
          pdfDoc.setFontSize(11)
          pdfDoc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
          pdfDoc.setFont('helvetica', 'bold')
          pdfDoc.text(
            'Trends Visualization',
            chartX + chartWidth / 2,
            chartY - 2,
            {
              align: 'center',
            }
          )

          // Draw chart background with rounded corners
          pdfDoc.setFillColor(250, 250, 250)
          pdfDoc.setDrawColor(200, 200, 200)
          pdfDoc.setLineWidth(0.2)
          pdfDoc.roundedRect(
            chartX,
            chartY,
            chartWidth,
            chartHeight,
            2,
            2,
            'FD'
          )

          // Draw mood zones (colored backgrounds for different mood ranges)
          // Happy zone (9-10)
          pdfDoc.setFillColor(200, 255, 200, 0.2) // Light green with transparency
          pdfDoc.rect(chartX, chartY, chartWidth, yScale * 2, 'F')

          // Good zone (7-8)
          pdfDoc.setFillColor(220, 255, 220, 0.2) // Lighter green with transparency
          pdfDoc.rect(chartX, chartY + yScale * 2, chartWidth, yScale * 2, 'F')

          // Normal zone (5-6)
          pdfDoc.setFillColor(255, 255, 220, 0.2) // Light yellow with transparency
          pdfDoc.rect(chartX, chartY + yScale * 4, chartWidth, yScale * 2, 'F')

          // Unhappy zone (3-4)
          pdfDoc.setFillColor(255, 220, 220, 0.2) // Light red with transparency
          pdfDoc.rect(chartX, chartY + yScale * 6, chartWidth, yScale * 2, 'F')

          // Sad zone (1-2)
          pdfDoc.setFillColor(255, 200, 200, 0.2) // Darker light red with transparency
          pdfDoc.rect(chartX, chartY + yScale * 8, chartWidth, yScale * 2, 'F')

          // Draw chart axes
          pdfDoc.setDrawColor(150, 150, 150)
          pdfDoc.setLineWidth(0.3)

          // X-axis
          pdfDoc.line(
            chartX,
            chartY + chartHeight,
            chartX + chartWidth,
            chartY + chartHeight
          )

          // Y-axis
          pdfDoc.line(chartX, chartY, chartX, chartY + chartHeight)

          // Draw y-axis labels (mood scale)
          pdfDoc.setFontSize(7)
          pdfDoc.setTextColor(100, 100, 100)
          for (let i = 0; i <= 10; i += 2) {
            const yPos = chartY + chartHeight - i * yScale
            pdfDoc.text(i.toString(), chartX - 4, yPos, { align: 'right' })

            // Draw light horizontal grid lines
            if (i > 0) {
              pdfDoc.setDrawColor(200, 200, 200)
              pdfDoc.setLineWidth(0.1)
              pdfDoc.line(chartX, yPos, chartX + chartWidth, yPos)
            }
          }

          // Draw x-axis labels (dates) - show only a subset to avoid overcrowding
          const dateInterval = Math.max(1, Math.floor(dates.length / 8))
          pdfDoc.setTextColor(100, 100, 100)
          for (let i = 0; i < dates.length; i += dateInterval) {
            const xPos = chartX + i * xScale
            pdfDoc.text(dates[i], xPos, chartY + chartHeight + 5, {
              align: 'center',
            })
          }

          // Draw lines for each metric with different colors and styles
          const metricsToShow = [
            { key: 'mood', label: 'Mood', lineWidth: 1.5 },
            { key: 'mind_clarity', label: 'Mind Clarity', lineWidth: 1.0 },
            { key: 'motivation', label: 'Motivation', lineWidth: 1.0 },
            { key: 'energy', label: 'Energy', lineWidth: 1.0 },
            { key: 'productivity', label: 'Productivity', lineWidth: 1.0 },
            {
              key: 'emotional_stability',
              label: 'Emotional Stability',
              lineWidth: 1.0,
            },
            { key: 'focus', label: 'Focus', lineWidth: 1.0 },
            { key: 'appetite', label: 'Appetite', lineWidth: 1.0 },
            { key: 'sex_drive', label: 'Sex Drive', lineWidth: 1.0 },
            { key: 'cravings', label: 'Cravings', lineWidth: 1.0 },
            { key: 'sleep_quality', label: 'Sleep Quality', lineWidth: 1.0 },
          ]

          // Draw each metric line
          metricsToShow.forEach((metric) => {
            const values = metricValues[metric.key as keyof typeof metricValues]
            const color = metricColors[metric.key as keyof typeof metricColors]

            pdfDoc.setDrawColor(color[0], color[1], color[2])
            pdfDoc.setLineWidth(metric.lineWidth)

            // Plot points and connect them with lines
            for (let i = 0; i < sortedEntries.length - 1; i++) {
              const x1 = chartX + i * xScale
              const y1 = chartY + chartHeight - values[i] * yScale
              const x2 = chartX + (i + 1) * xScale
              const y2 = chartY + chartHeight - values[i + 1] * yScale

              // Draw line connecting points
              pdfDoc.line(x1, y1, x2, y2)

              // Draw data points (only for mood to avoid clutter)
              if (metric.key === 'mood') {
                pdfDoc.setFillColor(color[0], color[1], color[2])
                pdfDoc.circle(x1, y1, 1.0, 'F')
              }
            }

            // Draw the last point (only for mood)
            if (metric.key === 'mood') {
              pdfDoc.setFillColor(color[0], color[1], color[2])
              pdfDoc.circle(
                chartX + (sortedEntries.length - 1) * xScale,
                chartY + chartHeight - values[values.length - 1] * yScale,
                1.0,
                'F'
              )
            }
          })

          // Add legend for metrics
          const legendStartX = chartX
          const legendStartY = chartY + chartHeight + 10
          const legendItemWidth = 50
          const legendItemHeight = 4
          const legendItemsPerRow = 5

          pdfDoc.setFontSize(6)

          metricsToShow.forEach((metric, index) => {
            const row = Math.floor(index / legendItemsPerRow)
            const col = index % legendItemsPerRow

            const legendX = legendStartX + col * legendItemWidth
            const legendY = legendStartY + row * legendItemHeight * 1.5

            const color = metricColors[metric.key as keyof typeof metricColors]

            // Draw color line
            pdfDoc.setDrawColor(color[0], color[1], color[2])
            pdfDoc.setLineWidth(1.0)
            pdfDoc.line(legendX, legendY, legendX + 8, legendY)

            // Draw label
            pdfDoc.setTextColor(60, 60, 60)
            pdfDoc.text(metric.label, legendX + 10, legendY + 2)
          })
        } catch (chartError) {
          console.error('Error creating chart:', chartError)
          pdfDoc.setFontSize(10)
          pdfDoc.setTextColor(200, 0, 0)
          pdfDoc.text(
            'Error creating trend chart. Please try again later.',
            100,
            finalY + 20
          )
        }
      } else {
        // Not enough data points
        pdfDoc.setFontSize(10)
        pdfDoc.setTextColor(100, 100, 100)
        pdfDoc.text(
          'Not enough data points to generate a trend chart.',
          100,
          finalY + 20
        )
      }
    }

    // Add footer with app name
    pdfDoc.setFillColor(240, 240, 240)
    pdfDoc.rect(0, pageHeight - 8, pageWidth, 8, 'F')

    pdfDoc.setFontSize(8)
    pdfDoc.setTextColor(100, 100, 100)
    pdfDoc.text('Generated by Mood Tracker App', 10, pageHeight - 3)

    // Add timestamp
    const now = new Date()
    pdfDoc.text(
      `Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
      pageWidth - 10,
      pageHeight - 3,
      { align: 'right' }
    )

    // Download the PDF with a descriptive filename
    pdfDoc.save(`mood-tracker-report-${fromDate}-to-${toDate}.pdf`)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
