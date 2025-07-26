
import React from 'react';
import { Link } from 'react-router-dom'; 

function verificarStatus(dataPrazo) {
    // Se não houver data de prazo, consideramos como 'Previsto' ou 'Aberto'
    // para não penalizar o concurso. A lógica de "Previsto" com base na data de início foi removida para simplificar.
    if (!dataPrazo) {
        return { texto: 'Aberto', classe: 'aberto' }; 
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera o horário para comparar apenas o dia

    // Converte a string 'YYYY-MM-DD' para um objeto Date de forma segura
    const partesPrazo = dataPrazo.split('-').map(Number);
    const prazo = new Date(partesPrazo[0], partesPrazo[1] - 1, partesPrazo[2]);
    prazo.setHours(0, 0, 0, 0);

    // Se a data do prazo for inválida, retorna um status neutro
    if (isNaN(prazo.getTime())) {
        return { texto: 'Aberto', classe: 'aberto' };
    }

    // A comparação final: o status é 'Encerrado' apenas se 'hoje' for estritamente maior que o 'prazo'
    if (hoje > prazo) {
        return { texto: 'Encerrado', classe: 'encerrado' };
    } else {
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
   const statusInfo = verificarStatus(concurso.prazo);  

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