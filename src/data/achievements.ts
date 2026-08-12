import { AchievementItem } from '@/types';

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first DSA lesson or visualization.',
    category: 'mastery',
    icon: '🌱',
    xp: 50,
    requiredCount: 1
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day uninterrupted DSA streak.',
    category: 'streak',
    icon: '🔥',
    xp: 150,
    requiredCount: 7
  },
  {
    id: 'consistent-coder',
    title: 'Consistent Coder',
    description: 'Achieve a 14-day learning streak.',
    category: 'streak',
    icon: '⚡',
    xp: 300,
    requiredCount: 14
  },
  {
    id: 'dsa-grinder',
    title: 'DSA Grinder',
    description: 'Reach a milestone 30-day streak.',
    category: 'streak',
    icon: '🏆',
    xp: 600,
    requiredCount: 30
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Complete 100 active DSA days.',
    category: 'streak',
    icon: '👑',
    xp: 2000,
    requiredCount: 100
  },
  {
    id: 'problem-solver-bronze',
    title: 'Problem Solver Bronze',
    description: 'Solve 10 practice problems successfully.',
    category: 'practice',
    icon: '🥉',
    xp: 100,
    requiredCount: 10
  },
  {
    id: 'problem-solver-silver',
    title: 'Problem Solver Silver',
    description: 'Solve 25 practice problems successfully.',
    category: 'practice',
    icon: '🥈',
    xp: 250,
    requiredCount: 25
  },
  {
    id: 'problem-solver-gold',
    title: 'Problem Solver Gold',
    description: 'Solve 50 practice problems successfully.',
    category: 'practice',
    icon: '🥇',
    xp: 500,
    requiredCount: 50
  },
  {
    id: 'pattern-master',
    title: 'Pattern Master',
    description: 'Solve problems across 5 distinct algorithm patterns.',
    category: 'mastery',
    icon: '🧩',
    xp: 200,
    requiredCount: 5
  },
  {
    id: 'sliding-window-expert',
    title: 'Sliding Window Expert',
    description: 'Master sliding window & two pointers problems.',
    category: 'mastery',
    icon: '🪟',
    xp: 180,
    requiredCount: 5
  },
  {
    id: 'graph-explorer',
    title: 'Graph Explorer',
    description: 'Traverse BFS, DFS, and grid-based graph problems.',
    category: 'mastery',
    icon: '🗺️',
    xp: 250,
    requiredCount: 5
  },
  {
    id: 'dp-warrior',
    title: 'DP Warrior',
    description: 'Conquer 5 Dynamic Programming challenges.',
    category: 'mastery',
    icon: '⚔️',
    xp: 350,
    requiredCount: 5
  },
  {
    id: 'ai-decoder-enthusiast',
    title: 'AI Logic Decoder',
    description: 'Deconstruct 10 complex problems using the AI De-coder.',
    category: 'ai',
    icon: '🧠',
    xp: 150,
    requiredCount: 10
  },
  {
    id: 'visual-learner',
    title: 'Visual Learner',
    description: 'Step through 10 algorithm simulations in the visualizer.',
    category: 'mastery',
    icon: '👁️',
    xp: 120,
    requiredCount: 10
  },
  {
    id: 'night-owl',
    title: 'Dedicated Scholar',
    description: 'Complete a study session according to your reminder schedule.',
    category: 'practice',
    icon: '🦉',
    xp: 80,
    requiredCount: 3
  }
];
