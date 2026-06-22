import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteAxios from '../api/clienteAxios';

const parseDate = (str) => {
  if (!str) return null;
  const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date(str);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};
const estadoColors = {
  pagado: { bg: '#dcfce7', text: '#166534' },
  debe: { bg: '#fef2f2', text: '#dc2626' },
  abono: { bg: '#fffbeb', text: '#d97706' },
};

function TicketVerificacion() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await clienteAxios.get(`/rifas/ticket/${codigo}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Ticket no encontrado');
      } finally {
        setCargando(false);
      }
    };
    verificar();
  }, [codigo]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Verificando ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: 22 }}>Ticket no válido</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 24px' }}>{error}</p>
          <button onClick={() => navigate('/')}
            style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data?.ticket) return null;
  const t = data.ticket;
  const ec = estadoColors[t.estado_pago] || { bg: '#f1f5f9', text: '#475569' };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: 440, margin: '0 auto' }}>
      {/* Ticket card */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '28px 24px 20px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginBottom: 4, letterSpacing: 2 }}>COMPROBANTE VERIFICADO</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{t.nombre_rifa || 'Rifa'}</div>
          {t.loteria && <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{t.loteria}</div>}
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20, fontSize: 11 }}>
            <span>✅</span> Válido
          </div>
        </div>

        {/* Numero */}
        <div style={{ textAlign: 'center', padding: '20px 24px 12px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>NÚMERO</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', letterSpacing: 4 }}>{t.numero}</div>
        </div>

        {/* Info */}
        <div style={{ padding: '0 24px 20px' }}>
          {[
            ['Comprador', t.cliente_nombre],
            ['Celular', t.cliente_celular],
            ['Vendedor', t.vendedor_nombre],
            ['Lotería', t.loteria],
            ['Fecha sorteo', t.fecha_sorteo ? parseDate(t.fecha_sorteo).toLocaleDateString() : ''],
          ].filter(([, v]) => v).map(([label, value], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
              <span style={{ color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>Estado</span>
            <span style={{ background: ec.bg, color: ec.text, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
              {t.estado_pago?.toUpperCase()}
            </span>
          </div>
          {t.valor_abonado > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>Abono</span>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>${Number(t.valor_abonado).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '0 24px 20px', fontSize: 11, color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
          <div style={{ fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 }}>{codigo}</div>
          <div>Gracias por su compra</div>
        </div>
      </div>
    </div>
  );
}

export default TicketVerificacion;
