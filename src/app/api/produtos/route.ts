import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product } from '@/types/product';

export async function GET() {
  try {
    const produtos = await db.query.produtos.findMany({
      orderBy: (produtos, { desc }) => [desc(produtos.createdAt)],
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const produto = await db.insert(db.produtos).values({
      nome: data.nome,
      descricao: data.descricao,
      fabricante: data.fabricante,
      categoria: data.categoria,
      precoUnitario: data.precoUnitario,
      quantidadeEstoque: data.quantidadeEstoque,
      estoqueMinimo: data.estoqueMinimo,
      estoqueMaximo: data.estoqueMaximo,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(produto[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
