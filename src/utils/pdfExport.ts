// PDF Export utility
import { MoodEntry } from '@/types'
import { getMoodLabel } from '@/types'

// Define types for jspdf-autotable
interface AutoTableData {
  pageNumber: number
  pageCount: number
  settings: any
  cursor: any
  [key: string]: any
}

// This function will be used client-side only, so we import dependencies dynamically
export const generateMoodPDF = async (
  entries: MoodEntry[],
  fromDate: string,
  toDate: string
) => {
  try {
    // Dynamically import required libraries
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

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

    // Format entries for the table - only include essential columns for better readability
    const tableRows = sortedEntries.map((entry) => {
      return [
        new Date(entry.date).toLocaleDateString(),
        getMoodLabel(entry.mood as any),
        entry.mood,
        entry.mind_clarity,
        entry.motivation,
        entry.energy,
        entry.productivity,
        entry.focus || 'N/A',
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
          'Focus',
          'Notes',
        ],
      ],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: secondaryColor,
        textColor: 255,
        fontSize: 9,
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
        5: { cellWidth: 15 }, // Energy
        6: { cellWidth: 15 }, // Productivity
        7: { cellWidth: 15 }, // Focus
        8: { cellWidth: 'auto' }, // Notes - auto width for remaining space
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
      const avgFocus =
        entries.reduce((sum, entry) => sum + (entry.focus || 5), 0) /
        entries.length

      // Add summary section with a nice box
      pdfDoc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
      pdfDoc.setFillColor(250, 250, 250)
      pdfDoc.setLineWidth(0.5)
      pdfDoc.roundedRect(10, finalY, 80, 35, 2, 2, 'FD')

      // Add summary title
      pdfDoc.setFontSize(11)
      pdfDoc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text('Summary Statistics', 15, finalY + 7)

      // Add summary data
      pdfDoc.setFontSize(9)
      pdfDoc.setTextColor(60, 60, 60)
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.text(`Average Mood: ${avgMood.toFixed(1)}`, 15, finalY + 14)
      pdfDoc.text(
        `Average Mind Clarity: ${avgClarity.toFixed(1)}`,
        15,
        finalY + 19
      )
      pdfDoc.text(
        `Average Motivation: ${avgMotivation.toFixed(1)}`,
        15,
        finalY + 24
      )
      pdfDoc.text(`Average Energy: ${avgEnergy.toFixed(1)}`, 15, finalY + 29)
      pdfDoc.text(`Average Focus: ${avgFocus.toFixed(1)}`, 15, finalY + 34)

      // Only create chart if we have at least 2 entries
      if (entries.length >= 2) {
        try {
          // Chart dimensions and position
          const chartX = 100
          const chartY = finalY
          const chartWidth = pageWidth - chartX - 10
          const chartHeight = 60
          const yScale = chartHeight / 10 // Scale based on 1-10 mood range
          const xScale = chartWidth / (sortedEntries.length - 1 || 1)

          // Extract dates and mood values
          const dates = sortedEntries.map((entry) =>
            new Date(entry.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          )
          const moodValues = sortedEntries.map((entry) => entry.mood)

          // Draw chart title
          pdfDoc.setFontSize(11)
          pdfDoc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
          pdfDoc.setFont('helvetica', 'bold')
          pdfDoc.text(
            'Mood Trend Visualization',
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
          pdfDoc.setFillColor(200, 255, 200, 0.5) // Light green with transparency
          pdfDoc.rect(chartX, chartY, chartWidth, yScale * 2, 'F')

          // Good zone (7-8)
          pdfDoc.setFillColor(220, 255, 220, 0.5) // Lighter green with transparency
          pdfDoc.rect(chartX, chartY + yScale * 2, chartWidth, yScale * 2, 'F')

          // Normal zone (5-6)
          pdfDoc.setFillColor(255, 255, 220, 0.5) // Light yellow with transparency
          pdfDoc.rect(chartX, chartY + yScale * 4, chartWidth, yScale * 2, 'F')

          // Unhappy zone (3-4)
          pdfDoc.setFillColor(255, 220, 220, 0.5) // Light red with transparency
          pdfDoc.rect(chartX, chartY + yScale * 6, chartWidth, yScale * 2, 'F')

          // Sad zone (1-2)
          pdfDoc.setFillColor(255, 200, 200, 0.5) // Darker light red with transparency
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

          // Draw the mood line with gradient effect
          pdfDoc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
          pdfDoc.setLineWidth(1.5)

          // Plot points and connect them with lines
          for (let i = 0; i < sortedEntries.length - 1; i++) {
            const x1 = chartX + i * xScale
            const y1 = chartY + chartHeight - moodValues[i] * yScale
            const x2 = chartX + (i + 1) * xScale
            const y2 = chartY + chartHeight - moodValues[i + 1] * yScale

            // Draw line connecting points
            pdfDoc.line(x1, y1, x2, y2)

            // Draw data points
            pdfDoc.setFillColor(
              primaryColor[0],
              primaryColor[1],
              primaryColor[2]
            )
            pdfDoc.circle(x1, y1, 1.2, 'F')
          }

          // Draw the last point
          pdfDoc.circle(
            chartX + (sortedEntries.length - 1) * xScale,
            chartY + chartHeight - moodValues[moodValues.length - 1] * yScale,
            1.2,
            'F'
          )

          // Add mood scale legends in a compact format
          const legendX = chartX
          const legendY = chartY + chartHeight + 10
          const legendSize = 4

          pdfDoc.setFontSize(6)

          // Happy (9-10)
          pdfDoc.setFillColor(200, 255, 200)
          pdfDoc.rect(legendX, legendY, legendSize, legendSize, 'F')
          pdfDoc.setDrawColor(150, 150, 150)
          pdfDoc.setLineWidth(0.1)
          pdfDoc.rect(legendX, legendY, legendSize, legendSize, 'S')
          pdfDoc.text(
            'Happy (9-10)',
            legendX + legendSize + 2,
            legendY + legendSize - 1
          )

          // Good (7-8)
          pdfDoc.setFillColor(220, 255, 220)
          pdfDoc.rect(legendX + 40, legendY, legendSize, legendSize, 'F')
          pdfDoc.rect(legendX + 40, legendY, legendSize, legendSize, 'S')
          pdfDoc.text(
            'Good (7-8)',
            legendX + 40 + legendSize + 2,
            legendY + legendSize - 1
          )

          // Normal (5-6)
          pdfDoc.setFillColor(255, 255, 220)
          pdfDoc.rect(legendX + 80, legendY, legendSize, legendSize, 'F')
          pdfDoc.rect(legendX + 80, legendY, legendSize, legendSize, 'S')
          pdfDoc.text(
            'Normal (5-6)',
            legendX + 80 + legendSize + 2,
            legendY + legendSize - 1
          )

          // Unhappy (3-4)
          pdfDoc.setFillColor(255, 220, 220)
          pdfDoc.rect(legendX + 120, legendY, legendSize, legendSize, 'F')
          pdfDoc.rect(legendX + 120, legendY, legendSize, legendSize, 'S')
          pdfDoc.text(
            'Unhappy (3-4)',
            legendX + 120 + legendSize + 2,
            legendY + legendSize - 1
          )

          // Sad (1-2)
          pdfDoc.setFillColor(255, 200, 200)
          pdfDoc.rect(legendX + 160, legendY, legendSize, legendSize, 'F')
          pdfDoc.rect(legendX + 160, legendY, legendSize, legendSize, 'S')
          pdfDoc.text(
            'Sad (1-2)',
            legendX + 160 + legendSize + 2,
            legendY + legendSize - 1
          )
        } catch (chartError) {
          console.error('Error creating chart:', chartError)
          pdfDoc.setFontSize(10)
          pdfDoc.setTextColor(200, 0, 0)
          pdfDoc.text(
            'Error creating mood chart. Please try again later.',
            100,
            finalY + 20
          )
        }
      } else {
        // Not enough data points
        pdfDoc.setFontSize(10)
        pdfDoc.setTextColor(100, 100, 100)
        pdfDoc.text(
          'Not enough data points to generate a mood chart.',
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
