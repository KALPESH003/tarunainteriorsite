'use client';
import { motion } from 'framer-motion';
import { 
  Award, 
  Clock, 
  Users, 
  ShieldCheck, 
  Shield, 
  Briefcase, 
  Timer, 
  Headphones, 
  Leaf 
} from 'lucide-react';

// Centralized data array for easy updates
const featuresData = [
  { id: 'premium', icon: Award, title: 'Premium', subtitle: 'Top Finishes' },
  { id: 'years', icon: Clock, title: '12+ Years', subtitle: 'Of Excellence' },
  { id: 'clients', icon: Users, title: '200+ Clients', subtitle: 'Trusted by Many' },
  { id: 'cost', icon: ShieldCheck, title: 'No Hidden', subtitle: 'Transparent Cost' },
  { id: 'warranty', icon: Shield, title: '10+ Yr Wty', subtitle: 'Long Assurance' },
  { id: 'experts', icon: Briefcase, title: '20+ Experts', subtitle: 'In-house Team' },
  { id: 'ontime', icon: Timer, title: 'On-Time', subtitle: 'Perfect Schedule' },
  { 
    id: 'support', 
    icon: Headphones, 
    title: '24*7 Support', 
    subtitle: 'Life-long Service', 
    highlighted: true // Triggers the special brand-blue elevated card
  },
  { 
    id: 'eco', 
    icon: Leaf, 
    title: 'Eco-Friendly', 
    subtitle: 'Sustainable', 
    iconColor: 'text-green-500' // Custom color override for the leaf
  },
];

export default function Features() {
  return (
    // WE ADDED THE ID HERE SO THE NAVBAR CAN FIND IT!
    <section id="features-bar">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 max-w-[1400px] mx-auto px-6 lg:px-12 -mt-12 lg:-mt-16"
      >
        <div className="bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[24px] lg:rounded-[2rem] border border-white p-2 relative">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1">
            
            {featuresData.map((feature, index) => {
              const Icon = feature.icon;
              const isHighlighted = feature.highlighted;
              
              return (
                <div 
                  key={feature.id} 
                  className={`flex flex-col items-center justify-center p-3 lg:p-4 text-center relative ${
                    isHighlighted 
                      ? 'bg-brand-blue rounded-2xl transform lg:scale-110 -translate-y-1 lg:-translate-y-2 shadow-[0_15px_40px_rgba(67,24,255,0.4)] z-10' 
                      : ''
                  }`}
                >
                  {/* Vertical divider line (hidden on the highlighted item and the last item) */}
                  {!isHighlighted && index !== featuresData.length - 1 && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden lg:block opacity-50" />
                  )}

                  <Icon 
                    strokeWidth={1.5} 
                    className={`w-6 h-6 mb-3 ${
                      isHighlighted ? 'text-white animate-pulse relative z-10' : 
                      feature.iconColor ? feature.iconColor : 'text-brand-blue'
                    }`} 
                  />
                  
                  <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    isHighlighted ? 'text-white relative z-10' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-[10px] font-medium ${
                    isHighlighted ? 'text-blue-200 relative z-10' : 'text-gray-500'
                  }`}>
                    {feature.subtitle}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </motion.div>
    </section>
  );
}