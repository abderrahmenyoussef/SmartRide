// Mock Data for SmartRide - Static Version
// This file contains all the static data used throughout the application

// Current authenticated user (can toggle role for demo)
export const mockUser = {
  id: '1',
  username: 'Ahmed',
  email: 'ahmed@example.com',
  role: 'conducteur', // 'passager' or 'conducteur'
  rating: 4.5,
  isVerified: true,
  avatar: null
};

// Stats for the dashboard
export const mockStats = {
  co2Saved: 1250,
  activeUsers: 3500,
  sharedRides: 5200
};

// Available rides (for passengers to browse)
export const mockRides = [
  {
    id: '1',
    departure: 'Tunis',
    arrival: 'Sousse',
    date: new Date(2025, 11, 15),
    time: '08:30',
    price: 25,
    availableSeats: 3,
    driverName: 'Thomas D.',
    driverRating: 4.8,
    description: 'Départ du centre-ville, climatisation disponible.'
  },
  {
    id: '2',
    departure: 'Sfax',
    arrival: 'Tunis',
    date: new Date(2025, 11, 16),
    time: '14:00',
    price: 35,
    availableSeats: 2,
    driverName: 'Sophie M.',
    driverRating: 4.9,
    description: 'Voyage confortable, arrêt possible à Sousse.'
  },
  {
    id: '3',
    departure: 'Bizerte',
    arrival: 'Tunis',
    date: new Date(2025, 11, 17),
    time: '07:00',
    price: 15,
    availableSeats: 4,
    driverName: 'Karim B.',
    driverRating: 4.6,
    description: 'Trajet matinal, idéal pour les travailleurs.'
  },
  {
    id: '4',
    departure: 'Tunis',
    arrival: 'Hammamet',
    date: new Date(2025, 11, 18),
    time: '10:00',
    price: 20,
    availableSeats: 3,
    driverName: 'Marie L.',
    driverRating: 4.7,
    description: 'Trajet direct, bagages acceptés.'
  },
  {
    id: '5',
    departure: 'Sousse',
    arrival: 'Monastir',
    date: new Date(2025, 11, 19),
    time: '16:30',
    price: 10,
    availableSeats: 2,
    driverName: 'Ali K.',
    driverRating: 4.5,
    description: 'Court trajet, flexible sur les horaires.'
  }
];

// Driver's own rides (for conducteur view)
export const mockDriverRides = [
  {
    id: '101',
    departure: 'Tunis',
    arrival: 'Sousse',
    date: new Date(2025, 11, 20),
    time: '09:00',
    price: 25,
    availableSeats: 3,
    totalSeats: 4,
    reservedSeats: 1,
    description: 'Mon trajet régulier du weekend.'
  },
  {
    id: '102',
    departure: 'Tunis',
    arrival: 'Sfax',
    date: new Date(2025, 11, 22),
    time: '07:30',
    price: 40,
    availableSeats: 2,
    totalSeats: 4,
    reservedSeats: 2,
    description: 'Voyage pour le travail, retour le soir.'
  }
];

// Passenger's reservations
export const mockReservations = [
  {
    id: '3',
    reservationId: 'r1',
    departure: 'Tunis',
    arrival: 'Sfax',
    date: new Date(2025, 11, 20),
    time: '08:30',
    price: 35,
    availableSeats: 2,
    driverName: 'Marie L.',
    driverRating: 4.9,
    places: 1,
    reservationDate: new Date(2025, 10, 28),
    status: 'confirmed'
  },
  {
    id: '4',
    reservationId: 'r2',
    departure: 'Sousse',
    arrival: 'Tunis',
    date: new Date(2025, 11, 25),
    time: '18:00',
    price: 25,
    availableSeats: 3,
    driverName: 'Karim B.',
    driverRating: 4.6,
    places: 2,
    reservationDate: new Date(2025, 10, 29),
    status: 'confirmed'
  }
];

// Testimonials for the landing section
export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah M.',
    avatar: null,
    rating: 5,
    comment: 'Excellent service ! J\'ai économisé beaucoup sur mes trajets quotidiens. Les conducteurs sont très sympathiques.',
    date: new Date(2025, 10, 15)
  },
  {
    id: '2',
    name: 'Mohammed K.',
    avatar: null,
    rating: 5,
    comment: 'Application très pratique pour mes déplacements professionnels. Je recommande vivement !',
    date: new Date(2025, 10, 20)
  },
  {
    id: '3',
    name: 'Fatma B.',
    avatar: null,
    rating: 4,
    comment: 'Bonne expérience globale. Le covoiturage est devenu ma solution préférée pour voyager.',
    date: new Date(2025, 10, 25)
  }
];

// Features for the landing section
export const mockFeatures = [
  {
    id: '1',
    icon: 'fa-wallet',
    title: 'Économique',
    description: 'Partagez les frais de voyage et économisez jusqu\'à 75% sur vos trajets.',
    color: '#4CAF50'
  },
  {
    id: '2',
    icon: 'fa-leaf',
    title: 'Écologique',
    description: 'Réduisez votre empreinte carbone en partageant votre véhicule.',
    color: '#2196F3'
  },
  {
    id: '3',
    icon: 'fa-shield-alt',
    title: 'Sécurisé',
    description: 'Profils vérifiés, avis des utilisateurs et système de notation.',
    color: '#FF9800'
  },
  {
    id: '4',
    icon: 'fa-users',
    title: 'Convivial',
    description: 'Rencontrez de nouvelles personnes et rendez vos trajets agréables.',
    color: '#9C27B0'
  }
];

// Helper function to format date
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Helper function to format time
export const formatTime = (time) => {
  return time || '';
};

// Helper function to format price
export const formatPrice = (price) => {
  return `${price.toFixed(2)} DT`;
};

// Helper function to generate star rating
export const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
};
