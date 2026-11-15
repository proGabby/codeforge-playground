import { INTERMEDIATE_TOPICS } from '../server/data/topics/intermediateTopics';
import { ADVANCED_TOPICS } from '../server/data/topics/advancedTopics';
import { BEGINNER_TOPICS } from '../server/data/topics/beginnerTopics';

const topics = [...BEGINNER_TOPICS, ...INTERMEDIATE_TOPICS, ...ADVANCED_TOPICS];

console.log('Total topics:', topics.length);

for (const topic of topics) {
  for (const ex of topic.exercises) {
    if (ex.isProject) continue;
    if (!ex.starterCode || typeof ex.starterCode !== 'string') continue;

    const code = ex.starterCode.trim();
    const inst = ex.instructions;
    
    // An exercise is suspicious if:
    // 1. It doesn't contain a comment indicating what the user should do (e.g. "// Write", "// TODO", "// Create", "// Implement", "____")
    // AND
    // 2. It has full implementation (e.g. func main() has calls, and the functions/structs called are already implemented)
    const hasComment = code.includes('//') || code.includes('/*') || code.includes('____');
    
    // Check if the expected output is literally in the starter code fmt.Println
    const expected = ex.testCases?.[0]?.expectedOutput?.trim();
    const printsExpectedDirectly = expected && code.includes(`"${expected}"`);

    // Let's print exercises with NO user-facing comment/blank
    if (!hasComment) {
      console.log(`[NO_COMMENT] Topic: ${topic.id} | Ex: ${ex.id} | Title: "${ex.title}"`);
      console.log(`   Inst: ${inst.slice(0, 100)}`);
      console.log(`   Code: ${code.replace(/\n/g, ' ')}\n`);
    }
  }
}

