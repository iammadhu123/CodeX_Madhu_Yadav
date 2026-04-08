import { Search, MapPin, Filter } from 'lucide-react';

const SearchBar = ({ keyword, category, location, categories, locations, onKeywordChange, onCategoryChange, onLocationChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="relative md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search by service name, provider, or description"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Filter by location"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {(keyword || category || location) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter size={16} />
          <span>Active filters:</span>
          {keyword && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Name: "{keyword}"</span>}
          {category && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Category: {category}</span>}
          {location && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Location: "{location}"</span>}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
