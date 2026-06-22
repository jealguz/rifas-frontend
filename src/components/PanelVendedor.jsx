import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../api/clienteAxios';
import TicketModal from './TicketModal';

const parseDate = (str) => {
  if (!str) return null;
  const m = String(str).match(/^(\d{4}-\d{2}-\d{2})/);
  if (!m) return new Date(str);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
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
  page: { animation: 'fadeIn 0.4s ease-out' },
  headerSection: { marginBottom: 28 },
  headerTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0 },
  headerAccent: { color: '#a5b4fc' },
  vendedorBadge: (color) => ({
    background: color || '#6366f1', color: '#fff',
    padding: '6px 16px', borderRadius: 20,
    fontSize: 13, fontWeight: 700, letterSpacing: '0.3px',
  }),
  headerInfo: {
    display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: '#94a3b8',
    flexWrap: 'wrap',
  },
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
  progressCard: (color) => ({
    background: '#f8fafc', borderRadius: 12,
    padding: '16px 18px',
    borderLeft: `4px solid ${color}`,
    marginBottom: 20,
  }),
  progressRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  progressName: { fontSize: 15, fontWeight: 700, color: '#0f172a' },
  progressPct: (color) => ({ fontSize: 18, fontWeight: 700, color }),
  progressSub: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 },
  progressTrack: { background: '#e2e8f0', height: 8, borderRadius: 99, marginTop: 10, overflow: 'hidden' },
  progressFill: (color, pct) => ({
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
    width: `${pct}%`, height: '100%', borderRadius: 99,
    transition: 'width 0.6s ease',
  }),
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
    gap: 6,
    background: '#f8fafc', padding: 16, borderRadius: 14,
    border: '1px solid #e2e8f0',
  },
  ticket: (esMia, estado_pago, color) => {
    if (!esMia) return {
      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 10, fontSize: 12, fontWeight: 700,
      background: '#e2e8f0', color: '#94a3b8', border: '1.5px solid #e2e8f0',
      cursor: 'not-allowed', opacity: 0.5,
    };
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
  imageWrapper: {
    width: '100%', height: 260, borderRadius: 16, overflow: 'hidden',
    marginBottom: 20, border: '1px solid #e2e8f0',
    background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  imageAsset: { width: '100%', height: '100%', objectFit: 'contain' },
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
  btnPrimary: (color) => ({
    padding: '11px 20px', borderRadius: 10, border: 'none',
    background: color || '#6366f1', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s',
  }),
};

function PanelVendedor() {
  const { rifaId, vendedorId } = useParams();
  const [cargando, setCargando] = useState(true);
  const [rifaData, setRifaData] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [boletos, setBoletos] = useState([]);

  const [ticketVenta, setTicketVenta] = useState(null);
  const [boletoSeleccionado, setBoletoSeleccionado] = useState(null);
  const [nombreCliente, setNombreCliente] = useState('');
  const [celularCliente, setCelularCliente] = useState('');
  const [direccionReferencia, setDireccionReferencia] = useState('');
  const [estadoPago, setEstadoPago] = useState('debe');
  const [valorAbono, setValorAbono] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      if (!rifaId || !vendedorId) return;
      try {
        const resRifa = await clienteAxios.get(`/rifas/${rifaId}`);

        const encargados = resRifa.data.lista_encargados || [];
        const vendedorEncontrado = encargados.find(e => String(e.id) === String(vendedorId));
        setVendedor(vendedorEncontrado || { id: vendedorId, nombre: 'Vendedor', color: '#6366f1' });
        setRifaData(resRifa.data);

        const todosBoletos = resRifa.data.boletos_pregenerados || [];
        setBoletos(todosBoletos);
      } catch (err) {
        console.error("Error al cargar:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [rifaId, vendedorId]);

  const handleGuardarVenta = async (e) => {
    e.preventDefault();
    try {
      const res = await clienteAxios.put('/rifas/vender', {
        rifa_id: rifaId,
        numero: boletoSeleccionado.numero,
        nombre_cliente: nombreCliente,
        celular: celularCliente,
        direccion_referencia: direccionReferencia,
        estado_pago: estadoPago,
        valor_abono: estadoPago === 'abono' ? parseFloat(valorAbono) : 0,
        vendedor_id: vendedorId
      });
      setTicketVenta(res.data.ticket);
      setBoletoSeleccionado(null);
    } catch (err) {
      console.error(err);
      alert('Error al procesar la venta.');
    }
  };

  const boletosDelVendedor = boletos.filter(b => String(b.vendedor?.id) === String(vendedorId));
  const vendidos = boletosDelVendedor.filter(b => b.estado_pago !== 'disponible').length;
  const asignados = boletosDelVendedor.length;
  const porcentaje = asignados > 0 ? Math.round((vendidos / asignados) * 100) : 0;
  const esBoletoDelVendedor = (boleto) => String(boleto.vendedor?.id) === String(vendedorId);

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Cargando panel de venta...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerSection}>
        <div style={s.headerTop}>
          <h1 style={s.headerTitle}>
            Panel de <span style={s.headerAccent}>Venta</span>
          </h1>
          {vendedor && (
            <span style={s.vendedorBadge(vendedor.color)}>{vendedor.nombre}</span>
          )}
        </div>
        {rifaData && (
          <div style={s.headerInfo}>
            <span>{rifaData.nombre_rifa}</span>
            {rifaData.loteria && <span>Lotería: {rifaData.loteria}</span>}
            {rifaData.fecha_sorteo && (
              <span>Sorteo: {parseDate(rifaData.fecha_sorteo)?.toLocaleDateString()}</span>
            )}
            {rifaData.precio_boleto && (
              <span>Valor: ${rifaData.precio_boleto?.toLocaleString?.() || rifaData.precio_boleto}</span>
            )}
          </div>
        )}
      </div>

      {/* Prize image */}
      {rifaData?.url_imagen && (
        <div style={s.imageWrapper}>
          <MediaRenderer src={rifaData.url_imagen} style={s.imageAsset} />
        </div>
      )}

      {/* Progress card */}
      {vendedor && (
        <div style={s.progressCard(vendedor.color)}>
          <div style={s.progressRow}>
            <span style={s.progressName}>{vendedor.nombre}</span>
            <span style={s.progressPct(vendedor.color)}>{porcentaje}%</span>
          </div>
          <div style={s.progressSub}>{vendidos} de {asignados} boletos colocados</div>
          <div style={s.progressTrack}>
            <div style={s.progressFill(vendedor.color, porcentaje)} />
          </div>
        </div>
      )}

      {/* Ticket grid */}
      <div style={s.card}>
        <div style={s.cardTitle}>Mis Boletos</div>
        <div style={s.ticketGrid}>
          {boletos.map((boleto, index) => {
            const esMia = esBoletoDelVendedor(boleto);
            return (
              <div
                key={index}
                onClick={() => esMia && boleto.estado_pago === 'disponible' && setBoletoSeleccionado(boleto)}
                style={s.ticket(esMia, boleto.estado_pago, vendedor?.color || '#6366f1')}
                title={esMia ? `N° ${boleto.numero}` : `N° ${boleto.numero} (Otra ruta)`}
              >
                {boleto.numero}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Venta */}
      {boletoSeleccionado && (
        <div style={s.overlay} onClick={() => setBoletoSeleccionado(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={s.modalTitle}>
                Vender Boleto{' '}
                <span style={{ color: vendedor?.color }}>{boletoSeleccionado.numero}</span>
              </h3>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', fontWeight: 600, color: '#475569' }}>
                {vendedor?.nombre}
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
                <button type="submit" style={s.btnPrimary(vendedor?.color)}>Confirmar Venta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ticketVenta && (
        <TicketModal
          ticket={ticketVenta}
          rifaData={rifaData}
          vendedor={vendedor}
          onClose={() => { setTicketVenta(null); setNombreCliente(''); setCelularCliente(''); setDireccionReferencia(''); setValorAbono(''); }}
        />
      )}
    </div>
  );
}

export default PanelVendedor;
