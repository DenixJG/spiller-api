/**
 * @deprecated No se usa en la aplicación.
 */
import { Router } from 'express';
import { createRecordCompany, renderRecordCompany } from '../controllers/recordCompany.controller';
import { renderNewRecordCompany } from '../controllers/recordCompany.controller';

const router: Router = Router();

/**
 * GET /about - Renderiza la página de "Record Company"
 */
router.get('/record-company', renderRecordCompany);

/**
 * GET /terms - Renderiza la página de "New Record Company"
 */
router.post('/record-company/new', createRecordCompany);

/**
 * GET /record-company/new - Renderiza la página de "New Record Company"
 */
router.get('/record-company/new', renderNewRecordCompany);

export default router;