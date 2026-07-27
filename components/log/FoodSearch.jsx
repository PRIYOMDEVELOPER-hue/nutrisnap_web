import { useState, useRef } from 'react'
import { SearchIcon } from '../icons/Icons'

const FOOD_DB = [
  { id: 1, name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  { id: 2, name: 'Brown Rice (cooked)', calories: 218, protein: 4.5, carbs: 45.8, fat: 1.6, unit: '1 cup' },
  { id: 3, name: 'Salmon Fillet', calories: 208, protein: 28, carbs: 0, fat: 10, unit: '100g' },
  { id: 4, name: 'Avocado', calories: 240, protein: 3, carbs: 13, fat: 22, unit: '1 medium' },
  { id: 5, name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, unit: '1 medium' },
  { id: 6, name: 'Greek Yogurt (plain)', calories: 150, protein: 17, carbs: 12, fat: 1, unit: '170g' },
  { id: 7, name: 'Egg (whole)', calories: 78, protein: 6, carbs: 0.6, fat: 5, unit: '1 large' },
  { id: 8, name: 'Oatmeal (cooked)', calories: 150, protein: 5, carbs: 27, fat: 3, unit: '1 cup' },
  { id: 9, name: 'Almonds', calories: 162, protein: 6, carbs: 6, fat: 14, unit: '28g (1 oz)' },
  { id: 10, name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, unit: '1 medium' },
  { id: 11, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, unit: '1 cup' },
  { id: 12, name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, unit: '2 tbsp' },
  { id: 13, name: 'Milk (2%)', calories: 122, protein: 8, carbs: 12, fat: 5, unit: '1 cup' },
  { id: 14, name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9, unit: '1 oz' },
  { id: 15, name: 'White Rice (cooked)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, unit: '1 cup' },
  { id: 16, name: 'Tuna (canned in water)', calories: 109, protein: 25, carbs: 0, fat: 1, unit: '100g' },
  { id: 17, name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, unit: '100g' },
  { id: 18, name: 'Orange', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, unit: '1 medium' },
  { id: 19, name: 'Strawberries', calories: 49, protein: 1, carbs: 12, fat: 0.5, unit: '1 cup' },
  { id: 20, name: 'Whey Protein Shake', calories: 130, protein: 25, carbs: 5, fat: 2, unit: '1 scoop' },
  { id: 21, name: 'Pasta (cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3, unit: '1 cup' },
  { id: 22, name: 'Beef (lean ground)', calories: 218, protein: 26, carbs: 0, fat: 12, unit: '100g' },
  { id: 23, name: 'Blueberries', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, unit: '1 cup' },
  { id: 24, name: 'Cottage Cheese', calories: 206, protein: 28, carbs: 8, fat: 9, unit: '1 cup' },
  { id: 25, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: '1 medium' },
]

export default function FoodSearch({ onResult, onBack }) {
  const [query, setQuery] = useState('')
  const [servings, setServings] = useState({})
  const inputRef = useRef(null)

  const results = query.length >= 2
    ? FOOD_DB.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : FOOD_DB.slice(0, 5)

  const handleSelect = (food) => {
    const srv = servings[food.id] || 1
    onResult({
      name: food.name,
      calories: Math.round(food.calories * srv),
      protein: Math.round(food.protein * srv * 10) / 10,
      carbs: Math.round(food.carbs * srv * 10) / 10,
      fat: Math.round(food.fat * srv * 10) / 10,
    })
  }

  return (
    <div className="px-5 pb-6">
      {/* Search input */}
      <div className="relative mb-4">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          autoFocus
          className="input pl-9"
          placeholder="Search food..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {query.length === 0 && (
        <p className="text-xs text-gray-400 mb-2">Popular foods</p>
      )}

      {/* Results */}
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No results for &quot;{query}&quot;</p>
        ) : (
          results.map(food => (
            <div
              key={food.id}
              className="flex items-center gap-3 p-3 rounded-xl
                         bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950/30
                         transition-colors cursor-pointer group"
              onClick={() => handleSelect(food)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {food.name}
                </p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-xs font-bold text-flame">
                    {Math.round(food.calories * (servings[food.id] || 1))} cal
                  </span>
                  <span className="text-[10px] text-gray-400">{food.unit}</span>
                </div>
              </div>

              {/* Serving adjuster */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700
                              rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <button
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm"
                  onClick={() => setServings(s => ({
                    ...s,
                    [food.id]: Math.max(0.5, (s[food.id] || 1) - 0.5)
                  }))}
                >−</button>
                <span className="px-2 text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[28px] text-center">
                  {servings[food.id] || 1}
                </span>
                <button
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm"
                  onClick={() => setServings(s => ({
                    ...s,
                    [food.id]: (s[food.id] || 1) + 0.5
                  }))}
                >+</button>
              </div>

              <button
                className="text-xs font-semibold text-brand-600 dark:text-brand-400
                           bg-brand-50 dark:bg-brand-950/30 px-2 py-1.5 rounded-lg
                           opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleSelect(food) }}
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={onBack} className="w-full btn-secondary py-2.5 text-sm">Back</button>
    </div>
  )
}
