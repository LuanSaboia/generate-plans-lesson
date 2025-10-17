export interface LessonPlan {
  id: string
  tema: string
  serie: string
  duracao: string
  disciplina: string
  objetivo: string
  introducao_ludica?: string
  objetivo_bncc?: string
  passo_a_passo?: string
  rubrica_avaliacao?: string
  created_at?: string
}
