import express from "express";
import multer from "multer";
import {listarTodosPosts, criarNovoPost, uploadImagem, atualizarNovoPost} from "../controllers/postsController.js";
import cors from "cors";

const corsOption = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200,
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({dest: "./uploads", storage})

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOption));

    app.get("/posts", listarTodosPosts);
    app.post("/posts", criarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarNovoPost);
};

export default routes;