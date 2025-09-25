import React from 'react';
import imagemLogin from '../../assets/marca-cnapne-barracao_vertical-1024x933.png';

export default function AuthCard({ children }: { children: React.ReactNode; }) {
  return (
    <div className="mx-auto w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden" style={{ minHeight: '500px' }}>

      {/* Coluna da Imagem*/}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-8">
        <img
          src={imagemLogin}
          alt="Logo do CNAPNE"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Coluna do Formulário */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-12 transition">


        {children}
      </div>
    </div>
  );
}