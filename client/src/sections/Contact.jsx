import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContact } from '../utils/api';
import portfolio from '../data/portfolio';

const MAX_MESSAGE = 500;

// ─── Floating-label input ─────────────────────────────────────────
function FloatInput({ id, type = 'text', name, value, onChange, label, required }) {
  return (
    <div className="float-label-group pt-5 pb-2 border-b border-border">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="input-glow w-full bg-transparent py-1 text-base md:text-lg text-text-primary placeholder:text-transparent focus:outline-none transition-colors"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

// ─── Floating-label textarea ──────────────────────────────────────
function FloatTextarea({ id, name, value, onChange, label, required }) {
  return (
    <div className="float-label-group pt-5 pb-2 border-b border-border">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        placeholder=" "
        className="input-glow w-full bg-transparent py-1 text-base md:text-lg text-text-primary placeholder:text-transparent focus:outline-none transition-colors resize-none"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

// ─── Success particle burst ───────────────────────────────────────
function SuccessParticles() {
  const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    dist: 60 + Math.random() * 60,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={p.id}
            className="absolute w-2 h-2 rounded-full bg-accent"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

export default function Contact() {
  const { contact, personal, social } = portfolio;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // Typing indicator — appears after user starts typing in message
    if (e.target.name === 'message') {
      setIsTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setStatus('error');
      setErrorMsg('Message should be at least 10 characters.');
      return;
    }

    try {
      await submitContact(formData);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const remaining = MAX_MESSAGE - formData.message.length;

  return (
    <section id="contact" className="section-padding border-t border-border bg-bg scroll-mt-20">
      <div className="section-container">
        {/* Growkool 06 Header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm tracking-wider text-accent font-bold">04</span>
          <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-text-secondary">
            START A PROJECT / HIRE
          </span>
        </div>

        <div className="relative w-full h-[1px] bg-border my-6">
          <div className="absolute top-[-1px] left-0 w-24 h-[3px] bg-accent" />
        </div>

        {/* Giant Red Headline */}
        <div className="mb-16 md:mb-24">
          <h2 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.92] uppercase text-accent">
            LET'S BUILD<br />
            SOMETHING.
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed mt-6">
            Have an internship role, engineering opportunity, or project idea in mind? Tell me what you're imagining.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column — Direct Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Email */}
            <div className="space-y-2 pb-6 border-b border-border">
              <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-text-muted block">
                EMAIL
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${personal.email}`}
                  className="font-heading font-black text-lg sm:text-xl text-text-primary hover:text-accent transition-colors"
                >
                  {personal.email}
                </a>
                <button
                  onClick={copyEmailToClipboard}
                  className="text-xs font-mono text-accent font-bold hover:underline cursor-pointer"
                >
                  {copiedEmail ? 'COPIED! ✓' : 'COPY'}
                </button>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="space-y-2 pb-6 border-b border-border">
              <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-text-muted block">
                PHONE &amp; WHATSAPP
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`tel:${personal.phoneRaw || personal.phone}`}
                  className="font-heading font-black text-lg sm:text-xl text-text-primary hover:text-accent transition-colors"
                >
                  {personal.phone}
                </a>
                <a
                  href={`https://wa.me/${(personal.phoneRaw || personal.phone).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-accent font-bold hover:underline"
                >
                  WHATSAPP ↗
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 pb-6 border-b border-border">
              <span className="font-heading font-bold text-xs tracking-[0.2em] uppercase text-text-muted block">
                LOCATION &amp; AVAILABILITY
              </span>
              <p className="font-heading font-black text-lg text-text-primary">
                India / Available Worldwide
              </p>
              <p className="text-xs font-mono text-text-secondary">{personal.college}</p>
            </div>

            {/* Social profiles */}
            <div className="flex items-center gap-6 text-xs font-heading font-bold uppercase tracking-wider text-text-primary">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  GITHUB ↗
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  LINKEDIN ↗
                </a>
              )}
            </div>
          </div>

          {/* Right Column — Enhanced Form */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div className="relative p-10 bg-bg-surface border border-border text-center space-y-4 overflow-hidden">
                {showBurst && <SuccessParticles />}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent text-white flex items-center justify-center font-bold mx-auto text-2xl"
                >
                  ✓
                </motion.div>
                <h3 className="font-heading font-black text-2xl uppercase text-text-primary">
                  MESSAGE SENT.
                </h3>
                <p className="text-text-secondary text-sm max-w-sm mx-auto">
                  Thank you for reaching out. Sheshank will get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-growkool-outline mt-4"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* Name */}
                <FloatInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="YOUR NAME"
                  required
                />

                {/* Email */}
                <FloatInput
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="EMAIL ADDRESS"
                  required
                />

                {/* Message + char counter */}
                <div className="space-y-1">
                  <FloatTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    label="TELL ME ABOUT THE ROLE OR PROJECT..."
                    required
                  />
                  {/* Character counter + Typing indicator */}
                  <div className="flex items-center justify-between pt-1">
                    <AnimatePresence>
                      {isTyping && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-mono text-[11px] text-accent flex items-center gap-1.5"
                        >
                          <span className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                          Sheshank is reading...
                        </motion.span>
                      )}
                      {!isTyping && <span />}
                    </AnimatePresence>
                    <span
                      className={`font-mono text-[11px] transition-colors ${
                        remaining < 50 ? 'text-accent font-bold' : 'text-text-muted'
                      }`}
                    >
                      {formData.message.length}/{MAX_MESSAGE}
                    </span>
                  </div>
                </div>

                {/* Error */}
                {status === 'error' && errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-accent font-mono text-xs bg-accent/10 border border-accent/30 p-3"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-growkool-red py-4 px-8 w-full sm:w-auto"
                  >
                    <span>{status === 'loading' ? 'TRANSMITTING...' : 'SEND MESSAGE'}</span>
                    <span className="font-mono text-sm font-bold">↗</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
