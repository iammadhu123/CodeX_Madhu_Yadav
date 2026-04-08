import ServiceCard from '../components/ServiceCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Search } from 'lucide-react';
import sampleServices from '../data/sampleServices';

const Home = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState(sampleServices.slice(0, 6));
  const [loading, setLoading] = useState(true);
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const list = services.length > 0 ? services : sampleServices;
    const serviceValue = serviceQuery.trim();
    const locationValue = locationQuery.trim();

    const filtered = list.filter((service) => {
      const byService = serviceValue
        ? new RegExp(serviceValue, 'i').test(service.title) ||
          new RegExp(serviceValue, 'i').test(service.description) ||
          new RegExp(serviceValue, 'i').test(service.category) ||
          new RegExp(serviceValue, 'i').test(service.provider?.name)
        : true;
      const byLocation = locationValue
        ? new RegExp(locationValue, 'i').test(service.location)
        : true;
      const byCategory = categoryFilter ? service.category === categoryFilter : true;
      return byService && byLocation && byCategory;
    });

    setFilteredServices(filtered.slice(0, 6));
  }, [serviceQuery, locationQuery, categoryFilter, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/services');
      setServices(res.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set('keyword', serviceQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    if (categoryFilter) params.set('category', categoryFilter);
    navigate(`/services?${params.toString()}`);
  };

  const featuredServices = filteredServices;
  const categoryCards = [
    { emoji: '❄️', name: 'AC Repair', key: 'ac repair' },
    { emoji: '🚰', name: 'Plumbing', key: 'plumbing' },
    { emoji: '💡', name: 'Electrical', key: 'electrical' },
    { emoji: '🌿', name: 'Gardening', key: 'gardening' },
    { emoji: '📚', name: 'Tutoring', key: 'tutoring' },
    { emoji: '🧹', name: 'Cleaning', key: 'cleaning' }
  ];

  const categoryStats = categoryCards.map((category) => ({
    ...category,
    count: services.filter((service) => service.category === category.key).length || Math.floor(Math.random() * 20) + 5
  }));

  const providerPool = services.length > 0 ? services : sampleServices;
  const providerMap = providerPool.reduce((acc, service) => {
    const id = service.provider?._id || `${service.provider?.email}-${service.provider?.name}`;
    if (!id || acc[id]) return acc;
    acc[id] = service.provider;
    return acc;
  }, {});
  const featuredProviders = Object.values(providerMap).slice(0, 4);

  return (
    <div>
      <div className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          ServiceSphere - Local Services at Your Doorstep
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Find verified local providers for repairs, home services, tutoring and more.
        </p>
        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1.3fr_0.7fr] items-end max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-lg">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a service or provider"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-4 pr-4 py-4 rounded-2xl border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <section className="py-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Service Categories</h2>
            <p className="text-gray-600 mt-2">Tap a category to view matching local providers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStats.map((category) => (
            <button
              key={category.key}
              onClick={() => {
                setCategoryFilter(category.key);
                navigate(`/services?category=${encodeURIComponent(category.key)}`);
              }}
              className="group bg-white rounded-3xl border border-gray-200 p-6 text-left shadow-sm hover:shadow-lg hover:border-blue-200 transition"
            >
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count}+ providers</p>
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-50 rounded-3xl mx-4 md:mx-8 px-6 py-10 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Featured Providers</h2>
            <p className="text-gray-600 mt-2">Browse top-rated providers ready to serve your neighborhood.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider, index) => (
              <div key={index} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-semibold text-xl">
                    {provider?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{provider?.name || 'Trusted Provider'}</h3>
                    <p className="text-sm text-gray-500">{provider?.location || 'Local area'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {provider?.bio || 'Reliable local service provider with fast response and quality work.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Browse services
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Popular local services available right now
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-96" />
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {featuredServices.map((service) => (
              <ServiceCard key={service._id || service.id} service={service} disableLink={!services.length} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try a different search to discover local providers.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
