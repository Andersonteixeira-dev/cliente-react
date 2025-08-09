import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SidebarNoticias() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/noticias`)
            .then(res => res.json())
            .then(data => setPosts(data.slice(0, 3)))
            .catch(err => console.error("Erro:", err));
    }, []);

    if (posts.length === 0) return null;

    return (
        <div className="sidebar-noticias">
            <h2>Últimas Notícias</h2>
            {posts.map(post => (
                <Link to={`/noticias/${post.slug}`} key={post._id} className="card-link-wrapper">
                    <article className="noticia-card-sidebar">
                        {post.imagemCapa && <img src={post.imagemCapa} alt={post.titulo} className="noticia-imagem-capa" />}
                        <div className="noticia-conteudo">
                            <span className="noticia-data">{/*...formatarData...*/(post.dataPublicacao)}</span>
                            <h3>{post.titulo}</h3>
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    );
}
export default SidebarNoticias;