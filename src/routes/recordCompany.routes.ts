import { Router } from 'express';
import { createRecordCompany, renderRecordCompany } from '../controllers/recordCompany.controller';
import { renderNewRecordCompany } from '../controllers/recordCompany.controller';

const router: Router = Router();

/**
 * GET /about - Renderiza la página de "Record Company"
 */
router.get('/recordcompany', renderRecordCompany);

/**
 * GET /terms - Renderiza la página de "New Record Company"
 */
 router.post('/recordcompany/new', createRecordCompany);
 
 router.get('/recordcompany/new', renderNewRecordCompany);

export default router;