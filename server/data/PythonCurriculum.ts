import { CurriculumData } from './GoCurriculum';
import { PYTHON_BEGINNER_TOPICS } from './topics/python/beginnerTopics';
import { PYTHON_INTERMEDIATE_TOPICS } from './topics/python/intermediateTopics';
import { PYTHON_ADVANCED_TOPICS } from './topics/python/advancedTopics';

export const PYTHON_CURRICULUM: CurriculumData = {
  languageId: 'python',
  languageName: 'Python 3',
  topics: [
    ...PYTHON_BEGINNER_TOPICS,
    ...PYTHON_INTERMEDIATE_TOPICS,
    ...PYTHON_ADVANCED_TOPICS,
  ],
};
