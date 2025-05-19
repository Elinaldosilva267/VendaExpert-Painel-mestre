import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlf3LKqmzkZ90Hi4MkpXxg-DYrn1kM3TI",
  authDomain: "vendaexpert-web2.firebaseapp.com",
  projectId: "vendaexpert-web2",
  storageBucket: "vendaexpert-web2.firebasestorage.app",
  messagingSenderId: "531943170345",
  appId: "1:531943170345:web:ed488db0d59fa5312a1738"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function AuthVendaXpert() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [erro, setErro] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => setUsuarioLogado(userCredential.user))
      .catch(() => setErro("Email ou senha incorretos"));
  };

  const handleCadastro = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => setUsuarioLogado(userCredential.user))
      .catch((error) => setErro("Erro ao cadastrar: " + error.message));
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (usuarioLogado) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Bem-vindo à VendaXpert!</h2>
        <p>Email logado: <strong>{usuarioLogado.email}</strong></p>
        <a className="block mt-4 underline text-blue-600" href="/painel">Ir para o Painel Mestre</a>
        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{modoCadastro ? "Cadastro" : "Login"} - VendaXpert</h2>
      <input type="email" placeholder="Email" className="w-full border p-2 mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" className="w-full border p-2 mb-2" value={senha} onChange={(e) => setSenha(e.target.value)} />
      {erro && <p className="text-red-500 mb-2">{erro}</p>}
      <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={modoCadastro ? handleCadastro : handleLogin}>
        {modoCadastro ? "Cadastrar" : "Entrar"}
      </button>
      <p className="text-sm text-gray-500 mt-2">
        {modoCadastro ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
        <span className="text-blue-600 underline cursor-pointer" onClick={() => setModoCadastro(!modoCadastro)}>
          {modoCadastro ? "Faça login" : "Cadastre-se"}
        </span>
      </p>
    </div>
  );
}
