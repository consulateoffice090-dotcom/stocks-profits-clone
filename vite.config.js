import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'index.html'),
        login:         resolve(__dirname, 'pages/login.html'),
        register:      resolve(__dirname, 'pages/register.html'),
        about:         resolve(__dirname, 'pages/about.html'),
        automate:      resolve(__dirname, 'pages/automate.html'),
        contacts:      resolve(__dirname, 'pages/contacts.html'),
        copy:          resolve(__dirname, 'pages/copy.html'),
        cryptocurrencies: resolve(__dirname, 'pages/cryptocurrencies.html'),
        etfs:          resolve(__dirname, 'pages/etfs.html'),
        faq:           resolve(__dirname, 'pages/faq.html'),
        'for-traders': resolve(__dirname, 'pages/for-traders.html'),
        forex:         resolve(__dirname, 'pages/forex.html'),
        indices:       resolve(__dirname, 'pages/indices.html'),
        regulation:    resolve(__dirname, 'pages/regulation.html'),
        shares:        resolve(__dirname, 'pages/shares.html'),
        trade:         resolve(__dirname, 'pages/trade.html'),
        'why-us':      resolve(__dirname, 'pages/why-us.html'),
        dashboard:     resolve(__dirname, 'pages/dashboard.html'),
        deposit:       resolve(__dirname, 'pages/deposit.html'),
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
