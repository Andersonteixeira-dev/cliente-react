import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Meta } from 'react-head';

function verificarStatus(dataInicio, dataPrazo) {
    // Se não tiver data de início ou de fim, é considerado Previsto.
    if (!dataInicio || !dataPrazo) {
        return { texto: 'Previsto', classe: 'previsto' };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicio = new Date(dataInicio + 'T00:00:00');
    const prazo = new Date(dataPrazo + 'T00:00:00');

    if (isNaN(inicio.getTime()) || isNaN(prazo.getTime())) {
        return { texto: 'Inválida', classe: 'encerrado' };
    }

    if (hoje < inicio) {
        // Se a data de hoje é ANTES da data de início
        return { texto: 'Previsto', classe: 'previsto' };
    } else if (hoje > prazo) {
        // Se a data de hoje é DEPOIS do prazo final
        return { texto: 'Encerrado', classe: 'encerrado' };
    } else {
        // Se a data de hoje está ENTRE o início e o fim
        return { texto: 'Aberto', classe: 'aberto' };
    }
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
    const { id } = useParams(); 
    const [concurso, setConcurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/concursos/${id}`)
            .then(res => res.json())
            .then(data => {
                setConcurso(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes:", err);
                setLoading(false);
            });
    }, [id]); 

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
    
    const statusInfo = verificarStatus(concurso.dataInicioInscricao, concurso.prazo);

    return (
         <>
      <Title>{`Concurso ${concurso.instituicao} | eConcursou`}</Title>
      <Meta name="description" content={`Detalhes sobre o concurso para ${concurso.instituicao}. Vagas para ${concurso.cargos || 'diversos cargos'}.`} />
        <div>             
            <div className="concurso-detalhe-card">
            <div className="card-header">
                <h4>{concurso.instituicao}</h4>
                <span className={`status ${statusInfo.classe}`}>{statusInfo.texto}</span>
            </div>
            </div>
            <div className="card-body">
                <div className="info-item-detalhe"><strong><i className="fas fa-briefcase"></i> Vagas:</strong> {concurso.vagas}</div>
                <div className="info-item-detalhe"><strong>Escolaridade:</strong> {concurso.escolaridade.join(' / ')}</div>
                <div className="info-item-detalhe"><strong><i className="fas fa-dollar-sign"></i> Salário:</strong> {concurso.salario}</div>
                <div className="info-item prazo-final">
                <i className="fas fa-calendar-days"></i>
                <strong>Inscrições até:</strong> {formatarData(concurso.prazo)}
            </div>
            </div>
            <div className="resumo-section">
                  <h3>Resumo do Edital e Links</h3>
                
                  {concurso.resumo && (
                    <>
                      <div 
                        className="resumo-formatado" 
                        dangerouslySetInnerHTML={{ __html: concurso.resumo || 'Nenhum resumo disponível.' }}/>
                    </>
                  )}
                
                  {concurso.links && concurso.links.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                      {concurso.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-detalhes"
                          >
                          {link.nome}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p>Nenhum link de edital foi fornecido.</p>
                  )}
                </div>

        </div>
        </>
    );
}
export default DetalhesPage;
