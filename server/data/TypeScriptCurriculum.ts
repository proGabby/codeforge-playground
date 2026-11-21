import { CurriculumData } from './GoCurriculum';
import { TYPESCRIPT_BEGINNER_TOPICS } from './topics/typescript/beginnerTopics';
import { TYPESCRIPT_INTERMEDIATE_TOPICS } from './topics/typescript/intermediateTopics';

export const TYPESCRIPT_CURRICULUM: CurriculumData = {
  languageId: 'typescript',
  languageName: 'TypeScript (Node.js)',
  topics: [
    ...TYPESCRIPT_BEGINNER_TOPICS,
    ...TYPESCRIPT_INTERMEDIATE_TOPICS,
  ],
};
