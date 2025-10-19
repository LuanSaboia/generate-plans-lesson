import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import GeneratePlanPage from "./pages/generateplan";
import PlanList from "./pages/planlist";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Gerador de Planos de Aula</h1>
          <nav>
            <Link to="/generateplan">Gerar Plano</Link>
            <Link to="/plans">Meus Planos</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<GeneratePlanPage />} />
            <Route path="/generateplan" element={<GeneratePlanPage />} />
            <Route path="/plans" element={<PlanList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
