'use client'

import { useState } from 'react'
import { MoodEntry } from '@/types'
import { getMoodLabel } from '@/types'
import dynamic from 'next/dynamic'

// Use Next.js dynamic imports with no SSR
const PDFGenerator = dynamic(() => import('./PDFGeneratorClient'), {
  ssr: false,
})

export default PDFGenerator

// Move all the PDF generation logic to a separate client-only component
export const usePDFGenerator = () => {
  const [isLoading, setIsLoading] = useState(false)

  const generatePDF = async (
    entries: MoodEntry[],
    fromDate: string,
    toDate: string
  ) => {
    try {
      setIsLoading(true)

      // Dynamically load the PDFGeneratorUtils which contains the actual PDF generation logic
      const PDFGeneratorUtils = await import('./PDFGeneratorUtils')
      await PDFGeneratorUtils.generatePDF(entries, fromDate, toDate)

      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Error generating PDF:', error)
      setIsLoading(false)
      throw error
    }
  }

  return { generatePDF, isLoading }
}
