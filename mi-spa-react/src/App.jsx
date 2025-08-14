import React, { useState, useEffect } from "react";
import { FaUserEdit, FaTrashAlt, FaBroom, FaUserPlus } from "react-icons/fa";

export default function App() {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    ciudad: ""
  });

  const [datos, setDatos] = useState([]);
  const [errores, setErrores] = useState({});

  // Cargar datos desde LocalStorage al iniciar
  useEffect(() => {
    const guardados = localStorage.getItem("personas");
    if (guardados) {
      try {
        setDatos(JSON.parse(guardados));
      } catch {
        setDatos([]);
      }
    }
  }, []);

  // Guardar en LocalStorage cuando cambien los datos
  useEffect(() => {
    // Solo guardar si datos tiene al menos un elemento
    if (Array.isArray(datos) && datos.length > 0) {
      localStorage.setItem("personas", JSON.stringify(datos));
    }
  }, [datos]);

  // ...existing code...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrores({ ...errores, [name]: "" });
  };

  // Solo letras para nombre y apellido
  const handleInputLetras = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  };
  // Solo números para teléfono
  const handleInputNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const validar = () => {
    let tempErrores = {};
    if (!formData.nombre.trim()) tempErrores.nombre = "Nombre obligatorio";
    if (!formData.apellido.trim()) tempErrores.apellido = "Apellido obligatorio";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrores.email = "Email inválido";
    if (!/^[0-9]{10}$/.test(formData.telefono)) tempErrores.telefono = "Teléfono debe tener 10 dígitos";
    if (!formData.ciudad.trim()) tempErrores.ciudad = "Ciudad obligatoria";

    setErrores(tempErrores);
    return Object.keys(tempErrores).length === 0;
  };

  const agregar = () => {
    if (!validar()) return;

    if (formData.id) {
      setDatos(datos.map((d) => (d.id === formData.id ? { ...formData } : d)));
    } else {
      setDatos([...datos, { ...formData, id: Date.now() }]);
    }

    setFormData({ id: null, nombre: "", apellido: "", email: "", telefono: "", ciudad: "" });
  };

  const eliminar = (id) => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      setDatos(datos.filter((d) => d.id !== id));
    }
  };

  const editar = (id) => {
    const persona = datos.find((d) => d.id === id);
    setFormData(persona);
  };

  const limpiarTodo = () => {
    if (window.confirm("¿Seguro que deseas eliminar todos los registros?")) {
      setDatos([]);
      localStorage.removeItem("personas");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0002", padding: 32 }}>
      <h1 style={{ textAlign: "center", color: "#1976d2", marginBottom: 8, fontWeight: 800, letterSpacing: 1 }}>Gestión de Personas</h1>
      <p style={{ textAlign: "center", color: "#1976d2", fontWeight: "bold", marginBottom: 24 }}>Total de personas agregadas: {datos.length}</p>
      <button onClick={limpiarTodo} style={{ background: "#d32f2f", color: "#fff", marginBottom: 20, border: "none", borderRadius: 8, padding: "12px 0", fontWeight: "bold", fontSize: 16, width: "100%", boxShadow: "0 2px 8px #d32f2f44", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <FaBroom /> Limpiar todo
      </button>

      <div className="formulario" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
  <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} onInput={handleInputLetras} style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16, transition: "border-color 0.2s" }} />
        {errores.nombre && <span className="error" style={{ color: "#d32f2f", fontSize: 13 }}>{errores.nombre}</span>}

  <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} onInput={handleInputLetras} style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16, transition: "border-color 0.2s" }} />
        {errores.apellido && <span className="error" style={{ color: "#d32f2f", fontSize: 13 }}>{errores.apellido}</span>}

        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16, transition: "border-color 0.2s" }} />
        {errores.email && <span className="error" style={{ color: "#d32f2f", fontSize: 13 }}>{errores.email}</span>}

  <input name="telefono" placeholder="Teléfono (10 dígitos)" value={formData.telefono} onChange={handleChange} onInput={handleInputNumeros} style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16, transition: "border-color 0.2s" }} />
        {errores.telefono && <span className="error" style={{ color: "#d32f2f", fontSize: 13 }}>{errores.telefono}</span>}

        <input name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} style={{ padding: 12, borderRadius: 8, border: "1px solid #bdbdbd", fontSize: 16, transition: "border-color 0.2s" }} />
        {errores.ciudad && <span className="error" style={{ color: "#d32f2f", fontSize: 13 }}>{errores.ciudad}</span>}

        <button onClick={agregar} style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: "bold", fontSize: 16, boxShadow: "0 2px 8px #1976d244", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {formData.id ? <FaUserEdit /> : <FaUserPlus />} {formData.id ? "Actualizar" : "Agregar Persona"}
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>No hay personas registradas</td>
              </tr>
            ) : (
              datos.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.apellido}</td>
                  <td>{d.email}</td>
                  <td>{d.telefono}</td>
                  <td>{d.ciudad}</td>
                  <td>
                    <button className="editar-btn" onClick={() => editar(d.id)}>
                      <FaUserEdit /> Editar
                    </button>
                    <button className="eliminar-btn" onClick={() => eliminar(d.id)}>
                      <FaTrashAlt /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
