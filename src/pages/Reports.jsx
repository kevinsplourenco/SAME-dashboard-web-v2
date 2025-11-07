import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useAuth, useProducts, useTransactions, useCashFlow } from "../hooks";
import { Download, FileText, TrendingUp, Banknote, Package, Truck, Trash2, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { cashflows, loading: cashflowsLoading } = useCashFlow();
  
  const [reportType, setReportType] = useState("vendas");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportHistory, setExportHistory] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [reportType, searchTerm, dateFilter, products, transactions, cashflows, suppliers]);

  const applyFilters = () => {
    let data = [];

    switch (reportType) {
      case "vendas":
        data = transactions.filter((t) => t.type === "entrada");
        break;
      case "fluxoCaixa":
        data = cashflows || transactions;
        break;
      case "produtos":
        data = products;
        break;
      case "fornecedores":
        data = suppliers;
        break;
      default:
        data = [];
    }

    // Filtro de busca
    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtro de data
    if (dateFilter) {
      data = data.filter((item) => {
        const itemDate = item.createdAt?.toDate?.()?.toISOString().split("T")[0] || item.data;
        return itemDate === dateFilter;
      });
    }

    setFilteredData(data);
  };

  const getReportTitle = () => {
    const titles = {
      vendas: "Relatório de Vendas",
      fluxoCaixa: "Relatório de Fluxo de Caixa",
      produtos: "Relatório de Produtos",
      fornecedores: "Relatório de Fornecedores",
    };
    return titles[reportType];
  };

  const getColumns = () => {
    const columns = {
      vendas: ["ID", "Descrição", "Valor", "Data"],
      fluxoCaixa: ["ID", "Descrição", "Tipo", "Valor", "Data"],
      produtos: ["ID", "Nome", "Preço", "Quantidade"],
      fornecedores: ["ID", "Nome", "Telefone", "Email"],
    };
    return columns[reportType];
  };

  const getRows = () => {
    if (reportType === "vendas") {
      return filteredData.map((item) => {
        const date = item.createdAt?.toDate?.()?.toLocaleDateString("pt-BR") || "-";
        return [item.id?.substring(0, 8) || "-", item.description || "-", `R$ ${(item.amount || 0).toFixed(2)}`, date];
      });
    } else if (reportType === "fluxoCaixa") {
      return filteredData.map((item) => {
        const date = item.createdAt?.toDate?.()?.toLocaleDateString("pt-BR") || "-";
        const tipo = item.type === "entrada" ? "Entrada" : "Saída";
        return [item.id?.substring(0, 8) || "-", item.description || "-", tipo, `R$ ${(item.amount || 0).toFixed(2)}`, date];
      });
    } else if (reportType === "produtos") {
      return filteredData.map((item) => [
        item.id?.substring(0, 8) || "-",
        item.name || "-",
        `R$ ${(item.price || 0).toFixed(2)}`,
        item.quantity || 0,
      ]);
    } else if (reportType === "fornecedores") {
      return filteredData.map((item) => [
        item.id?.substring(0, 8) || "-",
        item.name || "-",
        item.phone || "-",
        item.email || "-",
      ]);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const title = getReportTitle();
    const columns = getColumns();
    const rows = getRows();

    // Título
    doc.setFontSize(16);
    doc.text(title, 14, 22);

    // Data e hora
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 32);
    doc.text(`Usuário: ${user?.email || "Admin"}`, 14, 38);
    doc.text(`Registros: ${rows.length}`, 14, 44);

    // Tabela
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 50,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 50, right: 14, bottom: 14, left: 14 },
    });

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(9);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
        align: "center",
      });
    }

    const fileName = `${title.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`;
    doc.save(fileName);

    // Adicionar ao histórico
    const newExport = {
      id: Date.now(),
      titulo: title,
      arquivo: fileName,
      registros: rows.length,
      data: new Date().toLocaleString("pt-BR"),
    };
    setExportHistory([newExport, ...exportHistory]);
  };

  const deleteExportHistory = (id) => {
    setExportHistory(exportHistory.filter((item) => item.id !== id));
  };

  const isLoading = productsLoading || transactionsLoading || cashflowsLoading;

  const reportOptions = [
    { value: "vendas", label: "Vendas", icon: TrendingUp },
    { value: "fluxoCaixa", label: "Fluxo de Caixa", icon: Banknote },
    { value: "produtos", label: "Produtos", icon: Package },
    { value: "fornecedores", label: "Fornecedores", icon: Truck },
  ];

  return (
    <div className="flex min-h-screen bg-[rgb(var(--bg))] flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={user} />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[rgb(var(--fg))]">Relatórios</h1>
                  <p className="text-[rgb(var(--muted))]">Exporte e filtre seus relatórios em PDF</p>
                </div>
                <button
                  onClick={exportPDF}
                  disabled={filteredData.length === 0 || isLoading}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-semibold"
                >
                  <Download size={20} />
                  Exportar PDF
                </button>
              </div>

              {/* Seleção de Tipo */}
              <div className="card p-6 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Tipo de Relatório</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {reportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setReportType(option.value)}
                        disabled={isLoading}
                        className={`p-4 rounded-lg transition font-semibold flex items-center gap-3 ${
                          reportType === option.value
                            ? "bg-primary-600 text-white border-2 border-primary-400"
                            : "bg-white/10 text-[rgb(var(--fg))] border-2 border-white/20 hover:border-primary-500/50"
                        }`}
                      >
                        <Icon size={20} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtros */}
              <div className="card p-6 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Filtros</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Buscar</label>
                    <input
                      type="text"
                      placeholder="Busque por qualquer campo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Data</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <p className="text-sm text-[rgb(var(--muted))] mt-3">
                  {isLoading ? "Carregando..." : `Registros encontrados: ${filteredData.length}`}
                </p>
              </div>

              {/* Tabela de Dados */}
              <div className="card overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        {getColumns().map((col) => (
                          <th key={col} className="text-left p-4 text-white font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item, idx) => (
                          <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition">
                            {getRows()[idx]?.map((value, colIdx) => (
                              <td key={colIdx} className="p-4 text-[rgb(var(--fg))]">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={getColumns().length} className="p-4 text-center text-[rgb(var(--muted))]">
                            {isLoading ? "Carregando..." : "Nenhum registro encontrado"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Histórico de Exportações */}
              {exportHistory.length > 0 && (
                <div className="card p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Histórico de Exportações
                  </h2>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {exportHistory.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{exp.titulo}</p>
                          <p className="text-sm text-[rgb(var(--muted))]">{exp.data} • {exp.registros} registros</p>
                        </div>
                        <button
                          onClick={() => deleteExportHistory(exp.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="card p-6 border border-white/10 bg-blue-500/10 border-blue-500/30">
                <div className="flex items-start gap-4">
                  <FileText size={24} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Como usar</h3>
                    <p className="text-[rgb(var(--muted))] text-sm">
                      Selecione o tipo de relatório, aplique filtros conforme necessário e clique em "Exportar PDF". 
                      Os dados são buscados em tempo real do Firebase baseado no seu usuário.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}