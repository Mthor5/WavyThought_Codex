import { useState } from 'react'

const initialFormValues = {
  name: '',
  email: '',
  message: '',
  subscribe: true,
}

const ContactForm = () => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [status, setStatus] = useState('idle')
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
      setFeedback('Please complete every field before sending your note.')
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
      setFeedback('Thank you for the wave! We will respond shortly.')
      setFormValues(initialFormValues)
    } catch (error) {
      setStatus('error')
      setFeedback(error.message || 'Unable to send your message right now. Please try again soon.')
    }
  }

  return (
    <section className="relative px-4 py-20">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/smiley faces.png"
          alt="Smiley accent"
          className="absolute -left-6 top-6 w-28 opacity-80 sm:w-36"
        />
        <img
          src="/smiley faces.png"
          alt="Smiley accent"
          className="absolute right-6 bottom-1/3 w-24 rotate-[25deg] opacity-70 sm:w-32"
        />
      </div>
      <div className="mx-auto max-w-3xl text-center text-[#1f1b1f]">
        <h2 className="font-display text-3xl">Get in touch</h2>
        <p className="mt-2 text-base text-[#5c5a60]">
          Custom projects, inquiries and any other wavy thoughts or ideas are welcome.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-3xl">
        <div className="absolute -left-8 top-1/2 hidden w-16 -translate-y-1/2 sm:block">
          <img src="/Single smile.png" alt="Single smile accent" className="w-full" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[42px] border border-[#ffd9ff] bg-gradient-to-br from-[#fff4b0] via-[#ffbef4] to-[#c7a2ff] p-[2px] shadow-[0_25px_80px_rgba(31,27,31,0.2)]"
        >
          <div className="rounded-[38px] bg-white/85 p-8 sm:p-10">
            <div className="flex flex-col gap-4">
              {[
                { id: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
              ].map((field) => (
                <label key={field.id} className="text-left text-sm font-semibold text-[#5c5a60]">
                  {field.label}
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formValues[field.id]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-[#e5d5ff] bg-white px-4 py-3 text-base text-[#1f1b1f] placeholder:text-[#b1a8c3] focus-visible:border-[#ff9ae1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb6f5]/40"
                    required
                  />
                </label>
              ))}
              <label className="text-left text-sm font-semibold text-[#5c5a60]">
                What are your wavy thoughts?
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Share your idea here"
                  value={formValues.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-[#e5d5ff] bg-white px-4 py-3 text-base text-[#1f1b1f] placeholder:text-[#b1a8c3] focus-visible:border-[#ff9ae1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb6f5]/40"
                  required
                />
              </label>
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-[#5c5a60]">
              <span className="relative inline-flex h-6 w-6 items-center justify-center">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formValues.subscribe}
                  onChange={handleChange}
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-[#ff9ae1] bg-white"
                />
                <span className="pointer-events-none flex h-full w-full items-center justify-center rounded-full bg-white text-xs text-[#ff9ae1] transition-opacity peer-checked:opacity-0">
                  +
                </span>
                <img
                  src="/Single smile.png"
                  alt="Smile active"
                  className="pointer-events-none h-5 w-5 opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </span>
              Sign me up for updates and promotions from WavyThought
            </label>
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full border border-white/60 bg-[#ff9ae1] px-6 py-3 text-base font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-[#ff9ae1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Send'}
              </button>
              <p className="text-center text-sm text-[#917da7]">
                {feedback ||
                  'We usually reply within one business day. Thanks for sharing your wavy thoughts.'}
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-12 text-center text-sm text-[#5c5a60]">
        <p>Stop by and give us a wave</p>
        <p className="mt-1 font-semibold">Instagram · Hello@wavythought.com</p>
      </div>
    </section>
  )
}

export default ContactForm
