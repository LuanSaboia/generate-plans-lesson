import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LessonPlan } from "../types/types";
import "../styles/planlist.css";
import PlanModal from "../components/PlanModal";

export default function PlansList() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("lesson_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPlans(data || []);
      setLoading(false);
    }

    fetchPlans();
  }, []);

  if (loading) return <p className="loading">Carregando...</p>;
  if (plans.length === 0) return <p className="empty">Nenhum plano encontrado.</p>;

  return (
    <div className="plans-table-container">
      <h2 className="page-title">📘 Planos de Aula</h2>

      <table className="plans-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tema</th>
            <th>Série</th>
            <th>Duração</th>
            <th>Disciplina</th>
            <th>Objetivo</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p, index) => (
            <tr key={p.id} onClick={() => setSelectedPlan(p)} className="clickable-row">
              <td>{index + 1}</td>
              <td className="tema">{p.tema}</td>
              <td>{p.serie}</td>
              <td>{p.duracao}</td>
              <td>{p.disciplina}</td>
              <td className="descricao">
                {p.objetivo?.length > 90 ? p.objetivo.slice(0, 90) + "..." : p.objetivo}
              </td>
              <td>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPlan && (
        <PlanModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}