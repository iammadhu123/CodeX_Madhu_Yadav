import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import axios from '../api/axios';
import sampleServices from '../data/sampleServices';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchServices();
  }, [keyword, category, location]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const res = await axios.get(`/services${queryString}`);
      setServices(res.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (field === 'search') {
      if (value) nextParams.set('keyword', value);
      else nextParams.delete('keyword');
    } else if (field === 'category') {
      if (value) nextParams.set('category', value);
      else nextParams.delete('category');
    } else if (field === 'location') {
      if (value) nextParams.set('location', value);
      else nextParams.delete('location');
    }

    setSearchParams(nextParams);
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const categories = ['cleaning', 'plumbing', 'electrical', 'gardening', 'tutoring', 'other'];

  // Sort services
  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  // Show sample services if no services found after loading
  const showDefaultExamples = !loading && services.length === 0 && !keyword && !category && !location;
  const displayServices = showDefaultExamples ? sampleServices : sortedServices;

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Services</h1>
          <p className="text-xl text-gray-600">Find the perfect service for your needs</p>
          <p className="text-sm text-gray-500">Search by title, description, provider name, category, or location.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <SearchBar
            keyword={keyword}
            category={category}
            location={location}
            categories={categories}
            locations={[]}
            onKeywordChange={(value) => handleFilterChange('search', value)}
            onCategoryChange={(value) => handleFilterChange('category', value)}
            onLocationChange={(value) => handleFilterChange('location', value)}
          />

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-3">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="inline-block px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="w-full md:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {loading ? (
            Array(8).fill().map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 h-96" />
            ))
          ) : displayServices.length > 0 ? (
            displayServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
