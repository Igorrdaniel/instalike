import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModels.js";
import * as fs from "node:fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarTodosPosts(req, res) {

    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

export async function criarNovoPost(req, res) {

    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(201).json(postCriado);
        return res.body;
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"erro": "Erro ao criar novo post"})
    }
}

export async function uploadImagem(req, res) {

    const novoPost = {
        descricao: "",
        imagem: req.file.originalname,
        alt: ""
    };
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        res.status(201).json(postCriado);
        fs.renameSync(req.file.path, imagemAtualizada);
        return res.body;
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"erro": "Erro ao criar novo post"})
    }
}

export async function atualizarNovoPost(req, res) {

    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;


    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            descricao: descricao,
            imagem: urlImagem,
            alt: req.body.alt
        }


        const postAtualizado = await atualizarPost(id, post);

        res.status(200).json(postAtualizado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"erro": "Erro ao criar novo post"})
    }
}
