const sampleServices = [
  {
    _id: 'sample-1',
    title: 'Deep House Cleaning Service',
    description: 'Thorough cleaning of 2/3BHK apartments including kitchen deep clean, bathroom sanitization, dusting, mopping and utensil washing.',
    price: 350,
    category: 'cleaning',
    location: 'Bandra West',
    provider: { name: 'Sparkle Homes Cleaning', email: 'book@sparklehomes.in', experience: '8+ years', isVerified: true },
    duration: '3 hours',
    rating: 4.8,
    reviews: 256,
    available: true
  },
  {
    _id: 'sample-2',
    title: 'Emergency Plumbing & Leak Repair',
    description: '24/7 response for pipe leaks, clog removal, tap repairs, water heater issues and full plumbing diagnostics.',
    price: 450,
    category: 'plumbing',
    location: 'Andheri East',
    provider: { name: 'FlowMasters Plumbing', email: 'service@flowmasters.in', experience: '12+ years', isVerified: true },
    duration: '2 hours',
    rating: 4.9,
    reviews: 342,
    available: true
  },
  {
    _id: 'sample-3',
    title: 'Garden Maintenance & Lawn Care',
    description: 'Weekly lawn mowing, hedge trimming, plant watering, weeding, fertilizer application and balcony garden setup.',
    price: 300,
    category: 'gardening',
    location: 'Powai',
    provider: { name: 'GreenScape Services', email: 'care@greenscape.in', experience: '6+ years', isVerified: true },
    duration: '2.5 hours',
    rating: 4.7,
    reviews: 187,
    available: true
  },
  {
    _id: 'sample-4',
    title: 'Math & Science Home Tuition',
    description: 'ICSE/CBSE curriculum tutoring for grades 5-10. Interactive sessions with worksheets, doubt clearing and progress tracking.',
    price: 400,
    category: 'tutoring',
    location: 'Juhu',
    provider: { name: 'Excel Tutors Academy', email: 'tutors@exceltutors.in', experience: '10+ years', isVerified: true },
    duration: '1.5 hours',
    rating: 4.8,
    reviews: 156,
    available: true
  },
  {
    _id: 'sample-5',
    title: 'Electrical Wiring & Repair',
    description: 'Complete electrical fault diagnosis, fan/AC installation, wiring replacement, DB box upgrades and safety checks.',
    price: 500,
    category: 'electrical',
    location: 'Vasant Vihar',
    provider: { name: 'PowerSafe Electricians', email: 'support@powersafe.in', experience: '15+ years', isVerified: true },
    duration: '2 hours',
    rating: 4.6,
    reviews: 210,
    available: true
  },
  {
    _id: 'sample-6',
    title: 'Interior Painting Services',
    description: 'Premium wall painting with Asian Paints, wallpaper installation, texture finishes, ceiling painting and furniture protection.',
    price: 350,
    category: 'other',
    location: 'Malad West',
    provider: { name: 'ColorCraft Painters', email: 'paint@colorcraft.in', experience: '7+ years', isVerified: true },
    duration: '4 hours',
    rating: 4.7,
    reviews: 134,
    available: true
  },
  {
    _id: 'sample-7',
    title: 'AC Service & Deep Cleaning',
    description: 'Split/window AC gas charging, coil cleaning, filter replacement, PCB repairs and annual maintenance contracts.',
    price: 550,
    category: 'other',
    location: 'Goregaon East',
    provider: { name: 'CoolTech AC Services', email: 'service@cooltech.in', experience: '9+ years', isVerified: true },
    duration: '1.5 hours',
    rating: 4.9,
    reviews: 298,
    available: true
  },
  {
    _id: 'sample-8',
    title: 'Pest Control Treatment',
    description: 'Guaranteed German cockroach, termite and rodent control with eco-friendly chemicals. Free follow-up inspection.',
    price: 280,
    category: 'other',
    location: 'Chembur',
    provider: { name: 'SafeGuard Pest Control', email: 'protect@safeguard.in', experience: '11+ years', isVerified: true },
    duration: '2 hours',
    rating: 4.5,
    reviews: 89,
    available: true
  }
];


export default sampleServices;
