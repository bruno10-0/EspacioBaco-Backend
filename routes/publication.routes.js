import fileUpload from "express-fileupload";
import { Router } from "express";
import {createPublication,borrarImagenes,getImagenes,editarPublicacion} from "../controllers/publication.controllers.js"
const router = Router();


router.get("/publicacion",getImagenes)

router.post("/publicacion",fileUpload({useTempFiles : true,tempFileDir : './temp'}),createPublication)

router.delete("/publicacion/:id",borrarImagenes)

router.put("/publicacion/:id",fileUpload({useTempFiles : true,tempFileDir : './temp'}),editarPublicacion)

export default router;