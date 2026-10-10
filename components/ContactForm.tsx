'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, Loader2 } from 'lucide-react';

export default function HeroWithContact() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Prevent background scrolling when modal is open
    if (isContactOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isContactOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Please agree to the Terms of Use & Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTermsAccepted(false);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. The Hero Section with Blurred Interior Background */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex flex-col items-center justify-center px-6 overflow-hidden z-10">
        
        {/* Blurred Interior Image Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2500&auto=format&fit=crop"
            alt="Luxury Interior"
            fill
            priority
            quality={90}
            className="object-cover blur-[4px] scale-105 brightness-50"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-[1px] bg-[#FF5C05]" />
            <span className="text-[#FF5C05] text-[11px] uppercase tracking-[0.3em] font-bold">Taruna Interiors</span>
            <div className="w-8 h-[1px] bg-[#FF5C05]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-tight leading-[1.05] mb-8 drop-shadow-lg"
          >
            Designing Spaces, <br />
            <span className="font-medium">Elevating Lives.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mb-12 drop-shadow-md"
          >
            Bespoke interior design and turnkey execution tailored to reflect your unique vision and lifestyle.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            onClick={() => setIsContactOpen(true)}
            className="group relative flex items-center justify-center gap-3 bg-[#FF5C05] text-white px-10 py-5 rounded-full text-[13px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden hover:shadow-[0_10px_40px_rgba(255,92,5,0.4)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </div>
      </section>

      {/* 2. The Pop-Up Contact Form Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            {/* Dark Overlay Background */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsContactOpen(false)}
            />

            {/* Exit Cross Button (Top Right) */}
            <button 
              onClick={() => setIsContactOpen(false)}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-50 w-10 h-10 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center text-black shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content - White Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 max-h-[95vh] overflow-y-auto custom-scrollbar"
            >
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wider uppercase mb-2 font-mono">
                  Contact Us
                </h2>
                <p className="text-gray-500 text-[13px] md:text-sm font-mono">
                  Get in touch with our team for any enquiries and questions.
                </p>
              </div>

              {isClient ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name" 
                      className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono placeholder-gray-400"
                    />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="johndoe0001@gmail.com" 
                      className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono placeholder-gray-400"
                    />
                  </div>

                  {/* Row 2: Phone with +91 prefix */}
                  <div className="flex items-center w-full bg-white border border-gray-300 rounded-2xl px-5 py-3.5 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
                    <span className="text-gray-500 font-mono text-sm pr-4 border-r border-gray-300">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter Mobile Number" 
                      className="w-full bg-transparent pl-4 text-sm text-gray-900 focus:outline-none font-mono placeholder-gray-400"
                    />
                  </div>

                  {/* Row 3: Service Selection */}
                  <div className="relative">
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-3.5 text-sm text-gray-500 focus:text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Service</option>
                      <option value="residential">Residential Design</option>
                      <option value="commercial">Commercial Space</option>
                      <option value="turnkey">Turnkey Execution</option>
                    </select>
                  </div>

                  {/* Row 4: Message Textarea */}
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter your message..." 
                    className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-mono placeholder-gray-400 resize-none"
                  />

                  {/* Checkbox & Terms */}
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer accent-black"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-500 font-mono cursor-pointer select-none">
                      By continuing, I agree to the <span className="font-bold text-gray-700 underline">Terms of Use</span> & <span className="font-bold text-gray-700 underline">Privacy Policy</span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-sm font-mono mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full py-4 mt-2 rounded-2xl text-[15px] font-mono font-medium tracking-wide transition-all duration-300 flex justify-center items-center ${
                      isSubmitted 
                        ? 'bg-green-500 text-white cursor-default' 
                        : 'bg-[#0044ff] text-white hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSubmitted ? (
                      'Message Sent Successfully'
                    ) : (
                      'Submit'
                    )}
                  </button>

                </form>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// 'use client';
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

// export default function ContactForm() {
//   const [isClient, setIsClient] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     service: '',
//     message: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState(null); // Added for error handling

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError(null); // Clear error when user types
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           service: formData.service,
//           message: formData.message, 
//         }),
//       });

//       // 1. Read the response as raw text first
//       const textResponse = await response.text();

//       // 2. Try to parse it as JSON
//       let result;
//       try {
//         result = JSON.parse(textResponse);
//       } catch (parseError) {
//         // If it fails to parse (meaning it's HTML), log it so we can see the real error
//         console.error("Server returned HTML instead of JSON. Raw response:", textResponse);
//         throw new Error("Server configuration error. Check terminal.");
//       }

//       // 3. Handle the actual result
//       if (response.ok) {
//         setIsSubmitted(true);
//         setFormData({ name: '', email: '', phone: '', service: '', message: '' });
//         setTimeout(() => setIsSubmitted(false), 5000);
//       } else {
//         throw new Error(result.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error("Submission Error:", err);
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section id="contact" className="bg-[#0a0a0a] py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-white/5">
//       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

//       <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
//         {/* Left Column: Contact Details */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[45%] flex flex-col justify-center"
//         >
//           <div className="inline-flex items-center gap-3 mb-6">
//             <div className="w-8 h-[1px] bg-brand-blue" />
//             <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Get in Touch</span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-medium text-white tracking-tight leading-[1.1] mb-6">
//             Let&apos;s Discuss <br />
//             <span className="italic text-gray-400 font-light">Your Space.</span>
//           </h2>
          
//           <p className="text-[16px] text-gray-400 leading-relaxed mb-12 font-light max-w-md">
//             Whether you are looking for a complete turnkey solution or bespoke interior styling, our lead designers are ready to bring your vision to life.
//           </p>
          
//           <div className="space-y-8">
//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Phone className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Direct Line</p>
//                 <a href="tel:+919586396373" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">+91 95863 96373</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Mail className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Email</p>
//                 <a href="mailto:hello@tarunainterior.com" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">hello@tarunainterior.com</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <MapPin className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Studio</p>
//                 <p className="text-lg text-white font-serif tracking-wide leading-relaxed">
//                   Laxmi Nagar, New Sama,<br /> Vadodara, Gujarat
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Column: Interactive Form */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[55%]"
//         >
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            
//             {isClient ? (
//               <form onSubmit={handleSubmit} className="flex flex-col gap-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="relative group">
//                     <input 
//                       type="text" 
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       placeholder="Your Name" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
                  
//                   <div className="relative group">
//                     <input 
//                       type="email" 
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       placeholder="Email Address" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="relative group">
//                     <input 
//                       type="tel" 
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       placeholder="Phone Number" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
                  
//                   <div className="relative group">
//                     <select 
//                       name="service"
//                       value={formData.service}
//                       onChange={handleChange}
//                       required
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-gray-400 focus:text-white focus:outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer peer"
//                     >
//                       <option value="" disabled hidden>Select Service</option>
//                       <option value="residential" className="bg-[#121212] text-white">Residential Design</option>
//                       <option value="commercial" className="bg-[#121212] text-white">Commercial Space</option>
//                       <option value="turnkey" className="bg-[#121212] text-white">Turnkey Execution</option>
//                       <option value="consultation" className="bg-[#121212] text-white">Design Consultation</option>
//                     </select>
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
//                 </div>

//                 <div className="relative group">
//                   <textarea 
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows="4"
//                     placeholder="Tell us about your project..." 
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 resize-none peer"
//                   />
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>

//                 {error && (
//                   <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>{error}</span>
//                   </div>
//                 )}

//                 <button 
//                   type="submit" 
//                   disabled={isSubmitting || isSubmitted}
//                   className={`group relative flex items-center justify-center gap-3 w-full md:w-auto md:self-start px-10 py-4 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden border ${
//                     isSubmitted 
//                       ? 'bg-green-500/10 border-green-500 text-green-400 cursor-default' 
//                       : 'bg-white/5 border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1'
//                   }`}
//                 >
//                   {!isSubmitted && (
//                     <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
//                   )}
                  
//                   <span className="relative z-10">
//                     {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent' : 'Send Message'}
//                   </span>
                  
//                   <div className="relative z-10">
//                     {isSubmitting ? (
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     ) : isSubmitted ? (
//                       <CheckCircle2 className="w-4 h-4" />
//                     ) : (
//                       <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
//                     )}
//                   </div>
//                 </button>
//               </form>
//             ) : (
//               <div className="h-[400px] flex items-center justify-center">
//                  <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
















































// 'use client';
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

// export default function ContactForm() {
//   const [isClient, setIsClient] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     service: '',
//     message: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSubmitted(true);
//       setFormData({ name: '', email: '', phone: '', service: '', message: '' });
//       setTimeout(() => setIsSubmitted(false), 5000);
//     }, 1500);
//   };

//   return (
//     <section id="contact" className="bg-[#0a0a0a] py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-white/5">
//       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

//       <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
//         {/* Left Column: Contact Details */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[45%] flex flex-col justify-center"
//         >
//           <div className="inline-flex items-center gap-3 mb-6">
//             <div className="w-8 h-[1px] bg-brand-blue" />
//             <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Get in Touch</span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-medium text-white tracking-tight leading-[1.1] mb-6">
//             Let&apos;s Discuss <br />
//             <span className="italic text-gray-400 font-light">Your Space.</span>
//           </h2>
          
//           <p className="text-[16px] text-gray-400 leading-relaxed mb-12 font-light max-w-md">
//             Whether you are looking for a complete turnkey solution or bespoke interior styling, our lead designers are ready to bring your vision to life.
//           </p>
          
//           <div className="space-y-8">
//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Phone className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Direct Line</p>
//                 <a href="tel:+919586396373" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">+91 95863 96373</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Mail className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Email</p>
//                 <a href="mailto:hello@tarunainterior.com" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">hello@tarunainterior.com</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <MapPin className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Studio</p>
//                 <p className="text-lg text-white font-serif tracking-wide leading-relaxed">
//                   Laxmi Nagar, New Sama,<br /> Vadodara, Gujarat
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Column: Interactive Form */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[55%]"
//         >
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            
//             {/* We only render the form content once the client is ready to avoid extension-induced mismatches */}
//             {isClient ? (
//               <form onSubmit={handleSubmit} className="flex flex-col gap-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="relative group">
//                     <input 
//                       type="text" 
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       placeholder="Your Name" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
                  
//                   <div className="relative group">
//                     <input 
//                       type="email" 
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       placeholder="Email Address" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="relative group">
//                     <input 
//                       type="tel" 
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       placeholder="Phone Number" 
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                     />
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
                  
//                   <div className="relative group">
//                     <select 
//                       name="service"
//                       value={formData.service}
//                       onChange={handleChange}
//                       required
//                       className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-gray-600 focus:text-white focus:outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer peer"
//                     >
//                       <option value="" disabled hidden>Select Service</option>
//                       <option value="residential" className="bg-[#121212] text-white">Residential Design</option>
//                       <option value="commercial" className="bg-[#121212] text-white">Commercial Space</option>
//                       <option value="turnkey" className="bg-[#121212] text-white">Turnkey Execution</option>
//                       <option value="consultation" className="bg-[#121212] text-white">Design Consultation</option>
//                     </select>
//                     <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                   </div>
//                 </div>

//                 <div className="relative group">
//                   <textarea 
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows="4"
//                     placeholder="Tell us about your project..." 
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 resize-none peer"
//                   />
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>

//                 <button 
//                   type="submit" 
//                   disabled={isSubmitting || isSubmitted}
//                   className={`group relative flex items-center justify-center gap-3 w-full md:w-auto md:self-start px-10 py-4 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden border ${
//                     isSubmitted 
//                       ? 'bg-green-500/10 border-green-500 text-green-400 cursor-default' 
//                       : 'bg-white/5 border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1'
//                   }`}
//                 >
//                   {!isSubmitted && (
//                     <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
//                   )}
                  
//                   <span className="relative z-10">
//                     {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent' : 'Send Message'}
//                   </span>
                  
//                   <div className="relative z-10">
//                     {isSubmitting ? (
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     ) : isSubmitted ? (
//                       <CheckCircle2 className="w-4 h-4" />
//                     ) : (
//                       <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
//                     )}
//                   </div>
//                 </button>
//               </form>
//             ) : (
//               <div className="h-[400px] flex items-center justify-center">
//                  <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
//               </div>
//             )}
//           </div>
//         </motion.div>

//       </div>
//     </section>
//   );
// }

// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     service: '',
//     message: ''
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate a network request (replace this with your actual form submission API later)
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSubmitted(true);
//       setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      
//       // Reset success message after 5 seconds
//       setTimeout(() => setIsSubmitted(false), 5000);
//     }, 1500);
//   };

//   return (
//     <section id="contact" className="bg-[#0a0a0a] py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-white/5">
      
//       {/* Abstract Background Elements */}
//       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

//       <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
//         {/* Left Column: Contact Details */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[45%] flex flex-col justify-center"
//         >
//           <div className="inline-flex items-center gap-3 mb-6">
//             <div className="w-8 h-[1px] bg-brand-blue" />
//             <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Get in Touch</span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-medium text-white tracking-tight leading-[1.1] mb-6">
//             Let&apos;s Discuss <br />
//             <span className="italic text-gray-400 font-light">Your Space.</span>
//           </h2>
          
//           <p className="text-[16px] text-gray-400 leading-relaxed mb-12 font-light max-w-md">
//             Whether you are looking for a complete turnkey solution or bespoke interior styling, our lead designers are ready to bring your vision to life.
//           </p>
          
//           <div className="space-y-8">
//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Phone className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Direct Line</p>
//                 <a href="tel:+919586396373" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">+91 95863 96373</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <Mail className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Email</p>
//                 <a href="mailto:hello@tarunainterior.com" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">hello@tarunainterior.com</a>
//               </div>
//             </div>

//             <div className="group flex items-start gap-6">
//               <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
//                 <MapPin className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Studio</p>
//                 <p className="text-lg text-white font-serif tracking-wide leading-relaxed">
//                   Laxmi Nagar, New Sama,<br /> Vadodara, Gujarat
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Column: Interactive Form */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//           className="w-full lg:w-[55%]"
//         >
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
//             <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="relative group">
//                   <input 
//                     type="text" 
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Your Name" 
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                   />
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>
                
//                 <div className="relative group2"suppressHydrationWarning>
//                   <input 
//                     type="email" 
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="Email Address" 
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                   />
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="relative group3">
//                   <input 
//                     type="tel" 
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     placeholder="Phone Number" 
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
//                   />
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>
                
//                 <div className="relative group4">
//                   <select 
//                     name="service"
//                     value={formData.service}
//                     onChange={handleChange}
//                     required
//                     className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-gray-600 focus:text-white focus:outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer peer"
//                   >
//                     <option value="" disabled hidden>Select Service</option>
//                     <option value="residential" className="bg-[#121212] text-white">Residential Design</option>
//                     <option value="commercial" className="bg-[#121212] text-white">Commercial Space</option>
//                     <option value="turnkey" className="bg-[#121212] text-white">Turnkey Execution</option>
//                     <option value="consultation" className="bg-[#121212] text-white">Design Consultation</option>
//                   </select>
//                   <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//                 </div>
//               </div>

//               <div className="relative group5">
//                 <textarea 
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   required
//                   rows="4"
//                   placeholder="Tell us about your project..." 
//                   className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 resize-none peer"
//                 />
//                 <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
//               </div>

//               <button 
//                 type="submit" 
//                 disabled={isSubmitting || isSubmitted}
//                 className={`group relative flex items-center justify-center gap-3 w-full md:w-auto md:self-start px-10 py-4 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden border ${
//                   isSubmitted 
//                     ? 'bg-green-500/10 border-green-500 text-green-400 cursor-default' 
//                     : 'bg-white/5 border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1'
//                 }`}
//               >
//                 {!isSubmitted && (
//                   <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
//                 )}
                
//                 <span className="relative z-10">
//                   {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent' : 'Send Message'}
//                 </span>
                
//                 <div className="relative z-10">
//                   {isSubmitting ? (
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   ) : isSubmitted ? (
//                     <CheckCircle2 className="w-4 h-4" />
//                   ) : (
//                     <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
//                   )}
//                 </div>
//               </button>

//             </form>
//           </div>
//         </motion.div>

//       </div>
//     </section>
//   );
// }