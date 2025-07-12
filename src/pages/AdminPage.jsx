
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();
    
    const [concursos, setConcursos] = useState([]); 
    
    const [loading, setLoading] = useState(true); 
    
    const [editingId, setEditingId] = useState(null); 
    
    const [formData, setFormData] = useState({
        instituicao: '', vagas: '', escolaridade: '', ambito: 'Municipal',
        salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
    });
    
    const token = localStorage.getItem('authToken');
    
    useEffect(() => {
        fetchConcursos();
    }, []);

    const fetchConcursos = async () => {
        try {
            const response = await fetch('${import.meta.env.VITE_API_URL}/api/concursos');
            const data = await response.json();
            setConcursos(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar concursos:", error);
            setLoading(false);
        }
    };
       
    const handleInputChange = (e) => {
    const { id, value } = e.target;

    
    const novosDados = { ...formData, [id]: value };

    
    if (id === 'ambito' && value === 'Nacional') {
        
        novosDados.estado = '';
    }
    
    setFormData(novosDados);
};    
    
    const resetarFormulario = () => {
        setEditingId(null);
        setFormData({
            instituicao: '', vagas: '', escolaridade: [], ambito: 'Municipal',
            salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
        });
    };
    
    const handlePreencherFormulario = (concurso) => {
        setEditingId(concurso._id);
        setFormData({
            instituicao: concurso.instituicao, vagas: concurso.vagas, 
            escolaridade: concurso.escolaridade || [], ambito: concurso.ambito,
            salario: concurso.salario, prazo: concurso.prazo,
            estado: concurso.estado || '', resumo: concurso.resumo, 
            linkEdital: concurso.linkEdital,  cargos: ''
        });
        window.scrollTo(0, 0); 
    };    

const handleSalvar = async (event) => {
    event.preventDefault();
    const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/concursos/${editingId}`
        : '${import.meta.env.VITE_API_URL}/api/concursos';
    const method = editingId ? 'PUT' : 'POST';
    
    const dadosParaEnviar = { ...formData };
    if (dadosParaEnviar.prazo && dadosParaEnviar.prazo.includes('/')) {
        const partes = dadosParaEnviar.prazo.split('/');
        dadosParaEnviar.prazo = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }    

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
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
    const handleEscolaridadeChange = (e) => {
    const { value, checked } = e.target;
    const currentEscolaridade = formData.escolaridade || [];

    let newEscolaridade;
    if (checked) {
        
        newEscolaridade = [...currentEscolaridade, value];
    } else {
        
        newEscolaridade = currentEscolaridade.filter(item => item !== value);
    }
    
    setFormData(prevData => ({ ...prevData, escolaridade: newEscolaridade }));
};
    
    return (
        <div>
            <button onClick={handleLogout} className="btn-logout" style={{ float: 'right' }}>
                Sair <i className="fas fa-sign-out-alt"></i>
            </button>      
            <section className="form-section">
                <h1 id="form-title">{editingId ? 'Editando Concurso' : 'Cadastrar Novo Concurso'}</h1>
                <form onSubmit={handleSalvar}>
                    
                    <div className="form-group">
                        <label htmlFor="instituicao">Instituição</label>
                        <input type="text" id="instituicao" value={formData.instituicao} onChange={handleInputChange} required />
                    </div>
                    
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
                               disabled={formData.ambito === 'Nacional'} 
                               required={formData.ambito !== 'Nacional'} 
                        />
                    </div>                    
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
                            rows="5" 
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


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();
    
    const [concursos, setConcursos] = useState([]); 
    
    const [loading, setLoading] = useState(true); 
    
    const [editingId, setEditingId] = useState(null); 
    
    const [formData, setFormData] = useState({
        instituicao: '', vagas: '', escolaridade: '', ambito: 'Municipal',
        salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
    });
    
    const token = localStorage.getItem('authToken');
    
    useEffect(() => {
        fetchConcursos();
    }, []);

    const fetchConcursos = async () => {
        try {
            const response = await fetch('${import.meta.env.VITE_API_URL}/api/concursos');
            const data = await response.json();
            setConcursos(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar concursos:", error);
            setLoading(false);
        }
    };
       
    const handleInputChange = (e) => {
    const { id, value } = e.target;

    
    const novosDados = { ...formData, [id]: value };

    
    if (id === 'ambito' && value === 'Nacional') {
        
        novosDados.estado = '';
    }
    
    setFormData(novosDados);
};    
    
    const resetarFormulario = () => {
        setEditingId(null);
        setFormData({
            instituicao: '', vagas: '', escolaridade: [], ambito: 'Municipal',
            salario: '', prazo: '', estado: '', resumo: '', linkEdital: '',  cargos: ''
        });
    };
    
    const handlePreencherFormulario = (concurso) => {
        setEditingId(concurso._id);
        setFormData({
            instituicao: concurso.instituicao, vagas: concurso.vagas, 
            escolaridade: concurso.escolaridade || [], ambito: concurso.ambito,
            salario: concurso.salario, prazo: concurso.prazo,
            estado: concurso.estado || '', resumo: concurso.resumo, 
            linkEdital: concurso.linkEdital,  cargos: ''
        });
        window.scrollTo(0, 0); 
    };    

const handleSalvar = async (event) => {
    event.preventDefault();
    const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/concursos/${editingId}`
        : '${import.meta.env.VITE_API_URL}/api/concursos';
    const method = editingId ? 'PUT' : 'POST';
    
    const dadosParaEnviar = { ...formData };
    if (dadosParaEnviar.prazo && dadosParaEnviar.prazo.includes('/')) {
        const partes = dadosParaEnviar.prazo.split('/');
        dadosParaEnviar.prazo = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }    

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            
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
    const handleEscolaridadeChange = (e) => {
    const { value, checked } = e.target;
    const currentEscolaridade = formData.escolaridade || [];

    let newEscolaridade;
    if (checked) {
        
        newEscolaridade = [...currentEscolaridade, value];
    } else {
        
        newEscolaridade = currentEscolaridade.filter(item => item !== value);
    }
    
    setFormData(prevData => ({ ...prevData, escolaridade: newEscolaridade }));
};
    
    return (
        <div>
            <button onClick={handleLogout} className="btn-logout" style={{ float: 'right' }}>
                Sair <i className="fas fa-sign-out-alt"></i>
            </button>      
            <section className="form-section">
                <h1 id="form-title">{editingId ? 'Editando Concurso' : 'Cadastrar Novo Concurso'}</h1>
                <form onSubmit={handleSalvar}>
                    
                    <div className="form-group">
                        <label htmlFor="instituicao">Instituição</label>
                        <input type="text" id="instituicao" value={formData.instituicao} onChange={handleInputChange} required />
                    </div>
                    
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
                               disabled={formData.ambito === 'Nacional'} 
                               required={formData.ambito !== 'Nacional'} 
                        />
                    </div>                    
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
                            rows="5" 
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