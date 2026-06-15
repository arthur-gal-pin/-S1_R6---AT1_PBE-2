import express from 'express';
import router from './routes/routes';
import 'dotenv/config';
import cors from 'cors';
import { initializeDatabase } from './configs/Database';

const app = express();
const PORT = process.env.PORT;

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());
app.use('/', router);

initializeDatabase().then(()=>{
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    })
}).catch(err => {
    console.error("Erro ao incializar o banco de dados:", err);
})