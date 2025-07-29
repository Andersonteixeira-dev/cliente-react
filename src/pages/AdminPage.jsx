import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Meta } from 'react-head';

function formatarData(dataString) {
    if (!dataString || !dataString.includes('-')) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

const initialState = {
    instituicao: '', vagas: '', escolaridade: [], ambito: 'Municipal',
    salario: '', dataInicioInscricao: '', dataFimInscricao: '', textoInscricao: '', 
    estado: '', resumo: '', cargos: '', links: []
};

function AdminPage() {
    const navigate = useNavigate();
    const [concursos, setConcursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [novoLinkNome, setNovoLinkNome] = useState('');
    const [novoLinkUrl, setNovoLinkUrl] = useState('');
    const [textoEditadoManualmente, setTextoEditadoManualmente] = useState(false);
    const token = localStorage.getItem('authToken');

    const fetchConcursos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/concursos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar dados');
            const data = await response.json();
            setConcursos(data);
        } catch (error) {
            console.error("Erro ao buscar concursos:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchConcursos();
    }, [fetchConcursos]);

     useEffect(() => {
        if (textoEditadoManualmente) return;
        const inicio = formatarData(formData.dataInicioInscricao);
        const fim = formatarData(formData.dataFimInscricao);
        let textoGerado = '';
        if (inicio && fim) textoGerado = `De ${inicio} a ${fim}`;
        else if (fim) textoGerado = `Até ${fim}`;
        else if (inicio) textoGerado = `A partir de ${inicio}`;
        setFormData(prev => ({ ...prev, textoInscricao: textoGerado }));
    }, [formData.dataInicioInscricao, formData.dataFimInscricao, textoEditadoManualmente]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'textoInscricao') setTextoEditadoManualmente(true);
        const novosDados = { ...formData, [id]: value };
        if (id === 'ambito' && value === 'Nacional') novosDados.estado = '';
        if (id === 'dataInicioInscricao' || id === 'dataFimInscricao') setTextoEditadoManualmente(false);
        setFormData(novosDados);
    };

    const handleEscolaridadeChange = (e) => {
        const { value, checked } = e.target;
        const escolaridadeAtual = formData.escolaridade || [];
        const novaEscolaridade = checked
            ? [...escolaridadeAtual, value]
            : escolaridadeAtual.filter(item => item !== value);
        setFormData(prev => ({ ...prev, escolaridade: novaEscolaridade }));
    };

    const resetarFormulario = () => {
        setEditingId(null);
        setFormData(initialState);
        setTextoEditadoManualmente(false);
    };
    
    const handlePreencherFormulario = (concurso) => {
        setEditingId(concurso._id);
        setFormData({
            instituicao: concurso.instituicao || '', vagas: concurso.vagas || '', 
            escolaridade: concurso.escolaridade || [], ambito: concurso.ambito || 'Municipal',
            salario: concurso.salario || '', 
            dataInicioInscricao: concurso.dataInicioInscricao ? concurso.dataInicioInscricao.substring(0, 10) : '',
            dataFimInscricao: concurso.dataFimInscricao ? concurso.dataFimInscricao.substring(0, 10) : '',
            estado: concurso.estado || '', resumo: concurso.resumo || '', 
            cargos: concurso.cargos || '', links: concurso.links || [],
            textoInscricao: concurso.textoInscricao || ''
        });
        setTextoEditadoManualmente(true);
        window.scrollTo(0, 0);
    };

    const handleAdicionarLink = () => {
        if (!novoLinkNome || !novoLinkUrl) return alert('Preencha o nome e a URL do link.');
        const novoLink = { nome: novoLinkNome, url: novoLinkUrl };
        setFormData(prev => ({ ...prev, links: [...(prev.links || []), novoLink] }));
        setNovoLinkNome('');
        setNovoLinkUrl('');
    };

    const handleRemoverLink = (index) => {
        setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
    };

    const handleSalvar = async (event) => {
        event.preventDefault();         
        const url = editingId ? `${import.meta.env.VITE_API_URL}/api/concursos/${editingId}` : `${import.meta.env.VITE_API_URL}/api/concursos`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                ...formData,
                dataInicioInscricao: formData.dataInicioInscricao,
                dataFimInscricao: formData.dataFimInscricao
            })
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

    const handleDeletar = async (id) => {
        if (confirm('Tem certeza que deseja deletar este concurso?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/concursos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Falha ao deletar.');
                alert(result.message);
                fetchConcursos();
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert(`Erro: ${error.message}`);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            <Title>Painel de Administração | eConcursou</Title>
            <Meta name="robots" content="noindex, nofollow" />
            <div>
                <button onClick={handleLogout} className="btn-logout" style={{ float: 'right' }}>Sair <i className="fas fa-sign-out-alt"></i></button>
                <section className="form-section">
                    <h1>{editingId ? 'Editando Concurso' : 'Cadastrar Novo Concurso'}</h1>
                    <form onSubmit={handleSalvar}>
                        <div className="form-group"><label htmlFor="instituicao">Instituição</label><input type="text" id="instituicao" value={formData.instituicao} onChange={handleInputChange} required /></div>
                        <div className="form-group"><label htmlFor="vagas">Vagas</label><input type="text" id="vagas" value={formData.vagas} onChange={handleInputChange} /></div>
                        <div className="form-group"><label>Escolaridade</label><div className="checkbox-group">{['Nível Fundamental', 'Nível Médio', 'Nível Técnico', 'Nível Superior'].map(nivel => (<label key={nivel}><input type="checkbox" value={nivel} checked={(formData.escolaridade || []).includes(nivel)} onChange={handleEscolaridadeChange} /> {nivel}</label>))}</div></div>
                        <div className="form-group"><label htmlFor="cargos">Cargos em Destaque</label><input type="text" id="cargos" value={formData.cargos} onChange={handleInputChange} placeholder='Ex: "Analista, Técnico" ou "Vários Cargos"' /></div>
                        <div className="form-group"><label htmlFor="ambito">Âmbito do Concurso</label><select id="ambito" value={formData.ambito} onChange={handleInputChange} required><option value="Municipal">Municipal</option><option value="Estadual">Estadual</option><option value="Nacional">Nacional</option></select></div>
                        <div className="form-group"><label htmlFor="estado">Sigla do Estado</label><input type="text" id="estado" value={formData.estado} onChange={handleInputChange} disabled={formData.ambito === 'Nacional'} required={formData.ambito !== 'Nacional'} maxLength="2" /></div>
                        <div className="form-group"><label htmlFor="salario">Salário</label><input type="text" id="salario" value={formData.salario} onChange={handleInputChange} /></div>
                        <div className="form-group"><label htmlFor="dataInicioInscricao">Data Início Inscrição</label><input type="date" id="dataInicioInscricao" value={formData.dataInicioInscricao} onChange={handleInputChange} /></div>
                        <div className="form-group"><label htmlFor="dataFimInscricao">Data Fim Inscrição</label><input type="date" id="dataFimInscricao" value={formData.dataFimInscricao} onChange={handleInputChange} /></div>
                        <div className="form-group">
                            <label htmlFor="textoInscricao">Texto de Inscrição (visível no card)</label>
                            <input
                                type="text"
                                id="textoInscricao"
                                value={formData.textoInscricao || ''}
                                onChange={handleInputChange}
                                placeholder="Ex: Inscrições até 30/09/2025"
                            />
                        </div>
                        <div className="form-group"><label htmlFor="resumo">Resumo do Concurso</label><textarea id="resumo" rows="5" value={formData.resumo} onChange={handleInputChange}></textarea></div>
                        <div className="form-group"><label>Links (Edital, Anexos, etc.)</label><div className="lista-links-admin">{(formData.links || []).map((link, index) => (<div key={index} className="item-link-admin"><span>{link.nome} ({link.url})</span><button type="button" onClick={() => handleRemoverLink(index)}>&times;</button></div>))}</div><div className="add-link-form"><input type="text" placeholder="Nome do Link" value={novoLinkNome} onChange={(e) => setNovoLinkNome(e.target.value)} /><input type="url" placeholder="URL do Link" value={novoLinkUrl} onChange={(e) => setNovoLinkUrl(e.target.value)} /><button type="button" onClick={handleAdicionarLink} className="btn-add-link">Adicionar Link</button></div></div>
                        <button type="submit" className="btn-submit">{editingId ? 'Salvar Alterações' : 'Adicionar Concurso'}</button>
                        {editingId && <button type="button" onClick={resetarFormulario} className="btn-cancelar">Cancelar Edição</button>}
                    </form>
                </section>
                <section className="gerenciamento-section">
                    <h2>Gerenciar Concursos Cadastrados</h2>
                    {loading ? <p>Carregando...</p> : (
                        <div id="lista-gerenciamento">
                            {concursos.map(concurso => (
                                <div key={concurso._id} className="item-admin">
                                    <div className="item-info"><strong>{concurso.instituicao}</strong></div>
                                    <div className="item-acoes">
                                        <button onClick={() => handlePreencherFormulario(concurso)} className="btn-editar"><i className="fas fa-edit"></i> Editar</button>
                                        <button onClick={() => handleDeletar(concurso._id)} className="btn-deletar-admin"><i className="fas fa-trash"></i> Deletar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default AdminPage;
