import React, { useState } from 'react';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowRight,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlinePhone,
  HiOutlineSparkles
} from 'react-icons/hi2';
import Button from '../../components/common/Button';

const eligibility = [
  { grade: 'Playgroup & Nursery', age: '3.0 - 4.0 Years', assessment: 'Informal playful interaction and cognitive readiness' },
  { grade: 'Prep / Kindergarten', age: '4.5 - 5.5 Years', assessment: 'Basic motor skills, coloring, and vocabulary recognition' },
  { grade: 'Grade 1 to 5 (Primary)', age: '6.0 - 10.0 Years', assessment: 'Written evaluation in English, Mathematics, and Urdu' },
  { grade: 'Grade 6 to 8 (Middle)', age: '11.0 - 13.0 Years', assessment: 'English, Science, and Mathematics entrance test' },
  { grade: 'Matriculation (SSC I & II)', age: '14.0 - 16.0 Years', assessment: 'Middle standard academic transcripts + Entrance test' },
  { grade: 'Cambridge O-Levels / IGCSE', age: '14.0 - 16.5 Years', assessment: 'Cambridge diagnostic assessment & interview' },
  { grade: 'A-Levels & FSc (HSSC)', age: '16.5+ Years', assessment: 'Minimum 5 A*/B in O-Levels or 80%+ in Matric' }
];

const feeStructure = [
  { program: 'Montessori / Early Years', admission: 'Rs. 25,000', tuition: 'Rs. 14,500 / month', annualCharges: 'Rs. 10,000' },
  { program: 'Primary (Grade 1 - 5)', admission: 'Rs. 30,000', tuition: 'Rs. 16,800 / month', annualCharges: 'Rs. 12,000' },
  { program: 'Middle School (Grade 6 - 8)', admission: 'Rs. 35,000', tuition: 'Rs. 19,500 / month', annualCharges: 'Rs. 14,000' },
  { program: 'Matriculation (Science/CS)', admission: 'Rs. 38,000', tuition: 'Rs. 22,000 / month', annualCharges: 'Rs. 15,000' },
  { program: 'Cambridge O-Levels (IGCSE)', admission: 'Rs. 45,000', tuition: 'Rs. 28,500 / month', annualCharges: 'Rs. 18,000' },
  { program: 'Cambridge A-Levels / FSc', admission: 'Rs. 50,000', tuition: 'Rs. 34,000 / month', annualCharges: 'Rs. 20,000' }
];

const documents = [
  'Attested copy of Student NADRA Birth Certificate / B-Form',
  '4 recent passport size photographs with sky-blue background',
  'Attested copy of Father / Guardian CNIC / Passport',
  'Original School Leaving / Transfer Certificate (from previous institution)',
  'Certified copies of last two academic progress reports / report cards',
  'Immunization & Medical Fitness record signed by registered physician'
];

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    email: '',
    phone: '',
    grade: 'Grade 1 to 5 (Primary)',
    dob: '',
    prevSchool: '',
    address: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomId = 'EDU-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomId);
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent text-center space-y-4">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
            Admissions 2026 – 2027
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Begin Your Child's Journey of Excellence
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome prospective families! Review our eligibility standards, fee schedule, 
            and submit your admission inquiry online in minutes.
          </p>
        </div>
      </section>

      {/* Main Form & Guidelines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Online Application Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131D31] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xl">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-bold">
                <HiOutlineDocumentText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Online Admission Inquiry Form</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the prospective applicant details below</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <HiOutlineCheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Application Received!</h3>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your Inquiry Reference Number:</p>
                  <p className="text-2xl font-mono font-extrabold text-primary-600 dark:text-primary-400 mt-1">{refId}</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Our admissions office has received your inquiry for <strong>{formData.studentName}</strong>. 
                  An admissions coordinator will contact you at <strong>{formData.phone}</strong> with assessment schedule instructions.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zaid Ahmed"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Father / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmed Raza"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Parent Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Contact / WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Grade Applying For *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option>Playgroup & Nursery</option>
                      <option>Prep / Kindergarten</option>
                      <option>Grade 1 to 5 (Primary)</option>
                      <option>Grade 6 to 8 (Middle)</option>
                      <option>Matriculation (SSC)</option>
                      <option>Cambridge O-Levels / IGCSE</option>
                      <option>Cambridge A-Levels / FSc</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Previous School Attended (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. Army Public School / Beaconhouse"
                    value={formData.prevSchool}
                    onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Residential Address</label>
                  <input
                    type="text"
                    placeholder="House / Street / Sector / City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full shadow-md font-bold">
                    Submit Admission Application Now <HiOutlineArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Required Documents Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#131D31] p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                  <HiOutlineClipboardDocumentCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Document Checklist</h3>
                  <p className="text-[11px] text-slate-400">Required upon assessment clearance</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarships Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-primary-950 text-white p-6 rounded-3xl shadow-soft-xl space-y-3 border border-indigo-800/40">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-amber-300">
                <HiOutlineSparkles className="w-4 h-4" />
                Merit & Need Scholarships
              </div>
              <h4 className="text-base font-bold">Up to 100% Tuition Fee Waivers</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We reward intellectual brilliance. Top position holders in BISE Board exams or straight A* O-Level students qualify for automated merit scholarships. Kinship discounts (20% for 2nd sibling) apply automatically.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Age Eligibility Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            Standard Criteria
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Age & Eligibility Matrix (as of August 2026)
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Grade Level / Track</th>
                <th className="px-6 py-3.5">Recommended Age</th>
                <th className="px-6 py-3.5">Assessment & Prerequisites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
              {eligibility.map((el, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">{el.grade}</td>
                  <td className="px-6 py-3.5 font-mono">{el.age}</td>
                  <td className="px-6 py-3.5">{el.assessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fee Structure Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            Financial Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Standard Fee Schedule 2026 – 2027
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">All fees are payable on a monthly / quarterly basis with digital payment portal integration.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Program</th>
                <th className="px-6 py-3.5">Admission Fee (One-Time)</th>
                <th className="px-6 py-3.5">Tuition Fee</th>
                <th className="px-6 py-3.5">Annual Resource & Lab Charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
              {feeStructure.map((fee, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">{fee.program}</td>
                  <td className="px-6 py-3.5 font-mono">{fee.admission}</td>
                  <td className="px-6 py-3.5 font-mono font-bold text-primary-600 dark:text-primary-400">{fee.tuition}</td>
                  <td className="px-6 py-3.5 font-mono">{fee.annualCharges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
