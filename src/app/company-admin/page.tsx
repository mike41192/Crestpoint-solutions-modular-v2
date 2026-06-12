import Link from "next/link"

export default function CompanyAdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
          Company Admin
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Team access portal
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          Manage your company roster, add approved seats, suspend access, and
          keep your team list current within the limits set by the platform
          administrator.
        </p>

        <Link
          href="/company-admin/access"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
        >
          Open access list
        </Link>
      </section>
    </main>
  )
}
