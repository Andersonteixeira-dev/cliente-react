import React, { useState, useEffect } from 'react';
import { Title, Meta } from 'react-head';
import ConcursoCard from '../components/ConcursoCard';
import { estadosMap } from '../utils/estados';
import UltimasNoticias from '../components/UltimasNoticias'; 
import SidebarNoticias from '../components/SidebarNoticias';
import useSmartScrollRestoration from '../hooks/useSmartScrollRestoration';

function HomePage() {    
    const [concursos, setConcursos] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState('todos');
    const [loading, setLoading] = useState(true);

    useSmartScrollRestoration(loading, concursos.length);

    useEffect(() => {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/api/concursos?search=${termoBusca}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setConcursos(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar concursos:", error);
                setLoading(false);
            });
    }, [termoBusca]);

    // Lógica de filtragem e agrupamento no front-end
    const concursosFiltrados = concursos.filter(concurso => {
        if (filtroAtivo === 'todos') return true;
        if (filtroAtivo === 'nacional') return concurso.ambito === 'Nacional';
        return concurso.estado === filtroAtivo;
    });

    // 1. Separa os concursos Nacionais e ordena
    const nacionais = concursosFiltrados
        .filter(c => c.ambito === 'Nacional')
        .sort((a, b) => a.instituicao.localeCompare(b.instituicao));

    // 2. Agrupa TODOS os outros concursos por estado
    const concursosPorEstado = concursosFiltrados
        .filter(c => c.ambito !== 'Nacional')
        .reduce((acc, concurso) => {
            const estado = concurso.estado.toUpperCase();
            if (!acc[estado]) acc[estado] = [];
            acc[estado].push(concurso);
            return acc;
        }, {});

    // 3. Define a nossa ORDEM DE EXIBIÇÃO customizada
    const ordemDeExibicao = [
        'SP', 'RJ', 'MG', 'ES', // Sudeste primeiro, com SP na frente
        // Adicione aqui outras siglas em qualquer ordem de prioridade que desejar
    ];

    // Pega todas as siglas de estados que temos, remove as que já estão na ordem customizada, e ordena o resto alfabeticamente
    const siglasRestantes = Object.keys(concursosPorEstado)
        .filter(sigla => !ordemDeExibicao.includes(sigla))
        .sort();
    
    // Junta a nossa ordem prioritária com o resto dos estados
    const todasAsSiglasOrdenadas = [...ordemDeExibicao, ...siglasRestantes];

    return (
        <>
            <Title>eConcursou - Concursos Públicos Abertos e Previstos</Title>
            <Meta name="description" content="Encontre os últimos editais de concursos públicos abertos, previstos e em andamento em todo o Brasil." />

                <div className="container-wide">
                <section className="filtro-estados">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por cargo, instituição ou nível..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                    <div className="mapa-brasil" style={{ marginTop: '15px' }}>
                        <div className="regiao">
                            <strong>Filtros:</strong>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'todos' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('todos'); }}>Todos</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'nacional' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('nacional'); }}>Nacional</a>
                        </div>
                        <div className="regiao">
                            <strong>Sudeste:</strong>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'sp' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('sp'); }}>SP</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'rj' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('rj'); }}>RJ</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'mg' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('mg'); }}>MG</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'es' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('es'); }}>ES</a>
                        </div>
                        <div className="regiao">
                            <strong>Sul:</strong>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'pr' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('pr'); }}>PR</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'sc' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('sc'); }}>SC</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'rs' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('rs'); }}>RS</a>
                        </div>
                         <div className="regiao">
                            <strong>Nordeste:</strong>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'al' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('al'); }}>AL</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ba' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ba'); }}>BA</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ce' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ce'); }}>CE</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ma' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ma'); }}>MA</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'pb' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('pb'); }}>PB</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'pe' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('pe'); }}>PE</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'pi' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('pi'); }}>PI</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'rn' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('rn'); }}>RN</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'se' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('se'); }}>SE</a>
                        </div>
                         <div className="regiao">
                            <strong>Norte:</strong>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ac' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ac'); }}>AC</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ap' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ap'); }}>AP</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'am' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('am'); }}>AM</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'pa' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('pa'); }}>PA</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ro' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ro'); }}>RO</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'rr' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('rr'); }}>RR</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'to' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('to'); }}>TO</a>
                        </div>
                        <div className="regiao">
                            <strong>Centro-Oeste:</strong>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'df' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('df'); }}>DF</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'go' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('go'); }}>GO</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'mt' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('mt'); }}>MT</a>
                            <a href="#" className={`filtro-btn notranslate ${filtroAtivo === 'ms' ? 'active' : ''}`} translate="no" onClick={(e) => { e.preventDefault(); setFiltroAtivo('ms'); }}>MS</a>
                        </div>
                    </div>
                </section>
                 <div className="homepage-grid">
                <main className="concursos-coluna">
                    <div className="lista-concursos">                                 
                    {loading ? <p>Carregando...</p> : (
                        <>                       
                            {nacionais.length > 0 && (
                                <section className="regiao-section"><h2 className="section-title">Nacional</h2>{nacionais.map(c => <ConcursoCard key={c._id} concurso={c} />)}</section>
                            )}
                            {todasAsSiglasOrdenadas.map(sigla => (
                             // Verifica se realmente existem concursos para essa sigla antes de criar a seção
                               concursosPorEstado[sigla] && (
                                 <section key={sigla} className="regiao-section">
                                     <h2 className="section-title">{estadosMap[sigla] || sigla}</h2>
                                     {concursosPorEstado[sigla]
                                     .sort((a, b) => a.instituicao.localeCompare(b.instituicao))
                                     .map(c => <ConcursoCard key={c._id} concurso={c} />)}
                                    </section>
                                  )
                               ))}
                          </>
                        )}
                       {!loading && concursosFiltrados.length === 0 && (
                          <p className="aviso-lista-vazia">Nenhum concurso encontrado para os filtros selecionados.</p>
                       )}
                </div>
            </main>
            <aside className="sidebar-noticias">
                    <UltimasNoticias />
            </aside>
            </div>
            </div>
        </>
    );
}

export default HomePage;
