import { useState } from 'react';
import { Phone, Mail, Star, Send, CheckCircle } from 'lucide-react';
import type { RealtorInfo } from '../../types';

interface ContactRealtorProps {
  realtor: RealtorInfo;
  address: string;
}

export default function ContactRealtor({ realtor, address }: ContactRealtorProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: `Hi ${realtor.name}, I'm interested in ${address}. Please contact me with more information.` });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      {/* Realtor card */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <img
          src={realtor.photo}
          alt={realtor.name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-200"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{realtor.name}</div>
          <div className="text-sm text-gray-500">{realtor.agency}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{realtor.rating}</span>
            <span className="text-xs text-gray-400">({realtor.reviews} reviews)</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={`tel:${realtor.phone}`}
            className="flex items-center gap-1.5 text-xs bg-white text-blue-600 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 transition-colors"
          >
            <Phone className="h-3 w-3" />
            Call
          </a>
          <a
            href={`mailto:${realtor.email}`}
            className="flex items-center gap-1.5 text-xs bg-white text-blue-600 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 transition-colors"
          >
            <Mail className="h-3 w-3" />
            Email
          </a>
        </div>
      </div>

      {/* Contact form */}
      {submitted ? (
        <div className="text-center py-8 text-green-600">
          <CheckCircle className="h-10 w-10 mx-auto mb-2" />
          <p className="font-semibold">Message Sent!</p>
          <p className="text-sm text-gray-500 mt-1">{realtor.name} will contact you shortly.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(512) 555-0100"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
