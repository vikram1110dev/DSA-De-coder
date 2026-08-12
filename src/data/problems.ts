import { PracticeProblem } from '@/types';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  // 1. Two Sum
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topicId: 'hash-maps',
    topicTitle: 'Hash Maps & Hash Sets',
    pattern: 'Hash Map Lookup',
    summary: 'Find indices of two numbers that add up to a specific target.',
    problemStatement: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    given: [
      'An array of integers `nums` of length >= 2',
      'An integer `target` sum'
    ],
    needed: [
      'Indices `[i, j]` such that `nums[i] + nums[j] === target` and `i !== j`'
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    importantClues: [
      '"Find two numbers that sum to target" -> complement = target - nums[i]',
      '"Return indices in any order" -> Hash map mapping value -> index enables O(1) lookup',
      '"Exact one solution" -> Stop immediately upon finding first match'
    ],
    suggestedPattern: 'Hash Map Complement Lookup',
    patternConfidence: 'High',
    patternReasoning: 'Storing visited numbers in a hash map allows us to check if the required complement (target - current) exists in O(1) time.',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Decode the logic here
};`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Decode the logic here
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Decode the logic here
        return {};
    }
};`
    },
    solutionCode: {
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
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
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
      cpp: `class Solution {
public:
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
    }
};`
    },
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'nums[0] + nums[1] == 2 + 7 == 9' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'nums[1] + nums[2] == 2 + 4 == 6' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'nums[0] + nums[1] == 3 + 3 == 6' }
    ],
    hints: [
      'Brute force checks every pair (i, j) taking O(n^2) time. Can we do it in a single pass?',
      'If you are at element x, what other number y are you desperately searching for? (y = target - x)',
      'Use a Hash Map to store numbers you have already seen along with their indices. When you check for the complement, it takes O(1) time.'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    xpReward: 20,
    similarProblems: ['3sum', 'two-sum-ii-input-array-is-sorted', '4sum']
  },

  // 2. Longest Substring Without Repeating Characters
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topicId: 'sliding-window',
    topicTitle: 'Sliding Window Technique',
    pattern: 'Dynamic Sliding Window',
    summary: 'Find the length of the longest contiguous substring without duplicate letters.',
    problemStatement: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    given: [
      'A string `s` of characters, symbols, digits, and spaces'
    ],
    needed: [
      'An integer representing the maximum length of a contiguous substring with all unique characters'
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      '`s` consists of English letters, digits, symbols and spaces.'
    ],
    importantClues: [
      '"Longest contiguous substring" -> Sliding Window',
      '"Without duplicate characters" -> Window state invariant is all unique characters',
      'When duplicate is found, jump `left` pointer past the previous occurrence'
    ],
    suggestedPattern: 'Sliding Window with Hash Map Index Tracker',
    patternConfidence: 'High',
    patternReasoning: 'As the right pointer expands, we record the last seen index of each character. When a repeat is spotted inside the current window, we contract left directly to lastIndex + 1.',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Decode the logic here
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Decode the logic here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Decode the logic here
        return 0;
    }
};`
    },
    solutionCode: {
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
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        left = 0
        max_len = 0
        last_index = {}
        for right, char in enumerate(s):
            if char in last_index and last_index[char] >= left:
                left = last_index[char] + 1
            last_index[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int left = 0, maxLen = 0;
        java.util.Map<Character, Integer> map = new java.util.HashMap<>();
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
      cpp: `class Solution {
public:
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
    }
};`
    },
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', expectedOutput: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', expectedOutput: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    hints: [
      'Try keeping a contiguous sliding window `[left, right]` where every character inside is unique.',
      'What data structure tells you if a character is already inside the current window in O(1)?',
      'Store each character with its last seen index. When a duplicate appears, move `left = lastIndex[char] + 1` (only if lastIndex >= left).'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m, n)) where m is charset size',
    xpReward: 35,
    similarProblems: ['minimum-window-substring', 'longest-repeating-character-replacement']
  },

  // 3. Binary Search Basic
  {
    id: 'binary-search-basic',
    title: 'Binary Search',
    slug: 'binary-search-basic',
    difficulty: 'Easy',
    topicId: 'binary-search-algorithm',
    topicTitle: 'Binary Search',
    pattern: 'Search Space Reduction',
    summary: 'Search for a target value within a sorted integer array in O(log n) time.',
    problemStatement: `Given an array of integers \`nums\` which is sorted in **ascending order**, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its **index**. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    given: [
      'Ascending sorted array `nums` of unique integers',
      'Integer `target` to find'
    ],
    needed: [
      'Index of `target` if found, else `-1`'
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in `nums` are unique.',
      '`nums` is sorted in ascending order.'
    ],
    importantClues: [
      '"Sorted in ascending order" -> Monotonic property allows binary search',
      '"O(log n) runtime" -> Must divide search space in half at each step'
    ],
    suggestedPattern: 'Binary Search Interval Halving',
    patternConfidence: 'High',
    patternReasoning: 'Since the array is sorted, checking the middle element tells us definitively whether the target is in the left or right half.',
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Decode the logic here
};`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Decode the logic here
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Decode the logic here
        return -1;
    }
};`
    },
    solutionCode: {
      javascript: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
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
      java: `class Solution {
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
      cpp: `class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int low = 0, high = (int)nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
};`
    },
    testCases: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', expectedOutput: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', expectedOutput: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    hints: [
      'Maintain two pointers `low` and `high` representing the current valid search boundary.',
      'Calculate the midpoint using `mid = low + (high - low) // 2` to prevent overflow.',
      'Compare `nums[mid]` with `target`. Adjust `low` or `high` accordingly.'
    ],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    xpReward: 20,
    similarProblems: ['search-insert-position', 'find-first-and-last-position-of-element-in-sorted-array']
  },

  // 4. Reverse Linked List
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    topicId: 'linked-lists',
    topicTitle: 'Linked Lists',
    pattern: 'In-Place Pointer Manipulation',
    summary: 'Reverse a singly linked list iteratively and return the new head.',
    problemStatement: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    given: [
      '`head` of a singly linked list'
    ],
    needed: [
      'New head of the reversed linked list'
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    importantClues: [
      '"Reverse pointers" -> Node arrows must point backward instead of forward',
      'Need temporary storage `nextTemp` before overwriting `curr.next`'
    ],
    suggestedPattern: 'Three-Pointer Iterative Rewiring (prev, curr, nextTemp)',
    patternConfidence: 'High',
    patternReasoning: 'By tracking `prev`, `curr`, and `nextTemp`, we can reverse all pointers in a single O(n) pass with O(1) memory.',
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Decode the logic here
};`,
      python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Decode the logic here
        return null;
    }
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Decode the logic here
        return nullptr;
    }
};`
    },
    solutionCode: {
      javascript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, curr = None, head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev`,
      java: `class Solution {
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
      cpp: `class Solution {
public:
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
    }
};`
    },
    testCases: [
      { input: 'head = [1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', explanation: 'Reversed list nodes' },
      { input: 'head = [1, 2]', expectedOutput: '[2, 1]', explanation: 'Reversed two nodes' },
      { input: 'head = []', expectedOutput: '[]', explanation: 'Empty list returns null' }
    ],
    hints: [
      'Before rewiring `curr.next`, save the pointer to the next node in a temporary variable so you do not lose the rest of the list.',
      'Point `curr.next = prev`.',
      'Advance `prev = curr` and `curr = nextTemp`. When `curr` is null, `prev` is the new head.'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    xpReward: 20,
    similarProblems: ['reverse-linked-list-ii', 'palindrome-linked-list']
  },

  // 5. Valid Parentheses
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topicId: 'stack-and-queue',
    topicTitle: 'Stack (LIFO) & Queue (FIFO)',
    pattern: 'LIFO Stack Matching',
    summary: 'Determine if an input string of brackets is syntactically valid.',
    problemStatement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    given: [
      'A string `s` containing brackets `()[]{}`'
    ],
    needed: [
      'Boolean `true` if properly balanced and nested, `false` otherwise'
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      '`s` consists of parentheses only `()[]{}`.'
    ],
    importantClues: [
      '"Closed in correct order" -> The most recently opened bracket must be the first one closed (LIFO property)',
      'Stack data structure is ideal for tracking open brackets'
    ],
    suggestedPattern: 'Stack Matching',
    patternConfidence: 'High',
    patternReasoning: 'Push open brackets onto a stack. When a closing bracket is encountered, pop the top of the stack and check for a type match.',
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Decode the logic here
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Decode the logic here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(std::string s) {
        // Decode the logic here
        return false;
    }
};`
    },
    solutionCode: {
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
      python: `class Solution:
    def isValid(self, s: str) -> bool:
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
      java: `class Solution {
    public boolean isValid(String s) {
        java.util.Stack<Character> stack = new java.util.Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `class Solution {
public:
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
    }
};`
    },
    testCases: [
      { input: 's = "()"', expectedOutput: 'true', explanation: 'Simple matching parentheses' },
      { input: 's = "()[]{}"', expectedOutput: 'true', explanation: 'Sequential matching pairs' },
      { input: 's = "(]"', expectedOutput: 'false', explanation: 'Mismatched bracket types' }
    ],
    hints: [
      'What data structure enables Last-In First-Out tracking of opening tags?',
      'When you see an opening bracket `(`, `[`, `{`, push it to your stack.',
      'When you see a closing bracket, pop from the stack and verify the types match. At the end, verify stack is completely empty.'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    xpReward: 20,
    similarProblems: ['generate-parentheses', 'minimum-remove-to-make-valid-parentheses']
  },

  // 6. Number of Islands
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topicId: 'graphs',
    topicTitle: 'Graphs (BFS, DFS & Shortest Paths)',
    pattern: '2D Grid Graph DFS/BFS',
    summary: 'Count connected components of land ("1") surrounded by water ("0").',
    problemStatement: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    given: [
      '2D character grid `grid` of \'1\' and \'0\''
    ],
    needed: [
      'Integer representing count of connected 4-directional land components'
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    importantClues: [
      '"Adjacent lands horizontally or vertically" -> 4-directional graph neighbors (r+1, r-1, c+1, c-1)',
      '"Count islands" -> Number of connected components in an undirected graph',
      'Sinking visited land to \'0\' avoids extra memory for a visited set'
    ],
    suggestedPattern: 'Flood Fill / Connected Component DFS',
    patternConfidence: 'High',
    patternReasoning: 'When we encounter land \'1\', increment count by 1 and trigger DFS/BFS to traverse and sink the entire island into \'0\'.',
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Decode the logic here
};`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Decode the logic here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        // Decode the logic here
        return 0;
    }
};`
    },
    solutionCode: {
      javascript: `function numIslands(grid) {
  if (!grid.length) return 0;
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
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
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid: return 0
        rows, cols = len(grid), len(grid[0])
        count = 0

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
                return
            grid[r][c] = '0'
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
      java: `class Solution {
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
      cpp: `class Solution {
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
    testCases: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        expectedOutput: '1',
        explanation: 'All connected land forms a single big island'
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        expectedOutput: '3',
        explanation: 'Three distinct isolated islands'
      }
    ],
    hints: [
      'Iterate through every cell in the grid. What should you do when you see a \'1\'?',
      'Launch a graph traversal (DFS or BFS) starting from that cell to find all connected land cells.',
      'Mark visited cells by changing them to \'0\' (sinking the island) so you never count the same land twice.'
    ],
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N) worst case recursion stack',
    xpReward: 35,
    similarProblems: ['max-area-of-island', 'surrounded-regions', 'rotting-oranges']
  },

  // 7. Coin Change
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topicId: 'dynamic-programming',
    topicTitle: 'Dynamic Programming',
    pattern: 'Unbounded Knapsack / 1D DP',
    summary: 'Find the minimum number of coins needed to make up an exact amount.',
    problemStatement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an **infinite number** of each kind of coin.`,
    given: [
      'Array of coin values `coins`',
      'Target total `amount`'
    ],
    needed: [
      'Minimum number of coins to sum to `amount`, or `-1` if impossible'
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    importantClues: [
      '"Fewest number of coins" -> Optimization problem with overlapping subproblems',
      '"Infinite number of each coin" -> Unbounded Knapsack pattern',
      'Greedy fails for arbitrary coin denominations (e.g., coins [1, 3, 4] with amount 6: greedy gives 4+1+1=3 coins, DP gives 3+3=2 coins)'
    ],
    suggestedPattern: 'Bottom-Up 1D Dynamic Programming Tabulation',
    patternConfidence: 'High',
    patternReasoning: '`dp[i]` stores the minimum coins needed for amount `i`. Recurrence: `dp[i] = min(dp[i], dp[i - coin] + 1)` for all `coin <= i`.',
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Decode the logic here
};`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Decode the logic here
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // Decode the logic here
        return -1;
    }
};`
    },
    solutionCode: {
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
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        java.util.Arrays.fill(dp, amount + 1);
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
      cpp: `class Solution {
public:
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
    }
};`
    },
    testCases: [
      { input: 'coins = [1, 2, 5], amount = 11', expectedOutput: '3', explanation: '11 = 5 + 5 + 1 (3 coins)' },
      { input: 'coins = [2], amount = 3', expectedOutput: '-1', explanation: 'Cannot make 3 with coin of value 2' },
      { input: 'coins = [1], amount = 0', expectedOutput: '0', explanation: '0 coins needed for amount 0' }
    ],
    hints: [
      'Think bottom-up: What is the minimum coins needed to make amount 0? Exactly 0 coins (`dp[0] = 0`).',
      'For amount i, if you decide to use coin c, the remaining amount is i - c. The subproblem answer is `dp[i - c]`.',
      'Therefore: `dp[i] = min(dp[i - c] + 1)` across all eligible coins.'
    ],
    timeComplexity: 'O(amount * coins.length)',
    spaceComplexity: 'O(amount)',
    xpReward: 40,
    similarProblems: ['climbing-stairs', 'coin-change-ii', 'partition-equal-subset-sum']
  },

  // 8. Container With Most Water
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topicId: 'two-pointers',
    topicTitle: 'Two Pointers Technique',
    pattern: 'Opposite-End Two Pointers',
    summary: 'Find two lines that together with the x-axis form a container holding the maximum water.',
    problemStatement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

**Notice** that you may not slant the container.`,
    given: [
      'An array of non-negative integers `height`'
    ],
    needed: [
      'Maximum water area = `(right - left) * min(height[left], height[right])`'
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    importantClues: [
      '"Maximize area = width * height" -> Start with maximum width (left=0, right=n-1)',
      'Water level is strictly bottlenecked by the SHORTER line',
      'Moving the taller line cannot increase height and always reduces width. Therefore, ALWAYS move the shorter line inward!'
    ],
    suggestedPattern: 'Two Pointers Greedy Inward Elimination',
    patternConfidence: 'High',
    patternReasoning: 'Starting with maximum width at extremities and moving the shorter vertical line inward guarantees we evaluate all potential candidates in O(n) without missing the optimal container.',
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Decode the logic here
};`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Decode the logic here
        pass`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Decode the logic here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Decode the logic here
        return 0;
    }
};`
    },
    solutionCode: {
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
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
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
      java: `class Solution {
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
      cpp: `class Solution {
public:
    int maxArea(std::vector<int>& height) {
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
    }
};`
    },
    testCases: [
      { input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', expectedOutput: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) hold area 7 * 7 = 49' },
      { input: 'height = [1, 1]', expectedOutput: '1', explanation: 'Area 1 * 1 = 1' }
    ],
    hints: [
      'Start with two pointers at the widest possible positions: `left = 0` and `right = height.length - 1`.',
      'The area is limited by whichever line is shorter: `min(height[left], height[right]) * (right - left)`.',
      'Which pointer should you move? Moving the taller pointer will only decrease the width without any chance of increasing the height. You must move the shorter pointer inward!'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    xpReward: 35,
    similarProblems: ['trapping-rain-water', '3sum']
  }
];
