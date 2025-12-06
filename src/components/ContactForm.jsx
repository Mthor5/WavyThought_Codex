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
    <section className="px-4 pb-16 pt-4">
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
          className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-[0_30px_80px_rgba(4,6,10,0.35)] backdrop-blur-2xl"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium tracking-wide text-slate-200">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
              className="mt-1 h-5 w-5 rounded-md border-white/20 bg-transparent text-blue-400 focus-visible:outline-blue-500"
            />
            <span className="leading-relaxed">
              Sign me up for updates, promotions, and insights from the WavyThought team.
            </span>
          </label>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-2xl bg-blue-500 px-6 py-3 text-lg font-semibold uppercase tracking-wide text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
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
        </form>
      </div>
    </section>
  )
}

export default ContactForm
