import React from "react";

export default function MetricCard({ title, value, hint, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/70">{title}</span>
        {icon && <div className="text-primary-400">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {hint && <p className="text-xs text-white/60 mt-2">{hint}</p>}
    </div>
  );
}