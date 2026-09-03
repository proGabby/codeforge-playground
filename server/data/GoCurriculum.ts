import { Exercise, Topic } from '../../src/types';
import { BEGINNER_TOPICS } from './topics/beginnerTopics';
import { INTERMEDIATE_TOPICS } from './topics/intermediateTopics';
import { ADVANCED_TOPICS } from './topics/advancedTopics';

export interface CurriculumData {
  languageId: string;
  languageName: string;
  topics: (Topic & { exercises: Exercise[] })[];
}

export const GO_CURRICULUM: CurriculumData = {
  languageId: 'go',
  languageName: 'Go (Golang)',
  topics: [
    ...BEGINNER_TOPICS,
    ...INTERMEDIATE_TOPICS,
    ...ADVANCED_TOPICS,
  ],
};
