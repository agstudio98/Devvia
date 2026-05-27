require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log("--- Verificación de Archivo .env ---");
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const line = content.split('\n').find(l => l.startsWith('AI_STUDIO_API_KEY'));
  console.log("Línea en el archivo:", line);
  console.log("Valor cargado en process.env:", process.env.AI_STUDIO_API_KEY);
  console.log("Longitud cargada:", (process.env.AI_STUDIO_API_KEY || "").length);
} else {
  console.log("Archivo .env no encontrado en:", envPath);
}
