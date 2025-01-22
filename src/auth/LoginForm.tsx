import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { LinearGradient } from "react-text-gradients";
import GradientButton from "./GradientButton";
import { FirebaseError } from "firebase/app";

const errorMessages: { [key: string]: string } = {
  "auth/user-not-found": "Usuário não encontrado",
  "auth/wrong-password": "Senha incorreta",
  "auth/invalid-email": "Email inválido",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
  "auth/email-already-in-use": "Email já está em uso",
};

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/home");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const errorCode = err.code;
        setError(errorMessages[errorCode] || "Ocorreu um error ao fazer login");
      } else {
        setError("Ocorreu um error desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 md:px-0">
      <div className="mb-16">
        <h1 className="text-2xl font-bold mb-2">
          <LinearGradient gradient={["to left", "#FF6B6B ,#FF8E53"]}>
            MB.Event dashboard
          </LinearGradient>
        </h1>
        <p className="text-base text-gray-600 mb-2">
          Comece a gerenciar seus eventos de forma rápida e eficiente
        </p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-900"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-900 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e33392] focus:border-[#e33392] transition-all"
            required
            disabled={loading}
            placeholder="Informe seu e-mail"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-900"
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e33392] focus:border-[#e33392] transition-all"
              required
              disabled={loading}
              placeholder="Informe sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <GradientButton
          gradient="linear-gradient(to right, #FF6B6B, #FF8E53)"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Login"
          )}
        </GradientButton>
      </form>
    </div>
  );
}
