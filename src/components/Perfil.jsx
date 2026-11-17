import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, updateProfile, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const irA = useNavigate();

  useEffect(() => {
    const salir = onAuthStateChanged(auth, async (u) => {
      setUsuario(u);
      if (u) {
        const ref = doc(db, 'usuarios', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDatos(snap.data());
          setNombre(snap.data().nombre);
        }
      }
      setCargando(false);
    });
    return salir;
  }, []);

  const actualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await updateProfile(auth.currentUser, { displayName: nombre });
      await updateDoc(doc(db, 'usuarios', usuario.uid), { nombre });
      setDatos({ ...datos, nombre });
      setMensaje('Nombre actualizado');
    } catch (err) {
      setError('No se pudo actualizar');
    }
  };

  const eliminar = async () => {
    if (
      !window.confirm(
        '¿Seguro que quieres eliminar tu cuenta? No se puede deshacer.'
      )
    )
      return;
    setMensaje('');
    setError('');
    try {
      await deleteDoc(doc(db, 'usuarios', usuario.uid));
      await deleteUser(auth.currentUser);
      irA('/registro');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError(
          'Por seguridad, cierra sesión, vuelve a iniciar sesión e intenta de nuevo'
        );
      } else {
        setError('No se pudo eliminar la cuenta');
      }
    }
  };

  if (cargando) return <p style={{ padding: 20 }}>Cargando...</p>;

  if (!usuario) {
    return (
      <div className="formulario">
        <h2>Perfil</h2>
        <p>Inicia sesión para ver tu perfil.</p>
        <Link to="/login">Iniciar sesión</Link>
        <Link to="/registro">Crear cuenta</Link>
      </div>
    );
  }

  return (
    <div className="formulario">
      <h2>Mi perfil</h2>
      <p>
        <b>Nombre:</b> {datos ? datos.nombre : usuario.displayName}
      </p>
      <p>
        <b>Correo:</b> {usuario.email}
      </p>

      <form onSubmit={actualizar} className="formulario" style={{ padding: 0 }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nuevo nombre"
          required
        />
        <button type="submit">Actualizar nombre</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <button onClick={eliminar} style={{ background: '#c0392b' }}>
        Eliminar cuenta
      </button>
    </div>
  );
}
