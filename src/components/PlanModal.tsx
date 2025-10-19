import React from "react";
import "../styles/PlanModal.css";
import { LessonPlan, Step } from "../types/types";

interface PlanModalProps {
    plan: LessonPlan;
    onClose: () => void;
}

// Função robusta para tratar JSONs ou texto
const parseField = (field: unknown): string => {
    if (!field) return "—";

    let parsed: any = field;
    if (typeof field === "string") {
        try {
            parsed = JSON.parse(field);
        } catch {
            return field.trim();
        }
    }

    if (Array.isArray(parsed)) {
        return parsed
            .map((step, i) => {
                const etapa = step.etapa || step.titulo || `Etapa ${i + 1}`;
                const descricao = step.descricao || "";
                return `• ${etapa}: ${descricao}`;
            })
            .join("\n");
    }

    if (typeof parsed === "object" && parsed !== null) {
        if (parsed.criterios) {
            return parsed.criterios
                .map((c: any) => {
                    const niveis = Object.entries(c.niveis || {})
                        .map(([nivel, desc]) => `   - ${nivel}: ${desc}`)
                        .join("\n");
                    return `• Critério: ${c.nome}\n${niveis}`;
                })
                .join("\n\n");
        }

        return Object.entries(parsed)
            .map(([k, v]) => {
                // Transforma snake_case em texto legível
                const label = k
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                return `${label}: ${typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)
                    }`;
            })
            .join("\n\n");
    }

    return String(parsed);
};

const PlanModal: React.FC<PlanModalProps> = ({ plan, onClose }) => {
    if (!plan) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Plano de Aula (BNCC)</h2>

                <div className="modal-actions">
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <table className="plan-detail-table">
                    <tbody>
                        <tr>
                            <th>Tema</th>
                            <td>{plan.tema}</td>
                        </tr>
                        <tr>
                            <th>Série</th>
                            <td>{plan.serie}</td>
                        </tr>
                        <tr>
                            <th>Disciplina</th>
                            <td>{plan.disciplina}</td>
                        </tr>
                        <tr>
                            <th>Duração</th>
                            <td>{plan.duracao}</td>
                        </tr>
                        <tr>
                            <th>Objetivo</th>
                            <td>{plan.objetivo}</td>
                        </tr>
                        <tr>
                            <th>Introdução Lúdica</th>
                            <td>{parseField(plan.introducao_ludica)}</td>
                        </tr>
                        <tr>
                            <th>Objetivo BNCC</th>
                            <td>{parseField(plan.objetivo_bncc)}</td>
                        </tr>
                        <tr>
                            <th>Passo a Passo</th>
                            <td>
                                {(() => {
                                    let steps: Step[] = [];
                                    try {
                                        steps =
                                            typeof plan.passo_a_passo === "string"
                                                ? JSON.parse(plan.passo_a_passo)
                                                : (plan.passo_a_passo as Step[]);
                                    } catch {
                                        return <p>{String(plan.passo_a_passo)}</p>;
                                    }
                                    if (!Array.isArray(steps)) {
                                        return <p>{String(plan.passo_a_passo)}</p>;
                                    }
                                    return (
                                        <div className="steps-container">
                                            {steps.map((step, index) => (
                                                <div className="step-card" key={index}>
                                                    <h4>{step.etapa || step.titulo || `Etapa ${index + 1}`}</h4>
                                                    <p>{step.descricao || step.texto || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </td>
                        </tr>
                        <tr>
                            <th>Rúbrica de Avaliação</th>
                            <td><pre>{parseField(plan.rubrica_avaliacao)}</pre></td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default PlanModal;
