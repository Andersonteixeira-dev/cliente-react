import React, { useState, useEffect } from 'react';
import NoticiaCard from './NoticiaCard'; 

function UltimasNoticias() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        // Busca todas as notícias e pega apenas as 3 mais recentes
        fetch(`${import.meta.env.VITE_API_URL}/api/noticias`)
            .then(res => res.json())
            .then(data => setPosts(data.slice(0, 3)))
            .catch(err => console.error("Erro ao buscar últimas notícias:", err));
    }, []);

    if (posts.length === 0) return null; // Não mostra nada se não houver notícias

    return (
        <section className="ultimas-noticias-section">
            <h2 className="section-title">Últimas Notícias</h2>
            <div className="noticias-grid">
                {posts.map(post => <NoticiaCard key={post._id} post={post} />)}
            </div>
        </section>
    );
}
export default UltimasNoticias;