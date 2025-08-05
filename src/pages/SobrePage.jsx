import React from 'react';
import { Title, Meta } from 'react-head';

function SobrePage() {
    return (
        <>
            <Title>Sobre Nós | eConcursou</Title>
            <Meta name="description" content="Saiba mais sobre a missão e a visão do eConcursou, o seu portal de concursos públicos." />

            <div className="static-page-card">
                <h1>Sobre o eConcursou</h1>
                <p>
                    Bem-vindo ao eConcursou! Nossa missão é simplificar e centralizar a busca por oportunidades no serviço público em todo o Brasil.
                </p>
                <p>
                    Acreditamos que o acesso fácil e organizado à informação é o primeiro passo para a aprovação. Navegue, encontre e prepare-se para o seu futuro.
                </p>
                <p>
                    Este projeto foi desenvolvido com dedicação para ajudar concurseiros de todos os níveis a encontrarem a vaga dos seus sonhos.
                </p>
                <p>
                    Boa sorte!
                </p>
            </div>
        </>
    );
}

export default SobrePage;