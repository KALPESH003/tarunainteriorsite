'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="bg-[#0a0a0a] py-32 px-6 md:px-12 relative z-20 w-full overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-[1300px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Column: Contact Details */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[45%] flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-brand-blue" />
            <span className="text-brand-blue text-[11px] uppercase tracking-[0.25em] font-bold">Get in Touch</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-medium text-white tracking-tight leading-[1.1] mb-6">
            Let&apos;s Discuss <br />
            <span className="italic text-gray-400 font-light">Your Space.</span>
          </h2>
          
          <p className="text-[16px] text-gray-400 leading-relaxed mb-12 font-light max-w-md">
            Whether you are looking for a complete turnkey solution or bespoke interior styling, our lead designers are ready to bring your vision to life.
          </p>
          
          <div className="space-y-8">
            <div className="group flex items-start gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Direct Line</p>
                <a href="tel:+919586396373" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">+91 95863 96373</a>
              </div>
            </div>

            <div className="group flex items-start gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Email</p>
                <a href="mailto:hello@tarunainterior.com" className="text-lg text-white font-serif tracking-wide group-hover:text-brand-blue transition-colors">hello@tarunainterior.com</a>
              </div>
            </div>

            <div className="group flex items-start gap-6">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all duration-500">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors duration-500" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Studio</p>
                <p className="text-lg text-white font-serif tracking-wide leading-relaxed">
                  Laxmi Nagar, New Sama,<br /> Vadodara, Gujarat
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[55%]"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            
            {/* We only render the form content once the client is ready to avoid extension-induced mismatches */}
            {isClient ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone Number" 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 peer"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
                  </div>
                  
                  <div className="relative group">
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-gray-600 focus:text-white focus:outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer peer"
                    >
                      <option value="" disabled hidden>Select Service</option>
                      <option value="residential" className="bg-[#121212] text-white">Residential Design</option>
                      <option value="commercial" className="bg-[#121212] text-white">Commercial Space</option>
                      <option value="turnkey" className="bg-[#121212] text-white">Turnkey Execution</option>
                      <option value="consultation" className="bg-[#121212] text-white">Design Consultation</option>
                    </select>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
                  </div>
                </div>

                <div className="relative group">
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Tell us about your project..." 
                    className="w-full bg-transparent border-b border-white/20 py-3 text-[15px] text-white focus:outline-none focus:border-brand-blue transition-colors placeholder-gray-600 resize-none peer"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-blue transition-all duration-500 peer-focus:w-full" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isSubmitted}
                  className={`group relative flex items-center justify-center gap-3 w-full md:w-auto md:self-start px-10 py-4 rounded-full text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden border ${
                    isSubmitted 
                      ? 'bg-green-500/10 border-green-500 text-green-400 cursor-default' 
                      : 'bg-white/5 border-white/20 text-white hover:bg-brand-blue hover:border-brand-blue hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1'
                  }`}
                >
                  {!isSubmitted && (
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0" />
                  )}
                  
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent' : 'Send Message'}
                  </span>
                  
                  <div className="relative z-10">
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isSubmitted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                    )}
                  </div>
                </button>
              </form>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

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