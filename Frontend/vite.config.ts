import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mcp-data': path.resolve(__dirname, '../MCP-server/data'),
    },
  },
})
