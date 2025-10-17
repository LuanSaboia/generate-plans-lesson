import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LessonPlan } from "../types/types";
import "../styles/planlist.css";

export default function PlansListPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="plans-container">
      <h2>Meus Planos de Aula</h2>
      {loading && <p>Carregando...</p>}
      {!loading && plans.length === 0 && <p>Nenhum plano encontrado.</p>}

      {plans.map((p) => (
        <div key={p.id} className="plan-card">
          <h3>{p.tema}</h3>
          <p><b>Disciplina:</b> {p.disciplina}</p>
          <p><b>Duração:</b> {p.duracao}</p>
          <details>
            <summary>Ver detalhes</summary>
            <pre>{JSON.stringify(p, null, 2)}</pre>
          </details>
        </div>
      ))}
    </div>
  );
}
