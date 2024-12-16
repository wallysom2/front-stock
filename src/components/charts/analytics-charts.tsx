"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PaymentMethodChartProps {
  data: {
    method: string;
    value: number;
    percentage: number;
  }[];
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie
            data={data}
            dataKey="value"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={item.method} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium">{item.method}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomerRetentionChartProps {
  data: {
    month: string;
    newCustomers: number;
    returningCustomers: number;
  }[];
}

export function CustomerRetentionChart({ data }: CustomerRetentionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Retenção de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" name="Novos Clientes" fill="#4f46e5" />
            <Bar dataKey="returningCustomers" name="Clientes Recorrentes" fill="#22c55e" />
          </Bar>
        </div>
      </CardContent>
    </Card>
  );
}

interface SalesPerformanceChartProps {
  data: {
    date: string;
    actual: number;
    target: number;
  }[];
}

export function SalesPerformanceChart({ data }: SalesPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Desempenho de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Vendas Realizadas"
              stroke="#4f46e5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Meta"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </Line>
        </div>
      </CardContent>
    </Card>
  );
}

const colors = [
  "#4f46e5",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#6366f1",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
];
