import { INTERMEDIATE_TOPICS } from '../server/data/topics/intermediateTopics';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function testGoGenerics() {
  console.log('[Test] Auditing go-generics topic exercises...');
  const genTopic = INTERMEDIATE_TOPICS.find((t) => t.id === 'go-generics');
  if (!genTopic) throw new Error('go-generics topic not found');

  const solutions: Record<string, string> = {
    'go-gen-1': `package main
import "fmt"
func Identity[T any](v T) T { return v }
func main() { fmt.Println(Identity("Go"), Identity(100)) }`,

    'go-gen-2': `package main
import "fmt"
func Equal[T comparable](a, b T) bool { return a == b }
func main() { fmt.Println(Equal(5, 5)) }`,

    'go-gen-3': `package main
import "fmt"
func Reverse[T any](s []T) []T {
    res := make([]T, len(s))
    for i, v := range s { res[len(s)-1-i] = v }
    return res
}
func main() { nums := []int{1, 2, 3}; fmt.Println(Reverse(nums)) }`,

    'go-gen-4': `package main
import "fmt"
type Stack[T any] struct { items []T }
func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }
func (s *Stack[T]) Pop() T {
    top := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return top
}
func main() {
    s := &Stack[string]{}
    s.Push("first")
    s.Push("second")
    fmt.Println(s.Pop())
}`,

    'go-gen-5': `package main
import "fmt"
type Number interface { ~int | ~float64 }
func Add[T Number](a, b T) T { return a + b }
func main() { fmt.Println(Add(10, 20), Add(1.5, 2.5)) }`,

    'go-gen-6': `package main
import "fmt"
func Map[T, U any](s []T, fn func(T) U) []U {
    res := make([]U, len(s))
    for i, v := range s { res[i] = fn(v) }
    return res
}
func main() {
    nums := []int{1, 2, 3}
    doubled := Map(nums, func(n int) int { return n * 2 })
    fmt.Println(doubled)
}`,

    'go-gen-7': `package main
import "fmt"
func Filter[T any](s []T, predicate func(T) bool) []T {
    var res []T
    for _, v := range s { if predicate(v) { res = append(res, v) } }
    return res
}
func main() {
    nums := []int{1, 2, 3, 4, 5}
    evens := Filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(evens)
}`,

    'go-gen-8': `package main
import "fmt"
func Keys[K comparable, V any](m map[K]V) []K {
    keys := make([]K, 0, len(m))
    for k := range m { keys = append(keys, k) }
    return keys
}
func main() {
    m := map[string]int{"a": 1}
    fmt.Println(Keys(m))
}`,

    'go-gen-9': `package main
import "fmt"
func Identity[T any](val T) T { return val }
func main() {
    fmt.Println(Identity[string]("Explicit"))
}`,

    'go-gen-10': `package main
import "fmt"
func Pointer[T any](v T) *T { return &v }
func main() {
    p := Pointer(42)
    fmt.Println(*p)
}`,
  };

  const tempDir = path.join(process.cwd(), '.tmp_test_generics');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  try {
    for (const ex of genTopic.exercises) {
      console.log(`Checking ${ex.id}: "${ex.title}"...`);
      const code = solutions[ex.id];
      if (!code) throw new Error(`Missing solution for ${ex.id}`);

      const filePath = path.join(tempDir, `${ex.id}.go`);
      fs.writeFileSync(filePath, code);

      const out = execSync(`go run "${filePath}"`).toString();
      const expected = ex.testCases[0].expectedOutput;

      if (out !== expected) {
        throw new Error(
          `Mismatch in ${ex.id}!\nExpected: ${JSON.stringify(expected)}\nGot:      ${JSON.stringify(out)}`
        );
      }
      console.log(`  ✓ Passed! Output: ${JSON.stringify(out)} matches expected.`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  console.log('\n[PASS] All 10 go-generics exercises verified and valid!');
}

testGoGenerics();
