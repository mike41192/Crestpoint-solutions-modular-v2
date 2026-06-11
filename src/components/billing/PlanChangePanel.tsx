"use client"

import { useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

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
  accentClassName: string
  badge: string
}

const billingPlanHighlights: Record<StripeBillingTier, string[]> = {
  starter: ["Resume library expansion", "Starter ATS access", "Core AI tools"],
  pro: ["Higher usage limits", "Interview workflows", "Advanced job search"],
  premium: ["Full Career OS access", "Priority workflows", "Expanded AI usage"],
  business: ["Team-scale limits", "High-volume usage", "Agency-ready access"],
}

const billingPlanAccents: Record<StripeBillingTier, string> = {
  starter: "from-sky-500 to-blue-600",
  pro: "from-indigo-500 to-blue-700",
  premium: "from-violet-500 to-indigo-700",
  business: "from-slate-700 to-slate-950",
}

const billingPlanBadges: Record<StripeBillingTier, string> = {
  starter: "Build",
  pro: "Grow",
  premium: "Scale",
  business: "Team",
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
    accentClassName: billingPlanAccents[plan.tier],
    badge: billingPlanBadges[plan.tier],
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
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
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

        <div className="grid w-full max-w-[300px] shrink-0 grid-cols-2 rounded-full border border-slate-200 bg-slate-100 p-1.5 shadow-inner">
          {(["monthly", "yearly"] as StripeBillingInterval[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setInterval(option)}
              className={`min-h-11 rounded-full px-5 text-center text-sm font-black capitalize transition ${
                interval === option
                  ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {billingPlans.map((plan) => {
          const isCurrent =
            plan.name.toLowerCase() === currentPlanName.toLowerCase()
          const price =
            interval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
          const yearlySavings = Math.max(plan.monthlyPrice * 12 - plan.yearlyPrice, 0)

          return (
            <article
              key={plan.tier}
              className={`group flex min-h-[420px] overflow-hidden rounded-[24px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isCurrent
                  ? "border-blue-300 ring-4 ring-blue-50"
                  : "border-slate-200 hover:border-blue-200"
              }`}
            >
              <div className="flex flex-1 flex-col p-4">
                <div
                  className={`rounded-[20px] bg-gradient-to-br ${plan.accentClassName} p-4 text-white`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                        {plan.badge}
                      </span>

                      <h3 className="mt-4 text-2xl font-black">
                        {plan.name}
                      </h3>
                    </div>

                    {isCurrent && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-4 min-h-[72px] text-sm font-semibold leading-6 text-white/85">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      {interval === "monthly" ? "Monthly" : "Annual"}
                    </p>

                    <p className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                      ${price}
                      <span className="text-base font-black text-slate-500">
                        /{interval === "monthly" ? "mo" : "yr"}
                      </span>
                    </p>
                  </div>

                  {interval === "yearly" && yearlySavings > 0 && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      Save ${yearlySavings}
                    </span>
                  )}
                </div>

                <div className="mt-5 grid gap-3">
                  {plan.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 text-sm font-bold leading-6 text-slate-700"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-1 shrink-0 text-emerald-600"
                      />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-500">
                  <ShieldCheck size={16} className="shrink-0 text-blue-700" />
                  <span>
                    Secure Stripe billing with plan changes managed from your
                    account.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanAction(plan.tier)}
                  disabled={activeTier !== null || isCurrent}
                  className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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
              </div>
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
