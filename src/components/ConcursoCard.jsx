import React from 'react';
import { Link } from 'react-router-dom';

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

    const partes = dataString.split('-').map(Number);
    const data = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));

    if (isNaN(data.getTime())) {
        return 'Formato de data irreconhecível';
    }

    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}

function ConcursoCard({ concurso }) { 
    const statusInfo = verificarStatus(concurso.dataInicioInscricao, concurso.dataFimInscricao);
    return (
         <Link to={`/concursos/${concurso.slug}`} className="card-link-wrapper"> 
            <article className={`concurso-card ${statusInfo.classe}`}>
                <div className="card-header">
                    <h4>{concurso.instituicao}</h4>
                    <span className={`status ${statusInfo.classe}`}>{statusInfo.texto}</span>
                </div>

                <div className="card-body"> 
                    <div className="info-coluna">
                        <div className="info-item">
                            <i className="fas fa-graduation-cap"></i>
                            <div>
                                <strong>Escolaridade: </strong>
                                <span>{(concurso.escolaridade || []).join(' / ')}</span>
                            </div>
                        </div>
                        {concurso.cargos && (
                            <div className="info-item">
                                <i className="fas fa-user-tie"></i>
                                <div>
                                    <strong>Cargos: </strong>
                                    <span>{concurso.cargos}</span>
                                </div>
                            </div>
                        )}
                    </div> 
                    <div className="info-coluna">
                        <div className="info-item">
                            <i className="fas fa-briefcase"></i>
                            <div>
                                <strong>Vagas: </strong>
                                <span>{concurso.vagas}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-dollar-sign"></i>
                            <div>
                                <strong>Salário: </strong>
                                <span>{concurso.salario}</span>
                            </div>
                        </div>
                        {concurso.textoInscricao && (
                        <div className="info-item prazo-final">
                            <i className="fas fa-calendar-days"></i>
                            <strong>Inscrições:</strong>
                            <span>{concurso.textoInscricao}</span>
                        </div>
                    )}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default ConcursoCard;
