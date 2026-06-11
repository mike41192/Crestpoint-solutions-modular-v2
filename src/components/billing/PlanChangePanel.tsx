"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, RefreshCcw, Sparkles } from "lucide-react"

import {
  openStripePortal,
  startStripeCheckout,
} from "@/modules/billing-management"
import type {
  StripeBillingInterval,
  StripeBillingTier,
} from "@/lib/stripe/stripe-env"
import { pricingPlans } from "@/lib/config/pricing.config"

type BillingPlanView = {
  tier: StripeBillingTier
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  highlights: string[]
}

const billingPlanHighlights: Record<StripeBillingTier, string[]> = {
  starter: ["Resume library expansion", "Starter ATS access", "Core AI tools"],
  pro: ["Higher usage limits", "Interview workflows", "Advanced job search"],
  premium: ["Full Career OS access", "Priority workflows", "Expanded AI usage"],
  business: ["Team-scale limits", "High-volume usage", "Agency-ready access"],
}

const billingPlans: BillingPlanView[] = pricingPlans
  .filter((plan): plan is BillingPlanView =>
    ["starter", "pro", "premium", "business"].includes(plan.tier),
  )
  .map((plan) => ({
    tier: plan.tier,
    name: plan.name,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice: plan.yearlyPrice,
    description: plan.description,
    highlights: billingPlanHighlights[plan.tier],
  }))

export function PlanChangePanel({
  currentPlanName,
}: {
  currentPlanName: string
}) {
  const [interval, setInterval] = useState<StripeBillingInterval>("monthly")
  const [activeTier, setActiveTier] = useState<StripeBillingTier | null>(null)
  const [message, setMessage] = useState("")
  const currentPlan = currentPlanName.toLowerCase()
  const currentPlanIsPaid = ["starter", "pro", "premium", "business"].includes(
    currentPlan,
  )

  async function handlePlanAction(tier: StripeBillingTier) {
    setActiveTier(tier)
    setMessage("")

    const result = currentPlanIsPaid
      ? await openStripePortal()
      : await startStripeCheckout({
          tier,
          interval,
        })

    setMessage(result.message)
    setActiveTier(null)
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            <Sparkles size={14} />
            Change Plan
          </div>

          <h2 className="text-xl font-black text-slate-950">
            Upgrade or switch subscription level
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a paid tier to open Stripe Checkout. Existing subscribers can
            also use the billing portal to manage plan changes and cancellation.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-full border border-slate-200 bg-slate-100 p-1">
          {(["monthly", "yearly"] as StripeBillingInterval[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInterval(option)}
              className={`rounded-full px-4 py-2 text-sm font-black capitalize transition ${
                interval === option
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        {billingPlans.map((plan) => {
          const isCurrent =
            plan.name.toLowerCase() === currentPlanName.toLowerCase()
          const price =
            interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice

          return (
            <article
              key={plan.tier}
              className={`flex min-h-[320px] flex-col rounded-[24px] border p-4 transition ${
                isCurrent
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {plan.description}
                  </p>
                </div>

                {isCurrent && (
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
                    Current
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-black text-slate-950">
                ${price}
                <span className="text-sm font-bold text-slate-500">
                  /{interval === "monthly" ? "mo" : "yr"}
                </span>
              </p>

              <div className="mt-4 grid gap-2">
                {plan.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-emerald-600"
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePlanAction(plan.tier)}
                disabled={activeTier !== null || isCurrent}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {activeTier === plan.tier ? (
                  <>
                    <RefreshCcw size={16} className="animate-spin" />
                    Opening
                  </>
                ) : (
                  <>
                    {isCurrent
                      ? "Current Plan"
                      : currentPlanIsPaid
                        ? "Manage in Portal"
                        : "Select Plan"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </article>
          )
        })}
      </div>

      {message && (
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-600">
          {message}
        </p>
      )}
    </section>
  )
}
