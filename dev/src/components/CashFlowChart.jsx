import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCashFlow } from "../hooks/useCashFlow";

export function CashFlowChart() {
  const { cashFlow } = useCashFlow();
  const [period, setPeriod] = useState("month"); // day, month, year

  const chartData = useMemo(() => {
    const data = {};
    const dateMap = {}; // Mapa para manter controle das datas reais

    cashFlow.forEach((cf) => {
      const date = cf.date ? new Date(cf.date) : null;
      if (!date) return;

      let key;
      let sortDate; // Para ordenação correta
      
      if (period === "day") {
        key = date.toLocaleDateString("pt-BR");
        sortDate = date.getTime();
      } else if (period === "month") {
        key = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
        // Usar o primeiro dia do mês para ordenação
        sortDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      } else {
        key = date.getFullYear().toString();
        // Usar o primeiro dia do ano para ordenação
        sortDate = new Date(date.getFullYear(), 0, 1).getTime();
      }

      if (!data[key]) {
        data[key] = { date: key, entrada: 0, saida: 0, sortDate };
      }

      if (cf.type === "entrada") {
        data[key].entrada += parseFloat(cf.amount || cf.valor || 0);
      } else {
        data[key].saida += parseFloat(cf.amount || cf.valor || 0);
      }
    });

    // Ordena por sortDate e remove esse campo antes de retornar
    return Object.values(data)
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ sortDate, ...item }) => item); // Remove sortDate do objeto final
  }, [cashFlow, period]);

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Fluxo de Caixa</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("day")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "day"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "month"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "year"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Ano
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center text-white/40 py-12">Sem dados disponíveis</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="entrada"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEntrada)"
              name="Entradas"
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="saida"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSaida)"
              name="Saídas"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}