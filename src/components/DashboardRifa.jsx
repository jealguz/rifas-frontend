import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';
import TicketModal from './TicketModal';

const LOTERIAS_POR_DIA = {
  0: ['Sorteos Especiales', 'Extra de Colombia'],
  1: ['Lotería de Cundinamarca', 'Lotería del Tolima'],
  2: ['Lotería de la Cruz Roja', 'Lotería del Huila'],
  3: ['Lotería de Manizales', 'Lotería del Valle', 'Lotería del Meta'],
  4: ['Lotería de Bogotá', 'Lotería del Quindío'],
  5: ['Lotería de Medellín', 'Lotería de Santander', 'Lotería del Risaralda'],
  6: ['Lotería de Boyacá', 'Lotería del Cauca', 'Extra de Colombia'],
};

const isYouTube = (url) => /(youtube\.com\/watch\?v=|youtu\.be\/)/.test(url);
const isVideoUrl = (url) => /\.(mp4|webm|ogg)(\?|$)/i.test(url) || (typeof url === 'string' && url.startsWith('data:video'));

function MediaRenderer({ src, style }) {
  if (!src) return null;
  if (isYouTube(src)) {
    const videoId = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
    if (!videoId) return <img src={src} alt="Premio" style={style} />;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
        title="Video Premio"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ ...style, border: 'none' }}
      />
    );
  }
  if (isVideoUrl(src)) {
    return <video src={src} controls style={style} />;
  }
  return <img src={src} alt="Premio" style={style} />;
}

const s = {
  page: {
    animation: 'fadeIn 0.4s ease-out',
  },
  infoBar: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 20px', borderRadius: 12,
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.15)',
    marginBottom: 24, fontSize: 14, fontWeight: 500, color: '#e2e8f0',
  },
  infoBarAccent: { color: '#a5b4fc', fontWeight: 700 },
  // Header section
  headerSection: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24, flexWrap: 'wrap', gap: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  headerAccent: { color: '#a5b4fc' },
  headerActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tabBtn: (active) => ({
    padding: '8px 16px', borderRadius: 10,
    border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#a5b4fc' : '#64748b',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  actionBtn: (bg) => ({
    padding: '8px 16px', borderRadius: 10, border: 'none',
    background: bg, color: '#fff', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', gap: 6,
  }),
  // Cards
  card: {
    background: '#fff', borderRadius: 16,
    padding: '24px 28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 13, fontWeight: 700, color: '#6366f1',
    textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: 16, paddingBottom: 12,
    borderBottom: '2px solid #eef2ff',
  },
  // Seller grid
  sellerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12, marginBottom: 0,
  },
  sellerCard: (color, pct) => ({
    background: '#f8fafc', borderRadius: 12,
    padding: '16px 18px',
    borderLeft: `4px solid ${color}`,
    position: 'relative',
    overflow: 'hidden',
  }),
  sellerName: { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  sellerStats: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 },
  progressTrack: { background: '#e2e8f0', height: 6, borderRadius: 99, marginTop: 10, overflow: 'hidden' },
  progressFill: (color, pct) => ({
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
    width: `${pct}%`, height: '100%', borderRadius: 99,
    transition: 'width 0.6s ease',
  }),
  // Links section
  linkRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', borderRadius: 10,
    background: '#f8fafc', fontSize: 14, fontWeight: 500, color: '#0f172a',
  },
  copyBtn: {
    padding: '7px 14px', borderRadius: 8, border: 'none',
    background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  // Filter
  filterRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, flexWrap: 'wrap', gap: 12,
  },
  filterLabel: { fontSize: 14, fontWeight: 600, color: '#1e293b' },
  filterSelect: {
    padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14,
    background: '#f8fafc', color: '#0f172a', cursor: 'pointer',
    outline: 'none',
  },
  // Ticket grid
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
    gap: 6,
    background: '#f8fafc', padding: 16, borderRadius: 14,
    border: '1px solid #e2e8f0',
  },
  ticket: (estado_pago, color) => {
    const d = estado_pago === 'disponible';
    let bg = '#fff', text = '#475569', border = `1.5px solid ${color}`;
    if (estado_pago === 'pagado') { bg = color; text = '#fff'; border = `1.5px solid ${color}`; }
    else if (estado_pago === 'debe') { bg = '#fef2f2'; text = '#dc2626'; border = '1.5px solid #fca5a5'; }
    else if (estado_pago === 'abono') { bg = '#fffbeb'; text = '#d97706'; border = '1.5px solid #fde68a'; }
    return {
      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 10, fontSize: 12, fontWeight: 700,
      cursor: d ? 'pointer' : 'not-allowed',
      background: bg, color: text, border, opacity: d ? 1 : 0.7,
      transition: 'all 0.15s',
    };
  },
  // Image
  imageWrapper: {
    width: '100%', height: 260, borderRadius: 16, overflow: 'hidden',
    marginBottom: 20, border: '1px solid #e2e8f0',
    background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  imageAsset: { width: '100%', height: '100%', objectFit: 'contain' },
  // Modals
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, zIndex: 1000, animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    background: '#fff', borderRadius: 20,
    width: '100%', maxWidth: 480,
    padding: 32, maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    animation: 'slideUp 0.3s ease-out',
  },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' },
  modalSub: { fontSize: 13, color: '#64748b', margin: '0 0 20px 0', fontWeight: 500 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.3px' },
  input: {
    padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', color: '#0f172a',
  },
  select: {
    padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', color: '#0f172a', cursor: 'pointer',
  },
  btnCancel: {
    padding: '11px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0',
    background: '#fff', color: '#475569', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  btnPrimary: {
    padding: '11px 20px', borderRadius: 10, border: 'none',
    background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  btnDanger: {
    padding: '12px 24px', borderRadius: 10, border: 'none',
    background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', width: '100%', transition: 'all 0.2s',
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  // Winner result
  resultBox: (sold) => ({
    padding: 16, borderRadius: 12,
    background: sold ? '#f0fdf4' : '#f8fafc',
    border: `1.5px dashed ${sold ? '#22c55e' : '#cbd5e1'}`,
    marginBottom: 20,
  }),
  resultLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8, letterSpacing: '0.5px' },
  soldBadge: { background: '#22c55e', color: '#fff', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 },
  unsoldBadge: { background: '#64748b', color: '#fff', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 },
};

function DashboardRifa({ datosRifa }) {
  const [seguroDatos, setSeguroDatos] = useState(datosRifa || {});
  
  const [idRifaCreada] = useState(
    seguroDatos.rifaId || seguroDatos.id || seguroDatos.id_rifa || ''
  );

  const [imagenRenderizada] = useState(seguroDatos.url_imagen || seguroDatos.imagen || seguroDatos.imagen_url || '');
  const [filtroVendedor, setFiltroVendedor] = useState('todos');
  const [boletosMatriz, setBoletosMatriz] = useState([]);
  const [estadisticasVendedores, setEstadisticasVendedores] = useState([]);

  const [boletoSeleccionado, setBoletoSeleccionado] = useState(null);
  const [nombreCliente, setNombreCliente] = useState('');
  const [celularCliente, setCelularCliente] = useState('');
  const [direccionReferencia, setDireccionReferencia] = useState('');
  const [estadoPago, setEstadoPago] = useState('debe');
  const [valorAbono, setValorAbono] = useState('');

  const [ticketVenta, setTicketVenta] = useState(null);
  const [abrirModalGanador, setAbrirModalGanador] = useState(false);
  const [numeroGanadorInput, setNumeroGanadorInput] = useState('');
  const [ganadorOficial, setGanadorOficial] = useState(null);
  const [modoVista, setModoVista] = useState('activa');
  const [historial, setHistorial] = useState([]);
  const [finalizando, setFinalizando] = useState(false);
  const [abrirModalFecha, setAbrirModalFecha] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaLoteria, setNuevaLoteria] = useState('');
  const [cambiandoFecha, setCambiandoFecha] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const res = await clienteAxios.get('/rifas/historial');
        setHistorial(res.data || []);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };
    cargarHistorial();
  }, []);

  // Auto-sugerir lotería al cambiar la fecha en el modal
  useEffect(() => {
    if (!nuevaFecha) return;
    const fecha = new Date(nuevaFecha + 'T12:00:00');
    const sugerencias = LOTERIAS_POR_DIA[fecha.getDay()] || [];
    if (sugerencias.length > 0) setNuevaLoteria(sugerencias[0]);
  }, [nuevaFecha]);

  useEffect(() => {
    if (!idRifaCreada) return;
    const cargarRifaDesdeDB = async () => {
      try {
        const res = await clienteAxios.get(`/rifas/${idRifaCreada}`);
        if (res.data) setSeguroDatos(res.data);
      } catch (error) {
        console.error("Error al traer la rifa:", error);
      }
    };
    cargarRifaDesdeDB();
  }, [idRifaCreada]);

  useEffect(() => {
    if (!seguroDatos || !seguroDatos.lista_encargados) return;

    const COLORES_PREDETERMINADOS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    
    const fuenteVendedores = seguroDatos.lista_encargados;

    const vProcesados = fuenteVendedores.map((v, index) => ({
      id: v.id,
      nombre: v.nombre || `Vendedor ${index + 1}`,
      color: v.color || COLORES_PREDETERMINADOS[index % COLORES_PREDETERMINADOS.length],
      asignados: 0,
      vendidos: 0
    }));

    const vendedoresFinales = vProcesados.length > 0 
      ? vProcesados 
      : [{ id: 'general', nombre: 'Ruta General 1', color: '#6366f1', asignados: 0, vendidos: 0 }];

    const boletos = seguroDatos.boletos_pregenerados || [];
    const matrizNormalizada = boletos.map((boleto) => {
      const idVendedorRaw = boleto.vendedor_id || boleto.vendedor?.id;
      const vendedorReal = vendedoresFinales.find(v => String(v.id) === String(idVendedorRaw)) || vendedoresFinales[0];
      return {
        ...boleto,
        vendedor: vendedorReal
      };
    });

    const vendedoresConConteos = vendedoresFinales.map(v => ({
      ...v,
      asignados: matrizNormalizada.filter(b => String(b.vendedor.id) === String(v.id)).length,
      vendidos: matrizNormalizada.filter(b => String(b.vendedor.id) === String(v.id) && b.estado_pago !== 'disponible').length
    }));

    setEstadisticasVendedores(vendedoresConConteos);
    setBoletosMatriz(matrizNormalizada);
  }, [seguroDatos]); 

  const generarLinkVendedor = (vendedor) => `${window.location.origin}/vendedor/${idRifaCreada}/${vendedor.id}`;

  const handleGuardarVenta = async (e) => {
    e.preventDefault();
    try {
      const res = await clienteAxios.put('/rifas/vender', {
        rifa_id: idRifaCreada,
        numero: boletoSeleccionado.numero,
        nombre_cliente: nombreCliente,
        celular: celularCliente,
        direccion_referencia: direccionReferencia,
        estado_pago: estadoPago,
        valor_abono: estadoPago === 'abono' ? parseFloat(valorAbono) : 0,
        vendedor_id: boletoSeleccionado.vendedor?.id
      });
      setTicketVenta(res.data.ticket);
      setBoletoSeleccionado(null);
    } catch (err) {
      console.error(err);
      alert('Error al procesar la venta.');
    }
  };

  const handleVerificarGanador = (e) => {
    e.preventDefault();
    const boletoEncontrado = boletosMatriz.find(b => parseInt(b.numero) === parseInt(numeroGanadorInput));
    if (!boletoEncontrado) return alert("Número no encontrado.");
    setGanadorOficial(boletoEncontrado);
  };

  const handleFinalizarRifa = async () => {
    setFinalizando(true);
    try {
      await clienteAxios.post('/rifas/finalizar', {
        rifa_id: idRifaCreada,
        numero_ganador: numeroGanadorInput
      });
      alert('¡Rifa finalizada con éxito!');
      setAbrirModalGanador(false);
      setGanadorOficial(null);
      setModoVista('historial');
      const res = await clienteAxios.get('/rifas/historial');
      setHistorial(res.data || []);
    } catch (err) {
      alert('Error al finalizar rifa: ' + (err.response?.data?.error || 'Error interno'));
    } finally {
      setFinalizando(false);
    }
  };

  const handleCambiarFecha = async (e) => {
    e.preventDefault();
    if (!nuevaFecha) return;
    setCambiandoFecha(true);
    try {
      const payload = { fecha_sorteo: nuevaFecha };
      if (nuevaLoteria.trim()) payload.loteria = nuevaLoteria.trim();
      await clienteAxios.put(`/rifas/${idRifaCreada}/cambiar-fecha`, payload);
      alert('¡Rifa actualizada!');
      setAbrirModalFecha(false);
      const res = await clienteAxios.get(`/rifas/${idRifaCreada}`);
      setSeguroDatos(res.data);
    } catch (err) {
      alert('Error al actualizar: ' + (err.response?.data?.error || 'Error interno'));
    } finally {
      setCambiandoFecha(false);
    }
  };

  const boletosFiltrados = boletosMatriz.filter(b => {
    if (filtroVendedor === 'todos') return true;
    return b.vendedor.id.toString() === filtroVendedor.toString();
  });

  const renderHistorial = () => (
    <div>
      <div style={{ ...s.cardTitle, borderBottom: '2px solid #eef2ff', marginBottom: 20 }}>
        Historial de Rifas
      </div>
      {historial.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '48px 0', fontWeight: 500 }}>
          No hay rifas finalizadas aún.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {historial.map(rifa => (
            <div key={rifa.id} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{rifa.nombre_rifa}</h4>
                <span style={s.unsoldBadge}>Finalizada</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: '#475569' }}>
                <div><strong>Loteria:</strong> {rifa.loteria}</div>
                <div><strong>Sorteo:</strong> {new Date(rifa.fecha_sorteo).toLocaleDateString()}</div>
                <div><strong>Ganador:</strong> <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 18 }}>{rifa.numero_ganador}</span></div>
                <div><strong>Vendidos:</strong> {rifa.boletos_vendidos} / {rifa.total_boletos}</div>
              </div>
              {rifa.encargado_ganador_nombre && (
                <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
                  <strong>Vendedor del ganador:</strong> {rifa.encargado_ganador_nombre}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                Finalizada el {new Date(rifa.fecha_finalizacion).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.page}>
      {/* Info bar */}
      {seguroDatos.fecha_sorteo && (
        <div style={s.infoBar}>
          <span>
            {seguroDatos.loteria && <><strong>{seguroDatos.loteria}</strong> &middot; </>}
            Sorteo:{' '}
            <span style={s.infoBarAccent}>
              {new Date(seguroDatos.fecha_sorteo).toLocaleDateString('es-CO', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </span>
        </div>
      )}

      {/* Header */}
      <div style={s.headerSection}>
        <h2 style={s.headerTitle}>
          Dashboard <span style={s.headerAccent}>de Rifa</span>
        </h2>
        <div style={s.headerActions}>
          <button onClick={() => setModoVista('activa')} style={s.tabBtn(modoVista === 'activa')}>Panel Activo</button>
          <button onClick={() => setModoVista('historial')} style={s.tabBtn(modoVista === 'historial')}>Historial</button>
          <button onClick={() => { setAbrirModalFecha(true); setNuevaFecha(seguroDatos.fecha_sorteo || ''); setNuevaLoteria(seguroDatos.loteria || ''); }} style={s.actionBtn('#f59e0b')}>Cambiar Fecha / Lotería</button>
          <button onClick={() => { setAbrirModalGanador(true); setNumeroGanadorInput(''); setGanadorOficial(null); }} style={s.actionBtn('#ef4444')}>Asignar Ganador</button>
        </div>
      </div>

      {modoVista === 'activa' ? (
        <>
          {/* Prize image */}
          {imagenRenderizada && (
            <div style={s.imageWrapper}>
              <MediaRenderer src={imagenRenderizada} style={s.imageAsset} />
            </div>
          )}

          {/* Seller links */}
          <div style={s.card}>
            <div style={s.cardTitle}>Enlaces para Vendedores</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {estadisticasVendedores.map(v => (
                <div key={v.id} style={s.linkRow}>
                  <span>{v.nombre}</span>
                  <button onClick={() => { navigator.clipboard.writeText(generarLinkVendedor(v)); alert('Link copiado!'); }} style={s.copyBtn}>
                    Copiar Link
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Seller stats */}
          <div style={s.card}>
            <div style={s.cardTitle}>Rendimiento de Vendedores</div>
            <div style={s.sellerGrid}>
              {estadisticasVendedores.map(v => {
                const pct = v.asignados > 0 ? Math.round((v.vendidos / v.asignados) * 100) : 0;
                return (
                  <div key={v.id} style={s.sellerCard(v.color, pct)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={s.sellerName}>{v.nombre}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: v.color }}>{pct}%</span>
                    </div>
                    <div style={s.sellerStats}>{v.vendidos} de {v.asignados} colocados</div>
                    <div style={s.progressTrack}>
                      <div style={s.progressFill(v.color, pct)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket matrix */}
          <div style={s.card}>
            <div style={{ ...s.cardTitle, border: 'none', marginBottom: 16 }}>
              Mapa de Números
            </div>
            <div style={s.filterRow}>
              <span style={s.filterLabel}>Matriz de boletos</span>
              <select value={filtroVendedor} onChange={(e) => setFiltroVendedor(e.target.value)} style={s.filterSelect}>
                <option value="todos">Ver matriz completa</option>
                {estadisticasVendedores.map(v => (
                  <option key={v.id} value={v.id}>Filtrar: {v.nombre}</option>
                ))}
              </select>
            </div>
            <div style={s.ticketGrid}>
              {boletosFiltrados.map((boleto, index) => (
                <div
                  key={index}
                  onClick={() => boleto.estado_pago === 'disponible' && setBoletoSeleccionado(boleto)}
                  style={s.ticket(boleto.estado_pago, boleto.vendedor.color)}
                  title={`N° ${boleto.numero} | ${boleto.vendedor.nombre}`}
                >
                  {boleto.numero}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={s.card}>{renderHistorial()}</div>
      )}

      {/* MODAL: Venta */}
      {boletoSeleccionado && (
        <div style={s.overlay} onClick={() => setBoletoSeleccionado(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={s.modalTitle}>
                Vender Boleto{' '}
                <span style={{ color: boletoSeleccionado.vendedor.color }}>{boletoSeleccionado.numero}</span>
              </h3>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', fontWeight: 600, color: '#475569' }}>
                {boletoSeleccionado.vendedor.nombre}
              </span>
            </div>
            <form onSubmit={handleGuardarVenta} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.field}>
                <label style={s.label}>Nombre del Comprador</label>
                <input type="text" placeholder="Ej. José Amaya" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Teléfono Celular</label>
                <input type="text" placeholder="Ej. 315XXXXXXX" value={celularCliente} onChange={(e) => setCelularCliente(e.target.value)} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Dirección o Referencia</label>
                <input type="text" placeholder="Ej. Frente al parque" value={direccionReferencia} onChange={(e) => setDireccionReferencia(e.target.value)} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Estado de Pago</label>
                <select value={estadoPago} onChange={(e) => setEstadoPago(e.target.value)} style={s.select}>
                  <option value="debe">Lo Debe Completo</option>
                  <option value="abono">Dejó un Abono</option>
                  <option value="pagado">Totalmente Pagado</option>
                </select>
              </div>
              {estadoPago === 'abono' && (
                <div style={s.field}>
                  <label style={s.label}>Monto del Abono (COP)</label>
                  <input type="number" placeholder="Ej. 5000" value={valorAbono} onChange={(e) => setValorAbono(e.target.value)} style={s.input} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setBoletoSeleccionado(null)} style={s.btnCancel}>Cancelar</button>
                <button type="submit" style={s.btnPrimary}>Confirmar Venta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ganador */}
      {abrirModalGanador && (
        <div style={s.overlay} onClick={() => setAbrirModalGanador(false)}>
          <div style={{ ...s.modal, maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Asignar Número Ganador</h3>
            <p style={s.modalSub}>Ingresa el número sorteado oficial para verificar su estado.</p>
            <form onSubmit={handleVerificarGanador} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input type="number" placeholder="Ej. 42" value={numeroGanadorInput} onChange={(e) => setNumeroGanadorInput(e.target.value)} style={{ ...s.input, fontSize: 20, textAlign: 'center', fontWeight: 700 }} required />
              <button type="submit" style={{ ...s.btnPrimary, flex: '0 0 auto', padding: '0 28px' }}>Buscar</button>
            </form>
            {ganadorOficial && (
              <>
                <div style={s.resultBox(!!ganadorOficial.cliente)}>
                  <div style={s.resultLabel}>Resultado del escrutinio</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                    N° <span style={{ color: ganadorOficial.vendedor.color }}>{ganadorOficial.numero}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#334155', marginTop: 4 }}>
                    Ruta: <strong>{ganadorOficial.vendedor.nombre}</strong>
                  </div>
                  <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />
                  {ganadorOficial.cliente ? (
                    <div>
                      <span style={s.soldBadge}>Vendido</span>
                      <div style={{ marginTop: 8, fontSize: 15, color: '#166534' }}>
                        Comprador: <strong>{ganadorOficial.cliente.nombre}</strong>
                      </div>
                      {ganadorOficial.cliente.celular && (
                        <div style={{ fontSize: 14, color: '#166534' }}>
                          Celular: {ganadorOficial.cliente.celular}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                        Estado: <strong>{ganadorOficial.estado_pago.toUpperCase()}</strong>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={s.unsoldBadge}>No Vendido</span>
                      <p style={{ marginTop: 8, fontSize: 14, color: '#64748b', fontStyle: 'italic' }}>
                        Este número no fue vendido; el premio se acumula.
                      </p>
                    </div>
                  )}
                </div>
                <button onClick={handleFinalizarRifa} disabled={finalizando}
                  style={{ ...s.btnDanger, ...(finalizando ? s.btnDisabled : {}), marginBottom: 12 }}>
                  {finalizando ? 'Finalizando...' : 'Finalizar Rifa con este Número'}
                </button>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setAbrirModalGanador(false)} style={{ ...s.btnCancel, padding: '10px 24px' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cambiar Fecha / Lotería */}
      {abrirModalFecha && (
        <div style={s.overlay} onClick={() => setAbrirModalFecha(false)}>
          <div style={{ ...s.modal, maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Cambiar Fecha / Lotería</h3>
            <p style={s.modalSub}>Actualiza la fecha del sorteo y/o la lotería.</p>
            <form onSubmit={handleCambiarFecha} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.field}>
                <label style={s.label}>Nueva Fecha</label>
                <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Lotería</label>
                <input type="text" value={nuevaLoteria} onChange={(e) => setNuevaLoteria(e.target.value)} style={s.input} placeholder="Ej. Lotería de Bogotá" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setAbrirModalFecha(false)} style={s.btnCancel}>Cancelar</button>
                <button type="submit" disabled={cambiandoFecha} style={{ ...s.btnPrimary, background: '#f59e0b' }}>
                  {cambiandoFecha ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ticket de venta */}
      {ticketVenta && (
        <TicketModal
          ticket={ticketVenta}
          rifaData={seguroDatos}
          vendedor={estadisticasVendedores.find(v => String(v.id) === String(boletoSeleccionado?.vendedor?.id || ticketVenta.vendedor_id))}
          onClose={() => { setTicketVenta(null); setNombreCliente(''); setCelularCliente(''); setDireccionReferencia(''); setValorAbono(''); }}
        />
      )}
    </div>
  );
}

export default DashboardRifa;
