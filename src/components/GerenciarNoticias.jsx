import React, { useState, useEffect, useCallback } from 'react';
import { Title, Meta } from 'react-head';
import { Editor } from '@tinymce/tinymce-react';

function GerenciarNoticias() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '', resumo: '', conteudo: '', imagemCapa: ''
    });
    const token = localStorage.getItem('authToken');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/noticias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar notícias');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    // Função específica para o editor de texto rico
    const handleConteudoChange = (content, editor) => {
        setFormData(prev => ({ ...prev, conteudo: content }));
    };

    const resetarFormulario = () => {
        setEditingId(null);
        setFormData({ titulo: '', resumo: '', conteudo: '', imagemCapa: '' });
    };

    const handlePreencherFormulario = (post) => {
        setEditingId(post._id);
        setFormData({
            titulo: post.titulo || '',
            resumo: post.resumo || '',
            conteudo: post.conteudo || '',
            imagemCapa: post.imagemCapa || ''
        });
        window.scrollTo(0, 0);
    };

    const handleSalvar = async (event) => {
        event.preventDefault();
        const url = editingId 
            ? `${import.meta.env.VITE_API_URL}/api/noticias/${editingId}`
            : `${import.meta.env.VITE_API_URL}/api/noticias`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Falha ao salvar notícia.');
            alert(result.message);
            resetarFormulario();
            fetchPosts();
        } catch (error) {
            console.error("Erro ao salvar notícia:", error);
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDeletar = async (id) => {
        if (confirm('Tem certeza que deseja deletar esta notícia?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/noticias/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Falha ao deletar.');
                alert(result.message);
                fetchPosts();
            } catch (error) {
                console.error("Erro ao deletar notícia:", error);
                alert(`Erro: ${error.message}`);
            }
        }
    };

    return (
        <>
                    <Title>Painel Gerenciar Noticias | eConcursou</Title>
                    <Meta name="robots" content="noindex, nofollow" />
        <div>
            <section className="form-section">
                <h2>{editingId ? 'Editando Notícia' : 'Cadastrar Nova Notícia'}</h2>
                <form onSubmit={handleSalvar}>
                    <div className="form-group">
                        <label htmlFor="titulo">Título</label>
                        <input type="text" id="titulo" value={formData.titulo} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="resumo">Resumo (chamada para a home do blog)</label>
                        <input type="text" id="resumo" value={formData.resumo} onChange={handleInputChange} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="imagemCapa">URL da Imagem de Capa (Opcional)</label>
                        <input type="url" id="imagemCapa" value={formData.imagemCapa} onChange={handleInputChange} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="conteudo">Conteúdo Completo da Notícia</label>
                        <Editor
                            apiKey='018onnjsbjpa6892oyi8vpl22f4ku8skjkyywco43ims47ap' 
                            value={formData.conteudo}
                            onEditorChange={handleConteudoChange}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: [ 'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount' ],
                                toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help',
                                forced_root_block: 'p',
                            }}
                        />
                    </div>
                    <button type="submit" className="btn-submit">{editingId ? 'Salvar Alterações' : 'Publicar Notícia'}</button>
                    {editingId && <button type="button" onClick={resetarFormulario} className="btn-cancelar">Cancelar Edição</button>}
                </form>
            </section>

            <section className="gerenciamento-section">
                <h2>Gerenciar Notícias Publicadas</h2>
                {loading ? <p>Carregando...</p> : (
                    <div>
                        {posts.map(post => (
                            <div key={post._id} className="item-admin">
                                <div className="item-info"><strong>{post.titulo}</strong></div>
                                <div className="item-acoes">
                                    <button onClick={() => handlePreencherFormulario(post)} className="btn-editar"><i className="fas fa-edit"></i> Editar</button>
                                    <button onClick={() => handleDeletar(post._id)} className="btn-deletar-admin"><i className="fas fa-trash"></i> Deletar</button>
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

export default GerenciarNoticias;