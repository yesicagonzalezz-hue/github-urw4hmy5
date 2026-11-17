import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const irA = useNavigate();

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      irA("/perfil");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <form className="formulario" onSubmit={entrar}>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Entrar</button>
      <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </form>
  );
}