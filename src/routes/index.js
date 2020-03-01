import express from 'express';

const router = express.Router();

const indexRoute = router.get('/', (req, res) => res.send('welcome to foodie backend'));

router.use('/api/v1', indexRoute);

export default router;
