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
    <section className="relative overflow-hidden px-4 pb-24 pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,217,147,0.85),rgba(255,217,147,0))] blur-[55px]" />
        <div className="absolute right-2 top-10 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,111,201,0.85),rgba(255,111,201,0))] blur-[75px]" />
        <div className="absolute left-10 bottom-4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_40%_60%,rgba(255,174,88,0.65),rgba(255,174,88,0))] blur-[65px]" />
        <div className="absolute right-10 bottom-0 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(199,138,255,0.75),rgba(199,138,255,0))] blur-[75px]" />
      </div>
      <div className="mx-auto max-w-3xl text-center text-[#1b1a1e]">
        <h2 className="font-rounded text-[2rem] font-semibold uppercase tracking-[0.175em]">
          Get in touch
        </h2>
        <p className="mt-3 text-base text-[#5c5a60]">
          Custom projects, inquiries, and any other wavy thoughts or ideas are welcome.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl">
        <div className="pointer-events-none absolute -left-12 top-1/3 hidden w-20 -translate-y-1/2 sm:block">
          <img src="/Single smile.png" alt="Single smile accent" className="w-full" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[48px] border border-[#ffd9ff] bg-gradient-to-br from-[#ffe88c] via-[#ff9fe6] to-[#c593ff] p-[3px] shadow-[0_30px_90px_rgba(31,27,31,0.25)]"
        >
          <div className="rounded-[44px] bg-white/85 p-8 sm:p-12">
            <div className="flex flex-col gap-5">
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
                    className="mt-2 w-full rounded-3xl border border-transparent bg-[#fdf2ff] px-6 py-3 text-base text-[#1d1b1d] placeholder:text-[#b7aec8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] focus-visible:border-[#ffb7ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb7ee]/50"
                    required
                  />
                </label>
              ))}
              <label className="text-left text-sm font-semibold text-[#5c5a60]">
                What are your wavy thoughts?
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Share your idea here"
                  value={formValues.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-transparent bg-[#fdf2ff] px-6 py-3 text-base text-[#1d1b1d] placeholder:text-[#b7aec8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] focus-visible:border-[#ffb7ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb7ee]/50"
                  required
                />
              </label>
            </div>
            <label className="mt-5 flex items-center gap-3 text-sm text-[#5c5a60]">
              <span className="relative inline-flex h-7 w-7 items-center justify-center">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formValues.subscribe}
                  onChange={handleChange}
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-[#ff9ae1] bg-white"
                />
                <span className="pointer-events-none flex h-full w-full items-center justify-center rounded-full bg-white text-base text-[#ff9ae1] transition-opacity peer-checked:opacity-0">
                  +
                </span>
                <img
                  src="/Single smile.png"
                  alt="Smile active"
                  className="pointer-events-none h-6 w-6 opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </span>
              Sign me up for updates and promotions from WavyThought
            </label>
            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full border border-white/50 bg-gradient-to-r from-[#ffd467] via-[#ff7ed1] to-[#c06cff] px-6 py-3 text-base font-semibold uppercase tracking-[0.4em] text-white shadow-[0_18px_45px_rgba(255,126,209,0.45)] transition hover:translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Send'}
              </button>
              <p className="text-center text-sm text-[#917da7]">
                {feedback ||
                  'We usually reply within one business day. Thanks for sharing your wavy thoughts.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
