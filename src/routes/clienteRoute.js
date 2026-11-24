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