"use client"

import { Download, Printer } from "lucide-react"
import { motion } from "framer-motion"

export function ResumePrintActions() {
  function printResume() {
    window.print()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <motion.button
        type="button"
        onClick={printResume}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          bg-blue-600
          px-5
          py-3
          text-sm
          font-black
          text-white
          shadow-lg
          shadow-blue-100
          transition
          hover:bg-blue-700
        "
      >
        <Printer size={16} />
        Print Resume
      </motion.button>

      <motion.button
        type="button"
        onClick={printResume}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          border
          border-slate-300
          bg-white
          px-5
          py-3
          text-sm
          font-black
          text-slate-700
          transition
          hover:border-blue-300
          hover:text-blue-700
        "
      >
        <Download size={16} />
        Save PDF
      </motion.button>

      <div className="text-xs font-semibold leading-5 text-slate-500 sm:max-w-[220px]">
        Opens your browser print dialog. Choose{" "}
        <strong>Save as PDF</strong> to download a professional PDF copy.
      </div>
    </div>
  )
}
