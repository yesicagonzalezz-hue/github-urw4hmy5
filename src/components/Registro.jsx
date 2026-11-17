import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const irA = useNavigate();

  const registrar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, correo, clave);
      await updateProfile(cred.user, { displayName: nombre });
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        correo,
        creado: new Date().toISOString(),
      });
      irA("/perfil");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("Ese correo ya está registrado");
      else if (err.code === "auth/weak-password") setError("La contraseña debe tener mínimo 6 caracteres");
      else if (err.code === "auth/invalid-email") setError("Correo no válido");
      else setError("No se pudo registrar. Intenta de nuevo");
    }
  };

  return (
    <form className="formulario" onSubmit={registrar}>
      <h2>Crear cuenta</h2>
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <input type="password" placeholder="Contraseña (mínimo 6)" value={clave} onChange={(e) => setClave(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Registrarme</button>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </form>
  );
}