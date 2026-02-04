/**
 * Sandbox - Experimental Formulation Builder
 *
 * A form-based interface for building experimental soap/cream/shampoo formulations
 * with AI-assisted recommendations.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical, ChevronDown, ChevronRight, Search, Sparkles,
  BookOpen, Send, MessageSquare, Plus, X, AlertCircle,
  Loader2, Check, ExternalLink, Beaker, Leaf, Droplets
} from 'lucide-react';
import api from '../api/client';

// Product types
const PRODUCT_TYPES = [
  { id: 'machine', name: 'Machine Made', description: 'Standard commercial soap production' },
  { id: 'transparent', name: 'Transparent', description: 'Clear glycerin-based soap' },
  { id: 'cold_pressed', name: 'Cold Pressed', description: 'Traditional cold process method' },
  { id: 'syndet', name: 'Syndet', description: 'Synthetic detergent bar (soap-free)' }
];

// Constraint suggestions
const CONSTRAINT_SUGGESTIONS = [
  'Only essential oils',
  'Vegan',
  'Ayurvedic ingredients only',
  'Natural ingredients only',
  'No synthetic fragrances',
  'Organic certified',
  'Palm oil free'
];

const Sandbox = () => {
  const navigate = useNavigate();

  // Form state
  const [purpose, setPurpose] = useState('');
  const [productType, setProductType] = useState('');
  const [constraints, setConstraints] = useState([]);
  const [newConstraint, setNewConstraint] = useState('');

  // Sections expanded state
  const [expandedSections, setExpandedSections] = useState({
    purpose: true,
    type: false,
    constraints: false,
    similar: false,
    recommendations: false,
    formula: false
  });

  // Data state
  const [similarProducts, setSimilarProducts] = useState([]);
  const [aiSimilarFormulations, setAiSimilarFormulations] = useState([]);
  const [recommendations, setRecommendations] = useState({
    coreIngredients: [],
    additives: [],
    actives: [],
    perfumes: [],
    formulationNotes: '',
    ayurvedicNotes: ''
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Database ingredients browsing
  const [allIngredients, setAllIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showIngredientBrowser, setShowIngredientBrowser] = useState(false);

  // Loading states
  const [searchingDatabase, setSearchingDatabase] = useState(false);
  const [searchingAI, setSearchingAI] = useState(false);
  const [sendingToFormulation, setSendingToFormulation] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  // UI state
  const [error, setError] = useState(null);
  const [activeAIOption, setActiveAIOption] = useState(null);

  // Load ingredients and categories on mount
  useEffect(() => {
    loadIngredientsAndCategories();
  }, []);

  const loadIngredientsAndCategories = async () => {
    setLoadingIngredients(true);
    try {
      const [ingRes, catRes] = await Promise.all([
        api.get('/ingredients'),
        api.get('/categories')
      ]);
      setAllIngredients(ingRes.data.ingredients || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Error loading ingredients:', err);
    } finally {
      setLoadingIngredients(false);
    }
  };

  // Filter ingredients based on search and category
  const filteredIngredients = allIngredients.filter(ing => {
    const matchesSearch = !ingredientSearch ||
      ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
      (ing.inci_name && ing.inci_name.toLowerCase().includes(ingredientSearch.toLowerCase()));
    const matchesCategory = !selectedCategory || ing.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Check if ingredient is already selected (by id or name)
  const isIngredientSelected = (ingredient) => {
    if (typeof ingredient === 'object') {
      return selectedIngredients.some(i =>
        i.id === ingredient.id ||
        (i.name && ingredient.name && i.name.toLowerCase() === ingredient.name.toLowerCase())
      );
    }
    // If just an ID is passed
    return selectedIngredients.some(i => i.id === ingredient);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Open next section when current is completed
  const openNextSection = (currentSection) => {
    const sectionOrder = ['purpose', 'type', 'constraints', 'similar', 'recommendations', 'formula'];
    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIndex + 1];
      setExpandedSections(prev => ({
        ...prev,
        [currentSection]: false,
        [nextSection]: true
      }));
    }
  };

  // Add constraint
  const addConstraint = (constraint) => {
    const trimmed = constraint.trim();
    if (trimmed && !constraints.includes(trimmed)) {
      setConstraints([...constraints, trimmed]);
      setNewConstraint('');
    }
  };

  // Remove constraint
  const removeConstraint = (constraint) => {
    setConstraints(constraints.filter(c => c !== constraint));
  };

  // Handle constraint key press
  const handleConstraintKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addConstraint(newConstraint);
    }
  };

  // Search database for similar products
  const searchSimilarProducts = async () => {
    if (!purpose.trim()) {
      setError('Please enter a purpose first');
      return;
    }

    setSearchingDatabase(true);
    setError(null);

    try {
      // Search formulations by keywords from purpose
      const response = await api.get('/formulations', {
        params: { search: purpose.split(' ').slice(0, 3).join(' ') }
      });

      const formulations = response.data.formulations || [];
      setSimilarProducts(formulations.slice(0, 5)); // Show top 5

      // Open similar products section
      setExpandedSections(prev => ({ ...prev, similar: true }));
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search database');
    } finally {
      setSearchingDatabase(false);
    }
  };

  // AI Integration - Ask Claude
  const askClaude = async (mode) => {
    if (!purpose.trim() || !productType) {
      setError('Please enter purpose and select product type first');
      return;
    }

    setSearchingAI(true);
    setActiveAIOption(mode);
    setError(null);

    try {
      const response = await api.post('/sandbox/ai-recommend', {
        purpose,
        product_type: productType,
        constraints,
        mode // 'general', 'ayurvedic', 'web'
      });

      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        setExpandedSections(prev => ({ ...prev, recommendations: true }));
      }

      // Set similar formulations from AI search
      if (response.data.similarFormulations) {
        setAiSimilarFormulations(response.data.similarFormulations);
      }
    } catch (err) {
      console.error('AI recommendation error:', err);
      const errorMsg = err.response?.data?.error || 'AI recommendations failed. Please try again.';
      setError(errorMsg);
    } finally {
      setSearchingAI(false);
      setActiveAIOption(null);
    }
  };

  // Add ingredient to formula
  const addToFormula = (ingredient, type) => {
    const newIng = {
      ...ingredient,
      type: type || 'ingredient',
      percentage: ingredient.suggestedPercentage || 0,
      id: ingredient.id || Date.now(),
      cost_per_kg: ingredient.landed_cost_net_gst || ingredient.cost_per_kg || 0
    };

    if (!selectedIngredients.find(i => i.id === newIng.id)) {
      setSelectedIngredients([...selectedIngredients, newIng]);
      // Auto-expand formula section when ingredient is added
      setExpandedSections(prev => ({ ...prev, formula: true }));
    }
  };

  // Toggle ingredient selection (for checkboxes)
  const toggleIngredientSelection = (ingredient, type) => {
    if (isIngredientSelected(ingredient)) {
      // Find and remove by id or name
      const existing = selectedIngredients.find(i =>
        i.id === ingredient.id ||
        (i.name && ingredient.name && i.name.toLowerCase() === ingredient.name.toLowerCase())
      );
      if (existing) {
        removeFromFormula(existing.id);
      }
    } else {
      addToFormula(ingredient, type);
    }
  };

  // Add from database browser
  const addFromDatabase = (ingredient) => {
    addToFormula({
      id: ingredient.id,
      name: ingredient.name,
      inci_name: ingredient.inci_name,
      category_id: ingredient.category_id,
      landed_cost_net_gst: ingredient.landed_cost_net_gst,
      suggestedPercentage: 0
    }, 'ingredient');
  };

  // Remove ingredient from formula
  const removeFromFormula = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredientId));
  };

  // Update ingredient percentage
  const updatePercentage = (ingredientId, percentage) => {
    setSelectedIngredients(selectedIngredients.map(i =>
      i.id === ingredientId ? { ...i, percentage: parseFloat(percentage) || 0 } : i
    ));
  };

  // Calculate total percentage
  const totalPercentage = selectedIngredients.reduce((sum, i) => sum + (i.percentage || 0), 0);

  // Send to Formulation
  const sendToFormulation = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please add at least one ingredient to the formula');
      return;
    }

    if (Math.abs(totalPercentage - 100) > 0.1) {
      setError('Total percentage must equal 100%');
      return;
    }

    setSendingToFormulation(true);
    setError(null);

    try {
      // Create a new formulation from sandbox
      const response = await api.post('/formulations', {
        product_name: `Sandbox: ${purpose.slice(0, 50)}`,
        product_type_id: 1, // Default, can be mapped from productType
        grammage: 75,
        status: 'draft',
        notes: `Created from Sandbox.\nPurpose: ${purpose}\nType: ${productType}\nConstraints: ${constraints.join(', ')}`,
        ingredients: selectedIngredients.map(i => ({
          ingredient_id: i.id,
          percentage: i.percentage
        }))
      });

      if (response.data.formulation_id) {
        navigate(`/formulations/${response.data.formulation_id}`);
      }
    } catch (err) {
      console.error('Error creating formulation:', err);
      setError(err.response?.data?.error || 'Failed to create formulation');
    } finally {
      setSendingToFormulation(false);
    }
  };

  // Section Header Component
  const SectionHeader = ({ section, title, icon: Icon, completed, step }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {completed ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{step}</span>}
        </div>
        <Icon className={`w-5 h-5 ${completed ? 'text-green-600' : 'text-gray-500'}`} />
        <span className={`font-medium ${completed ? 'text-green-700' : 'text-gray-900'}`}>{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FlaskConical className="w-7 h-7 text-purple-600" />
          Sandbox - Experimental Formulation
        </h1>
        <p className="text-gray-500 mt-1">
          Build and experiment with new soap, cream, or shampoo formulations
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-4">
        {/* Section 1: Purpose */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="purpose"
            title="Define Purpose"
            icon={Sparkles}
            completed={purpose.trim().length > 0}
            step={1}
          />
          {expandedSections.purpose && (
            <div className="p-4 border-t bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should this product do?
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Moisturizing soap for dry skin with anti-aging properties, or Face wash for acne-prone skin using only essential oils"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => openNextSection('purpose')}
                  disabled={!purpose.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Product Type */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="type"
            title="Select Product Type"
            icon={Beaker}
            completed={!!productType}
            step={2}
          />
          {expandedSections.type && (
            <div className="p-4 border-t bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProductType(type.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      productType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openNextSection('type')}
                  disabled={!productType}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Constraints */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="constraints"
            title="Constraints & Preferences"
            icon={Leaf}
            completed={constraints.length > 0}
            step={3}
          />
          {expandedSections.constraints && (
            <div className="p-4 border-t bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any specific requirements? (optional)
              </label>

              {/* Current constraints */}
              {constraints.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {constraints.map((constraint, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 border border-purple-300"
                    >
                      {constraint}
                      <button
                        onClick={() => removeConstraint(constraint)}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add constraint input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newConstraint}
                  onChange={(e) => setNewConstraint(e.target.value)}
                  onKeyDown={handleConstraintKeyDown}
                  placeholder="Add a constraint (press Enter)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => addConstraint(newConstraint)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2">
                {CONSTRAINT_SUGGESTIONS.filter(s => !constraints.includes(s)).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => addConstraint(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 border border-gray-200"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openNextSection('constraints')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Similar Products */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="similar"
            title="Similar Products"
            icon={Search}
            completed={similarProducts.length > 0}
            step={4}
          />
          {expandedSections.similar && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Search for existing formulations that might be similar to what you're building.
              </p>

              <button
                onClick={searchSimilarProducts}
                disabled={searchingDatabase || !purpose.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {searchingDatabase ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search Database
              </button>

              {/* Results */}
              {similarProducts.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Found {similarProducts.length} similar formulations:</h4>
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 bg-white rounded-lg border hover:border-blue-300 cursor-pointer"
                      onClick={() => navigate(`/formulations/${product.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{product.product_name}</div>
                          <div className="text-sm text-gray-500">
                            {product.current_version} | {product.ingredients?.length || 0} ingredients
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openNextSection('similar')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: AI Recommendations */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="recommendations"
            title="Get Recommendations"
            icon={Sparkles}
            completed={recommendations.coreIngredients.length > 0}
            step={5}
          />
          {expandedSections.recommendations && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered suggestions for your formulation.
              </p>

              {/* AI Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => askClaude('general')}
                  disabled={searchingAI}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    activeAIOption === 'general' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="font-medium text-gray-900">Ask Claude</div>
                  <div className="text-xs text-gray-500 mt-1">General AI recommendations</div>
                </button>

                <button
                  onClick={() => askClaude('ayurvedic')}
                  disabled={searchingAI}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    activeAIOption === 'ayurvedic' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-green-600 mb-2" />
                  <div className="font-medium text-gray-900">Ayurvedic</div>
                  <div className="text-xs text-gray-500 mt-1">Traditional formulations</div>
                </button>

                <button
                  onClick={() => askClaude('web')}
                  disabled={searchingAI}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    activeAIOption === 'web' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">Web Search</div>
                  <div className="text-xs text-gray-500 mt-1">Search latest trends</div>
                </button>
              </div>

              {searchingAI && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Getting recommendations...</span>
                </div>
              )}

              {/* Recommendations Display */}
              {recommendations.coreIngredients.length > 0 && (
                <div className="space-y-4">
                  {/* Core Ingredients */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Core Ingredients</h4>
                    <div className="space-y-2">
                      {recommendations.coreIngredients.map((ing, idx) => {
                        const selected = isIngredientSelected(ing);
                        return (
                          <label
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selected
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-purple-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleIngredientSelection(ing, 'core')}
                              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{ing.name}</div>
                              {ing.reason && (
                                <div className="text-sm text-gray-500 mt-0.5">{ing.reason}</div>
                              )}
                            </div>
                            {ing.suggestedPercentage > 0 && (
                              <span className="text-sm text-purple-600 font-medium">
                                ~{ing.suggestedPercentage}%
                              </span>
                            )}
                            {selected && <Check className="w-5 h-5 text-purple-600" />}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additives */}
                  {recommendations.additives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Additives (Lather & Hardness)</h4>
                      <div className="space-y-2">
                        {recommendations.additives.map((ing, idx) => {
                          const selected = isIngredientSelected(ing);
                          return (
                            <label
                              key={idx}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleIngredientSelection(ing, 'additive')}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{ing.name}</div>
                                {ing.reason && (
                                  <div className="text-sm text-gray-500 mt-0.5">{ing.reason}</div>
                                )}
                              </div>
                              {ing.suggestedPercentage > 0 && (
                                <span className="text-sm text-blue-600 font-medium">
                                  ~{ing.suggestedPercentage}%
                                </span>
                              )}
                              {selected && <Check className="w-5 h-5 text-blue-600" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Perfumes */}
                  {recommendations.perfumes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Fragrances</h4>
                      <div className="space-y-2">
                        {recommendations.perfumes.map((ing, idx) => {
                          const selected = isIngredientSelected(ing);
                          return (
                            <label
                              key={idx}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 bg-white hover:border-pink-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleIngredientSelection(ing, 'perfume')}
                                className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{ing.name}</div>
                                {ing.reason && (
                                  <div className="text-sm text-gray-500 mt-0.5">{ing.reason}</div>
                                )}
                              </div>
                              {ing.suggestedPercentage > 0 && (
                                <span className="text-sm text-pink-600 font-medium">
                                  ~{ing.suggestedPercentage}%
                                </span>
                              )}
                              {selected && <Check className="w-5 h-5 text-pink-600" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actives */}
                  {recommendations.actives && recommendations.actives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Active Ingredients</h4>
                      <div className="space-y-2">
                        {recommendations.actives.map((ing, idx) => {
                          const selected = isIngredientSelected(ing);
                          return (
                            <label
                              key={idx}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleIngredientSelection(ing, 'active')}
                                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{ing.name}</div>
                                {ing.reason && (
                                  <div className="text-sm text-gray-500 mt-0.5">{ing.reason}</div>
                                )}
                              </div>
                              {ing.suggestedPercentage > 0 && (
                                <span className="text-sm text-green-600 font-medium">
                                  ~{ing.suggestedPercentage}%
                                </span>
                              )}
                              {selected && <Check className="w-5 h-5 text-green-600" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Notes */}
                  {(recommendations.formulationNotes || recommendations.ayurvedicNotes) && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">AI Notes</h4>
                      {recommendations.formulationNotes && (
                        <p className="text-sm text-yellow-700 mb-2">{recommendations.formulationNotes}</p>
                      )}
                      {recommendations.ayurvedicNotes && (
                        <p className="text-sm text-yellow-700 italic">{recommendations.ayurvedicNotes}</p>
                      )}
                    </div>
                  )}

                  {/* Similar Formulations from AI */}
                  {aiSimilarFormulations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Similar Formulations in Database ({aiSimilarFormulations.length})
                      </h4>
                      <div className="space-y-2">
                        {aiSimilarFormulations.map((form) => (
                          <div
                            key={form.id}
                            className="p-3 bg-white rounded-lg border hover:border-blue-300 cursor-pointer"
                            onClick={() => navigate(`/formulations/${form.id}`)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">{form.product_name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Matching: {form.matching_ingredients}
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openNextSection('recommendations')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continue to Formula
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Final Formula */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <SectionHeader
            section="formula"
            title="Build Formula"
            icon={Droplets}
            completed={selectedIngredients.length > 0 && Math.abs(totalPercentage - 100) < 0.1}
            step={6}
          />
          {expandedSections.formula && (
            <div className="p-4 border-t">
              {/* Formula Summary */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Purpose:</strong> {purpose || 'Not defined'}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Type:</strong> {PRODUCT_TYPES.find(t => t.id === productType)?.name || 'Not selected'}
                </div>
                {constraints.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Constraints:</strong> {constraints.join(', ')}
                  </div>
                )}
              </div>

              {/* Database Ingredient Browser */}
              <div className="mb-4">
                <button
                  onClick={() => setShowIngredientBrowser(!showIngredientBrowser)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200"
                >
                  {showIngredientBrowser ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <Search className="w-4 h-4" />
                  Browse Database Ingredients
                  {selectedIngredients.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {selectedIngredients.length} selected
                    </span>
                  )}
                </button>

                {showIngredientBrowser && (
                  <div className="mt-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={ingredientSearch}
                          onChange={(e) => setIngredientSearch(e.target.value)}
                          placeholder="Search ingredients..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ingredients List with Checkboxes */}
                    {loadingIngredients ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto space-y-1 bg-white rounded-lg border border-gray-200 p-2">
                        {filteredIngredients.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">No ingredients found</div>
                        ) : (
                          filteredIngredients.slice(0, 50).map(ing => {
                            const selected = isIngredientSelected(ing);
                            return (
                              <label
                                key={ing.id}
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                                  selected ? 'bg-blue-100' : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => {
                                    if (selected) {
                                      removeFromFormula(ing.id);
                                    } else {
                                      addFromDatabase(ing);
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{ing.name}</div>
                                  {ing.inci_name && (
                                    <div className="text-xs text-gray-500 truncate">{ing.inci_name}</div>
                                  )}
                                </div>
                                {selected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                              </label>
                            );
                          })
                        )}
                        {filteredIngredients.length > 50 && (
                          <div className="text-center py-2 text-sm text-gray-500">
                            Showing 50 of {filteredIngredients.length} results. Refine your search.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ingredients Table */}
              {selectedIngredients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left text-sm font-medium text-gray-600">
                        <th className="px-3 py-2">Ingredient</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2 w-24 text-right">%</th>
                        <th className="px-3 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedIngredients.map((ing) => (
                        <tr key={ing.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{ing.name}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              ing.type === 'core' ? 'bg-purple-100 text-purple-700' :
                              ing.type === 'additive' ? 'bg-blue-100 text-blue-700' :
                              ing.type === 'perfume' ? 'bg-pink-100 text-pink-700' :
                              ing.type === 'active' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {ing.type}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={ing.percentage}
                              onChange={(e) => updatePercentage(ing.id, e.target.value)}
                              className="w-full px-2 py-1 text-right border border-gray-300 rounded"
                              step="0.1"
                              min="0"
                              max="100"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => removeFromFormula(ing.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="2" className="px-3 py-2 font-medium text-gray-900">Total</td>
                        <td className={`px-3 py-2 text-right font-bold ${
                          Math.abs(totalPercentage - 100) < 0.1 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {totalPercentage.toFixed(1)}%
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No ingredients added yet.</p>
                  <p className="text-sm mt-1">Use the recommendations above or browse the database.</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setShowIngredientBrowser(!showIngredientBrowser)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showIngredientBrowser ? 'Hide Browser' : 'Add More Ingredients'}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={sendToFormulation}
                    disabled={sendingToFormulation || selectedIngredients.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {sendingToFormulation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send to Formulation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
