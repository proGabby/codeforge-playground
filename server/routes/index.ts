import { Router } from 'express';
import { curriculumRouter } from './curriculumRoutes';
import { codeRouter } from './codeRoutes';
import { userRouter } from './userRoutes';
import { mentorRouter } from './mentorRoutes';

export const apiRouter = Router();

apiRouter.use(curriculumRouter);
apiRouter.use(codeRouter);
apiRouter.use(userRouter);
apiRouter.use(mentorRouter);

export { curriculumRouter, codeRouter, userRouter, mentorRouter };

