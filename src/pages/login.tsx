import { useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegister) {
      // Cadastro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setError(error.message);
      else alert("Cadastro realizado! Verifique seu e-mail para confirmar.");
    } else {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else onLogin(data.user);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? "Cadastro de Professor" : "Login do Professor"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : isRegister ? "Cadastrar" : "Entrar"}
        </button>
      </form>

      <p>
        {isRegister ? (
          <>
            Já possui conta?{" "}
            <span className="link" onClick={() => setIsRegister(false)}>
              Faça login
            </span>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <span className="link" onClick={() => setIsRegister(true)}>
              Cadastre-se
            </span>
          </>
        )}
      </p>
    </div>
  );
}
