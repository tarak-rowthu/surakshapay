import React from 'react';
import { Activity, ShieldCheck, Calculator, ArrowRightLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const steps = [
  { id: 1, label: 'Trigger', icon: Activity },
  { id: 2, label: 'Eligible', icon: ShieldCheck },
  { id: 3, label: 'Payout', icon: Calculator },
  { id: 4, label: 'Transfer', icon: ArrowRightLeft },
  { id: 5, label: 'Completed', icon: CheckCircle2 },
];

const TriggerPipeline = ({ currentStep, isError }) => {
  return (
    <div className="w-full bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 mb-8">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Live AI Pipeline</h3>
      <div className="flex justify-between items-center relative">
        {/* Connection Line background */}
        <div className="absolute left-[5%] right-[5%] top-6 -translate-y-1/2 h-1 bg-slate-100 z-0 rounded-full"></div>
        {/* Active connection line */}
        <div 
          className={`absolute left-[5%] top-6 -translate-y-1/2 h-1 z-0 transition-all duration-700 ease-out rounded-full ${isError ? 'bg-rose-500' : 'bg-blue-500'}`}
          style={{ width: `${Math.max(0, currentStep - 1) * 22.5}%` }}
        ></div>

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;
          const isErrorStep = isError && isActive;

          let bgColor = 'bg-slate-100 text-slate-400';
          let ringColor = 'border-white';
          
          if (isPast) {
            bgColor = 'bg-emerald-500 text-white';
            ringColor = 'ring-4 ring-emerald-50 border-white';
          } else if (isActive) {
             if (isErrorStep) {
                bgColor = 'bg-rose-500 text-white';
                ringColor = 'ring-4 ring-rose-50 border-white';
             } else {
                bgColor = 'bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse';
                ringColor = 'ring-4 ring-blue-50 border-white';
             }
          }

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${ringColor} ${bgColor} transition-all duration-500`}>
                {isErrorStep ? <AlertCircle size={20} /> : <Icon size={20} />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider text-center ${isActive ? (isErrorStep ? 'text-rose-600' : 'text-blue-600') : (isPast ? 'text-emerald-600' : 'text-slate-400')}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriggerPipeline;
