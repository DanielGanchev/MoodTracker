'use client'

interface PDFGeneratorProps {
  onGenerate: () => void
}

// Simple client-side button component
export default function PDFGeneratorClient({ onGenerate }: PDFGeneratorProps) {
  return (
    <button
      onClick={onGenerate}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
    >
      Generate PDF
    </button>
  )
}
