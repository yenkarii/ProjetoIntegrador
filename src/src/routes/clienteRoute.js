import { Router } from 'express';
import * as clienteController from '../controllers/clienteController.js';
import { validarId } from '../middlewares/validarId.js';

const router = Router();

router.get('/', clienteController.listar);
router.get('/:id', validarId, clienteController.buscarPorId);
router.post('/', clienteController.criar);
router.put('/:id', validarId, clienteController.atualizar);
router.delete('/:id', validarId, clienteController.deletar);

export default router;
export function textoValido(valor, limite) {
    return typeof valor === "string"
        && valor.trim().length > 0
        && valor.trim().length <= limite;
}

export function inteiroPositivo(valor) {
    return typeof valor === "number"
        && Number.isSafeInteger(valor)
        && valor > 0;
}