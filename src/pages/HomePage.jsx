import React, { useState, useEffect } from 'react';
import ConcursoCard from '../components/ConcursoCard';
import { estadosMap } from '../utils/estados';
import { Title, Meta } from 'react-head';

function HomePage() {
    const [concursos, setConcursos] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [loading, setLoading] = useState(true);

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

    // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO CUSTOMIZADA NO FRONT-END ---
    
    // 1. Aplica o filtro de estado selecionado
    const concursosFiltrados = concursos.filter(concurso => {
        if (filtroEstado === 'todos') return true;
        if (filtroEstado === 'nacional') return concurso.ambito === 'Nacional';
        return concurso.estado === filtroEstado;
    });

    // 2. Separa os concursos em grupos com base na nossa regra de negócio
    const nacionais = concursosFiltrados.filter(c => c.ambito === 'Nacional').sort((a, b) => a.instituicao.localeCompare(b.instituicao));
    const sp = concursosFiltrados.filter(c => c.estado === 'sp').sort((a, b) => a.instituicao.localeCompare(b.instituicao));
    const sudeste = concursosFiltrados.filter(c => ['rj', 'mg', 'es'].includes(c.estado)).sort((a, b) => a.instituicao.localeCompare(b.instituicao));
    
    // Agrupa os outros estados
    const outrosEstados = concursosFiltrados
        .filter(c => c.ambito !== 'Nacional' && !['sp', 'rj', 'mg', 'es'].includes(c.estado))
        .reduce((acc, concurso) => {
            const estado = concurso.estado.toUpperCase();
            if (!acc[estado]) acc[estado] = [];
            acc[estado].push(concurso);
            return acc;
        }, {});
    
    const siglasOutrosEstados = Object.keys(outrosEstados).sort();


    return (
        <>
            <Title>eConcursou - Concursos Públicos Abertos e Previstos</Title>
            <Meta name="description" content="Encontre os últimos editais de concursos públicos abertos e previstos em todo o Brasil..." />
        <div>              
            <section className="filtro-estados">
                    <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por cargo, instituição ou nível escolar..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
                <div className="mapa-brasil" style={{ marginTop: '15px' }}>
                    <div className="regiao">
                        <strong>Filtro Rápido:</strong>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'todos' ? 'active' : ''}`} onClick={() => setFiltroAtivo('todos')}>Todos</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'nacional' ? 'active' : ''}`} onClick={() => setFiltroAtivo('nacional')}>Nacional</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'ac' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ac')}>AC</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'al' ? 'active' : ''}`} onClick={() => setFiltroAtivo('al')}>AL</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'am' ? 'active' : ''}`} onClick={() => setFiltroAtivo('am')}>AM</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'ap' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ap')}>AP</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'ba' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ba')}>BA</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'ce' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ce')}>CE</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'df' ? 'active' : ''}`} onClick={() => setFiltroAtivo('df')}>DF</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'es' ? 'active' : ''}`} onClick={() => setFiltroAtivo('es')}>ES</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'go' ? 'active' : ''}`} onClick={() => setFiltroAtivo('go')}>GO</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'ma' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ma')}>MA</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'mg' ? 'active' : ''}`} onClick={() => setFiltroAtivo('mg')}>MG</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'ms' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ms')}>MS</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'mt' ? 'active' : ''}`} onClick={() => setFiltroAtivo('mt')}>MT</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'pa' ? 'active' : ''}`} onClick={() => setFiltroAtivo('pa')}>PA</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'pb' ? 'active' : ''}`} onClick={() => setFiltroAtivo('pb')}>PB</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'pe' ? 'active' : ''}`} onClick={() => setFiltroAtivo('pe')}>PE</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'pi' ? 'active' : ''}`} onClick={() => setFiltroAtivo('pi')}>PI</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'pr' ? 'active' : ''}`} onClick={() => setFiltroAtivo('pr')}>PR</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'rj' ? 'active' : ''}`} onClick={() => setFiltroAtivo('rj')}>RJ</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'rn' ? 'active' : ''}`} onClick={() => setFiltroAtivo('rn')}>RN</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'ro' ? 'active' : ''}`} onClick={() => setFiltroAtivo('ro')}>RO</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'rr' ? 'active' : ''}`} onClick={() => setFiltroAtivo('rr')}>RR</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'rs' ? 'active' : ''}`} onClick={() => setFiltroAtivo('rs')}>RS</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'sc' ? 'active' : ''}`} onClick={() => setFiltroAtivo('sc')}>SC</a>
                         <a href="#" className={`filtro-btn ${filtroAtivo === 'se' ? 'active' : ''}`} onClick={() => setFiltroAtivo('se')}>SE</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'sp' ? 'active' : ''}`} onClick={() => setFiltroAtivo('sp')}>SP</a>
                        <a href="#" className={`filtro-btn ${filtroAtivo === 'to' ? 'active' : ''}`} onClick={() => setFiltroAtivo('to')}>TO</a>                                               
                    </div>
                </div>
                {estadosOrdenados.map(estadoSigla => (
                    <section key={estadoSigla} className="regiao-section">                        
                        <h2>{estadosMap[estadoSigla.toUpperCase()] || estadoSigla}</h2>
                        {concursosPorEstado[estadoSigla].map(concurso => (
                            <ConcursoCard key={concurso._id} concurso={concurso} />
                        ))}
                    </section>
                ))}
            </section>

            <div className="lista-concursos">
                {loading ? <p>Carregando...</p> : (
                    <>                        
                        {nacionais.length > 0 && (
                            <section className="regiao-section">
                                <h2>Nacional</h2>
                                {nacionais.map(c => <ConcursoCard key={c._id} concurso={c} />)}
                            </section>
                        )}
                        
                        {sp.length > 0 && (
                            <section className="regiao-section">
                                <h2>São Paulo</h2>
                                {sp.map(c => <ConcursoCard key={c._id} concurso={c} />)}
                            </section>
                        )}                        
                        
                        {sudeste.length > 0 && (
                            <section className="regiao-section">
                                <h2>Sudeste (RJ, MG, ES)</h2>
                                {sudeste.map(c => <ConcursoCard key={c._id} concurso={c} />)}
                            </section>
                        )}
                        
                        {siglasOutrosEstados.map(sigla => (
                             <section key={sigla} className="regiao-section">
                                <h2>{estadosMap[sigla] || sigla}</h2>
                                {outrosEstados[sigla]
                                    .sort((a,b) => a.instituicao.localeCompare(b.instituicao))
                                    .map(c => <ConcursoCard key={c._id} concurso={c} />)}
                            </section>
                        ))}
                    </>
                )}
                 {!loading && concursosFiltrados.length === 0 && (
                    <p className="aviso-lista-vazia">Nenhum concurso encontrado para os filtros selecionados.</p>
                 )}
            </div>
        </div>
        </>
    );
}

export default HomePage;
