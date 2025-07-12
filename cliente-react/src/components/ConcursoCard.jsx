// Arquivo: src/components/ConcursoCard.jsx (Versão Final)

import React from 'react';
import { Link } from 'react-router-dom'; // Importa o componente de Link

// Funções auxiliares para formatar os dados
// A NOVA E ROBUSTA FUNÇÃO verificarStatus

// No arquivo src/components/ConcursoCard.jsx

function verificarStatus(dataPrazo) {
    if (!dataPrazo)   return { texto: 'Previsto', classe: 'previsto' };

    let dataISO = dataPrazo;
    // Se a data vier no formato brasileiro, converte para o formato ISO
    if (dataPrazo.includes('/')) {
        const partes = dataPrazo.split('/');
        dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(dataISO + 'T00:00:00');
    
    if (isNaN(prazo.getTime())) return { texto: 'Inválida', classe: 'encerrado' };

    return hoje > prazo 
        ? { texto: 'Encerrado', classe: 'encerrado' }
        : { texto: 'Aberto', classe: 'aberto' };
}

// A NOVA FUNÇÃO formatarData (BILÍNGUE)

function formatarData(dataString) {
    if (!dataString) return 'Data não definida';

    let data;

    // Verifica se a data está no formato brasileiro (contém "/")
    if (dataString.includes('/')) {
        // Quebra a data em partes [DD, MM, YYYY]
        const partes = dataString.split('/');
        // Remonta na ordem que o JavaScript entende: YYYY-MM-DD
        const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
        data = new Date(dataISO + 'T00:00:00');
    } else {
        // Se não tem "/", assume que já está no formato correto (YYYY-MM-DD)
        data = new Date(dataString + 'T00:00:00');
    }

    // Se, mesmo após a tentativa, a data for inválida, retorna um aviso
    if (isNaN(data.getTime())) {
        return 'Formato de data irreconhecível';
    }

    // Extrai e formata o dia, mês e ano
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é base 0, então +1
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

function ConcursoCard({ concurso }) {
    console.log('Dados recebidos pelo card:', concurso);
    const statusInfo = verificarStatus(concurso.prazo);
   

    return (
        <article className="concurso-card">
            <div className="card-header">
                <h4>{concurso.instituicao}</h4>
                <span className={`status ${statusInfo.classe}`}>{statusInfo.texto}</span>
            </div>
            <div className="card-body">
                <div className="info-item">
                    <i className="fas fa-briefcase"></i>
                    <strong>Vagas:</strong> {concurso.vagas}
                </div>
                <div className="info-item">
                    <i className="fas fa-graduation-cap"></i>
                    <strong>Escolaridade:</strong> {concurso.escolaridade.join(' / ')}
                </div>
                    {concurso.cargos && (
                        <div className="info-item">
                            <i className="fas fa-user-tie"></i>
                            <strong>Cargos:</strong> {concurso.cargos}
                        </div>
                    )}
                <div className="info-item">
                    <i className="fas fa-dollar-sign"></i>
                    <strong>Salário:</strong> {concurso.salario}
                </div>
                {concurso.prazo && (
                    <div className="info-item prazo-final">
                        <i className="fas fa-calendar-days"></i>
                        <strong>Inscrições até:</strong> {formatarData(concurso.prazo)}
                    </div>
                )}

                {/* ... */}
                <div className="card-footer">
                    {/* SÓ MOSTRA O BOTÃO SE O CAMPO 'linkEdital' EXISTIR */}
                    {concurso.linkEdital ? (
                        <Link to={`/concursos/${concurso._id}`} className="btn-detalhes">
                            Ver Detalhes e Edital
                        </Link>
                    ) : (
                        <span className="sem-edital">Edital não disponível</span>
                    )}
                </div>
                
            </div>
            
        </article>
    );
}

export default ConcursoCard;