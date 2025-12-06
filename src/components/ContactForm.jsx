import { useState } from 'react'

const initialFormValues = {
  name: '',
  email: '',
  message: '',
  subscribe: true,
}

const ContactForm = () => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (status !== 'idle') {
      setStatus('idle')
      setFeedback('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.message.trim()) {
      setStatus('error')
      setFeedback('Please complete all fields before sending your note.')
      return
    }

    setStatus('loading')
    setFeedback('Sending your message...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || 'Something unexpected happened.')
      }

      setStatus('success')
      setFeedback('Thank you for reaching out - we will respond shortly.')
      setFormValues(initialFormValues)
    } catch (error) {
      setStatus('error')
      setFeedback(error.message || 'Unable to send your message right now. Please try again soon.')
    }
  }

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-16 flex justify-center" aria-hidden>
        <div className="h-72 w-[900px] overflow-hidden rounded-[50%] bg-gradient-to-r from-orange-200/40 via-pink-200/40 to-amber-100/30 opacity-60 blur-[30px]">
          <div className="relative h-full w-full">
            <div className="wave-shape-1 absolute inset-x-0 top-6 h-24 w-full" />
            <div className="wave-shape-2 absolute inset-x-0 top-24 h-24 w-full" />
            <div className="wave-shape-3 absolute inset-x-0 top-40 h-24 w-full" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-40 flex justify-center" aria-hidden>
        <div className="h-64 w-[920px] overflow-hidden rounded-[50%] bg-gradient-to-r from-pink-100/40 via-transparent to-orange-100/30 opacity-60 blur-[45px]">
          <div className="relative h-full w-full">
            <div className="wave-shape-4 absolute inset-x-0 top-10 h-20 w-full" />
            <div className="wave-shape-5 absolute inset-x-0 top-28 h-20 w-full" />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-72 h-56 bg-gradient-to-t from-pink-200/10 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent opacity-70"
        aria-hidden
      />
      <div className="mx-auto max-w-3xl text-center">
        <div className="space-y-3">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Let&apos;s build together</h2>
          <p className="text-base text-slate-300">
            Share a bit about your project and we&apos;ll connect from{' '}
            <span className="text-white">info@wavythought.com</span>.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative mt-10 overflow-hidden rounded-[34px] border border-white/20 bg-gradient-to-br from-white/20 via-white/8 to-white/3 p-[1px] shadow-[0_35px_90px_rgba(4,6,10,0.45)] backdrop-blur-[42px] before:pointer-events-none before:absolute before:inset-[-30%] before:bg-gradient-to-b before:from-white/25 before:via-transparent before:to-white/15 before:opacity-40 before:blur-3xl before:content-['']"
        >
          <div
            className="pointer-events-none absolute -left-20 top-24 h-48 w-48 rounded-full bg-gradient-to-br from-orange-100 via-pink-100 to-pink-300 opacity-60 blur-[60px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-10 h-40 w-56 rounded-[999px] bg-gradient-to-br from-pink-200 via-orange-200 to-amber-200 opacity-50 blur-[70px]"
            aria-hidden
          />
          <div className="relative space-y-6 rounded-[32px] bg-gradient-to-br from-white/12 via-white/4 to-white/0 p-8 text-left">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium tracking-wide text-slate-200">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus-visible:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              value={formValues.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium tracking-wide text-slate-200">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus-visible:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium tracking-wide text-slate-200">
              Project Notes
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Message"
              rows={5}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus-visible:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              value={formValues.message}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-transparent px-2 py-1 text-sm text-slate-300 hover:text-white">
            <input
              type="checkbox"
              name="subscribe"
              checked={formValues.subscribe}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded-md border-white/25 bg-white/10 text-white focus-visible:outline-white/60"
            />
            <span className="leading-relaxed">
              Sign me up for updates, promotions, and insights from the WavyThought team.
            </span>
          </label>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-2xl bg-white/70 px-6 py-3 text-lg font-semibold uppercase tracking-wide text-ink-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' ? 'Sending...' : 'Send'}
            </button>
            <p className="text-center text-xs text-slate-400">
              We keep your details private and respond within one business day.
            </p>
            <p className="text-center text-sm font-medium" aria-live="polite">
              {feedback && (
                <span className={status === 'error' ? 'text-rose-300' : 'text-emerald-300'}>
                  {feedback}
                </span>
              )}
            </p>
          </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
