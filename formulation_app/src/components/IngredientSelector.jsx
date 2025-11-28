import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

const IngredientSelector = ({ ingredients, onSelect, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Group ingredients by category and subcategory
  const groupedIngredients = useMemo(() => {
    const filtered = searchTerm
      ? ingredients.filter(ing => 
          ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ing.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ing.subcategory_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : ingredients;

    const grouped = {};
    
    filtered.forEach(ing => {
      const category = ing.category_name || 'Uncategorized';
      const subcategory = ing.subcategory_name || 'General';
      
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = [];
      }
      grouped[category][subcategory].push(ing);
    });

    return grouped;
  }, [ingredients, searchTerm]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubcategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelect = (ingredient) => {
    onSelect(ingredient);
    setSearchTerm('');
  };

  return (
    <div className="border border-gray-300 rounded-md">
      {/* Search Box */}
      <div className="p-3 border-b bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Ingredient Tree */}
      <div className="max-h-96 overflow-y-auto">
        {Object.keys(groupedIngredients).length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {searchTerm ? 'No ingredients found' : 'No ingredients available'}
          </div>
        ) : (
          Object.keys(groupedIngredients).sort().map(category => (
            <div key={category} className="border-b last:border-b-0">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 font-medium text-sm"
                disabled={disabled}
              >
                {expandedCategories[category] ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-900">{category}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({Object.values(groupedIngredients[category]).reduce((sum, arr) => sum + arr.length, 0)})
                </span>
              </button>

              {/* Subcategories and Ingredients */}
              {expandedCategories[category] && (
                <div className="bg-gray-50">
                  {Object.keys(groupedIngredients[category]).sort().map(subcategory => {
                    const subcatKey = `${category}-${subcategory}`;
                    const subcatIngredients = groupedIngredients[category][subcategory];

                    return (
                      <div key={subcatKey} className="border-t">
                        {/* Subcategory Header */}
                        <button
                          type="button"
                          onClick={() => toggleSubcategory(subcatKey)}
                          className="w-full flex items-center gap-2 px-6 py-2 text-left hover:bg-gray-100 text-sm"
                          disabled={disabled}
                        >
                          {expandedCategories[subcatKey] ? (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-gray-700">{subcategory}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            ({subcatIngredients.length})
                          </span>
                        </button>

                        {/* Ingredients List */}
                        {expandedCategories[subcatKey] && (
                          <div className="bg-white">
                            {subcatIngredients.map(ing => (
                              <button
                                key={ing.id}
                                type="button"
                                onClick={() => handleSelect(ing)}
                                className="w-full px-9 py-2 text-left hover:bg-blue-50 text-sm flex items-center justify-between group"
                                disabled={disabled}
                              >
                                <span className="text-gray-900 group-hover:text-blue-700">
                                  {ing.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ₹{ing.landed_cost_net_gst}/kg
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IngredientSelector;
