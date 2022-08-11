import {Router} from "express";
import userController from "../constrollers/user-controller";
import {authMiddleware} from "../middlewares/auth-middleware";

const router = Router()

router.get('/', (req, res) => res.send('api is healthy!'))
router.get('/github', userController.github )
router.post('/refresh', userController.refresh)
router.get('/logout', authMiddleware, userController.logout )
router.get('/logout-all', authMiddleware, userController.logoutAll )
router.get('/me', authMiddleware, userController.me )

export default router