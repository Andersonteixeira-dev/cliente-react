// Arquivo: src/pages/AdminPage.jsx (Versão Completa)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();

    // --- ESTADOS DO COMPONENTE ---
    // Guarda a lista de concursos vinda da API
    const [concursos, setConcursos] = useState([]); 
    // Controla a exibição da mensagem de "Carregando..."
    const [loading, setLoading] = useState(true); 
    // Guarda o ID do concurso que está sendo editado (ou null se for um novo)
    const [editingId, setEditingId] = useState(null); 
    // Guarda os dados de todos os campos do formulário em um único objeto
    const [formData, setFormData] = useState({
        instituicao: '', vagas: '', escolaridade: '', ambito: 'Municipal',
        salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
    });

    // Pega o token de autenticação do localStorage
    const token = localStorage.getItem('authToken');

    // --- FUNÇÕES DE API ---

    // Busca todos os concursos na API quando o componente é carregado
    useEffect(() => {
        fetchConcursos();
    }, []);

    const fetchConcursos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/concursos');
            const data = await response.json();
            setConcursos(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar concursos:", error);
            setLoading(false);
        }
    };

    // --- FUNÇÕES DE MANIPULAÇÃO DO FORMULÁRIO ---

    // Atualiza o estado 'formData' sempre que um campo do formulário muda
    const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Cria uma cópia dos dados do formulário
    const novosDados = { ...formData, [id]: value };

    // Se o campo alterado foi o 'ambito' e o novo valor é 'Nacional'...
    if (id === 'ambito' && value === 'Nacional') {
        // ...limpa o campo de estado.
        novosDados.estado = '';
    }

    // Atualiza o estado com os novos dados
    setFormData(novosDados);
};
    
    // Limpa o formulário e volta para o modo "Adicionar"
    const resetarFormulario = () => {
        setEditingId(null);
        setFormData({
            instituicao: '', vagas: '', escolaridade: [], ambito: 'Municipal',
            salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
        });
    };

    // Preenche o formulário com os dados de um concurso para edição
    const handlePreencherFormulario = (concurso) => {
        setEditingId(concurso._id);
        setFormData({
            instituicao: concurso.instituicao, vagas: concurso.vagas, 
            escolaridade: concurso.escolaridade || [], ambito: concurso.ambito,
            salario: concurso.salario, prazo: concurso.prazo,
            estado: concurso.estado || '', resumo: concurso.resumo, 
            linkEdital: concurso.linkEdital,  cargos: ''
        });
        window.scrollTo(0, 0); // Rola a página para o topo
    };

    // Lida com a submissão do formulário (Criação ou Edição)
    // Em src/pages/AdminPage.jsx

const handleSalvar = async (event) => {
    event.preventDefault();
    const url = editingId 
        ? `http://localhost:3000/api/concursos/${editingId}`
        : 'http://localhost:3000/api/concursos';
    const method = editingId ? 'PUT' : 'POST';

    // --- CORREÇÃO IMPORTANTE AQUI ---
    // Garante que a data esteja no formato YYYY-MM-DD antes de enviar
    const dadosParaEnviar = { ...formData };
    if (dadosParaEnviar.prazo && dadosParaEnviar.prazo.includes('/')) {
        const partes = dadosParaEnviar.prazo.split('/');
        dadosParaEnviar.prazo = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    // --------------------------------

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // Envia os dados corrigidos
            body: JSON.stringify(dadosParaEnviar) 
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Falha ao salvar.');

        alert(result.message);
        resetarFormulario();
        fetchConcursos();

    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert(`Erro: ${error.message}`);
    }
};

    // Deleta um concurso
    const handleDeletar = async (id) => {
        if (confirm('Tem certeza que deseja deletar este concurso?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/concursos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Falha ao deletar.');
                alert(result.message);
                fetchConcursos(); // Atualiza a lista
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert(`Erro: ${error.message}`);
            }
        }
    };

    // --- FUNÇÃO DE LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };
    const handleEscolaridadeChange = (e) => {
    const { value, checked } = e.target;
    const currentEscolaridade = formData.escolaridade || [];

    let newEscolaridade;
    if (checked) {
        // Adiciona o nível ao array se não estiver lá
        newEscolaridade = [...currentEscolaridade, value];
    } else {
        // Remove o nível do array
        newEscolaridade = currentEscolaridade.filter(item => item !== value);
    }
    // Atualiza o estado
    setFormData(prevData => ({ ...prevData, escolaridade: newEscolaridade }));
};


    // --- RENDERIZAÇÃO DO COMPONENTE (O que aparece na tela) ---
    return (
        <div>
            <button onClick={handleLogout} className="btn-logout" style={{ float: 'right' }}>
                Sair <i className="fas fa-sign-out-alt"></i>
            </button>
            
            {/* Formulário */}
            <section className="form-section">
                <h1 id="form-title">{editingId ? 'Editando Concurso' : 'Cadastrar Novo Concurso'}</h1>
                <form onSubmit={handleSalvar}>
                    {/* Campos do formulário... Exemplo: */}
                    <div className="form-group">
                        <label htmlFor="instituicao">Instituição</label>
                        <input type="text" id="instituicao" value={formData.instituicao} onChange={handleInputChange} required />
                    </div>
                    {/* ... Adicione todos os outros campos do formulário aqui, seguindo o mesmo padrão ... */}
                    {/* Exemplo do campo de estado, que é condicional */}
                    <div className="form-group">
                        <label htmlFor="ambito">Âmbito do Concurso</label>
                        <select id="ambito" value={formData.ambito} onChange={handleInputChange} required>
                            <option value="Municipal">Municipal</option>
                            <option value="Estadual">Estadual</option>
                            <option value="Nacional">Nacional</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="estado">Sigla do Estado</label>
                        <input type="text" id="estado" value={formData.estado} onChange={handleInputChange} 
                               disabled={formData.ambito === 'Nacional'} // Desabilita se for Nacional
                               required={formData.ambito !== 'Nacional'} // Obrigatório se não for Nacional
                        />
                    </div>
                    {/* ... continue para todos os campos: vagas, escolaridade, salario, prazo, resumo, linkEdital ... */}
                    <div className="form-group">
                        <label htmlFor="vagas">Vagas</label>
                        <input type="text" id="vagas" value={formData.vagas} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Escolaridade</label>
                        <div className="checkbox-group">
                            {['Nível Fundamental', 'Nível Médio', 'Nível Superior'].map(nivel => (
                                <label key={nivel}>
                                    <input
                                        type="checkbox"
                                        value={nivel}
                                        checked={formData.escolaridade.includes(nivel)}
                                        onChange={handleEscolaridadeChange}
                                    />
                                    {nivel}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cargos">Cargos em Destaque</label>
                        <input 
                            type="text" 
                            id="cargos" 
                            value={formData.cargos} 
                            onChange={handleInputChange}
                            placeholder='Ex: "Analista, Técnico" ou "Vários Cargos"'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salario">Salario</label>
                        <input type="text" id="salario" value={formData.salario} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prazo">Prazo</label>
                        <input type="text" id="prazo" value={formData.prazo} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="resumo">Resumo do Concurso</label>
                        <textarea 
                            id="resumo" 
                            rows="5" /* Define a altura inicial */
                            value={formData.resumo} 
                            onChange={handleInputChange}
                            placeholder="Fale um pouco sobre o concurso, cargos, etc."
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="linkEdital">LinkEdital</label>
                        <input type="text" id="linkEdital" value={formData.linkEdital} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn-submit">{editingId ? 'Salvar Alterações' : 'Adicionar Concurso'}</button>
                    {editingId && <button type="button" onClick={resetarFormulario} className="btn-cancelar">Cancelar Edição</button>}
                </form>
            </section>

            {/* Lista de Gerenciamento */}
            <section className="gerenciamento-section">
                <h2>Gerenciar Concursos Cadastrados</h2>
                {loading ? <p>Carregando...</p> : (
                    <div id="lista-gerenciamento">
                        {concursos.map(concurso => (
                            <div key={concurso._id} className="item-admin">
                                <div className="item-info">
                                    <strong>{concurso.instituicao}</strong>
                                </div>
                                <div className="item-acoes">
                                    <button onClick={() => handlePreencherFormulario(concurso)} className="btn-editar">
                                        <i className="fas fa-edit"></i> Editar
                                    </button>
                                    <button onClick={() => handleDeletar(concurso._id)} className="btn-deletar-admin">
                                        <i className="fas fa-trash"></i> Deletar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default AdminPage;