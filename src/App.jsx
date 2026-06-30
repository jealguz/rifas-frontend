import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import clienteAxios from './api/clienteAxios';
import CrearRifa from './components/CrearRifa';
import DashboardRifa from './components/DashboardRifa';
import PanelVendedor from './components/PanelVendedor';
import TicketVerificacion from './pages/TicketVerificacion';

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '24px',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid rgba(99,102,241,0.2)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: '0.3px',
  },
  navbar: {
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(99,102,241,0.15)',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navInner: {
    width: '100%',
    maxWidth: 1200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: 32,
    height: 32,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 700,
  },
  navBadge: {
    background: 'rgba(99,102,241,0.15)',
    color: '#a5b4fc',
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 20,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px',
  },
  mainInner: {
    width: '100%',
    maxWidth: 1200,
  },
};

function App() {
  const [rifaConfig, setRifaConfig] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  useEffect(() => {
    let cancelada = false;
    let timeout;

    const verificarRifaActiva = async () => {
      try {
        const res = await clienteAxios.get('/rifas/ultima-activa');
        if (!cancelada && res.data) setRifaConfig(res.data);
        clearTimeout(timeout);
      } catch (error) {
        if (!cancelada) console.log("No hay rifa activa, mostrar formulario.");
        clearTimeout(timeout);
      } finally {
        if (!cancelada) setCargando(false);
      }
    };
    verificarRifaActiva();

    // Si en 70 seg el servidor no responde (Render cold start hasta 60s), mostrar error
    timeout = setTimeout(() => {
      if (!cancelada) {
        setErrorCarga(true);
        setCargando(false);
      }
    }, 70000);

    // Keep-alive cada 60s para que Render no duerma el servidor
    const intervalo = setInterval(async () => {
      try {
        await clienteAxios.get('/health');
      } catch (_) {}
    }, 60000);

    return () => { clearInterval(intervalo); clearTimeout(timeout); cancelada = true; };
  }, []);

  if (cargando) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <span style={styles.loadingText}>Iniciando sistema...</span>
        <span style={{ color: '#64748b', fontSize: 12 }}>Conectando con el servidor...</span>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, padding: 20, textAlign: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500, maxWidth: 400 }}>
          El servidor está tardando en responder. Puede estar arrancando (Render tarda hasta 60s en reactivarse).
        </span>
        <button onClick={() => window.location.reload()} style={{
          padding: '12px 28px', borderRadius: 10, border: 'none',
          background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 15,
          cursor: 'pointer', marginTop: 8,
        }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>R</div>
            <span> Rifas FONAMENPRE</span>
          </div>
          <span style={styles.navBadge}>Sistema Profesional</span>
        </div>
      </nav>
      <main style={styles.main}>
        <div style={styles.mainInner}>
          <Routes>
            <Route path="/admin" element={
              !rifaConfig ? (
                <CrearRifa alCrearRifa={(datos) => setRifaConfig(datos)} />
              ) : (
                <DashboardRifa datosRifa={rifaConfig} />
              )
            } />
            <Route path="/vendedor/:rifaId/:vendedorId" element={<PanelVendedor />} />
            <Route path="/ticket/:codigo" element={<TicketVerificacion />} />
            <Route path="/" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
