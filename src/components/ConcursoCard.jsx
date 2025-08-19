import React from 'react';
import { Link } from 'react-router-dom';

function verificarStatus(concurso) {    
    if (concurso.statusManual && concurso.statusManual.trim() !== '') {       
        return { texto: concurso.statusManual, classe: concurso.statusManual.toLowerCase() };
    }
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (concurso.dataFimInscricao) {
        const fim = new Date(concurso.dataFimInscricao + 'T00:00:00');
        if (!isNaN(fim.getTime()) && hoje > fim) {
            return { texto: 'Encerrado', classe: 'encerrado' };
        }
    }
    if (concurso.dataInicioInscricao) {
        const inicio = new Date(concurso.dataInicioInscricao + 'T00:00:00');
        if (!isNaN(inicio.getTime()) && hoje < inicio) {
            return { texto: 'Previsto', classe: 'previsto' };
        }
    }
    
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
    const statusInfo = verificarStatus(concurso);
    return (
         <Link to={`/concursos/${concurso.slug}`} className="card-link-wrapper"> 
            <article className={`concurso-card ${statusInfo.classe}`}>
                <div className="card-header">
                    <h4>
                        {concurso.instituicao}
                        {concurso.estado && <span className="estado-sigla-card">({concurso.estado.toUpperCase()})</span>}
                    </h4>
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
