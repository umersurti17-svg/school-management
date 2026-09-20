import React, { useState } from 'react';
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineBuildingOffice,
  HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const contactChannels = [
  {
    title: 'Admissions & Enrollment Office',
    phone: '+92 (51) 884-9001',
    email: 'admissions@theeducator.edu.pk',
    hours: 'Mon - Sat: 8:00 AM - 4:00 PM',
    icon: HiOutlineBuildingOffice
  },
  {
    title: 'Accounts & Fee Collection Desk',
    phone: '+92 (51) 884-9002',
    email: 'accounts@theeducator.edu.pk',
    hours: 'Mon - Fri: 8:30 AM - 3:30 PM',
    icon: HiOutlineEnvelope
  },
  {
    title: 'Cambridge Examination Directorate',
    phone: '+92 (51) 884-9003',
    email: 'cambridge@theeducator.edu.pk',
    hours: 'Mon - Fri: 8:00 AM - 3:00 PM',
    icon: HiOutlineChatBubbleLeftRight
  },
  {
    title: 'Transport & Security Helpdesk',
    phone: '+92 (51) 884-9004',
    email: 'transport@theeducator.edu.pk',
    hours: '24/7 Helpline Support',
    icon: HiOutlinePhone
  }
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Admissions Office',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketId('TKT-' + Math.floor(100000 + Math.random() * 900000));
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            We Are Here to Assist You
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have an inquiry regarding student admissions, campus visits, fee payments, 
            or academic counseling? Reach out to our dedicated campus offices.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131D31] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Our helpdesk responds within 1 business day</p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <HiOutlineCheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Delivered!</h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-xs mx-auto">
                  <p className="text-[11px] text-slate-400">Support Ticket ID:</p>
                  <p className="text-xl font-mono font-bold text-primary-600 dark:text-primary-400 mt-0.5">{ticketId}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. An email confirmation has been sent to <strong>{formData.email}</strong>.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Siddiqui"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Target Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option>Admissions Office</option>
                      <option>Accounts & Fee Section</option>
                      <option>Cambridge CAIE Examinations</option>
                      <option>Principal Secretariat</option>
                      <option>Transport & Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your inquiry..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Message / Inquiry Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please specify your query or student details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full shadow-md font-bold">
                  <HiOutlinePaperAirplane className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Right: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            {contactChannels.map((chan, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#131D31] border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-md transition-all space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    <chan.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{chan.title}</h4>
                    <p className="text-[11px] text-slate-400">{chan.hours}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                  <a href={`tel:${chan.phone}`} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1">
                    <HiOutlinePhone className="w-3.5 h-3.5 shrink-0" /> {chan.phone}
                  </a>
                  <a href={`mailto:${chan.email}`} className="text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1 truncate">
                    <HiOutlineEnvelope className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {chan.email}
                  </a>
                </div>
              </div>
            ))}

            {/* Campus Address Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-primary-950 text-white shadow-soft space-y-2">
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <h4 className="text-sm font-bold">Main Campus Address</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Educator School Complex, Plot 44-B, Educational Avenue, Sector F-8/3, Islamabad, Pakistan
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft-xl bg-white dark:bg-[#131D31]">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineMapPin className="w-5 h-5 text-primary-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">Campus Map & Directions</span>
            </div>
            <span className="text-[11px] text-slate-400">Sector F-8, Islamabad</span>
          </div>

          <div className="w-full h-80 relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <iframe
              title="School Campus Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13274.654854728562!2d73.0362947!3d33.7144883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf9df159491b%3A0x6a2c20689cf6bbcd!2sSector%20F-8%2C%20Islamabad!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
