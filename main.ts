import express from "express";
import pgp from 'pg-promise';
import cors from 'cors'; 

const app = express();
const corsa = require('cors');
app.use(corsa()); // Permite todas as origens
app.use(express.json());

const hostbanco = '159.89.46.66'
const usuariobanco = 'postgres'
const senhabanco = 'dev@123'
const nomebanco = 'funcionarios'
const portabanco = 5432

const conexaobanco = pgp()({
    host: hostbanco,
    database: nomebanco,
    user: usuariobanco,
    password: senhabanco,
    port: portabanco
})

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/funcionarios', async (req, res) => {
    const itens = await conexaobanco.query('select * from funcionarios order by id');
    res.json(itens);
})

app.get('/usuarios', async (req, res) => {
    const itens = await conexaobanco.query('select * from usuarios order by id');
    res.json(itens);
})

// app.get('/funcionarios', async (req, res) => {
//     const itens = await conexaobanco.query('select * from funcionarios order by id');

//     const funcionaios = itens.map((item: any) => {
//         return {
//             id: item.id,
//             nome: item.nome,
//             status: item.status,
//             status_str: item.status == 1 ? 'Ativo' : 'Inativo'
//         }
//     })
//     res.json(funcionaios);
// })

app.post('/funcionarios', async (req, res) => {
    await conexaobanco.query('insert into funcionarios (nome, status, usuario_id) values($1,$2, $3)',
        [req.body.nome, req.body.status, req.body.usuario_id]
    );
    res.json({mesagem: 'salvou'});
})

app.put('/funcionarios/', async (req, res) => {
    await conexaobanco.query('update funcionarios set nome = $1, status = $2, usuario_id = $3 where id = $4',
        [req.body.nome, req.body.status, req.body.usuario_id, req.body.id]
    );
    res.json({mesagem: 'atualizou'});
})

app.put('/funcionarios/status/', async (req, res) => {
    await conexaobanco.query('update funcionarios set status = $1 where id = $2',
        [req.body.status, req.body.id]
    );
    res.json({mesagem: 'atualizou'});
})


// ADICIONADO
// excluir um funcionário com base no ID
app.delete('/funcionarios/:id', async (req, res) => {
    const { id } = req.params;  // Captura o ID da URL
    try {
        await conexaobanco.query('delete from funcionarios where id = $1', [id]);
        res.json({ mensagem: `Funcionário com ID ${id} excluído com sucesso!` });
    } catch (error) {
        console.error('Erro ao excluir o funcionário:', error);
        res.status(500).json({ mensagem: 'Erro ao excluir o funcionário.' });
    }
});

// ADICIONADO
// retorna os dados do funcionário conforme o ID na URL 
app.get('/funcionarios/:id', async (req, res) => {
    const { id } = req.params;  // Captura o ID da URL
    const funcionario = await conexaobanco.oneOrNone('select id, nome, status, usuario_id from funcionarios where id = $1', [id]);
    res.json(funcionario);
});


app.listen(4000, () => {
    console.log('iniciou')}
);