import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

import BookingForm from './BookingForm';

const categoryImages = {
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  plumbing: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
  electrician: 'https://images.unsplash.com/photo-1581091215367-59ab6b9bdf5b?auto=format&fit=crop&w=1200&q=80',
  gardening: 'https://images.unsplash.com/photo-1598514983318-2f64f8f8e4c3?auto=format&fit=crop&w=1200&q=80',
  tutoring: 'https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1200&q=80',
  other: 'https://images.unsplash.com/photo-1490265440705-3e44d33b3632?auto=format&fit=crop&w=1200&q=80',
};

const ServiceCard = ({ service, disableLink = false }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const navigate = useNavigate();
  const rating = Math.round(service.rating || 0);
  const destinationId = service._id || service.id;
  const reviews = service.reviews || Math.floor((service.rating || 4.5) * 30) + 20;
  const experience = service.provider?.experience || service.experience || '6+ years';
  const defaultImage = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80';
  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBookingForm(true);
  };


  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    navigate('/bookings');
  };

  useEffect(() => {
    if (showBookingForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showBookingForm]);


  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/40 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.75)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-30px_rgba(79,70,229,0.65)]">
        <div className="relative overflow-hidden rounded-b-none rounded-[32px] h-64">
          <img
            src={categoryImages[service.category?.toLowerCase()] || defaultImage}
            alt={service.category || 'Service'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-200 backdrop-blur-md">
            {service.category || 'Service'}
          </div>

          {service.provider?.isVerified && (
            <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/90 to-blue-500/90 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-4 w-4" />
              Verified
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6 md:p-7">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-tight text-white line-clamp-2 leading-tight">
              {service.title}
            </h3>
            <p className="text-sm text-slate-300">{service.provider?.name || 'Premium Provider'}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-3 text-slate-300">
                <Tag className="h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Price/hr</p>
                  <p className="mt-2 text-lg font-semibold text-white">₹{service.price}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-3 text-slate-300">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Experience</p>
                  <p className="mt-2 text-lg font-semibold text-white">{experience}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill={index < (service.rating || 0) ? 'currentColor' : 'none'}
                    className={index < (service.rating || 0) ? 'text-yellow-400' : 'text-slate-500'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">{(service.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-slate-400">({reviews}) reviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-cyan-200" />
              <span>{service.location || 'Nearby'}</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/services/${destinationId}`);
              }}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-white/15"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={handleBookNow}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:brightness-110"
            >
              Book Now

            </button>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBookingForm(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 pb-4 border-b pt-6 px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-xl text-gray-400 hover:text-gray-600 transition"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <BookingForm service={service} onClose={handleBookingSuccess} />
            </div>
          </div>
        </div>
      )}

    </>
  );
};


export default ServiceCard;
