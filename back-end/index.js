import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import fountainRoutes from './routes/fountain.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1407;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());  // ✅ Important for JSON request handling
app.use(express.urlencoded({ extended: true })); // ✅ Ensures nested data parsing


// Resolve __dirname for ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Serve React Build Files (Frontend)
const reactBuildPath = path.join(__dirname, '../front-end/dist');

if (!fs.existsSync(reactBuildPath)) {
  console.error(`❌ React build folder not found at: ${reactBuildPath}`);
  process.exit(1); // Stop server if build is missing
}

app.use(express.static(reactBuildPath));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Exit the server if the database fails to connect
  });

// ✅ API Routes
app.use('/api', fountainRoutes);

// ✅ Catch-All Route for React Router
app.get('*', (req, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React build not found. Please run `npm run build` in the frontend.');
  }
});

// ✅ Start Server
app.listen(PORT, HOST, () =>
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
);
