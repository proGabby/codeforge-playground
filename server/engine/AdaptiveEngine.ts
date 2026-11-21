import { UserProgress } from '../../src/types';
import { GO_CURRICULUM } from '../data/GoCurriculum';
import { PYTHON_CURRICULUM } from '../data/PythonCurriculum';
import { JAVASCRIPT_CURRICULUM } from '../data/JavaScriptCurriculum';
import { TYPESCRIPT_CURRICULUM } from '../data/TypeScriptCurriculum';

export class AdaptiveEngine {
  /**
   * Identifies weak concept tags based on user attempt history and recommends targeted exercises.
   */
  public static analyzeProgress(progress: UserProgress, languageId?: string) {
    const failedCounts = progress.failedAttemptsCount || {};
    const conceptFailures: Record<string, number> = {};

    const curriculums = languageId === 'typescript'
      ? [TYPESCRIPT_CURRICULUM, JAVASCRIPT_CURRICULUM, PYTHON_CURRICULUM, GO_CURRICULUM]
      : languageId === 'javascript'
        ? [JAVASCRIPT_CURRICULUM, TYPESCRIPT_CURRICULUM, PYTHON_CURRICULUM, GO_CURRICULUM]
        : languageId === 'python'
          ? [PYTHON_CURRICULUM, GO_CURRICULUM, JAVASCRIPT_CURRICULUM, TYPESCRIPT_CURRICULUM]
          : [GO_CURRICULUM, PYTHON_CURRICULUM, JAVASCRIPT_CURRICULUM, TYPESCRIPT_CURRICULUM];

    // Map failed exercises to their concept tags
    for (const [exerciseId, failCount] of Object.entries(failedCounts)) {
      if (failCount > 0) {
              // Find exercise in curriculums
              for (const curriculum of curriculums) {
                for (const topic of curriculum.topics) {
                  for (const ex of topic.exercises) {
                    if (ex.id === exerciseId) {
                      conceptFailures[ex.concept] = (conceptFailures[ex.concept] || 0) + failCount;
                    }
                  }
                }
              }
            }
          }

          // Weak concepts are those with >= 2 failed attempts
          const weakConcepts = Object.entries(conceptFailures)
            .filter(([_, fails]) => fails >= 2)
            .map(([concept]) => concept);

          // Recommend exercises targeting weak concepts that aren't completed yet
          const recommendations: { exerciseId: string; title: string; topicId: string; concept: string }[] = [];

          for (const concept of weakConcepts) {
                  for (const curriculum of curriculums) {
                    for (const topic of curriculum.topics) {
                      for (const ex of topic.exercises) {
                        if (
                          ex.concept === concept &&
                          !progress.completedExerciseIds.includes(ex.id) &&
                          recommendations.length < 3
                        ) {
                          recommendations.push({
                            exerciseId: ex.id,
                            title: ex.title,
                            topicId: topic.id,
                            concept: ex.concept,
                          });
                        }
                      }
                    }
                  }
                }

                return {
                  weakConcepts,
                  recommendations,
                };
              }
            }
