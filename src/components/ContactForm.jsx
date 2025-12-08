import { useState } from 'react'

const initialFormValues = {
  name: '',
  email: '',
  message: '',
  subscribe: true,
}

const ContactForm = ({ isDark = false }) => {
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
    <section className="relative px-4 pb-24 pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-6 hidden h-72 w-72 -rotate-[12deg] rounded-[45%_55%_40%_60%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,217,147,0.8),rgba(255,153,215,0.5),rgba(255,217,147,0))] blur-[70px] sm:block" />
        <div className="absolute left-6 top-1/3 hidden h-64 w-64 rotate-[18deg] rounded-[60%_40%_45%_55%] bg-[radial-gradient(circle_at_40%_30%,rgba(255,140,201,0.85),rgba(255,209,152,0.5),rgba(255,140,201,0))] blur-[75px] md:block" />
        <div className="absolute right-0 top-10 hidden h-72 w-60 rotate-[20deg] rounded-[55%_45%_60%_40%] bg-[radial-gradient(circle_at_60%_30%,rgba(255,111,201,0.85),rgba(255,168,122,0.5),rgba(255,111,201,0))] blur-[90px] sm:block" />
        <div className="absolute left-10 bottom-2 hidden h-80 w-72 -rotate-[25deg] rounded-[55%_45%_50%_50%] bg-[radial-gradient(circle_at_30%_70%,rgba(255,174,88,0.7),rgba(255,111,201,0.35),rgba(255,174,88,0))] blur-[85px] sm:block" />
        <div className="absolute right-6 bottom-4 h-72 w-68 rotate-[18deg] rounded-[40%_60%_55%_45%] bg-[radial-gradient(circle_at_60%_40%,rgba(199,138,255,0.7),rgba(255,193,121,0.4),rgba(199,138,255,0))] blur-[85px]" />
      </div>
      <div className={`mx-auto max-w-3xl text-center ${isDark ? 'text-white' : 'text-[#1b1a1e]'}`}>
        <h2 className="font-rounded text-[2rem] font-semibold uppercase tracking-[0.175em]">
          Get in touch
        </h2>
        <p className={`mt-3 text-base ${isDark ? 'text-white/75' : 'text-[#5c5a60]'}`}>
          Custom projects, inquiries, and any other wavy thoughts or ideas are welcome.
        </p>
      </div>

      <div className="relative mx-auto mt-6 max-w-[44rem] px-3 sm:px-8">
        <div className="pointer-events-none absolute left-0 top-12 hidden w-64 -translate-x-[35%] sm:block lg:-translate-x-[45%]">
          <img src="/Single smile.png" alt="Single smile accent" className="w-full rotate-[-20deg]" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[48px] border border-white/70 bg-gradient-to-br from-[#ffe48f] via-[#ffb4f3] to-[#c179ff] p-[1.5px] shadow-[0_45px_120px_rgba(31,27,31,0.25)] sm:ml-12 sm:mr-4"
        >
          <div className="m-3 rounded-[36px] bg-gradient-to-b from-white/75 via-white/65 to-white/45 p-8 backdrop-blur-[2px] sm:m-4 sm:p-12">
            <div className="flex flex-col gap-6">
              {[
                { id: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
              ].map((field) => (
                <label
                  key={field.id}
                  className={`text-left text-sm font-semibold ${
                    isDark ? 'text-white/80' : 'text-[#6c5e7d]'
                  }`}
                >
                  {field.label}
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formValues[field.id]}
                    onChange={handleChange}
                    className={`mt-2 w-full rounded-[28px] border border-white/60 bg-white/70 px-6 py-3 text-base ${
                      isDark ? 'text-[#1f1b1f]' : 'text-[#1f1b1f]'
                    } placeholder:text-[#c6a7d9] shadow-[0_10px_35px_rgba(255,120,210,0.18)] transition focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`}
                    required
                  />
                </label>
              ))}
              <label
                className={`text-left text-sm font-semibold ${
                  isDark ? 'text-white/80' : 'text-[#6c5e7d]'
                }`}
              >
                What are your wavy thoughts?
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Share your idea here"
                  value={formValues.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-[28px] border border-white/60 bg-white/60 px-6 py-3 text-base text-[#1f1b1f] placeholder:text-[#c6a7d9] shadow-[0_10px_35px_rgba(255,120,210,0.18)] transition focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  required
                />
              </label>
            </div>
            <label className={`mt-6 flex items-center gap-4 text-sm ${isDark ? 'text-white/80' : 'text-[#6c5e7d]'}`}>
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formValues.subscribe}
                  onChange={handleChange}
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-[#ff9ae1]/70 bg-transparent"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity peer-checked:opacity-100">
                  <img src="/Single smile.png" alt="Smile active" className="h-7 w-7 object-contain" />
                </span>
              </span>
              Sign me up for updates and promotions from WavyThought
            </label>
            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full border border-white/60 bg-gradient-to-r from-[#ffd15f] via-[#ff7bd5] to-[#b46bff] px-6 py-4 text-base font-semibold uppercase tracking-[0.4em] text-white shadow-[0_25px_60px_rgba(255,126,209,0.45)] transition hover:translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Send'}
              </button>
              <p className={`text-center text-sm ${isDark ? 'text-white/70' : 'text-[#8c7da1]'}`}>
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
