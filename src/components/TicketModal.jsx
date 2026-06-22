import { useRef } from 'react';
import html2canvas from 'html2canvas';

const s = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, zIndex: 1000, animation: 'fadeIn 0.2s ease-out',
  },
  card: {
    background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400,
    overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    padding: '28px 24px 20px', textAlign: 'center', color: '#fff',
  },
  headerLabel: { fontSize: 11, fontWeight: 600, opacity: 0.8, marginBottom: 4, letterSpacing: 2 },
  headerTitle: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' },
  headerSub: { fontSize: 12, opacity: 0.8, marginTop: 4 },
  body: { padding: '16px 24px 20px' },
  numeroLabel: { fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4, textAlign: 'center' },
  numeroValue: { fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: 4, textAlign: 'center' },
  codigoText: { fontSize: 11, color: '#94a3b8', marginTop: 6, fontFamily: 'monospace', letterSpacing: 1, textAlign: 'center' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 },
  fieldKey: { color: '#64748b', fontWeight: 500 },
  fieldVal: { color: '#0f172a', fontWeight: 700, textAlign: 'right' },
  badge: (bg, color) => ({ background: bg, color, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }),
  footer: { textAlign: 'center', fontSize: 11, color: '#94a3b8', borderTop: '1px dashed #e2e8f0', padding: '12px 0 0', marginTop: 8 },
  actions: { display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px 24px' },
  btnPrimary: {
    width: '100%', padding: 12, borderRadius: 10, border: 'none',
    background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnWhatsApp: {
    width: '100%', padding: 12, borderRadius: 10, border: 'none',
    background: '#25D366', color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnOutline: {
    width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #e2e8f0',
    background: '#fff', color: '#475569', fontWeight: 600, fontSize: 14,
    cursor: 'pointer',
  },
  btnRow: { display: 'flex', gap: 8 },
};

const estadoColors = {
  pagado: { bg: '#dcfce7', text: '#166534' },
  debe: { bg: '#fef2f2', text: '#dc2626' },
  abono: { bg: '#fffbeb', text: '#d97706' },
};

function TicketModal({ ticket, rifaData, vendedor, onClose }) {
  const ticketRef = useRef(null);

  const linkVerificacion = `https://fonamenpre.netlify.app/ticket/${ticket.codigo}`;

  const descargarImagen = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
      });
      const enlace = document.createElement('a');
      enlace.download = `ticket-${ticket.codigo}.png`;
      enlace.href = canvas.toDataURL();
      enlace.click();
    } catch (err) {
      alert('Error al generar la imagen. Intenta con imprimir.');
    }
  };

  const compartirWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `🎟️ *Ticket de Rifa*\n\n` +
      `Número: ${ticket.numero}\n` +
      `Comprador: ${ticket.nombre_cliente}\n` +
      `Vendedor: ${vendedor?.nombre || ''}\n` +
      `Estado: ${ticket.estado_pago.toUpperCase()}\n\n` +
      `🔗 Verificar: ${linkVerificacion}`
    );
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  const ec = estadoColors[ticket.estado_pago] || { bg: '#f1f5f9', text: '#475569' };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div style={s.header}>
          <div style={s.headerLabel}>COMPROBANTE</div>
          <div style={s.headerTitle}>{rifaData?.nombre_rifa || 'Rifa'}</div>
          {rifaData?.loteria && <div style={s.headerSub}>{rifaData.loteria}</div>}
        </div>

        {/* Contenido del ticket (se captura para imagen) */}
        <div ref={ticketRef}>
          <div style={s.body}>
            <div style={s.numeroLabel}>NÚMERO</div>
            <div style={s.numeroValue}>{ticket.numero}</div>
            <div style={s.codigoText}>{ticket.codigo}</div>

            <div style={{ marginTop: 16 }}>
              <div style={s.row}>
                <span style={s.fieldKey}>Comprador</span>
                <span style={s.fieldVal}>{ticket.nombre_cliente}</span>
              </div>
              {ticket.celular && (
                <div style={s.row}>
                  <span style={s.fieldKey}>Celular</span>
                  <span style={s.fieldVal}>{ticket.celular}</span>
                </div>
              )}
              <div style={s.row}>
                <span style={s.fieldKey}>Vendedor</span>
                <span style={s.fieldVal}>{vendedor?.nombre || ''}</span>
              </div>
              <div style={s.row}>
                <span style={s.fieldKey}>Estado</span>
                <span style={s.fieldVal}>
                  <span style={s.badge(ec.bg, ec.text)}>{ticket.estado_pago.toUpperCase()}</span>
                </span>
              </div>
              {ticket.valor_abono > 0 && (
                <div style={s.row}>
                  <span style={s.fieldKey}>Abono</span>
                  <span style={s.fieldVal}>${Number(ticket.valor_abono).toLocaleString()}</span>
                </div>
              )}
              <div style={s.footer}>Gracias por su compra</div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={s.actions}>
          <button onClick={compartirWhatsApp} style={s.btnWhatsApp}>
            Compartir en WhatsApp
          </button>
          <div style={s.btnRow}>
            <button onClick={descargarImagen} style={{ ...s.btnPrimary, background: '#0f172a' }}>
              Descargar imagen
            </button>
            <button onClick={() => {
              const w = window.open('', '_blank');
              if (!w) return;
              w.document.write(`<!DOCTYPE html><html><head><title>Ticket - ${ticket.numero}</title><style>
                body{font-family:'Courier New',monospace;margin:0;padding:20px}
                .t{max-width:350px;margin:0 auto;border:2px dashed #6366f1;padding:24px;border-radius:16px}
                .h{text-align:center;border-bottom:2px solid #6366f1;padding-bottom:12px;margin-bottom:16px}
                .h h1{margin:0;font-size:22px;color:#6366f1}
                .n{text-align:center;font-size:48px;font-weight:900;color:#0f172a;margin:16px 0;letter-spacing:4px}
                .i div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e2e8f0;font-size:13px}
                .i strong{color:#475569}.i span{color:#0f172a;font-weight:700}
                .f{text-align:center;margin-top:16px;padding-top:12px;border-top:2px dashed #6366f1;font-size:11px;color:#94a3b8}
                .c{text-align:center;font-size:10px;color:#94a3b8;margin-top:12px}
              </style></head><body>
              <div class="t">
                <div class="h"><h1>${rifaData?.nombre_rifa || 'Rifa'}</h1><p>${rifaData?.loteria || ''}${rifaData?.fecha_sorteo ? ' - '+new Date(rifaData.fecha_sorteo+'T12:00:00').toLocaleDateString() : ''}</p></div>
                <div class="n">${ticket.numero}</div>
                <div class="i">
                  <div><strong>Comprador</strong><span>${ticket.nombre_cliente}</span></div>
                  ${ticket.celular ? `<div><strong>Celular</strong><span>${ticket.celular}</span></div>` : ''}
                  <div><strong>Vendedor</strong><span>${vendedor?.nombre || ''}</span></div>
                  <div><strong>Estado</strong><span style="background:${ec.bg};color:${ec.text};padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px">${ticket.estado_pago.toUpperCase()}</span></div>
                  ${ticket.valor_abono > 0 ? `<div><strong>Abono</strong><span>$${Number(ticket.valor_abono).toLocaleString()}</span></div>` : ''}
                </div>
                <div class="c">${ticket.codigo}</div>
                <div class="f">Gracias por su compra</div>
              </div></body></html>`);
              w.document.close();
              w.print();
            }} style={s.btnOutline}>
              Imprimir
            </button>
          </div>
          <button onClick={onClose} style={s.btnOutline}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
