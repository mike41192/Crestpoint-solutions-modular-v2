"use client"

import { useState } from "react"
import { ArrowRight, CreditCard, RefreshCcw, ShieldCheck } from "lucide-react"

import { openStripePortal } from "@/modules/billing-management"

export function BillingPortalPanel() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleOpenPortal() {
    setLoading(true)
    setMessage("")

    const result = await openStripePortal()

    setMessage(result.message)
    setLoading(false)
  }

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <CreditCard size={20} />
        </div>

        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          Stripe
        </span>
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-950">
        Manage Subscription
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Open Stripe to update payment details, review invoices, change your
        subscription, or cancel renewal.
      </p>

      <button
        type="button"
        onClick={handleOpenPortal}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? (
          <>
            <RefreshCcw size={16} className="animate-spin" />
            Opening Portal
          </>
        ) : (
          <>
            Open Billing Portal
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-600">
          <ShieldCheck size={16} className="mt-1 shrink-0 text-blue-700" />
          <p>{message}</p>
        </div>
      )}
    </article>
  )
}
