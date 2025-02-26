// Declaration file for PDF module types

declare module 'jspdf' {
  export default class jsPDF {
    constructor(options?: any)
    setFontSize(size: number): void
    text(text: string, x: number, y: number, options?: any): void
    save(filename: string): void
    internal: any
    lastAutoTable: {
      finalY: number
    }
  }
}

declare module 'jspdf-autotable' {
  export default function autoTable(doc: any, options: any): void
}
