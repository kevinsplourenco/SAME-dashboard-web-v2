import React, { useMemo, useState } from "react";
import { useSales } from "../hooks/useSales";
import { useCashFlow } from "../hooks/useCashFlow";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/formatters";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RPieChart,
} from "recharts";
import { Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Wallet } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Relatorios() {
  const { sales } = useSales();
  const { cashFlow } = useCashFlow();
  const { products } = useProducts();
  const [dateRange, setDateRange] = useState("month"); // day, week, month, year

  const data = useMemo(() => {
    // SEMPRE usar todas as vendas e cashflow (sem filtro de data por enquanto)
    const filteredSales = sales;
    const filteredCashFlow = cashFlow;

    console.log("Total de vendas:", filteredSales.length);
    console.log("Primeira venda:", filteredSales[0]);

    // Vendas por produto - IGUAL à página Sales
    const salesByProduct = {};
    filteredSales.forEach((sale) => {
      const productName = sale.produto || sale.name || "Produto desconhecido";
      if (!salesByProduct[productName]) {
        salesByProduct[productName] = { name: productName, amount: 0, quantity: 0 };
      }
      salesByProduct[productName].amount += parseFloat(sale.valor || sale.total || 0);
      salesByProduct[productName].quantity += parseInt(sale.quantidade || sale.quantity || 0);
    });

    // Fluxo de caixa diário
    const dailyFlow = {};
    filteredCashFlow.forEach((cf) => {
      const date = cf.date ? new Date(cf.date).toLocaleDateString("pt-BR") : "Sem data";
      if (!dailyFlow[date]) {
        dailyFlow[date] = { date, entrada: 0, saida: 0 };
      }
      if (cf.type === "entrada") {
        dailyFlow[date].entrada += parseFloat(cf.amount || cf.valor || 0);
      } else {
        dailyFlow[date].saida += parseFloat(cf.amount || cf.valor || 0);
      }
    });

    // Status de produtos
    const productStatus = {
      ativo: products.filter((p) => p.status !== "inativo").length,
      inativo: products.filter((p) => p.status === "inativo").length,
      baixoEstoque: products.filter(
        (p) => (p.quantity || 0) <= 10
      ).length,
    };

    // Totais - IGUAL à página Sales
    const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.valor || s.total || 0), 0);
    const totalQuantity = filteredSales.reduce((sum, s) => sum + (s.quantidade || s.quantity || 0), 0);

    console.log("Sales by Product:", Object.values(salesByProduct));
    console.log("Total Revenue:", totalRevenue);
    console.log("Total Quantity:", totalQuantity);

    return {
      salesByProduct: Object.values(salesByProduct).sort(
        (a, b) => b.amount - a.amount
      ),
      dailyFlow: Object.values(dailyFlow).sort((a, b) => new Date(a.date) - new Date(b.date)),
      productStatus,
      totalRevenue,
      totalExpenses: 0, // totalExpenses não está sendo calculado aqui, pois não temos informações de despesas na página Sales
      totalSales: filteredSales.length,
      profit: totalRevenue, // lucro é igual à receita total, pois não estamos considerando despesas
    };
  }, [sales, cashFlow, products, dateRange]);

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 10;

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("RELATÓRIO MENSAL - SAME DASHBOARD", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Período: ${dateRange === "day" ? "Hoje" : dateRange === "week" ? "Esta Semana" : dateRange === "month" ? "Este Mês" : "Este Ano"}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 5;
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Resumo Financeiro
    doc.setFontSize(12);
    doc.text("RESUMO FINANCEIRO", 10, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.text(`Receita Total: ${formatCurrency(data.totalRevenue)}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Despesas Total: ${formatCurrency(data.totalExpenses)}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Lucro Líquido: ${formatCurrency(data.profit)}`, 10, yPosition);
    yPosition += 10;

    // Vendas
    doc.setFontSize(12);
    doc.text("VENDAS", 10, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.text(`Total de Vendas: ${data.totalSales}`, 10, yPosition);
    yPosition += 10;

    // Tabela de Produtos
    if (data.salesByProduct.length > 0) {
      doc.setFontSize(12);
      doc.text("DETALHES DE VENDAS", 10, yPosition);
      yPosition += 7;

      doc.autoTable({
        startY: yPosition,
        head: [["Produto", "Quantidade", "Valor"]],
        body: data.salesByProduct.map((p) => [
          p.name,
          p.quantity.toString(),
          formatCurrency(p.amount),
        ]),
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [139, 92, 246] },
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Status de Produtos
    if (yPosition + 30 > pageHeight) {
      doc.addPage();
      yPosition = 10;
    }

    doc.setFontSize(12);
    doc.text("STATUS DE PRODUTOS", 10, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.text(`Produtos Ativos: ${data.productStatus.ativo}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Produtos Inativos: ${data.productStatus.inativo}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Produtos com Baixo Estoque: ${data.productStatus.baixoEstoque}`, 10, yPosition);
    yPosition += 10;

    // Salvar PDF
    doc.save(`relatorio-${new Date().getTime()}.pdf`);
  };

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-white/60">Análise detalhada do negócio</p>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold"
        >
          <Download size={20} />
          Baixar Relatório
        </button>
      </div>

      {/* Filtro de Data */}
      <div className="flex gap-2">
        <button
          onClick={() => setDateRange("day")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            dateRange === "day"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setDateRange("week")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            dateRange === "week"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setDateRange("month")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            dateRange === "month"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Mês
        </button>
        <button
          onClick={() => setDateRange("year")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            dateRange === "year"
              ? "bg-purple-600 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          Ano
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Receita Total</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {formatCurrency(
                  data.totalRevenue +
                  cashFlow
                    .filter((c) => c.type === "entrada")
                    .reduce((sum, c) => sum + (parseFloat(c.amount || c.valor || 0)), 0)
                )}
              </h3>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Despesas Total</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {formatCurrency(
                  data.totalExpenses +
                  cashFlow
                    .filter((c) => c.type === "saida" || c.type === "saída")
                    .reduce((sum, c) => sum + (parseFloat(c.amount || c.valor || 0)), 0)
                )}
              </h3>
            </div>
            <TrendingUp className="text-red-400" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Lucro Líquido</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {formatCurrency(
                  (data.totalRevenue +
                    cashFlow
                      .filter((c) => c.type === "entrada")
                      .reduce((sum, c) => sum + (parseFloat(c.amount || c.valor || 0)), 0)) -
                  (data.totalExpenses +
                    cashFlow
                      .filter((c) => c.type === "saida" || c.type === "saída")
                      .reduce((sum, c) => sum + (parseFloat(c.amount || c.valor || 0)), 0))
                )}
              </h3>
            </div>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total de Vendas</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {data.totalSales}
              </h3>
            </div>
            <ShoppingBag className="text-cyan-400" size={24} />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Fluxo de Caixa</h3>
          {data.dailyFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-white/40 py-8">Sem dados</div>
          )}
        </div>

        {/* Top Produtos */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top 5 Produtos</h3>
          {data.salesByProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesByProduct.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <Bar dataKey="quantity" fill="#8b5cf6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-white/40 py-8">Sem dados</div>
          )}
        </div>

        {/* Status de Produtos */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Status de Produtos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Ativos", value: data.productStatus.ativo },
                  { name: "Inativos", value: data.productStatus.inativo },
                  { name: "Baixo Estoque", value: data.productStatus.baixoEstoque },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                labelStyle={{ color: "#ffffff", backgroundColor: "#1a1a2e" }}
                formatter={(value, name) => [
                  <span style={{ color: "#ffffff" }}>{value} produto(s)</span>,
                  <span style={{ color: "#ffffff" }}>{name}</span>,
                ]}
              />
              <Legend wrapperStyle={{ color: "#ffffff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de Vendas */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Distribuição de Vendas</h3>
          {data.salesByProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.salesByProduct.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  labelStyle={{ color: "#ffffff", backgroundColor: "#1a1a2e" }}
                  formatter={(value) => [
                    <span style={{ color: "#ffffff" }}>
                      {formatCurrency(value)}
                    </span>,
                  ]}
                />
                <Legend wrapperStyle={{ color: "#ffffff" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-white/40 py-12">
              Nenhuma venda registrada neste período
            </div>
          )}
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Detalhes de Vendas</h3>
        {data.salesByProduct.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 text-white/60">Produto</th>
                  <th className="text-right py-2 px-4 text-white/60">Quantidade</th>
                  <th className="text-right py-2 px-4 text-white/60">Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.salesByProduct.map((product, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{product.name}</td>
                    <td className="text-right py-3 px-4 text-white">{product.quantity}</td>
                    <td className="text-right py-3 px-4 text-green-400">
                      {formatCurrency(product.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-white/40 py-8">Nenhuma venda registrada</div>
        )}
      </div>
    </div>
  );
}