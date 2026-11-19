import { Router } from 'express';
import { curriculumRouter } from './curriculumRoutes';
import { codeRouter } from './codeRoutes';
import { userRouter } from './userRoutes';
import { mentorRouter } from './mentorRoutes';
import { quizRouter } from './quizRoutes';

export const apiRouter = Router();

apiRouter.use(curriculumRouter);
apiRouter.use(codeRouter);
apiRouter.use(userRouter);
apiRouter.use(mentorRouter);
apiRouter.use(quizRouter);

export { curriculumRouter, codeRouter, userRouter, mentorRouter, quizRouter };

