
import React from 'react';
import { Link } from 'react-router-dom'; 

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

function ConcursoCard({ concurso }) {    
    const statusInfo = verificarStatus(concurso.dataInicioInscricao, concurso.prazo);   

    return (
         <Link to={`/concursos/${concurso._id}`} className="card-link-wrapper">           
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
                        {concurso.prazo && (
                            <div className="info-item prazo-final">
                                <i className="fas fa-calendar-days"></i>
                                <div>
                                    <strong>Inscrições até: </strong>
                                    <span>{formatarData(concurso.prazo)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default ConcursoCard;