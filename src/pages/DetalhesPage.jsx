import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Meta } from 'react-head';

function verificarStatus(dataInicio, dataFim) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Regra 1: Se tem data final e ela já passou, está Encerrado.
    if (dataFim) {
        const fim = new Date(dataFim + 'T00:00:00');
        if (!isNaN(fim.getTime()) && hoje > fim) {
            return { texto: 'Encerrado', classe: 'encerrado' };
        }
    }

    // Regra 2: Se tem data de início e ela ainda não chegou, está Previsto.
    if (dataInicio) {
        const inicio = new Date(dataInicio + 'T00:00:00');
        if (!isNaN(inicio.getTime()) && hoje < inicio) {
            return { texto: 'Previsto', classe: 'previsto' };
        }
    }

    // Regra 3: Se não se encaixa em nenhuma das anteriores, está Aberto.
    return { texto: 'Aberto', classe: 'aberto' };
}

function formatarData(dataString) {
    if (!dataString) return 'Data não definida';
    let data;
    if (dataString.includes('/')) {
        const partes = dataString.split('/');
        const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
        data = new Date(dataISO + 'T00:00:00');
    } else {
        data = new Date(dataString + 'T00:00:00');
    }
    if (isNaN(data.getTime())) {
        return 'Formato de data irreconhecível';
    }
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function DetalhesPage() {
    const { slug } = useParams();
    const [concurso, setConcurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/concursos/slug/${slug}`)
            .then(res => res.json())
            .then(data => {
                setConcurso(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes:", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <p>Carregando detalhes...</p>;
    }

    if (!concurso || !concurso.instituicao) {
        return (
            <div>
                <h1>Concurso não encontrado</h1>
                <p>O concurso que você está procurando não existe ou foi removido.</p>
                <Link to="/">Voltar para a página inicial</Link>
            </div>
        );
    }

    const statusInfo = verificarStatus(concurso.dataInicioInscricao, concurso.dataFimInscricao);
    return (
        <>
            <Title>{`Concurso ${concurso.instituicao} | eConcursou`}</Title>
            <Meta name="description" content={`Detalhes sobre o concurso para ${concurso.instituicao}. Vagas para ${concurso.cargos || 'diversos cargos'}.`} />
            <div className="concurso-detalhe-card">
                <div className="card-header">
                    <h4>{concurso.instituicao}</h4>
                    <span className={`status ${statusInfo.classe}`}>{statusInfo.texto}</span>
                </div>
                <div className="card-body-detalhes" style={{ paddingTop: '20px' }}>
                    <div className="info-item-detalhe">
                        <i className="fas fa-briefcase"></i>
                        <div><strong>Vagas: </strong><span>{concurso.vagas}</span></div>
                    </div>
                    <div className="info-item-detalhe">
                        <i className="fas fa-graduation-cap"></i>
                        <div><strong>Escolaridade: </strong><span>{(concurso.escolaridade || []).join(' / ')}</span></div>
                    </div>
                    {concurso.cargos && (
                        <div className="info-item-detalhe">
                            <i className="fas fa-user-tie"></i>
                            <div><strong>Cargos: </strong><span>{concurso.cargos}</span></div>
                        </div>
                    )}
                    <div className="info-item-detalhe">
                        <i className="fas fa-dollar-sign"></i>
                        <div><strong>Salário: </strong><span>{concurso.salario}</span></div>
                    </div>
                    {concurso.textoInscricao && (
                        <div className="info-item-detalhe">
                            <i className="fas fa-calendar-days"></i>
                            <div><strong>{concurso.textoInscricao ? 'Inscrições:' : 'Inscrições até:'} </strong><span>{concurso.textoInscricao || formatarData(concurso.dataFimInscricao)}</span></div>
                        </div>
                    )}
                </div>
                <div className="resumo-section">
                    <h3>Resumo do Edital</h3>
                    <div
                        className="resumo-formatado"
                        dangerouslySetInnerHTML={{ __html: concurso.resumo || 'Nenhum resumo disponível.' }}
                    />
                </div>
                <div className="resumo-section">
                    <h3>Documentos e Links Importantes</h3>
                    {(concurso.links && concurso.links.length > 0) ? (
                        <ul className="lista-links-publica">
                            {concurso.links.map((link, index) => (
                                <li key={index}>
                                    <a href={link.url} className="btn-detalhes-principal" target="_blank" rel="noopener noreferrer">
                                        <i className="fas fa-file-pdf"></i> {link.nome}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum link fornecido.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default DetalhesPage;
