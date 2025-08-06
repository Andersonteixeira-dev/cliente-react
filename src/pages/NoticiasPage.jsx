import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Title, Meta } from 'react-head';

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function NoticiasPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/noticias`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar notícias:", err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Title>Notícias sobre Concursos Públicos | eConcursou</Title>
            <Meta name="description" content="Acompanhe as últimas notícias, dicas e análises sobre o mundo dos concursos públicos no Brasil." />

            <div className="lista-noticias">
                <h1>Últimas Notícias</h1>
                {loading ? <p>Carregando notícias...</p> : (
                    posts.map(post => (
                        <article key={post._id} className="noticia-card">
                            {post.imagemCapa && <img src={post.imagemCapa} alt={post.titulo} className="noticia-imagem-capa" />}
                            <div className="noticia-conteudo">
                                <span className="noticia-data">{formatarData(post.dataPublicacao)}</span>
                                <h2>{post.titulo}</h2>
                                <p>{post.resumo}</p>
                                <Link to={`/noticias/${post.slug}`} className="btn-ler-mais">Ler Matéria Completa</Link>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </>
    );
}

export default NoticiasPage;