import { DSATopic } from '@/types';

export const DSA_TOPICS: DSATopic[] = [
  // FOUNDATIONS
  {
    id: 'big-o-complexity',
    title: 'Big-O & Complexity Analysis',
    category: 'Foundations',
    difficulty: 'Easy',
    estimatedMinutes: 25,
    summary: 'Master the universal mathematical notation for expressing algorithm performance as input scales.',
    whyItExists: 'Computers differ in CPU speed and memory architecture. We need a hardware-independent way to evaluate whether an algorithm will scale smoothly or crash under massive datasets.',
    intuition: 'Imagine searching for a word in a dictionary. Scanning every word takes O(n). Opening the middle, checking if your word is earlier/later and repeating halves the work every step: O(log n). That is the power of complexity analysis.',
    coreConcept: 'Big-O describes the upper bound (worst-case growth rate) of an algorithm. We focus on asymptotic behavior (as n -> infinity) and drop lower-order terms and constant coefficients.',
    algorithmSteps: [
      'Identify the input size variable (usually n).',
      'Count operations in loops and recursive calls.',
      'Multiply nested loops; add sequential blocks.',
      'Drop constants: O(2n + 5) -> O(n).',
      'Drop non-dominant terms: O(n^2 + 50n) -> O(n^2).',
      'Compute auxiliary space allocated on stack and heap.'
    ],
    pseudocode: `function analyze(code):
    for each loop with step 1: multiply by N
    for each halving step: multiply by log(N)
    for recursive calls: use Master Theorem or Tree method
    return highest order term`,
    codeImplementations: {
      javascript: `// O(1) Constant Time
function getFirst(arr) {
  return arr[0];
}

// O(n) Linear Time
function sumArray(arr) {
  let total = 0;
  for (let num of arr) total += num;
  return total;
}

// O(log n) Logarithmic Time
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      python: `# O(1) Constant Time
def get_first(arr):
    return arr[0] if arr else None

# O(n) Linear Time
def sum_array(arr):
    total = 0
    for num in arr:
        total += num
    return total

# O(log n) Logarithmic Time
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      java: `public class ComplexityDemo {
    public static int sumArray(int[] arr) {
        int sum = 0;
        for (int x : arr) sum += x; // O(n)
        return sum;
    }
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) { // O(log n)
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
      cpp: `#include <vector>
int sumArray(const std::vector<int>& arr) {
    int sum = 0;
    for (int x : arr) sum += x; // O(n)
    return sum;
}
int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) { // O(log n)
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    dryRun: {
      input: 'n = 16 (Binary Search)',
      steps: [
        { step: 1, state: 'n = 16', explanation: 'Initial array has 16 items.' },
        { step: 2, state: 'n = 8', explanation: 'First comparison halves array to 8 items.' },
        { step: 3, state: 'n = 4', explanation: 'Second comparison halves array to 4 items.' },
        { step: 4, state: 'n = 2', explanation: 'Third comparison halves array to 2 items.' },
        { step: 5, state: 'n = 1', explanation: 'Final comparison finds target. Total steps = log2(16) = 4.' }
      ]
    },
    complexity: {
      time: 'O(1) to O(2^n)',
      space: 'O(1) to O(n)',
      explanation: 'Time hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!).'
    },
    edgeCases: [
      'Empty array or n = 0',
      'Logarithm base (in computer science Big-O, base 2 is standard)',
      'Hidden recursion stack memory'
    ],
    commonMistakes: [
      'Assuming string operations like substring or concatenation are O(1) when they are often O(k).',
      'Confusing worst case O(n) with amortized O(1) for dynamic array appends.',
      'Ignoring space taken by recursion stack frames.'
    ],
    interviewTips: [
      'Always state both time and space complexity without being asked.',
      'Clarify if auxiliary space excludes the output data structure.'
    ],
    relatedProblemIds: ['two-sum', 'binary-search-basic'],
    prerequisites: [],
    learningModes: {
      beginner: 'Think of Big-O as measuring the recipe preparation time when you scale the party from 5 guests to 50,000 guests.',
      standard: 'Rigorous asymptotic analysis mapping runtime to input curves as n approaches infinity.',
      deepDive: 'Formal definitions of Big-O, Big-Omega, Big-Theta, amortized analysis, and Master Theorem recurrence trees.',
      interview: 'How to quickly eyeball nested loops, tree depths, and formulate trade-offs to show interviewer maturity.'
    }
  },

  {
    id: 'recursion-basics',
    title: 'Recursion & Call Stack Intuition',
    category: 'Foundations',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'Understand base cases, recurrence relations, and the call stack frame mechanics.',
    whyItExists: 'Many real-world structures (trees, graphs, JSON, directories) are self-similar and naturally nested.',
    intuition: 'Think of Russian nesting dolls. You open a doll to find a smaller doll, until you reach the smallest solid doll (base case), then you close them back up in reverse order (stack unwinding).',
    coreConcept: 'A recursive function calls itself on smaller sub-problems. Every recursive call pushes a stack frame; reaching the base case starts the return phase.',
    algorithmSteps: [
      'Define the Base Case: When should recursion terminate?',
      'Define the Recursive Step: How to shrink the problem towards the base case?',
      'Combine Subproblem Results: Return and combine values.'
    ],
    pseudocode: `function solve(state):
    if isBaseCase(state):
        return baseValue
    subResult = solve(smallerState)
    return combine(state, subResult)`,
    codeImplementations: {
      javascript: `function factorial(n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Recursive step
}

function sumArray(arr, idx = 0) {
  if (idx >= arr.length) return 0;
  return arr[idx] + sumArray(arr, idx + 1);
}`,
      python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def sum_array(arr, idx=0):
    if idx >= len(arr):
        return 0
    return arr[idx] + sum_array(arr, idx + 1)`,
      java: `public class RecursionDemo {
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
      cpp: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`
    },
    dryRun: {
      input: 'factorial(3)',
      steps: [
        { step: 1, state: 'Call factorial(3)', explanation: 'Pushed to stack. Waits for factorial(2).' },
        { step: 2, state: 'Call factorial(2)', explanation: 'Pushed to stack. Waits for factorial(1).' },
        { step: 3, state: 'Call factorial(1)', explanation: 'Base case reached! Returns 1.' },
        { step: 4, state: 'Unwind factorial(2)', explanation: 'Calculates 2 * 1 = 2 and returns 2.' },
        { step: 5, state: 'Unwind factorial(3)', explanation: 'Calculates 3 * 2 = 6 and returns 6.' }
      ]
    },
    complexity: {
      time: 'O(n)',
      space: 'O(n) auxiliary call stack space',
      explanation: 'Each call allocates memory on the call stack until the base case is hit.'
    },
    edgeCases: ['n = 0 or negative numbers', 'Deep recursion triggering Stack Overflow'],
    commonMistakes: [
      'Missing base case leading to maximum call stack exceeded error.',
      'Modifying parameters in a way that never reaches the base case.'
    ],
    interviewTips: [
      'Always draw the recursion tree during interviews to calculate time and space complexity with confidence.'
    ],
    relatedProblemIds: ['reverse-linked-list', 'fibonacci-number'],
    prerequisites: ['big-o-complexity'],
    learningModes: {
      beginner: 'Visualizing stack frames like a pile of plates that must be washed from top to bottom.',
      standard: 'Mathematical induction mapping: Base Case (n=0) + Inductive Step (P(k) -> P(k+1)).',
      deepDive: 'Tail call optimization, stack memory management, recursion-to-iteration transformations with explicit stacks.',
      interview: 'Writing clean recursive templates without global variable clutter.'
    }
  },

  // DATA STRUCTURES
  {
    id: 'arrays',
    title: 'Arrays & Dynamic Arrays',
    category: 'Data Structures',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'Contiguous memory storage, random access O(1), insertions, deletions, and dynamic resizing.',
    whyItExists: 'Hardware CPUs excel at reading contiguous memory blocks due to spatial locality and L1/L2 cache prefetching.',
    intuition: 'Think of numbered lockers lined up in a school hallway. Finding locker #47 takes zero searching because you immediately calculate its physical coordinate.',
    coreConcept: 'An array stores elements of uniform size in contiguous memory addresses. Element address = BaseAddress + index * ElementSize. This gives O(1) random access.',
    algorithmSteps: [
      'Access by index: Base + i * size -> O(1)',
      'Insertion at end: O(1) amortized',
      'Insertion/Deletion at arbitrary index: Shift remaining elements -> O(n)',
      'Dynamic resizing: When capacity is full, allocate 2x memory, copy elements, free old memory.'
    ],
    pseudocode: `function insertAt(arr, index, value):
    for i from arr.length down to index + 1:
        arr[i] = arr[i - 1]
    arr[index] = value`,
    codeImplementations: {
      javascript: `const arr = [10, 20, 30, 40];
// Access O(1)
console.log(arr[2]); // 30

// Push O(1) amortized
arr.push(50);

// Unshift (insert at beginning) O(n)
arr.unshift(5);

// Splice (delete/insert) O(n)
arr.splice(2, 1);`,
      python: `arr = [10, 20, 30, 40]
# Access O(1)
print(arr[2])

# Append O(1) amortized
arr.append(50)

# Insert at index O(n)
arr.insert(0, 5)

# Pop from index O(n)
arr.pop(2)`,
      java: `import java.util.ArrayList;
public class ArrayDemo {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(10); // O(1) amortized
        list.add(20);
        int val = list.get(1); // O(1)
        list.add(0, 5); // O(n)
    }
}`,
      cpp: `#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = {10, 20, 30};
    v.push_back(40); // O(1) amortized
    int x = v[1];    // O(1)
    v.insert(v.begin(), 5); // O(n)
}`
    },
    dryRun: {
      input: 'Insert 99 at index 1 in [10, 20, 30]',
      steps: [
        { step: 1, state: '[10, 20, 30, _]', explanation: 'Expand array capacity.' },
        { step: 2, state: '[10, 20, 30, 30]', explanation: 'Shift 30 right to index 3.' },
        { step: 3, state: '[10, 20, 20, 30]', explanation: 'Shift 20 right to index 2.' },
        { step: 4, state: '[10, 99, 20, 30]', explanation: 'Place 99 at index 1. Completed!' }
      ]
    },
    complexity: {
      time: 'Access: O(1), Search: O(n), Insert/Delete: O(n)',
      space: 'O(n) contiguous storage',
      explanation: 'CPU cache friendly, zero pointer overhead.'
    },
    edgeCases: ['Index out of bounds', 'Empty array access', 'Array resize reallocation'],
    commonMistakes: [
      'Forgetting that deleting from the front or middle requires O(n) element shifts.',
      'Creating new arrays inside loops leading to accidental O(n^2) runtime.'
    ],
    interviewTips: [
      'When you need fast lookups by index or in-place sorting, Arrays are your top choice.'
    ],
    relatedProblemIds: ['two-sum', 'best-time-to-buy-and-sell-stock', 'maximum-subarray'],
    prerequisites: ['big-o-complexity'],
    learningModes: {
      beginner: 'A row of consecutive parking spots where each car slot has a direct number.',
      standard: 'Contiguous memory chunk with mathematical index-to-byte-offset indexing.',
      deepDive: 'Amortized doubling analysis (aggregate method & potential method), CPU cache lines, SIMD vectorization.',
      interview: 'Mastering in-place two-pointer manipulation to avoid extra space.'
    }
  },

  {
    id: 'strings',
    title: 'Strings & Character Encoding',
    category: 'Data Structures',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'String immutability, ASCII/Unicode character mapping, frequency counting, and anagrams.',
    whyItExists: 'Text is the fundamental currency of human-computer interaction and web APIs.',
    intuition: 'Think of a string as an array of character bytes. In languages like Java or Python, strings are immutable (carved in stone), meaning modifying one character builds a whole new stone.',
    coreConcept: 'Strings are sequences of characters. In many modern languages they are immutable. Frequent string concatenation without builders leads to O(n^2) garbage allocation.',
    algorithmSteps: [
      'Character frequency array: size 26 for lowercase English or 128 for ASCII.',
      'Two pointers from opposite ends for palindrome checking.',
      'Sliding window for substring discovery.'
    ],
    pseudocode: `function isPalindrome(s):
    left = 0, right = s.length - 1
    while left < right:
        if s[left] != s[right]: return false
        left++, right--
    return true`,
    codeImplementations: {
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let c of s) count[c] = (count[c] || 0) + 1;
  for (let c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        if c not in count or count[c] == 0:
            return False
        count[c] -= 1
    return True`,
      java: `public class StringDemo {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        for (char c : t.toCharArray()) {
            if (--freq[c - 'a'] < 0) return false;
        }
        return true;
    }
}`,
      cpp: `#include <string>
#include <vector>
bool isAnagram(const std::string& s, const std::string& t) {
    if (s.length() != t.length()) return false;
    std::vector<int> freq(26, 0);
    for (char c : s) freq[c - 'a']++;
    for (char c : t) {
        if (--freq[c - 'a'] < 0) return false;
    }
    return true;
}`
    },
    dryRun: {
      input: 's = "racecar"',
      steps: [
        { step: 1, state: 'left=0 ("r"), right=6 ("r")', explanation: 'Characters match. Increment left, decrement right.' },
        { step: 2, state: 'left=1 ("a"), right=5 ("a")', explanation: 'Characters match. Move inward.' },
        { step: 3, state: 'left=2 ("c"), right=4 ("c")', explanation: 'Characters match. Move inward.' },
        { step: 4, state: 'left=3 ("e"), right=3 ("e")', explanation: 'Pointers meet at middle. Valid Palindrome!' }
      ]
    },
    complexity: {
      time: 'O(n) where n is string length',
      space: 'O(1) auxiliary with fixed 26/128-size frequency array',
      explanation: 'Single linear pass over characters.'
    },
    edgeCases: ['Empty string', 'Case sensitivity (A vs a)', 'Non-alphanumeric characters'],
    commonMistakes: [
      'Using repeated `s += char` inside a loop in Java/Python creating O(n^2) runtime.',
      'Not validating non-ASCII or whitespace characters.'
    ],
    interviewTips: [
      'Always ask if input contains only lowercase English letters or full Unicode.'
    ],
    relatedProblemIds: ['valid-anagram', 'longest-substring-without-repeating-characters', 'valid-palindrome'],
    prerequisites: ['arrays'],
    learningModes: {
      beginner: 'Letters placed into boxes. Comparing letters from start to finish.',
      standard: 'Character arrays, ASCII code offsets `c - 97`, immutable memory allocations.',
      deepDive: 'UTF-8 multi-byte encoding, Rabin-Karp hashing, KMP prefix functions.',
      interview: 'Frequency array optimizations and in-place mutation techniques.'
    }
  },

  {
    id: 'linked-lists',
    title: 'Linked Lists (Singly & Doubly)',
    category: 'Data Structures',
    difficulty: 'Medium',
    estimatedMinutes: 35,
    summary: 'Dynamic node chains, pointer manipulation, dummy head technique, and cycle detection.',
    whyItExists: 'Arrays require contiguous memory and costly resizing. Linked lists allow instant O(1) insertions/deletions at any known pointer position without shifting elements.',
    intuition: 'Think of a scavenger hunt. Clue #1 points to Clue #2, which points to Clue #3. To get to Clue #3, you must follow the trail step by step.',
    coreConcept: 'Nodes containing a `val` and a `next` pointer. Doubly linked lists have `prev` and `next`. Sentinel (dummy) head nodes eliminate edge-case branches for head modifications.',
    algorithmSteps: [
      'Create a dummy head node pointing to real head.',
      'Maintain `prev`, `curr`, and `nextTemp` pointers.',
      'Reverse pointers: `curr.next = prev; prev = curr; curr = nextTemp`.',
      'Fast & Slow pointer (Floyd cycle): slow moves 1 step, fast moves 2 steps.'
    ],
    pseudocode: `function reverse(head):
    prev = null, curr = head
    while curr != null:
        nextTemp = curr.next
        curr.next = prev
        prev = curr
        curr = nextTemp
    return prev`,
    codeImplementations: {
      javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      java: `public class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    dryRun: {
      input: '1 -> 2 -> 3 -> null',
      steps: [
        { step: 1, state: 'curr=1, prev=null', explanation: 'Save next=2. Point 1->null. Move prev=1, curr=2.' },
        { step: 2, state: 'curr=2, prev=1', explanation: 'Save next=3. Point 2->1. Move prev=2, curr=3.' },
        { step: 3, state: 'curr=3, prev=2', explanation: 'Save next=null. Point 3->2. Move prev=3, curr=null.' },
        { step: 4, state: 'curr=null, prev=3', explanation: 'Loop terminates. Return prev (3 -> 2 -> 1 -> null).' }
      ]
    },
    complexity: {
      time: 'O(n) for traversal and search',
      space: 'O(1) auxiliary space (in-place pointer updates)',
      explanation: 'No extra memory allocated; pointers are rewired in a single pass.'
    },
    edgeCases: ['Empty list (head is null)', 'Single node list', 'Cycle in list causing infinite loops'],
    commonMistakes: [
      'Losing reference to the rest of the list by overwriting `curr.next` before saving `nextTemp`.',
      'Forgetting to update tail pointer in doubly linked list operations.'
    ],
    interviewTips: [
      'Use a dummy node `dummy.next = head` whenever the head node might be removed or swapped.'
    ],
    relatedProblemIds: ['reverse-linked-list', 'linked-list-cycle', 'merge-two-sorted-lists'],
    prerequisites: ['arrays'],
    learningModes: {
      beginner: 'People holding hands in a line. Reversing means turning around and holding the other person\'s hand.',
      standard: 'Heap allocated struct nodes connected via memory address pointers.',
      deepDive: 'Memory fragmentation trade-offs vs array caches, LRU Cache doubly linked list design, XOR linked list memory compression.',
      interview: 'Mastering fast-slow pointer cycle detection and tortoise-hare convergence math.'
    }
  },

  {
    id: 'stack-and-queue',
    title: 'Stack (LIFO) & Queue (FIFO)',
    category: 'Data Structures',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'Push, Pop, Enqueue, Dequeue, Monotonic Stack, and sliding window buffers.',
    whyItExists: 'Essential for execution call stacks, undo/redo buffers, task schedulers, and breadth-first search wavefronts.',
    intuition: 'Stack: A stack of cafeteria plates — last plate placed is the first one taken (LIFO). Queue: People waiting in line at a movie theater — first person in line gets served first (FIFO).',
    coreConcept: 'Stack enforces Last-In First-Out. Queue enforces First-In First-Out. Monotonic Stack maintains strictly increasing or decreasing elements to solve Next Greater Element in O(n).',
    algorithmSteps: [
      'Stack Push: add to top O(1)',
      'Stack Pop: remove top O(1)',
      'Queue Enqueue: add to back O(1)',
      'Queue Dequeue: remove from front O(1)'
    ],
    pseudocode: `function isValidParentheses(s):
    stack = []
    for char in s:
        if isOpening(char): stack.push(char)
        else if stack.empty() or !matches(stack.pop(), char): return false
    return stack.empty()`,
    codeImplementations: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      java: `import java.util.Stack;
public class StackDemo {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `#include <stack>
#include <string>
bool isValid(std::string s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else if (st.empty() || st.top() != c) return false;
        else st.pop();
    }
    return st.empty();
}`
    },
    dryRun: {
      input: 's = "([{}])"',
      steps: [
        { step: 1, state: 'Push (', explanation: 'Stack: ["("]' },
        { step: 2, state: 'Push [', explanation: 'Stack: ["(", "["]' },
        { step: 3, state: 'Push {', explanation: 'Stack: ["(", "[", "{"]' },
        { step: 4, state: 'Match }', explanation: 'Pop "{" matches "}". Stack: ["(", "["]' },
        { step: 5, state: 'Match ]', explanation: 'Pop "[" matches "]". Stack: ["("]' },
        { step: 6, state: 'Match )', explanation: 'Pop "(" matches ")". Stack is empty. Valid!' }
      ]
    },
    complexity: {
      time: 'O(n) single pass',
      space: 'O(n) auxiliary stack space',
      explanation: 'Each character is pushed and popped at most once.'
    },
    edgeCases: ['Only opening brackets: "((("', 'Only closing brackets: ")))"', 'Mismatched order: "([)]"'],
    commonMistakes: [
      'Using standard JavaScript Array `.shift()` for queue operations causing hidden O(n) dequeue times instead of pointer/deque implementations.'
    ],
    interviewTips: [
      'Whenever problem asks for "Next Greater/Smaller Element", "Daily Temperatures", or "Matching Pairs", immediately think Monotonic Stack.'
    ],
    relatedProblemIds: ['valid-parentheses', 'daily-temperatures', 'min-stack'],
    prerequisites: ['arrays'],
    learningModes: {
      beginner: 'Stack is like an elevator (last one in is first one out). Queue is a checkout line.',
      standard: 'LIFO & FIFO linear abstract data types implemented via dynamic arrays or linked nodes.',
      deepDive: 'Circular ring buffers, lock-free concurrent queues, monotonic deque for sliding window maximum in O(n).',
      interview: 'Designing Min-Stack and 2-Stack Queue implementations with O(1) amortized guarantees.'
    }
  },

  {
    id: 'hash-maps',
    title: 'Hash Maps & Hash Sets',
    category: 'Data Structures',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'Key-value mapping, hashing functions, collision resolution (chaining vs open addressing), and O(1) average lookups.',
    whyItExists: 'Trading space for instantaneous O(1) lookups is the #1 optimization pattern in all of software engineering.',
    intuition: 'Think of an organizer with labeled cubbies. You run a name through a magic funnel (hash function) that tells you the exact cubby number to drop or find your item.',
    coreConcept: 'Hash function maps arbitrary keys to bucket indices: `index = hash(key) % capacity`. Collisions are handled via separate chaining (linked lists/trees) or open addressing (linear probing).',
    algorithmSteps: [
      'Calculate hash code for key.',
      'Modulo capacity to get array index.',
      'Check bucket for existing key to overwrite or insert.',
      'Rehash when load factor exceeds threshold (typically 0.75).'
    ],
    pseudocode: `function twoSum(nums, target):
    seen = HashMap()
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen: return [seen[diff], i]
        seen[num] = i`,
    codeImplementations: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `import java.util.HashMap;
public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`
    },
    dryRun: {
      input: 'nums = [2, 7, 11, 15], target = 9',
      steps: [
        { step: 1, state: 'i=0, num=2', explanation: 'Target - 2 = 7. Not in map. Store map[2] = 0.' },
        { step: 2, state: 'i=1, num=7', explanation: 'Target - 7 = 2. Found in map at index 0! Return [0, 1].' }
      ]
    },
    complexity: {
      time: 'O(1) average lookup/insert, O(n) worst case with adversarial hash collisions',
      space: 'O(n) auxiliary memory for hash table buckets',
      explanation: 'Instant lookups enabled by direct memory address calculation.'
    },
    edgeCases: ['Duplicate keys', 'Hash collisions', 'Custom object keys lacking proper hash/equals methods'],
    commonMistakes: [
      'Assuming hash map iteration order is sorted (it is insertion-order in JS, arbitrary in C++ `unordered_map`).',
      'Forgetting that lookup in `std::map` (C++) is O(log n) because it is a red-black tree, whereas `std::unordered_map` is O(1).'
    ],
    interviewTips: [
      'When an interviewer asks for O(n) time, your instinct should be: Can a Hash Map or Frequency Array save previously computed results?'
    ],
    relatedProblemIds: ['two-sum', 'group-anagrams', 'longest-consecutive-sequence'],
    prerequisites: ['arrays'],
    learningModes: {
      beginner: 'A phone directory where typing someone\'s name immediately pulls up their phone number in 1 second.',
      standard: 'Key hashing, bucket arrays, collision resolution strategies, and load factor thresholding.',
      deepDive: 'Robin Hood hashing, Cuckoo hashing, cryptographic vs non-cryptographic hash functions (MurmurHash, xxHash).',
      interview: 'Designing frequency caches, prefix sum frequency maps, and subarray sum counting.'
    }
  },

  {
    id: 'binary-trees',
    title: 'Trees & Binary Search Trees (BST)',
    category: 'Data Structures',
    difficulty: 'Medium',
    estimatedMinutes: 40,
    summary: 'Hierarchical node trees, BST properties, Inorder, Preorder, Postorder, and Level-Order traversals.',
    whyItExists: 'Hierarchies like DOM trees, file systems, auto-completers, and fast sorted searches cannot be represented as simple flat lists.',
    intuition: 'Think of a corporate organization chart. The CEO is the root, VPs are child nodes, and individual contributors with no direct reports are leaf nodes.',
    coreConcept: 'In a Binary Search Tree (BST): for every node X, all values in its left subtree are strictly < X.val, and all values in its right subtree are strictly > X.val. Inorder traversal of a BST yields sorted order!',
    algorithmSteps: [
      'Inorder traversal: Left -> Root -> Right (yields sorted sequence in BST).',
      'Preorder traversal: Root -> Left -> Right (used for serialization/cloning).',
      'Postorder traversal: Left -> Right -> Root (used for bottom-up deletion/calculating height).',
      'Level-order traversal: BFS using a Queue for horizontal layer-by-layer scanning.'
    ],
    pseudocode: `function inorder(root):
    if root == null: return
    inorder(root.left)
    visit(root.val)
    inorder(root.right)`,
    codeImplementations: {
      javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function searchBST(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return searchBST(root.left, val);
  return searchBST(root.right, val);
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def search_bst(root: TreeNode, val: int) -> TreeNode:
    if not root or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)`,
      java: `public class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
class TreeSolution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));
}`
    },
    dryRun: {
      input: 'BST: [4, 2, 7, 1, 3], search val = 3',
      steps: [
        { step: 1, state: 'curr = 4', explanation: '3 < 4, navigate to left child (2).' },
        { step: 2, state: 'curr = 2', explanation: '3 > 2, navigate to right child (3).' },
        { step: 3, state: 'curr = 3', explanation: '3 == 3. Target node found in 2 steps!' }
      ]
    },
    complexity: {
      time: 'Balanced BST: O(log n), Degenerate skew tree: O(n)',
      space: 'O(h) where h is tree height for recursion stack',
      explanation: 'Halves search space each step on balanced trees.'
    },
    edgeCases: ['Empty tree (root is null)', 'Single root node', 'Skewed linked-list like tree'],
    commonMistakes: [
      'Only checking direct child instead of full subtree validity when validating BST (e.g. node.left < node is not enough; all left subtree nodes must be < node).',
      'Forgetting that tree depth can cause stack overflow if tree is unbalanced.'
    ],
    interviewTips: [
      'Think bottom-up vs top-down: Return values from subtrees to parent for max depth, diameter, and LCA.'
    ],
    relatedProblemIds: ['maximum-depth-of-binary-tree', 'validate-binary-search-tree', 'lowest-common-ancestor-of-a-bst'],
    prerequisites: ['recursion-basics'],
    learningModes: {
      beginner: 'A family tree upside down. The original ancestor is at the top.',
      standard: 'Recursive non-linear nodes with left and right sub-trees satisfying BST invariant.',
      deepDive: 'AVL self-balancing tree rotations, Red-Black color invariants, B-Trees for database disk paging.',
      interview: 'Mastering iterative DFS with stack and Morris Inorder Traversal for O(1) space.'
    }
  },

  {
    id: 'heaps-priority-queues',
    title: 'Heaps & Priority Queues',
    category: 'Data Structures',
    difficulty: 'Medium',
    estimatedMinutes: 35,
    summary: 'Min-Heap, Max-Heap, array representation, bubble-up/bubble-down, Top-K elements.',
    whyItExists: 'Extracting the minimum or maximum element repeatedly in O(log n) time without sorting the whole array in O(n log n).',
    intuition: 'Think of an emergency room triage. Incoming patients are not seen in order of arrival, but strictly in order of medical urgency (highest priority first).',
    coreConcept: 'A complete binary tree stored compactly in an array where for index `i`, left child is `2i+1`, right child is `2i+2`, parent is `Math.floor((i-1)/2)`. Min-Heap property: parent is always <= children.',
    algorithmSteps: [
      'Insert: append to end of array, bubble up (sift up) while parent > element: O(log n).',
      'Extract Min: swap root with last element, pop last, bubble down (sift down) root with smaller child: O(log n).',
      'Peek: return array[0]: O(1).'
    ],
    pseudocode: `function siftDown(arr, i, n):
    smallest = i
    left = 2*i + 1, right = 2*i + 2
    if left < n and arr[left] < arr[smallest]: smallest = left
    if right < n and arr[right] < arr[smallest]: smallest = right
    if smallest != i:
        swap(arr[i], arr[smallest])
        siftDown(arr, smallest, n)`,
    codeImplementations: {
      javascript: `class MinHeap {
  constructor() { this.heap = []; }
  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }
  _bubbleUp(i) {
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  _bubbleDown(i) {
    const len = this.heap.length;
    while (true) {
      let left = 2 * i + 1, right = 2 * i + 2, smallest = i;
      if (left < len && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < len && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}`,
      python: `import heapq

# Min-Heap in Python
heap = []
heapq.heappush(heap, 10)
heapq.heappush(heap, 5)
heapq.heappush(heap, 30)

min_val = heapq.heappop(heap) # 5 (O(log n))

# Top K Frequent / Kth Largest
def find_kth_largest(nums, k):
    return heapq.nlargest(k, nums)[-1]`,
      java: `import java.util.PriorityQueue;
public class HeapDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(10);
        minHeap.offer(5);
        int smallest = minHeap.poll(); // 5
    }
}`,
      cpp: `#include <queue>
#include <vector>
int main() {
    // Max heap by default
    std::priority_queue<int> maxHeap;
    // Min heap
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    minHeap.push(10);
    minHeap.push(5);
    int smallest = minHeap.top(); // 5
    minHeap.pop();
}`
    },
    dryRun: {
      input: 'Insert [10, 5, 20] into MinHeap',
      steps: [
        { step: 1, state: '[10]', explanation: 'Push 10 to root.' },
        { step: 2, state: '[10, 5]', explanation: 'Push 5 at index 1. Parent is 10. Bubble up 5 with 10 -> [5, 10].' },
        { step: 3, state: '[5, 10, 20]', explanation: 'Push 20 at index 2. Parent is 5. 5 <= 20, heap property holds.' }
      ]
    },
    complexity: {
      time: 'Push: O(log n), Pop: O(log n), Peek: O(1), Heapify: O(n)',
      space: 'O(n) array storage',
      explanation: 'Array indexed complete binary tree provides optimal cache locality.'
    },
    edgeCases: ['Popping from empty heap', 'Single element heap', 'Duplicate priorities'],
    commonMistakes: [
      'Assuming elements in the heap array are fully sorted (only the root is guaranteed smallest/largest).',
      'Thinking building a heap from an array takes O(n log n) when bottom-up `heapify` is O(n).'
    ],
    interviewTips: [
      'Top K Largest: Maintain a Min-Heap of size K. When heap exceeds K, pop the smallest. Leftover items are the top K!'
    ],
    relatedProblemIds: ['kth-largest-element-in-an-array', 'merge-k-sorted-lists'],
    prerequisites: ['arrays', 'binary-trees'],
    learningModes: {
      beginner: 'A leaderboard where only the #1 champion stays on top at all times.',
      standard: 'Complete binary tree mapped onto flat array indices with sift-up and sift-down rebalancing.',
      deepDive: 'Fibonacci heaps, binomial heaps, amortized decrease-key in Dijkstra algorithm.',
      interview: 'Designing two-heap streaming median finders in O(log n) insert and O(1) median query.'
    }
  },

  {
    id: 'graphs',
    title: 'Graphs (BFS, DFS & Shortest Paths)',
    category: 'Data Structures',
    difficulty: 'Medium',
    estimatedMinutes: 45,
    summary: 'Adjacency list/matrix, Breadth-First Search (queue), Depth-First Search (stack/recursion), cycle detection, Dijkstra.',
    whyItExists: 'Networks of social friends, road maps, recommendation engines, and dependency trees are all graphs.',
    intuition: 'Think of navigating a subway map. Cities are vertices (nodes) and train lines connecting them are edges. BFS explores all 1-stop stations first, then 2-stop stations, guaranteeing the fewest transfers.',
    coreConcept: 'G = (V, E). Graphs can be directed/undirected, weighted/unweighted, cyclic/acyclic. BFS uses a Queue to find shortest unweighted paths. DFS uses recursion to explore connected components.',
    algorithmSteps: [
      'Represent as Adjacency List: `Map<Node, List<Node>>`.',
      'Maintain a `visited` Set to avoid infinite loops in cyclic graphs.',
      'BFS: Queue + layer-by-layer expansion.',
      'DFS: Recursion + backtrack.',
      'Dijkstra: PriorityQueue for shortest path in weighted graphs with non-negative weights.'
    ],
    pseudocode: `function bfs(start):
    queue = [start]
    visited = Set([start])
    while queue not empty:
        node = queue.shift()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.push(neighbor)`,
    codeImplementations: {
      javascript: `function numIslands(grid) {
  if (!grid.length) return 0;
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // mark visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0' # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      java: `public class GraphSolution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
      cpp: `#include <vector>
class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < (int)grid.size(); r++) {
            for (int c = 0; c < (int)grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    void dfs(std::vector<std::vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size() || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};`
    },
    dryRun: {
      input: 'Grid with 1 island surrounded by water',
      steps: [
        { step: 1, state: 'grid[0][0] == "1"', explanation: 'Found land! Increment island count to 1. Launch DFS.' },
        { step: 2, state: 'DFS sink [0][0]', explanation: 'Mark [0][0] as "0" to prevent revisit.' },
        { step: 3, state: 'DFS sink [0][1]', explanation: 'Traverse right neighbor and sink it.' },
        { step: 4, state: 'All adjacent water "0"', explanation: 'DFS returns. Island fully explored!' }
      ]
    },
    complexity: {
      time: 'O(V + E) for standard graphs, O(R * C) for 2D grids',
      space: 'O(V) for visited set and recursion stack / queue',
      explanation: 'Visits each node and edge exactly once.'
    },
    edgeCases: ['Disconnected graphs with multiple components', 'Cycles in graph', 'Self loops and parallel edges'],
    commonMistakes: [
      'Forgetting to mark nodes as visited when pushing to queue in BFS causing duplicate queue entries and memory explosions.',
      'Assuming BFS finds shortest path in weighted graphs (it only works for uniform/unweighted edge costs; use Dijkstra for weighted).'
    ],
    interviewTips: [
      'Shortest path in unweighted grid = BFS. Topological build order = Kahn\'s algorithm or postorder DFS.'
    ],
    relatedProblemIds: ['number-of-islands', 'clone-graph', 'course-schedule'],
    prerequisites: ['stack-and-queue', 'recursion-basics'],
    learningModes: {
      beginner: 'A web of roads connecting towns. A ripple of water spreading outward represents BFS.',
      standard: 'Vertices, directed/undirected edges, adjacency list representation, BFS queue wavefront vs DFS recursive depth.',
      deepDive: 'Dijkstra shortest path with Fibonacci heaps, Bellman-Ford negative cycle detection, Floyd-Warshall all-pairs O(V^3).',
      interview: 'Recognizing graph reductions in word ladders, matrix mazes, and prerequisite scheduling.'
    }
  },

  // ALGORITHMS
  {
    id: 'binary-search-algorithm',
    title: 'Binary Search & Search Space Reduction',
    category: 'Algorithms',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    summary: 'Divide and conquer, boundary conditions `low <= high`, finding left/right bounds, and binary search on answer.',
    whyItExists: 'Linear search on 1 billion items takes 1,000,000,000 operations (~1 sec). Binary search takes only 30 operations (~1 nanosecond).',
    intuition: 'High-Low guessing game. "I am thinking of a number from 1 to 100." You guess 50. I say "Higher". You have instantly eliminated numbers 1 through 50 with 1 single question.',
    coreConcept: 'Requires monotonic (sorted) condition: `f(x)` is non-decreasing. Check midpoint `mid = low + Math.floor((high - low) / 2)`. If condition holds, eliminate half the search space.',
    algorithmSteps: [
      'Set `low = 0`, `high = n - 1`.',
      'Loop while `low <= high`.',
      'Compute `mid = low + Math.floor((high - low) / 2)` (prevents integer overflow).',
      'If `arr[mid] === target`, return `mid`.',
      'If `arr[mid] < target`, discard left half: `low = mid + 1`.',
      'If `arr[mid] > target`, discard right half: `high = mid - 1`.'
    ],
    pseudocode: `function binarySearch(arr, target):
    low = 0, high = len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target: return mid
        else if arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    codeImplementations: {
      javascript: `function binarySearch(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      java: `public class BinarySearchSolution {
    public int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
      cpp: `#include <vector>
int search(const std::vector<int>& nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    dryRun: {
      input: 'nums = [1, 3, 5, 9, 12], target = 9',
      steps: [
        { step: 1, state: 'low=0, high=4, mid=2 (nums[mid]=5)', explanation: '5 < 9. Target is on right half. Set low = mid + 1 = 3.' },
        { step: 2, state: 'low=3, high=4, mid=3 (nums[mid]=9)', explanation: 'nums[3] == 9. Target matched! Return index 3.' }
      ]
    },
    complexity: {
      time: 'O(log n) logarithmic comparisons',
      space: 'O(1) auxiliary space for iterative approach',
      explanation: 'Search interval is halved in every iteration step.'
    },
    edgeCases: ['Target smaller than all elements', 'Target larger than all elements', 'Duplicate values (finding first vs last occurrence)'],
    commonMistakes: [
      'Writing `(low + high) / 2` in languages like Java/C++ causing 32-bit integer overflow when low and high are large.',
      'Infinite loop from setting `low = mid` or `high = mid` instead of `mid + 1` and `mid - 1`.'
    ],
    interviewTips: [
      'Binary Search on Answer: Whenever problem asks for "Minimum maximum" or "Capacity required to complete in D days", test validity with monotonic helper function and binary search the answer range!'
    ],
    relatedProblemIds: ['binary-search-basic', 'search-in-rotated-sorted-array', 'koko-eating-bananas'],
    prerequisites: ['arrays', 'big-o-complexity'],
    learningModes: {
      beginner: 'Splitting a phonebook right in the middle to find a name in seconds.',
      standard: 'Monotonic predicate search space reduction with exact invariant boundaries.',
      deepDive: 'Fractional cascading, exponential search, binary search on non-discrete floating point domains.',
      interview: 'Formulating lower_bound vs upper_bound predicate templates without off-by-one errors.'
    }
  },

  {
    id: 'two-pointers',
    title: 'Two Pointers Technique',
    category: 'Algorithms',
    difficulty: 'Easy',
    estimatedMinutes: 25,
    summary: 'Opposite-end pointers, same-direction fast-slow pointers, in-place sorting and container water calculation.',
    whyItExists: 'Reduces brute force O(n^2) nested pair comparisons down to single-pass O(n) time with O(1) memory.',
    intuition: 'Two runners on a track. One starts at the finish line running backward, one starts at the start line running forward. Or a fast sprinter and a steady jogger.',
    coreConcept: 'Use two index pointers to traverse a sequence. By leveraging sorting or problem invariants, each pointer move permanently eliminates suboptimal possibilities.',
    algorithmSteps: [
      'Identify if sequence is sorted or if relative ordering allows eliminating choices.',
      'Initialize `left = 0`, `right = n - 1`.',
      'Evaluate `currSum = arr[left] + arr[right]`.',
      'If `currSum < target`, increment `left` to increase sum.',
      'If `currSum > target`, decrement `right` to decrease sum.'
    ],
    pseudocode: `function twoSumSorted(arr, target):
    left = 0, right = arr.length - 1
    while left < right:
        sum = arr[left] + arr[right]
        if sum == target: return [left + 1, right + 1]
        else if sum < target: left++
        else: right--`,
    codeImplementations: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      python: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      java: `public class ContainerWithMostWater {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxWater = Math.max(maxWater, width * h);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxWater;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
int maxArea(const std::vector<int>& height) {
    int left = 0, right = (int)height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int width = right - left;
        int h = std::min(height[left], height[right]);
        maxWater = std::max(maxWater, width * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`
    },
    dryRun: {
      input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
      steps: [
        { step: 1, state: 'left=0 (h=1), right=8 (h=7)', explanation: 'Width=8, h=1, Area=8. Move left++ because 1 < 7.' },
        { step: 2, state: 'left=1 (h=8), right=8 (h=7)', explanation: 'Width=7, h=7, Area=49. MaxArea=49. Move right-- because 7 < 8.' },
        { step: 3, state: 'left=1 (h=8), right=7 (h=3)', explanation: 'Width=6, h=3, Area=18. Move right--.' },
        { step: 4, state: 'left=1 (h=8), right=6 (h=8)', explanation: 'Width=5, h=8, Area=40. Converges with max area 49.' }
      ]
    },
    complexity: {
      time: 'O(n) linear scan',
      space: 'O(1) in-place pointers',
      explanation: 'Each step moves at least one pointer closer to the other.'
    },
    edgeCases: ['Array with fewer than 2 elements', 'All elements identical', 'Negative numbers in unsorted array'],
    commonMistakes: [
      'Applying two-sum sorted pointer logic on an unsorted array without sorting first.',
      'Moving the wrong pointer (always move the bottleneck pointer).'
    ],
    interviewTips: [
      'For 3Sum: Sort array first, fix outer element with a loop, then run two pointers on the remaining subarray.'
    ],
    relatedProblemIds: ['container-with-most-water', '3sum', 'valid-palindrome'],
    prerequisites: ['arrays'],
    learningModes: {
      beginner: 'Two people walking towards each other from opposite ends of a bridge.',
      standard: 'Iterative coordinate narrowing over sorted or bounded 1D collections.',
      deepDive: 'Mathematical proof of invariant safety: why moving the shorter line never misses a taller container.',
      interview: 'Handling duplicates gracefully in 3Sum and 4Sum without hash sets.'
    }
  },

  {
    id: 'sliding-window',
    title: 'Sliding Window Technique',
    category: 'Algorithms',
    difficulty: 'Medium',
    estimatedMinutes: 35,
    summary: 'Fixed-size window, dynamic-size window, substring counting, and window state contraction.',
    whyItExists: 'Eliminates re-evaluating overlapping subarray slices from scratch, converting O(n * k) into O(n).',
    intuition: 'Looking through a moving magnifying glass. When you slide the glass one slot to the right, you only see 1 new element entering and 1 old element leaving. Everything in the middle stays the same.',
    coreConcept: 'Maintain a window `[left, right]`. Expand `right` to include elements until condition is satisfied or violated. Then shrink `left` to restore invariant or optimize window size.',
    algorithmSteps: [
      'Initialize `left = 0`, window state (e.g. sum, char frequency map).',
      'Iterate `right` from 0 to n-1.',
      'Add `arr[right]` to window state.',
      'While window is invalid: remove `arr[left]` from state, increment `left++`.',
      'Record best window length `right - left + 1`.'
    ],
    pseudocode: `function longestSubstringWithoutRepeating(s):
    seen = Map(), left = 0, maxLen = 0
    for right = 0 to s.length - 1:
        if s[right] in seen and seen[s[right]] >= left:
            left = seen[s[right]] + 1
        seen[s[right]] = right
        maxLen = max(maxLen, right - left + 1)
    return maxLen`,
    codeImplementations: {
      javascript: `function lengthOfLongestSubstring(s) {
  let left = 0, maxLen = 0;
  const lastIndex = new Map();
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastIndex.has(char) && lastIndex.get(char) >= left) {
      left = lastIndex.get(char) + 1;
    }
    lastIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    left = 0
    max_len = 0
    last_index = {}
    for right, char in enumerate(s):
        if char in last_index and last_index[char] >= left:
            left = last_index[char] + 1
        last_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      java: `import java.util.HashMap;
public class SlidingWindowSolution {
    public int lengthOfLongestSubstring(String s) {
        int left = 0, maxLen = 0;
        HashMap<Character, Integer> map = new HashMap<>();
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
int lengthOfLongestSubstring(std::string s) {
    int left = 0, maxLen = 0;
    std::unordered_map<char, int> lastIndex;
    for (int right = 0; right < (int)s.length(); right++) {
        char c = s[right];
        if (lastIndex.find(c) != lastIndex.end() && lastIndex[c] >= left) {
            left = lastIndex[c] + 1;
        }
        lastIndex[c] = right;
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`
    },
    dryRun: {
      input: 's = "abcabcbb"',
      steps: [
        { step: 1, state: 'right=0 ("a")', explanation: 'Window: "a", len=1, maxLen=1' },
        { step: 2, state: 'right=1 ("b")', explanation: 'Window: "ab", len=2, maxLen=2' },
        { step: 3, state: 'right=2 ("c")', explanation: 'Window: "abc", len=3, maxLen=3' },
        { step: 4, state: 'right=3 ("a")', explanation: 'Duplicate "a" found! Move left to 1. Window: "bca", len=3' },
        { step: 5, state: 'Final Result', explanation: 'Max non-repeating substring length is 3.' }
      ]
    },
    complexity: {
      time: 'O(n) amortized (each element added and removed at most once)',
      space: 'O(k) where k is size of character set',
      explanation: 'Linear two-pointer expansion and contraction.'
    },
    edgeCases: ['Empty string', 'String with all identical characters: "bbbbb"', 'String with no repeats: "abcdef"'],
    commonMistakes: [
      'Not updating `left` correctly when duplicate character occurred before the current `left` boundary.',
      'Recomputing sums inside the window from scratch using slice/reduce.'
    ],
    interviewTips: [
      'Keywords to trigger Sliding Window: "Longest/Shortest substring with property X", "Contiguous subarray of size K".'
    ],
    relatedProblemIds: ['longest-substring-without-repeating-characters', 'minimum-window-substring'],
    prerequisites: ['arrays', 'strings', 'hash-maps'],
    learningModes: {
      beginner: 'A sliding picture frame over a strip of film.',
      standard: 'Left/Right bounding indices maintaining monotonic or invariant state.',
      deepDive: 'At-most-K trick for exact-K frequency counting, sliding window maximum with monotonic queue in O(n).',
      interview: 'Recognizing contraction triggers in Minimum Window Substring.'
    }
  },

  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming (Memoization & Tabulation)',
    category: 'Algorithms',
    difficulty: 'Hard',
    estimatedMinutes: 50,
    summary: 'Overlapping subproblems, optimal substructure, top-down recursion with memoization vs bottom-up table filling.',
    whyItExists: 'Naive recursion recomputes the exact same branches millions of times: O(2^n). DP remembers previous answers to solve them in polynomial O(n) or O(n * W) time.',
    intuition: 'Write "1 + 1 + 1 + 1 + 1 = 5" on a piece of paper. If I add another "+ 1" to the right, how many is that? You said "6" immediately without recounting the first 5 ones because you remembered the previous sum.',
    coreConcept: 'DP requires: 1) Optimal Substructure (optimal solution to problem contains optimal solutions to subproblems) and 2) Overlapping Subproblems (same states evaluated repeatedly).',
    algorithmSteps: [
      'Identify State: What variables uniquely describe a subproblem? (e.g. `dp[i]` or `dp[i][w]`)',
      'Formulate Recurrence Relation: Express `dp[state]` in terms of smaller `dp[sub-states]`.',
      'Identify Base Cases: Initialize starting states (e.g. `dp[0] = 0`).',
      'Decide Direction: Top-Down (Recursion + Cache) or Bottom-Up (Iterative Array).',
      'Space Optimization: Can you replace an O(n) array with 2 variables?'
    ],
    pseudocode: `function coinChange(coins, amount):
    dp = array of size (amount + 1) filled with Infinity
    dp[0] = 0
    for i from 1 to amount:
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] == Infinity ? -1 : dp[amount]`,
    codeImplementations: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      java: `import java.util.Arrays;
public class CoinChangeSolution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
int coinChange(std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = std::min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
    },
    dryRun: {
      input: 'coins = [1, 2, 5], amount = 6',
      steps: [
        { step: 1, state: 'dp[0] = 0', explanation: 'Base case: 0 coins needed to make $0.' },
        { step: 2, state: 'dp[1]=1, dp[2]=1', explanation: 'Using coin 1 and coin 2.' },
        { step: 3, state: 'dp[5]=1', explanation: 'Using 1 coin of value 5.' },
        { step: 4, state: 'dp[6] = min(dp[5]+1, dp[4]+1, dp[1]+1)', explanation: 'dp[6] = dp[6-5] + 1 = dp[1] + 1 = 2 coins (5 + 1).' }
      ]
    },
    complexity: {
      time: 'O(amount * number of coins)',
      space: 'O(amount) space for 1D tabulation array',
      explanation: 'Evaluates each amount state exactly once.'
    },
    edgeCases: ['Amount = 0 (returns 0)', 'Impossible amount with given coins (returns -1)', 'Coin value > amount'],
    commonMistakes: [
      'Using greedy approach on non-canonical coin systems (e.g. coins [1, 3, 4] for amount 6: greedy picks 4+1+1=3 coins, but optimal is 3+3=2 coins).',
      'Confusing 0/1 Knapsack (each item at most once) with Unbounded Knapsack (items reused).'
    ],
    interviewTips: [
      'Start with standard top-down brute force recursion -> Add Memoization dictionary -> Transform into bottom-up array.'
    ],
    relatedProblemIds: ['coin-change', 'climbing-stairs', 'longest-increasing-subsequence'],
    prerequisites: ['recursion-basics'],
    learningModes: {
      beginner: 'Remembering answers to homework questions so you do not have to recalculate them every time.',
      standard: 'State transitions, DAG shortest paths, optimal substructure and overlapping subproblems.',
      deepDive: 'Digit DP, Bitmask DP for TSP in O(n^2 2^n), Matrix Exponentiation for linear recurrences in O(k^3 log n).',
      interview: 'Writing clean 5-step DP breakdown to convince interviewers of your reasoning.'
    }
  }
];
