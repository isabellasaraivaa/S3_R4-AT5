const { isUtf8 } = require("buffer");
const express = require(`express`);
const fs = require (`fs`);
const app = express();
const PORT = 3000;
const LIVROS_FILE = `./livros.json`;

app.use(express.json());

//FUNÇÂO PARA LER OS LIVROS DO ARQUIVO JSON
function lerLivros() {
   try {
   const dados = fs.readFileSync(LIVROS_FILE, `isUtf8`);
    return JSON.parse(dados);
   }
   catch (erro) {
    return[];
  }
}
 
//FUNÇÂO PARA SALVAR LIVROS NO ARQUIVO JSON
function salvarLivros(livros) {
    fs.writeFileSync(LIVROS_FILE, JSON.stringify(livros, null, 2));

}
//ROTA POST cadastrar novo livro
app.post(`/livros`, (req, res) => {
    const { titulo, autor, ano, quantidade } = req.body;

    if (!titulo || !autor || !ano || !quantidade) {
        return res.status(400).json({ erro: `Todos os campos são obrigatórios.`});

    }
const livros = lerLivros();

//verfica se o livro ja existe
const livroExistente = livros.find(livro => titulo.toLowerCase() ===
titulo.toLowerCase());
  if (livroExistente) {
    return res.status(409).json({ erro: `Livro já cadastrado.`});

  }
  const novoLivro = {titulo, autor, ano, quantidade };
  livros.push(novoLivro);
  salvarLivros(livros);

  res.status(201).json({ message: `Livro cadastrado com sucesso.`, livro:
    novoLivro});

});

//ROTA GET listar todos os livros
app.get(`/livros`, (req, res) => {
    const livros = lerLivros();
    res.status(200).json(livros);
});

//rota get buscar livros por título
app.get(`/livros/:titulo`, (req, res) =>{
  const {titulo} = req.params;
  const livros = lerLivros();

  const livro = livros.find(livro => livro.titulo.toLowerCase() ===
titulo.toLowerCase());

  if (!livro) {
    return res.status(404).json({ erro: `Livro não encontrado.`});

  }
  res.status(200).json(livro);
});

//iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


