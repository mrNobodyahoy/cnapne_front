// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Importe o módulo 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 2. Adicione a configuração 'resolve.alias'
  resolve: {
    alias: {
      // Esta linha força o Vite a usar sempre a mesma cópia do React,
      // resolvendo conflitos de versão em tempo de desenvolvimento.
      'react': path.resolve(__dirname, './node_modules/react'),
    }
  }
})