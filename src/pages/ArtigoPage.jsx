import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Meta } from 'react-head';

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function ArtigoPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/noticias/slug/${slug}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar notícia:", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <p>Carregando matéria...</p>;
    if (!post) return <h1>Notícia não encontrada.</h1>;

        return (
        <>
            <Title>{`${post.titulo} | eConcursou`}</Title>
            <Meta name="description" content={post.resumo} />
            
            <div className="container">                
                <div className="static-page-card">
                    <article className="artigo-completo">
                        {post.imagemCapa && <img src={post.imagemCapa} alt={post.titulo} className="artigo-imagem-capa" />}
                        <h1>{post.titulo}</h1>
                        <span className="artigo-data">Publicado em: {formatarData(post.dataPublicacao)}</span>
                        <div 
                            className="artigo-conteudo"
                            dangerouslySetInnerHTML={{ __html: post.conteudo }}
                        />
                        <Link to="/noticias" className="btn-voltar" style={{ marginTop: '30px' }}>
                            &larr; Voltar para Notícias
                        </Link>
                    </article>
                </div>
            </div>
        </>
    );
}

export default ArtigoPage;