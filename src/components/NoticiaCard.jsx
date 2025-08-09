import React from 'react';
import { Link } from 'react-router-dom';

function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function NoticiaCard({ post }) {
    return (
        <Link to={`/noticias/${post.slug}`} className="card-link-wrapper">
            <article className="noticia-card">
                {post.imagemCapa && <img src={post.imagemCapa} alt={post.titulo} className="noticia-imagem-capa" />}
                <div className="noticia-conteudo">
                    <span className="noticia-data">{formatarData(post.dataPublicacao)}</span>
                    <h2>{post.titulo}</h2>
                    <p>{post.resumo}</p>
                    {/* O botão foi removido, a ação é o clique no card */}
                </div>
            </article>
        </Link>
    );
}

export default NoticiaCard;