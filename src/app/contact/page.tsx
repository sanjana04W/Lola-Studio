'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-600 font-semibold block mb-2">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
            Contact Lola Studio
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 mt-2 font-sans">
            Have questions about an upcoming order, custom dimensions, or delivery details? Our workshop team is always ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl border border-brand-200 p-8 shadow-soft space-y-6">
              <h3 className="font-serif text-xl font-bold text-brand-950 pb-4 border-b border-brand-100">
                Workshop & Studio Details
              </h3>

              <div className="space-y-5 text-xs text-brand-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950 uppercase tracking-wide">Location</h4>
                    <p className="mt-0.5">Negombo, Western Province, Sri Lanka</p>
                    <a
                      href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=Negombo%2C%20Sri%20Lanka&FORM=FBKPL1&mkt=en-GB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-800 underline font-semibold mt-1 inline-block"
                    >
                      View on Map
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950 uppercase tracking-wide">Direct Telephone</h4>
                    <p className="mt-0.5">075 148 3613</p>
                    <a href="tel:0751483613" className="text-brand-800 underline font-semibold mt-1 inline-block">
                      Click to Call
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950 uppercase tracking-wide">Email Inquiries</h4>
                    <p className="mt-0.5">dili.gamage11@gmail.com</p>
                    <a href="mailto:dili.gamage11@gmail.com" className="text-brand-800 underline font-semibold mt-1 inline-block">
                      Send Email
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-950 uppercase tracking-wide">Operating Hours</h4>
                    <p className="mt-0.5 font-medium text-emerald-700">Always Open (24/7 Online Orders)</p>
                    <p className="text-[11px] text-brand-500">Customer calls handled 8:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4 border-t border-brand-100">
                <a
                  href="https://wa.me/94751483613?text=Hello%20Lola%20Studio%2C%20I%20have%20an%20inquiry%20regarding%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-brand-200 p-8 shadow-soft">
              <h3 className="font-serif text-xl font-bold text-brand-950 mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-brand-600 mb-6">
                Fill in your details and our workshop manager will respond within 2-4 hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-emerald-950">Thank You!</h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Your message has been received. You can also chat with us on WhatsApp at 075 148 3613 for urgent order questions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-800 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ruwan Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs bg-brand-50/70 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-800 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs bg-brand-50/70 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-800 mb-1">
                      Your Message or Inquiry *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us what you are looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs bg-brand-50/70 border border-brand-200 rounded-xl py-2.5 px-3 text-brand-950 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-soft"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
