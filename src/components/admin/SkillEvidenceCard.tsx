"use client"

import type {
  SkillEvidenceReport,
} from "@/modules/ats-intelligence/evidence-types"

type Props = {
  report: SkillEvidenceReport
}

export function SkillEvidenceCard({
  report,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-black">
        {report.skill}
      </h3>

      <p className="mt-2 text-sm font-bold text-violet-700">
        Confidence: {report.confidence}%
      </p>

      <div className="mt-4">
        <p className="font-black">
          Evidence Found
        </p>

        <ul className="mt-2 list-disc pl-5 text-sm">
          {report.evidenceFound.map(
            (item) => (
              <li key={item.phrase}>
                {item.phrase}
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="mt-4">
        <p className="font-black">
          Recommendation
        </p>

        <p className="mt-2 text-sm">
          {report.recommendation}
        </p>
      </div>
    </div>
  )
}