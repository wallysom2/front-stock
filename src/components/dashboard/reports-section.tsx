"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

interface Report {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  status: "ready" | "generating" | "failed";
}

interface SalesReport {
  id: number;
  date: string;
  customer: string;
  total: number;
  items: number;
  status: string;
}

export function ReportsSection() {
  const reports: Report[] = [
    {
      id: "1",
      name: "Relatório de Vendas",
      description: "Resumo detalhado das vendas do período",
      lastGenerated: "2024-01-15T10:00:00",
      status: "ready",
    },
    {
      id: "2",
      name: "Análise de Estoque",
      description: "Status atual do estoque e previsões",
      lastGenerated: "2024-01-14T15:30:00",
      status: "ready",
    },
    {
      id: "3",
      name: "Performance Financeira",
      description: "Indicadores financeiros e projeções",
      lastGenerated: "2024-01-13T09:15:00",
      status: "generating",
    },
  ];

  const salesData: SalesReport[] = [
    {
      id: 1,
      date: "2024-01-15",
      customer: "João Silva",
      total: 1500.00,
      items: 3,
      status: "Concluída",
    },
    {
      id: 2,
      date: "2024-01-15",
      customer: "Maria Santos",
      total: 2750.00,
      items: 5,
      status: "Concluída",
    },
    // Add more sample data as needed
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {report.name}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {report.description}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">
                  Última atualização:{" "}
                  {new Date(report.lastGenerated).toLocaleString("pt-BR")}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={report.status !== "ready"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Histórico de Vendas
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Hoje</DropdownMenuItem>
                  <DropdownMenuItem>Últimos 7 dias</DropdownMenuItem>
                  <DropdownMenuItem>Último mês</DropdownMenuItem>
                  <DropdownMenuItem>Personalizado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>#{sale.id}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                  <TableCell className="text-center">{sale.items}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
