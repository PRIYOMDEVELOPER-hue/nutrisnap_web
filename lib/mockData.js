// Mock data used when Supabase is not yet connected
export const mockUser = {
  id: 'mock-user-1',
  email: 'alex@example.com',
  name: 'Alex Johnson',
  avatar_url: null,
  goal_calories: 2500,
  goal_protein: 150,
  goal_carbs: 275,
  goal_fat: 70,
  goal_weight: 175,
  current_weight: 185,
  height: 72,
  age: 25,
  goal_type: 'lose_weight', // lose_weight | maintain | build_muscle
  units: 'imperial',
}

export const mockTodayLog = {
  date: new Date().toISOString().split('T')[0],
  calories: 1250,
  protein: 75,
  carbs: 138,
  fat: 35,
  water: 1500,
  meals: [
    {
      id: 'm1',
      meal_type: 'breakfast',
      name: 'Oatmeal with Berries',
      calories: 320,
      protein: 12,
      carbs: 58,
      fat: 6,
      time: '08:15',
      image_url: null,
    },
    {
      id: 'm2',
      meal_type: 'lunch',
      name: 'Grilled Salmon',
      calories: 550,
      protein: 46,
      carbs: 24,
      fat: 28,
      time: '12:37',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80',
    },
    {
      id: 'm3',
      meal_type: 'snack',
      name: 'Greek Yogurt',
      calories: 150,
      protein: 17,
      carbs: 12,
      fat: 1,
      time: '15:30',
      image_url: null,
    },
    {
      id: 'm4',
      meal_type: 'dinner',
      name: 'Caesar Salad',
      calories: 230,
      protein: 8,
      carbs: 20,
      fat: 14,
      time: '19:00',
      image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&q=80',
    },
  ],
}

// Last 7 days for streak calendar
export const mockStreak = {
  current: 15,
  longest: 21,
  thisWeek: [true, true, false, true, true, true, true], // Sun-Sat
}

// Weight history (last 6 months)
export const mockWeightHistory = [
  { date: '2025-01-15', weight: 198 },
  { date: '2025-02-01', weight: 195 },
  { date: '2025-02-15', weight: 193 },
  { date: '2025-03-01', weight: 191 },
  { date: '2025-03-15', weight: 190 },
  { date: '2025-04-01', weight: 188 },
  { date: '2025-04-15', weight: 187 },
  { date: '2025-05-01', weight: 186 },
  { date: '2025-05-15', weight: 185 },
  { date: '2025-06-01', weight: 184 },
  { date: '2025-06-15', weight: 183 },
  { date: '2025-07-01', weight: 185 },
  { date: '2025-07-13', weight: 185 },
]

// Weekly calorie averages
export const mockWeeklyCalories = [
  { day: 'Mon', calories: 2200 },
  { day: 'Tue', calories: 1900 },
  { day: 'Wed', calories: 2500 },
  { day: 'Thu', calories: 2100 },
  { day: 'Fri', calories: 2800 },
  { day: 'Sat', calories: 1600 },
  { day: 'Sun', calories: 2300 },
]

// Achievements / Badges
export const allBadges = [
  // Streak badges
  { id: 'streak_3',   category: 'streak',    icon: '🔥', name: 'On Fire',        desc: 'Log meals 3 days in a row',      threshold: 3,   earned: true,  earnedDate: '2025-06-28' },
  { id: 'streak_7',   category: 'streak',    icon: '🔥', name: 'Week Warrior',   desc: 'Log meals 7 days in a row',      threshold: 7,   earned: true,  earnedDate: '2025-07-04' },
  { id: 'streak_14',  category: 'streak',    icon: '🔥', name: 'Two Week Hero',  desc: 'Log meals 14 days in a row',     threshold: 14,  earned: true,  earnedDate: '2025-07-10' },
  { id: 'streak_21',  category: 'streak',    icon: '🏆', name: '21-Day Legend',  desc: 'Log meals 21 days in a row',     threshold: 21,  earned: false, earnedDate: null },
  { id: 'streak_30',  category: 'streak',    icon: '👑', name: 'Habit Master',   desc: 'Log meals 30 days in a row',     threshold: 30,  earned: false, earnedDate: null },
  { id: 'streak_100', category: 'streak',    icon: '💎', name: 'Century Club',   desc: '100-day logging streak',         threshold: 100, earned: false, earnedDate: null },
  // Calorie goal badges
  { id: 'goal_5',     category: 'goals',     icon: '🎯', name: 'Goal Getter',    desc: 'Hit calorie goal 5 days',        threshold: 5,   earned: true,  earnedDate: '2025-07-06' },
  { id: 'goal_10',    category: 'goals',     icon: '🎯', name: 'Consistent',     desc: 'Hit calorie goal 10 days',       threshold: 10,  earned: false, earnedDate: null },
  { id: 'goal_30',    category: 'goals',     icon: '🎯', name: 'Disciplined',    desc: 'Hit calorie goal 30 days',       threshold: 30,  earned: false, earnedDate: null },
  // Protein badges
  { id: 'protein_7',  category: 'nutrition', icon: '💪', name: 'Protein King',   desc: 'Hit protein goal 7 days',        threshold: 7,   earned: true,  earnedDate: '2025-07-07' },
  { id: 'protein_30', category: 'nutrition', icon: '🥩', name: 'Macro Master',   desc: 'Hit protein goal 30 days',       threshold: 30,  earned: false, earnedDate: null },
  // Weight badges
  { id: 'weight_10',  category: 'weight',    icon: '⚖️', name: 'Scale Tracker',  desc: 'Log weight 10 times',            threshold: 10,  earned: true,  earnedDate: '2025-06-30' },
  { id: 'weight_5lb', category: 'weight',    icon: '📉', name: 'First 5 lbs',    desc: 'Lost first 5 lbs',               threshold: 5,   earned: true,  earnedDate: '2025-07-01' },
  { id: 'weight_10lb',category: 'weight',    icon: '🏅', name: '10 lbs Down',    desc: 'Lost 10 lbs total',              threshold: 10,  earned: false, earnedDate: null },
  // Photo badges
  { id: 'photo_1',    category: 'logging',   icon: '📸', name: 'First Snap',     desc: 'Log first photo meal',           threshold: 1,   earned: true,  earnedDate: '2025-06-26' },
  { id: 'photo_50',   category: 'logging',   icon: '📷', name: 'Foodie',         desc: 'Log 50 photo meals',             threshold: 50,  earned: false, earnedDate: null },
  { id: 'water_7',    category: 'nutrition', icon: '💧', name: 'Hydrated',       desc: 'Hit water goal 7 days',          threshold: 7,   earned: false, earnedDate: null },
  { id: 'early_bird', category: 'special',   icon: '🌅', name: 'Early Bird',     desc: 'Log breakfast before 8am',       threshold: 1,   earned: false, earnedDate: null },
  { id: 'voice_log',  category: 'special',   icon: '🎙️', name: 'Voice Master',   desc: 'Log meal using voice 5 times',   threshold: 5,   earned: false, earnedDate: null },
]

// Progress photos mock
export const mockProgressPhotos = [
  { id: 'p1', date: '2023-09-20', weight: 198, url: null, label: 'Start' },
  { id: 'p2', date: '2024-01-10', weight: 193, url: null, label: 'Month 4' },
  { id: 'p3', date: '2024-06-15', weight: 188, url: null, label: 'Month 9' },
  { id: 'p4', date: '2025-07-13', weight: 185, url: null, label: 'Today' },
]
