// Representa uma etapa do plano (passo a passo)
export interface Step {
  etapa?: string;
  titulo?: string;
  descricao?: string;
  texto?: string;
}

// Representa os critérios da rubrica
export interface RubricaCriterio {
  nome: string;
  niveis: Record<string, string>;
}

// Representa uma rubrica completa
export interface Rubrica {
  criterios?: RubricaCriterio[];
  [key: string]: any;
}

// Estrutura completa de um plano de aula
export interface LessonPlan {
  id?: string;
  tema: string;
  serie: string;
  duracao: string;
  disciplina: string;
  objetivo: string;
  introducao_ludica?: string;
  objetivo_bncc?: string;
  passo_a_passo?: string | Step[];
  rubrica_avaliacao?: string | Rubrica | Record<string, any>;
  created_at: string;
}
