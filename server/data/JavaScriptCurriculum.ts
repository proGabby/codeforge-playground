import { CurriculumData } from './GoCurriculum';
import { JAVASCRIPT_BEGINNER_TOPICS } from './topics/javascript/beginnerTopics';
import { JAVASCRIPT_INTERMEDIATE_TOPICS } from './topics/javascript/intermediateTopics';

export const JAVASCRIPT_CURRICULUM: CurriculumData = {
  languageId: 'javascript',
  languageName: 'JavaScript (Node.js)',
  topics: [
    ...JAVASCRIPT_BEGINNER_TOPICS,
    ...JAVASCRIPT_INTERMEDIATE_TOPICS,
  ],
};
