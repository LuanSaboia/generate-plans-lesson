import { useState } from "react";
import "../styles/generateplan.css";
import PlanModal from "../components/PlanModal";

export default function GeneratePlanPage() {
  const [form, setForm] = useState({
    tema: "",
    duracao: "",
    serie: "",
    disciplina: "",
    objetivo: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGeneratedPlan(null);

    try {
      const res = await fetch(
        "https://xgevwldvvuougszyjxkc.supabase.co/functions/v1/generate_lesson_plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setGeneratedPlan(data.data[0]);
      }
    } catch (err) {
      console.error("Erro ao gerar plano:", err);
    }

    setLoading(false);
  }

  return (
    <div className="generate-wrapper">
      <h2>Gerar Plano de Aula</h2>

      <form onSubmit={handleSubmit} className="generate-form">
        <div className="form-group full">
          <label>Tema</label>
          <input
            type="text"
            value={form.tema}
            onChange={(e) => setForm({ ...form, tema: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group" style={{ marginRight: "10px" }}>
            <label>Duração</label>
            <input
              type="text"
              value={form.duracao}
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginLeft: "10px" }}>
            <label>Série</label>
            <input
              type="text"
              value={form.serie}
              onChange={(e) => setForm({ ...form, serie: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group full">
          <label>Disciplina</label>
          <input
            type="text"
            value={form.disciplina}
            onChange={(e) => setForm({ ...form, disciplina: e.target.value })}
            required
          />
        </div>

        <div className="form-group full">
          <label>Objetivo</label>
          <textarea
            rows={5}
            value={form.objetivo}
            onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
            placeholder="Descreva o objetivo principal da aula..."
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Plano"}
        </button>
      </form>

      {generatedPlan && (
        <PlanModal
          plan={generatedPlan}
          onClose={() => setGeneratedPlan(null)}
        />
      )}
    </div>
  );
}
