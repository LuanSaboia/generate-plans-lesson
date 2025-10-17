import { useState } from "react";
import { LessonPlan } from "../types/types";
import "../styles/generateplan.css";

export default function GeneratePlanPage() {
  const [form, setForm] = useState({
    tema: "",
    serie: "",
    duracao: "",
    disciplina: "",
    objetivo: "",
  });
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("https://xgevwldvvuougszyjxkc.supabase.co/functions/v1/generate_lesson_plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data.data?.[0]);
    setLoading(false);
  }

  return (
    <div className="generate-container">
      <h2>Gerar Plano de Aula</h2>
      <form className="generate-form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
          />
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Plano"}
        </button>
      </form>

      {result && (
        <div className="generate-result">
          <h3>Plano Gerado</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
