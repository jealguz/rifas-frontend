import { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';

const LOTERIAS_POR_DIA = {
    0: ['Sorteos Especiales', 'Extra de Colombia'],
    1: ['Lotería de Cundinamarca', 'Lotería del Tolima'],
    2: ['Lotería de la Cruz Roja', 'Lotería del Huila'],
    3: ['Lotería de Manizales', 'Lotería del Valle', 'Lotería del Meta'],
    4: ['Lotería de Bogotá', 'Lotería del Quindío'],
    5: ['Lotería de Medellín', 'Lotería de Santander', 'Lotería del Risaralda'],
    6: ['Lotería de Boyacá', 'Lotería del Cauca', 'Extra de Colombia'],
};

const s = {
  page: { animation: 'fadeIn 0.4s ease-out' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28, fontWeight: 800, color: '#fff',
    letterSpacing: '-0.5px',
  },
  titleAccent: { color: '#a5b4fc' },
  histBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#cbd5e1',
    borderRadius: 10,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 13, fontWeight: 700, color: '#6366f1',
    textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: 20, paddingBottom: 12,
    borderBottom: '2px solid #eef2ff',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16, marginBottom: 4,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 12, fontWeight: 600, color: '#475569',
    letterSpacing: '0.3px',
  },
  input: {
    padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', color: '#0f172a',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputFocus: {
    borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
  },
  select: {
    padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', color: '#0f172a', cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  previewImg: {
    width: 80, height: 80, objectFit: 'cover', marginTop: 8,
    borderRadius: 10, border: '2px solid #e2e8f0',
  },
  medioToggle: {
    display: 'flex', gap: 4,
    background: '#f1f5f9', borderRadius: 10, padding: 3,
  },
  medioBtn: (active) => ({
    flex: 1, padding: '7px 12px', borderRadius: 8,
    border: 'none', fontSize: 12, fontWeight: 600,
    background: active ? '#fff' : 'transparent',
    color: active ? '#6366f1' : '#64748b',
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  }),
  urlPreview: (isVideo) => ({
    width: 120, height: isVideo ? 68 : 80, objectFit: 'cover', marginTop: 8,
    borderRadius: 10, border: '2px solid #e2e8f0',
    background: '#0f172a',
  }),
  cifrasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
    gap: 8,
  },
  cifraBtn: (active) => ({
    padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 15,
    border: active ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
    background: active ? '#eef2ff' : '#f8fafc',
    color: active ? '#6366f1' : '#475569',
    cursor: 'pointer', transition: 'all 0.2s',
  }),
  sellerRow: (color) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', borderRadius: 10, marginBottom: 8,
    background: '#f8fafc',
    borderLeft: `4px solid ${color}`,
  }),
  sellerName: { fontWeight: 600, fontSize: 14, color: '#0f172a' },
  sellerDot: (color) => ({
    width: 10, height: 10, borderRadius: '50%', background: color,
    display: 'inline-block', marginRight: 10,
  }),
  removeBtn: {
    background: '#fef2f2', color: '#ef4444', border: 'none',
    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
    fontWeight: 600, fontSize: 12, transition: 'all 0.2s',
  },
  addBtn: {
    padding: '11px 20px', background: '#6366f1', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
  },
  submitBtn: {
    width: '100%', padding: '16px', borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', border: 'none', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', marginTop: 8,
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  },
  submitBtnDisabled: {
    opacity: 0.6, cursor: 'not-allowed',
  },
  // Modal
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, zIndex: 1000, animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    background: '#fff', borderRadius: 20,
    width: '100%', maxWidth: 520,
    padding: 32, maxHeight: '80vh', overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    animation: 'slideUp 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a' },
  closeBtn: {
    background: '#f1f5f9', border: 'none', borderRadius: 8,
    width: 36, height: 36, cursor: 'pointer', fontSize: 18,
    color: '#64748b', display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'all 0.2s',
  },
  histItem: {
    border: '1px solid #e2e8f0', borderRadius: 12,
    padding: 16, background: '#f8fafc',
  },
  histName: { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 },
  histBadge: {
    background: '#ef4444', color: '#fff', padding: '3px 10px',
    borderRadius: 6, fontSize: 11, fontWeight: 700,
  },
  histWinner: { color: '#ef4444', fontWeight: 700, fontSize: 16 },
  histMeta: { fontSize: 13, color: '#64748b' },
  histDate: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  emptyState: {
    textAlign: 'center', color: '#94a3b8', padding: '48px 0', fontWeight: 500,
  },
};

function CrearRifa({ alCrearRifa }) {
    const [nombreRifa, setNombreRifa] = useState('');
    const [premio, setPremio] = useState('');
    const [valorBoleto, setValorBoleto] = useState('');
    const [fechaSorteo, setFechaSorteo] = useState('');
    const [cifrasSeleccionadas, setCifrasSeleccionadas] = useState('2');
    const [loteriaSeleccionada, setLoteriaSeleccionada] = useState('');
    const [loteriasSugeridas, setLoteriasSugeridas] = useState([]);
    const [otraLoteria, setOtraLoteria] = useState('');
    const [imagenBase64, setImagenBase64] = useState('');
    const [medioTipo, setMedioTipo] = useState('archivo');
    const [urlMedio, setUrlMedio] = useState('');
    const [cargando, setCargando] = useState(false);

    const [listaVendedores, setListaVendedores] = useState([]);
    const [nuevoVendedor, setNuevoVendedor] = useState('');

    const [abrirHistorial, setAbrirHistorial] = useState(false);
    const [historial, setHistorial] = useState([]);

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

    const COLORES_VENDEDORES = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    useEffect(() => {
        if (!fechaSorteo) return;
        const fecha = new Date(fechaSorteo + 'T12:00:00');
        const sugerencias = LOTERIAS_POR_DIA[fecha.getDay()] || [];
        setLoteriasSugeridas(sugerencias);
        setLoteriaSeleccionada(sugerencias.length > 0 ? sugerencias[0] : 'otra');
    }, [fechaSorteo]);

    const handleCambioImagen = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        const lector = new FileReader();
        lector.onloadend = () => setImagenBase64(lector.result);
        lector.readAsDataURL(archivo);
    };

    const agregarVendedor = (e) => {
        if (e) e.preventDefault();
        if (!nuevoVendedor.trim()) return;

        const nuevoIdx = listaVendedores.length;
        setListaVendedores([...listaVendedores, {
            id: Date.now(),
            nombre: nuevoVendedor.trim(),
            color: COLORES_VENDEDORES[nuevoIdx % COLORES_VENDEDORES.length]
        }]);
        setNuevoVendedor('');
    };

    const eliminarVendedor = (id) => {
        setListaVendedores(listaVendedores.filter(v => v.id !== id));
    };

    const manejarEnviarFormulario = async (e) => {
        e.preventDefault();

        if (listaVendedores.length === 0) {
            return alert("Asigna al menos un vendedor antes de lanzar la rifa.");
        }

        const loteriaFinal = loteriaSeleccionada === 'otra' ? otraLoteria.trim() : loteriaSeleccionada;
        if (!loteriaFinal) return alert("Por favor, especifica la lotería.");

        setCargando(true);
        try {
            const payload = {
                nombre_rifa: nombreRifa.trim(),
                premio: premio.trim(),
                cifras: parseInt(cifrasSeleccionadas),
                precio_boleto: parseInt(valorBoleto),
                lista_encargados: listaVendedores.map(v => v.nombre),
                loteria: loteriaFinal,
                fecha_sorteo: fechaSorteo,
                url_imagen: medioTipo === 'url' ? urlMedio.trim() : imagenBase64
            };

            const res = await clienteAxios.post('/rifas/crear', payload);

            let encargadosFinales = [];

            const encargadosResp = res.data.lista_encargados || res.data.encargados;
            if (encargadosResp && Array.isArray(encargadosResp)) {
                encargadosFinales = encargadosResp.map(enc => ({
                    id: enc.id,
                    nombre: enc.nombre,
                    token_link: enc.token_link,
                    color: enc.codigo_color_hex || enc.color || '#6366f1'
                }));
            } else {
                console.error("El servidor no devolvió los encargados correctamente:", res.data);
                throw new Error("Error: El servidor no devolvió los IDs de los vendedores.");
            }

            let boletos = res.data.boletos_pregenerados || [];

            if (boletos.length === 0) {
                const totalBoletos = res.data.totalBoletosGenerados || Math.pow(10, parseInt(cifrasSeleccionadas));

                let todosLosNumeros = Array.from({ length: totalBoletos }, (_, i) =>
                    String(i).padStart(parseInt(cifrasSeleccionadas), '0')
                );

                for (let i = todosLosNumeros.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [todosLosNumeros[i], todosLosNumeros[j]] = [todosLosNumeros[j], todosLosNumeros[i]];
                }

                boletos = todosLosNumeros.map((numero, i) => {
                    const cantidadEncargados = encargadosFinales.length;
                    const encargadoAsignado = encargadosFinales[i % cantidadEncargados];

                    return {
                        id: i + 1,
                        numero: numero,
                        estado: 'disponible',
                        estado_pago: 'disponible',
                        vendedor_id: encargadoAsignado?.id || null,
                        vendedor_nombre: encargadoAsignado?.nombre || null,
                        vendedor: {
                            id: encargadoAsignado?.id,
                            nombre: encargadoAsignado?.nombre,
                            color: encargadoAsignado?.color || '#6366f1'
                        },
                        color: encargadoAsignado?.color || '#6366f1'
                    };
                });
            }

            const datosNormalizados = {
                ...res.data,
                nombre_rifa: nombreRifa.trim(),
                precio_boleto: parseInt(valorBoleto),
                loteria: loteriaFinal,
                fecha_sorteo: fechaSorteo,
                cifras: parseInt(cifrasSeleccionadas),
                encargados: encargadosFinales,
                lista_encargados: encargadosFinales,
                vendedores: encargadosFinales,
                boletos_pregenerados: boletos,
                rifaId: res.data.id || res.data.rifaId || 18
            };

            alCrearRifa(datosNormalizados);

        } catch (err) {
            console.error("Error en la comunicación HTTP:", err);
            alert("Error al guardar: " + (err.response?.data?.error || "Error interno del servidor"));
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={s.page}>
          <div style={s.header}>
            <h1 style={s.title}>
              Nueva <span style={s.titleAccent}>Rifa</span>
            </h1>
            <button onClick={() => setAbrirHistorial(true)} style={s.histBtn}>
              Historial
            </button>
          </div>

          <form onSubmit={manejarEnviarFormulario}>
            <div style={s.card}>
              <div style={s.cardTitle}>Datos Generales</div>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Nombre de la Rifa</label>
                  <input style={s.input} placeholder="Ej. Rifa de la Moto" value={nombreRifa} onChange={(e) => setNombreRifa(e.target.value)} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Premio</label>
                  <input style={s.input} placeholder="Ej. Casco + Guantes" value={premio} onChange={(e) => setPremio(e.target.value)} required />
                </div>
              </div>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Fecha del Sorteo</label>
                  <input style={s.input} type="date" value={fechaSorteo} onChange={(e) => setFechaSorteo(e.target.value)} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Valor del Boleto (COP)</label>
                  <input style={s.input} placeholder="Ej. 10000" type="number" value={valorBoleto} onChange={(e) => setValorBoleto(e.target.value)} required />
                </div>
              </div>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Cantidad de Cifras</label>
                  <div style={s.cifrasGrid}>
                    {['2','3','4','5'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        style={s.cifraBtn(cifrasSeleccionadas === opt)}
                        onClick={() => setCifrasSeleccionadas(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    {cifrasSeleccionadas === '2' ? '00 - 99' :
                     cifrasSeleccionadas === '3' ? '000 - 999' :
                     cifrasSeleccionadas === '4' ? '0000 - 9999' : '00000 - 99999'}
                  </span>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Lotería</label>
                  <select style={s.select} value={loteriaSeleccionada} onChange={(e) => setLoteriaSeleccionada(e.target.value)}>
                    {loteriasSugeridas.map(l => <option key={l} value={l}>{l}</option>)}
                    <option value="otra">Otra...</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Imagen / Video del Premio</label>
                  <div style={s.medioToggle}>
                    <button type="button" style={s.medioBtn(medioTipo === 'archivo')} onClick={() => setMedioTipo('archivo')}>Subir archivo</button>
                    <button type="button" style={s.medioBtn(medioTipo === 'url')} onClick={() => setMedioTipo('url')}>URL externa</button>
                  </div>
                  {medioTipo === 'archivo' ? (
                    <>
                      <input type="file" accept="image/*,video/*" onChange={handleCambioImagen}
                        style={{ ...s.input, padding: '9px', fontSize: 13 }} />
                      {imagenBase64 && (
                        imagenBase64.startsWith('data:video') ? (
                          <video src={imagenBase64} controls style={s.urlPreview(true)} />
                        ) : (
                          <img src={imagenBase64} alt="Previsualización" style={s.previewImg} />
                        )
                      )}
                    </>
                  ) : (
                    <>
                      <input style={s.input} placeholder="Ej. https://youtube.com/watch?v=..." value={urlMedio} onChange={(e) => setUrlMedio(e.target.value)} />
                      {urlMedio && (
                        urlMedio.includes('youtube.com/watch') || urlMedio.includes('youtu.be') ? (
                          <div style={{ marginTop: 8, fontSize: 12, color: '#6366f1', fontWeight: 600 }}>
                            YouTube detectado
                          </div>
                        ) : urlMedio.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                          <video src={urlMedio} controls style={s.urlPreview(true)} />
                        ) : (
                          <img src={urlMedio} alt="Preview" style={s.previewImg}
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
              {loteriaSeleccionada === 'otra' && (
                <div style={{ ...s.field, marginTop: 12 }}>
                  <label style={s.label}>Nombre de la Lotería</label>
                  <input style={s.input} placeholder="Nombre de la lotería" value={otraLoteria} onChange={(e) => setOtraLoteria(e.target.value)} required />
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>Vendedores de la Ruta</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <input
                  style={{ ...s.input, flex: 1 }}
                  placeholder="Nombre del vendedor"
                  value={nuevoVendedor}
                  onChange={(e) => setNuevoVendedor(e.target.value)}
                />
                <button type="button" onClick={agregarVendedor} style={s.addBtn}>
                  Agregar
                </button>
              </div>
              {listaVendedores.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '24px 0' }}>
                  Agrega al menos un vendedor para continuar
                </p>
              ) : (
                listaVendedores.map(v => (
                  <div key={v.id} style={s.sellerRow(v.color)}>
                    <span style={s.sellerName}>
                      <span style={s.sellerDot(v.color)} />
                      {v.nombre}
                    </span>
                    <button type="button" onClick={() => eliminarVendedor(v.id)} style={s.removeBtn}>
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="submit"
              style={{ ...s.submitBtn, ...(cargando ? s.submitBtnDisabled : {}) }}
              disabled={cargando}
            >
              {cargando ? 'Iniciando parámetros...' : 'Lanzar Rifa'}
            </button>
          </form>

          {abrirHistorial && (
            <div style={s.overlay} onClick={() => setAbrirHistorial(false)}>
              <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                <div style={s.modalHeader}>
                  <h3 style={s.modalTitle}>Historial de Rifas</h3>
                  <button onClick={() => setAbrirHistorial(false)} style={s.closeBtn}>✕</button>
                </div>
                {historial.length === 0 ? (
                  <p style={s.emptyState}>No hay rifas finalizadas aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {historial.map(rifa => (
                      <div key={rifa.id} style={s.histItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <h4 style={s.histName}>{rifa.nombre_rifa}</h4>
                          <span style={s.histBadge}>Finalizada</span>
                        </div>
                        <div style={s.histMeta}>
                          Ganador:{' '}
                          <span style={s.histWinner}>{rifa.numero_ganador}</span>
                        </div>
                        <div style={s.histMeta}>
                          Boletos vendidos: {rifa.boletos_vendidos} / {rifa.total_boletos}
                        </div>
                        <div style={s.histDate}>
                          Finalizada el {new Date(rifa.fecha_finalizacion).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    );
}

export default CrearRifa;
