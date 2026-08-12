export type DSALevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'cpp';
export type LearningGoal = 'placements' | 'interviews' | 'college' | 'cp' | 'skills';
export type AIMode = 'beginner' | 'standard' | 'deep-dive' | 'interview';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dsaLevel: DSALevel;
  language: ProgrammingLanguage;
  dailyStudyTime: number; // in minutes
  goal: LearningGoal;
  targetDays: number;
  preferredTime: string;
  aiMode: AIMode;
  xp: number;
  level: number;
  streakFreeze: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  completedTopics: string[];
  solvedProblems: string[];
  bookmarkedItems: string[];
}

export interface UserStreakState {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
  streakAtRisk: boolean;
  freezesAvailable: number;
}

export interface DSAActivityItem {
  id: string;
  date: string; // YYYY-MM-DD
  activityType:
    | 'LESSON_COMPLETED'
    | 'VISUALIZATION_COMPLETED'
    | 'PROBLEM_SOLVED'
    | 'STUDY_SESSION'
    | 'REVISION_COMPLETED'
    | 'AI_CHALLENGE'
    | 'MOCK_INTERVIEW';
  activityScore: number;
  title: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface DSATopic {
  id: string;
  title: string;
  category: 'Foundations' | 'Data Structures' | 'Algorithms' | 'Advanced';
  difficulty: Difficulty;
  estimatedMinutes: number;
  summary: string;
  whyItExists: string;
  intuition: string;
  coreConcept: string;
  algorithmSteps: string[];
  pseudocode: string;
  codeImplementations: Record<ProgrammingLanguage, string>;
  dryRun: {
    input: string;
    steps: { step: number; state: string; explanation: string }[];
  };
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  edgeCases: string[];
  commonMistakes: string[];
  interviewTips: string[];
  relatedProblemIds: string[];
  prerequisites: string[];
  learningModes: {
    beginner: string;
    standard: string;
    deepDive: string;
    interview: string;
  };
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topicId: string;
  topicTitle: string;
  pattern: string;
  summary: string;
  problemStatement: string;
  given: string[];
  needed: string[];
  constraints: string[];
  importantClues: string[];
  suggestedPattern: string;
  patternConfidence: 'High' | 'Medium';
  patternReasoning: string;
  starterCode: Record<ProgrammingLanguage, string>;
  solutionCode: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  hiddenTestCases?: TestCase[];
  hints: [string, string, string]; // Hint 1 subtle, Hint 2 intermediate, Hint 3 approach
  timeComplexity: string;
  spaceComplexity: string;
  xpReward: number;
  similarProblems?: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  description?: string;
  type: 'study' | 'practice' | 'revision' | 'mock_interview' | 'custom';
  time: string; // HH:mm
  date?: string; // YYYY-MM-DD for one-time
  repeatType: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'none';
  notificationType: 'in_app' | 'browser' | 'sound';
  isEnabled: boolean;
  isDismissed?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'streak' | 'achievement' | 'recommendation' | 'revision';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StudyTaskItem {
  id: string;
  dayNumber: number;
  topicId: string;
  title: string;
  description: string;
  type: 'concept' | 'visualizer' | 'practice' | 'ai_challenge' | 'revision';
  estimatedMinutes: number;
  xpReward: number;
  isCompleted: boolean;
  dateScheduled: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'practice' | 'mastery' | 'ai';
  icon: string;
  xp: number;
  requiredCount: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export interface NoteItem {
  id: string;
  topicId: string;
  topicTitle: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface BookmarkItem {
  id: string;
  itemType: 'problem' | 'topic' | 'visualizer' | 'explanation';
  itemId: string;
  title: string;
  subtitle: string;
  createdAt: string;
}

export interface AIDecoderResult {
  problemRestatement: string;
  inputs: string[];
  outputs: string[];
  constraints: string[];
  clues: string[];
  pattern: string;
  patternWhy: string;
  bruteForce: {
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    whySlow: string;
  };
  optimalApproach: {
    description: string;
    logicDecode: string;
    pseudocode: string;
    code: string;
    lineByLineExplanation: { line: number; code: string; explanation: string }[];
    timeComplexity: string;
    spaceComplexity: string;
  };
  dryRun: { step: number; state: string; explanation: string }[];
  edgeCases: string[];
  commonMistakes: string[];
  interviewFollowUps: string[];
  similarProblems: string[];
}
