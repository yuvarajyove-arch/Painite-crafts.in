import React from 'react';
import { Truck, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const TrustServiceBar: React.FC = () => {
  const items = [
    {
      icon: Truck,
      title: 'Fast Studio Shipping',
      description: 'Carefully cushioned in recyclable eco boxes.',
      accent: 'text-[#4A3728] bg-[#F8D7DA]'
    },
    {
      icon: ShieldCheck,
      title: 'Safe Checkout',
      description: 'Encrypted UPI, Cards, Net Banking & COD.',
      accent: 'text-[#4A3728] bg-[#FFF3E0]'
    },
    {
      icon: HeartHandshake,
      title: 'Artist Care',
      description: 'Dedicated support for all orders & queries.',
      accent: 'text-[#4A3728] bg-[#FCE4EC]'
    },
    {
      icon: Sparkles,
      title: 'Artisan Quality',
      description: 'Premium non-toxic clay with lustrous gloss finish.',
      accent: 'text-[#4A3728] bg-[#F8D7DA]'
    }
  ];

  return (
    <section className="border-y border-[#F2E8E0] bg-[#FDF9F6] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 sm:p-5 rounded-3xl bg-white border border-[#F2E8E0] hover:border-[#EAD0D3] hover:shadow-xs transition-all duration-300 group"
              >
                <div className={`p-2.5 rounded-2xl ${item.accent} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#4A3728] uppercase tracking-wider">{item.title}</h4>
                  <p className="text-xs text-[#7D6B5D] mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

