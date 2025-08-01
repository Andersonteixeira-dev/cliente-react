import React, { useState, useEffect } from 'react';
import { Title, Meta } from 'react-head';
import ConcursoCard from '../components/ConcursoCard';
import { estadosMap } from '../utils/estados';

function HomePage() {
    const [concursos, setConcursos] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState('todos');
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

            <div>
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
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'sp' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('sp'); }}>SP</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'rj' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('rj'); }}>RJ</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'mg' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('mg'); }}>MG</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'es' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('es'); }}>ES</a>
                        </div>
                        <div className="regiao">
                            <strong>Sul:</strong>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'pr' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('pr'); }}>PR</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'sc' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('sc'); }}>SC</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'rs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('rs'); }}>RS</a>
                        </div>
                         <div className="regiao">
                            <strong>Nordeste:</strong>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'al' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('al'); }}>AL</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ba' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ba'); }}>BA</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ce' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ce'); }}>CE</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ma' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ma'); }}>MA</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'pb' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('pb'); }}>PB</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'pe' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('pe'); }}>PE</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'pi' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('pi'); }}>PI</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'rn' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('rn'); }}>RN</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'se' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('se'); }}>SE</a>
                        </div>
                         <div className="regiao">
                            <strong>Norte:</strong>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ac' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ac'); }}>AC</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ap' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ap'); }}>AP</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'am' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('am'); }}>AM</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'pa' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('pa'); }}>PA</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ro' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ro'); }}>RO</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'rr' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('rr'); }}>RR</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'to' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('to'); }}>TO</a>
                        </div>
                        <div className="regiao">
                            <strong>Centro-Oeste:</strong>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'df' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('df'); }}>DF</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'go' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('go'); }}>GO</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'mt' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('mt'); }}>MT</a>
                            <a href="#" className={`filtro-btn ${filtroAtivo === 'ms' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setFiltroAtivo('ms'); }}>MS</a>
                        </div>
                    </div>
                </section>

                <div className="lista-concursos">
                    {loading ? <p>Carregando...</p> : (
                        <>                       
                            {nacionais.length > 0 && (
                                <section className="regiao-section"><h2>Nacional</h2>{nacionais.map(c => <ConcursoCard key={c._id} concurso={c} />)}</section>
                            )}
                            {todasAsSiglasOrdenadas.map(sigla => (
                             // Verifica se realmente existem concursos para essa sigla antes de criar a seção
                               concursosPorEstado[sigla] && (
                                 <section key={sigla} className="regiao-section">
                                     <h2>{estadosMap[sigla] || sigla}</h2>
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
            </div>
        </>
    );
}

export default HomePage;
