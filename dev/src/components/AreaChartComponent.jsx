import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AreaChartComponent({ data, title, subtitle }) {
  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[rgb(var(--fg))]">{title}</h3>
        <p className="text-sm text-[rgb(var(--muted))]">{subtitle}</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrejuizo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value) =>
              `R$ ${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}`
            }
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
          <Area
            type="monotone"
            dataKey="lucro"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLucro)"
            name="💚 Lucro"
          />
          <Area
            type="monotone"
            dataKey="prejuizo"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrejuizo)"
            name="❌ Prejuízo"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}