import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : []

app.use(express.json())
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
  }),
)

const emailConfigReady =
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS

const transporter = emailConfigReady
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

if (!emailConfigReady) {
  console.warn('SMTP credentials are missing. Contact form submissions will fail until configured.')
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, message, subscribe } = req.body || {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Please complete all required fields.' })
  }

  if (!emailConfigReady || !transporter) {
    return res
      .status(503)
      .json({ message: 'Email is temporarily unavailable. Please try again once we are ready.' })
  }

  const safeMessage = message.trim()
  const toAddress = process.env.CONTACT_RECIPIENT || 'info@wavythought.com'

  const mailOptions = {
    from: `"WavyThought Website" <${process.env.SMTP_USER}>`,
    to: toAddress,
    replyTo: email,
    subject: `New WavyThought inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Opted into updates: ${subscribe ? 'Yes' : 'No'}`,
      '',
      'Message:',
      safeMessage,
    ].join('\n'),
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ message: 'Your note is on its way. Talk soon!' })
  } catch (error) {
    console.error('Failed to send email', error)
    res
      .status(500)
      .json({ message: 'We could not deliver your message just yet. Please try again shortly.' })
  }
})

app.listen(port, () => {
  console.log(`API ready at http://localhost:${port}`)
})
