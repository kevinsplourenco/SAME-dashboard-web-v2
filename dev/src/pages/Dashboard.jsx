import React, { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";
import { useSales } from "../hooks/useSales";
import { useCashFlow } from "../hooks/useCashFlow";
import { formatCurrency } from "../utils/formatters";
import { CashFlowChart } from "../components/CashFlowChart";
import { ProductAlerts } from "../components/ProductAlerts";
import { ExpiringProducts } from "../components/ExpiringProducts";

export default function Dashboard() {
  const { sales, loading: loadingSales } = useSales();
  const { cashFlow, loading: loadingCashFlow } = useCashFlow();
  const [period, setPeriod] = useState("month");

  const stats = useMemo(() => {
    const now = new Date();
    let currentStart, currentEnd, lastStart, lastEnd;

    if (period === "day") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      lastStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      lastEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "month") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      lastEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      currentStart = new Date(now.getFullYear(), 0, 1);
      currentEnd = new Date(now.getFullYear() + 1, 0, 1);
      lastStart = new Date(now.getFullYear() - 1, 0, 1);
      lastEnd = new Date(now.getFullYear(), 0, 1);
    }

    const filterByDateRange = (items, start, end) => {
      return items.filter((item) => {
        const date = item.date ? new Date(item.date) : null;
        if (!date) return false;
        return date >= start && date < end;
      });
    };

    const currentCashFlow = filterByDateRange(cashFlow, currentStart, currentEnd);
    const lastCashFlow = filterByDateRange(cashFlow, lastStart, lastEnd);

    const currentRevenue = currentCashFlow
      .filter((t) => t.type === "entrada")
      .reduce((sum, t) => sum + parseFloat(t.amount || t.valor || 0), 0);

    const lastRevenue = lastCashFlow
      .filter((t) => t.type === "entrada")
      .reduce((sum, t) => sum + parseFloat(t.amount || t.valor || 0), 0);

    const revenueChange = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

    const currentExpenses = currentCashFlow
      .filter((t) => t.type === "saida" || t.type === "saída")
      .reduce((sum, t) => sum + parseFloat(t.amount || t.valor || 0), 0);

    const lastExpenses = lastCashFlow
      .filter((t) => t.type === "saida" || t.type === "saída")
      .reduce((sum, t) => sum + parseFloat(t.amount || t.valor || 0), 0);

    const expensesChange = lastExpenses === 0 ? 100 : ((currentExpenses - lastExpenses) / lastExpenses) * 100;

    const currentProfit = currentRevenue - currentExpenses;
    const lastProfit = lastRevenue - lastExpenses;
    const profitChange = lastProfit === 0 ? 100 : ((currentProfit - lastProfit) / lastProfit) * 100;

    // Vendas: sem filtro de data, pega TODAS
    const currentSalesCount = sales.length;
    const lastSalesCount = 0; // Sem comparação
    const salesChange = 0; // Sem comparação

    console.log("Dashboard Stats:", {
      period,
      totalSalesLoaded: sales.length,
      currentRevenue,
      currentExpenses,
      currentProfit,
    });

    return {
      revenue: { value: currentRevenue, change: revenueChange },
      expenses: { value: currentExpenses, change: expensesChange },
      profit: { value: currentProfit, change: profitChange },
      sales: { value: currentSalesCount, change: salesChange },
    };
  }, [cashFlow, sales, period]);

  const getPeriodLabel = () => {
    if (period === "day") return "hoje vs ontem";
    if (period === "month") return "este mês vs mês anterior";
    return "este ano vs ano anterior";
  };

  const cards = [
    {
      title: "Receita Total",
      value: formatCurrency(stats.revenue.value),
      change: `${stats.revenue.change > 0 ? "+" : ""}${stats.revenue.change.toFixed(1)}%`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Despesas",
      value: formatCurrency(stats.expenses.value),
      change: `${stats.expenses.change > 0 ? "+" : ""}${stats.expenses.change.toFixed(1)}%`,
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Lucro Líquido",
      value: formatCurrency(stats.profit.value),
      change: `${stats.profit.change > 0 ? "+" : ""}${stats.profit.change.toFixed(1)}%`,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Vendas",
      value: stats.sales.value.toString(),
      change: `${stats.sales.change > 0 ? "+" : ""}${stats.sales.change.toFixed(1)}%`,
      icon: ShoppingBag,
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  if (loadingSales || loadingCashFlow) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8" style={{ minWidth: 0 }}>
      {/* Filtros */}
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {cards.map((card) => (
          <div key={card.title} className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CashFlowChart period={period} setPeriod={setPeriod} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <ProductAlerts />
        <ExpiringProducts />
      </div>
    </div>
  );
}