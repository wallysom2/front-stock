"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProductsChartProps {
  data: {
    name: string;
    stockQuantity: number;
  }[];
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="stockQuantity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
} 