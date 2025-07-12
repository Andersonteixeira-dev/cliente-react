// Arquivo: src/pages/DetalhesPage.jsx (NOVO ARQUIVO)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Funções auxiliares (copiadas para cá para manter o componente independente)
// A NOVA E ROBUSTA FUNÇÃO verificarStatus

// Em src/components/ConcursoCard.jsx e src/pages/DetalhesPage.jsx

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
function DetalhesPage() {
    const { id } = useParams(); // Pega o 'id' da URL (ex: /concursos/123)
    const [concurso, setConcurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3000/api/concursos/${id}`)
            .then(res => res.json())
            .then(data => {
                setConcurso(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes:", err);
                setLoading(false);
            });
    }, [id]); // Executa sempre que o 'id' na URL mudar

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
    
    const statusInfo = verificarStatus(concurso.prazo);

    return (
        <div className="concurso-detalhe-card">
            <div className="card-header">
                <h4>{concurso.instituicao}</h4>
                <span className={`status ${statusInfo.classe}`}>{statusInfo.texto}</span>
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
                <h3>Resumo do Edital</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{concurso.resumo || 'Nenhum resumo disponível.'}</p>
            </div>
            <div className="card-footer-detalhe">
                <a href={concurso.linkEdital || '#'} className="btn-detalhes-principal" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-file-pdf"></i> Ver Edital Completo (PDF)
                </a>
            </div>
        </div>
    );
}

export default DetalhesPage;