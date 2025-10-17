import { useState } from "react";
import LoginPage from "./pages/login";
import GeneratePlanPage from "./pages/generateplan";
import PlansListPage from "./pages/planlist";
import "./App.css";

export default function App() {
  // const [user, setUser] = useState<any>(null);
  const [user, setUser] = useState<any>({ email: "teste@professor.com" });

  const [page, setPage] = useState<"generate" | "plans">("generate");

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="app-container">
      <nav>
        <button onClick={() => setPage("generate")} className={page === "generate" ? "active" : ""}>
          Gerar Plano
        </button>
        <button onClick={() => setPage("plans")} className={page === "plans" ? "active" : ""}>
          Meus Planos
        </button>
      </nav>

      {page === "generate" && <GeneratePlanPage />}
      {page === "plans" && <PlansListPage />}
    </div>
  );
}
