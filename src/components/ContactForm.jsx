import { useState } from 'react'

const initialFormValues = {
  name: '',
  email: '',
  message: '',
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const DEFAULT_WEB3FORMS_ACCESS_KEY = 'c33f1cf1-691e-462d-b2f8-0d0c9cd51de2'
const NEWSLETTER_WEB3FORMS_ACCESS_KEY = 'eef31bbf-67da-4210-adcd-5d2be7f62622'

const ContactForm = ({ isDark = false, reduceEffects = false }) => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState('idle')
  const [subscribeFeedback, setSubscribeFeedback] = useState('')
  const rawAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || DEFAULT_WEB3FORMS_ACCESS_KEY
  const accessKey = rawAccessKey?.trim() || ''
  const fallbackEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'
  const shouldUseWeb3Forms = Boolean(accessKey)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
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
      const successMessage = shouldUseWeb3Forms
        ? await submitInquiryViaWeb3Forms()
        : await submitInquiryViaBackend()

      setStatus('success')
      setFeedback(successMessage)
      setFormValues(initialFormValues)
    } catch (error) {
      setStatus('error')
      setFeedback(error.message || 'Unable to send your message right now. Please try again soon.')
    }
  }

  const submitInquiryViaWeb3Forms = async () => {
    const payload = new FormData()
    payload.append('access_key', NEWSLETTER_WEB3FORMS_ACCESS_KEY)
    payload.append('apikey', NEWSLETTER_WEB3FORMS_ACCESS_KEY)
    payload.append('from_name', 'WavyThought Website')
    payload.append('subject', `New inquiry from ${formValues.name}`)
    payload.append('reply_to', formValues.email)
    payload.append('name', formValues.name)
    payload.append('email', formValues.email)
    payload.append('message', formValues.message)

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.message || 'Something unexpected happened.')
    }

    const result = await response.json()
    return result?.message || 'Thank you for the wave! We will respond shortly.'
  }

  const submitInquiryViaBackend = async () => {
    const response = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: formValues.name,
        email: formValues.email,
        message: formValues.message,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.message || 'Email service is currently unavailable.')
    }

    const result = await response.json().catch(() => ({}))
    return result?.message || 'Your note is on its way. Talk soon!'
  }

  const handleSubscribeChange = (event) => {
    setSubscribeEmail(event.target.value)
    if (subscribeStatus !== 'idle') {
      setSubscribeStatus('idle')
      setSubscribeFeedback('')
    }
  }

  const handleSubscribeSubmit = async (event) => {
    event.preventDefault()
    if (!subscribeEmail.trim()) {
      setSubscribeStatus('error')
      setSubscribeFeedback('Please enter an email to subscribe.')
      return
    }

    setSubscribeStatus('loading')
    setSubscribeFeedback('Adding you to the wave list...')
    try {
      const message = shouldUseWeb3Forms
        ? await submitNewsletterOptIn()
        : await submitNewsletterToBackend()
      setSubscribeStatus('success')
      setSubscribeFeedback(message)
      setSubscribeEmail('')
    } catch (error) {
      setSubscribeStatus('error')
      setSubscribeFeedback(
        error.message || 'Unable to add you right now. Please try again shortly.'
      )
    }
  }

  const submitNewsletterOptIn = async () => {
    const payload = new FormData()
    payload.append('access_key', accessKey)
    payload.append('apikey', accessKey)
    payload.append('from_name', 'WavyThought Newsletter')
    payload.append('subject', 'Newsletter opt-in')
    payload.append('reply_to', subscribeEmail)
    payload.append('email', subscribeEmail)
    payload.append('subscribe', 'Newsletter signup only')

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.message || 'Something unexpected happened.')
    }

    const result = await response.json()
    return result?.message || 'Thanks for joining the wave. Check your inbox soon!'
  }

  const submitNewsletterToBackend = async () => {
    const response = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: subscribeEmail,
        subscribe: true,
        newsletterOnly: true,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.message || 'Email service is currently unavailable.')
    }

    const result = await response.json().catch(() => ({}))
    return result?.message || 'Thanks for joining the wave. Check your inbox soon!'
  }

  return (
    <section className="relative px-4 pb-24 pt-20">
      {!reduceEffects && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-6 hidden h-72 w-72 -rotate-[12deg] rounded-[45%_55%_40%_60%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,217,147,0.8),rgba(255,153,215,0.5),rgba(255,217,147,0))] blur-[70px] sm:block" />
          <div className="absolute left-6 top-1/3 hidden h-64 w-64 rotate-[18deg] rounded-[60%_40%_45%_55%] bg-[radial-gradient(circle_at_40%_30%,rgba(255,140,201,0.85),rgba(255,209,152,0.5),rgba(255,140,201,0))] blur-[75px] md:block" />
          <div className="absolute right-0 top-10 hidden h-72 w-60 rotate-[20deg] rounded-[55%_45%_60%_40%] bg-[radial-gradient(circle_at_60%_30%,rgba(255,111,201,0.85),rgba(255,168,122,0.5),rgba(255,111,201,0))] blur-[90px] sm:block" />
          <div className="absolute left-10 bottom-2 hidden h-80 w-72 -rotate-[25deg] rounded-[55%_45%_50%_50%] bg-[radial-gradient(circle_at_30%_70%,rgba(255,174,88,0.7),rgba(255,111,201,0.35),rgba(255,174,88,0))] blur-[85px] sm:block" />
          <div className="absolute right-6 bottom-4 h-72 w-68 rotate-[18deg] rounded-[40%_60%_55%_45%] bg-[radial-gradient(circle_at_60%_40%,rgba(199,138,255,0.7),rgba(255,193,121,0.4),rgba(199,138,255,0))] blur-[85px]" />
        </div>
      )}
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
        className={`relative overflow-hidden rounded-[48px] border border-white/70 p-[1.5px] sm:ml-12 sm:mr-4 ${
          reduceEffects
            ? 'shadow-none'
            : 'shadow-[0_20px_60px_rgba(31,27,31,0.25)] sm:shadow-[0_45px_120px_rgba(31,27,31,0.25)]'
        } ${
            isDark ? 'bg-gradient-to-br from-[#292734] via-[#28243a] to-[#1b1a20]' : 'bg-gradient-to-br from-[#ffe48f] via-[#ffb4f3] to-[#c179ff]'
          }`}
        >
          <div
          className={`m-3 rounded-[36px] p-8 sm:m-4 sm:p-12 ${
            isDark ? 'bg-white/5' : 'bg-gradient-to-b from-white/75 via-white/65 to-white/45'
          } ${
            reduceEffects
              ? ''
              : 'backdrop-blur-[2px] shadow-[0_6px_28px_rgba(0,0,0,0.15)] sm:shadow-[0_10px_45px_rgba(0,0,0,0.15)]'
          }`}
          >
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
                    className={`mt-2 w-full rounded-[28px] border border-white/60 px-6 py-3 text-base transition focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                      reduceEffects ? '' : 'shadow-[0_10px_35px_rgba(255,120,210,0.18)]'
                    } ${
                      isDark
                        ? 'bg-white/10 text-white placeholder:text-white/60'
                        : 'bg-white/70 text-[#1f1b1f] placeholder:text-[#c6a7d9]'
                    }`}
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
                  className={`mt-2 w-full rounded-[28px] border border-white/60 px-6 py-3 text-base transition focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                    reduceEffects ? '' : 'shadow-[0_10px_35px_rgba(255,120,210,0.18)]'
                  } ${
                    isDark
                      ? 'bg-white/10 text-white placeholder:text-white/60'
                      : 'bg-white/60 text-[#1f1b1f] placeholder:text-[#c6a7d9]'
                  }`}
                  required
                />
              </label>
            </div>
            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full rounded-full border border-white/60 bg-gradient-to-r from-[#ffd15f] via-[#ff7bd5] to-[#b46bff] px-6 py-4 text-base font-semibold uppercase tracking-[0.4em] text-white transition hover:translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 ${
                  reduceEffects ? '' : 'shadow-[0_25px_60px_rgba(255,126,209,0.45)]'
                }`}
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
      <div className="relative mx-auto mt-10 max-w-[44rem] px-3 sm:px-8">
        <div className="relative sm:ml-12 sm:mr-4">
          <div
            className={`pointer-events-none absolute inset-0 rounded-[48px] ${
              reduceEffects ? 'hidden' : 'shadow-[0_20px_60px_rgba(31,27,31,0.25)] sm:shadow-[0_45px_120px_rgba(31,27,31,0.25)]'
            } z-0`}
            aria-hidden
          />
          <img
            src="/Single smile.png"
            alt=""
            role="presentation"
            className="pointer-events-none absolute left-4 -bottom-[121px] h-36 w-36 -translate-x-4 rotate-[-12deg] opacity-85 sm:hidden z-10"
          />
          <div
            className={`relative z-20 rounded-[48px] border border-white/70 p-[1.5px] ${
              isDark
                ? 'bg-gradient-to-br from-[#292734] via-[#28243a] to-[#1b1a20]'
                : 'bg-gradient-to-br from-[#ffe48f] via-[#ffb4f3] to-[#c179ff]'
            }`}
          >
            <form
              onSubmit={handleSubscribeSubmit}
              className={`m-3 flex flex-col gap-4 rounded-[36px] px-6 py-6 text-center ${
                isDark ? 'bg-white/5 text-white' : 'bg-gradient-to-b from-white/80 via-white/70 to-white/55'
              } ${
              reduceEffects
                ? ''
                : 'backdrop-blur-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] sm:shadow-[0_15px_45px_rgba(0,0,0,0.15)]'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              Sign up for email list
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <input
                type="email"
                name="newsletter"
                value={subscribeEmail}
                onChange={handleSubscribeChange}
                placeholder="Email"
                className={`w-full rounded-[28px] border border-white/60 px-6 py-3 text-base transition focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:max-w-md ${
                  reduceEffects ? '' : 'shadow-[0_10px_35px_rgba(255,120,210,0.18)]'
                } ${
                  isDark
                    ? 'bg-white/10 text-white placeholder:text-white/60'
                    : 'bg-white/80 text-[#1f1b1f] placeholder:text-[#a07dbc]'
                }`}
                required
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className={`rounded-full border border-white/60 bg-gradient-to-r from-[#ffd15f] via-[#ff7bd5] to-[#b46bff] px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 ${
                  reduceEffects ? '' : 'shadow-[0_20px_50px_rgba(255,126,209,0.35)]'
                }`}
              >
                {subscribeStatus === 'loading' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
          {subscribeFeedback && (
            <p
              className={`px-6 pb-5 text-center text-xs ${
                isDark ? 'text-white/70' : 'text-[#6c5e7d]'
              }`}
            >
              {subscribeFeedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
