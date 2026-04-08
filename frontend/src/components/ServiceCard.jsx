import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, ShieldCheck } from 'lucide-react';

const ServiceCard = ({ service, disableLink = false }) => {
  const rating = Math.round(service.rating || 0);

  const destinationId = service._id || service.id;

  const content = (
    <>
      <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl mb-5 flex items-center justify-center transition-colors group-hover:from-blue-100 group-hover:to-indigo-200">
        <span className="text-5xl opacity-20">🛠️</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">{service.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{service.category || 'Local Service'}</p>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            ${service.price}
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{service.description}</p>
      </div>

      <div className="flex items-center justify-between mb-5 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{service.location || 'Nearby'}</span>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              fill={index < rating ? 'currentColor' : 'none'}
              className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-gray-700">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mb-5 rounded-3xl border border-gray-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
            {service.provider?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{service.provider?.name || 'Local provider'}</p>
            <p className="text-sm text-gray-500">{service.provider?.email || 'No email provided'}</p>
          </div>
        </div>
        {service.provider?.isVerified && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck className="h-4 w-4" /> Verified provider
          </div>
        )}
      </div>
    </>
  );

  if (disableLink) {
    return (
      <div className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/services/${destinationId}`}
      className="group bg-white rounded-3xl border border-gray-200 p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 block"
    >
      {content}
    </Link>
  );
};

export default ServiceCard;
