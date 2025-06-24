import { useState } from "react";
import Button from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Calendar, MapPin, Star, Wifi, Car, Utensils, Dumbbell, Users, Building2, Globe, Phone, Mail, Clock, Award, Menu, X, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/Carousel";
import '@/css/frontend-public/style.css'
import '@/css/tailwind.css'
import PublicNavbar from "../../layout/parts/PublicNavbar";

export default function PublicHotel() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [language, setLanguage] = useState("pt");
  const [currency, setCurrency] = useState("EUR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const translations = {
    pt: {
      title: "Grand Palace Hotel",
      subtitle: "Luxo e elegância no coração da cidade",
      location: "123 Ocean Drive, Miami Beach, FL",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Hóspedes",
      searchRooms: "Buscar Quartos",
      amenities: "Comodidades do Hotel",
      availableRooms: "Quartos Disponíveis",
      viewAllRooms: "Ver Todos os Quartos",
      bookNow: "Reservar Agora",
      perNight: "por noite",
      upTo: "Até",
      guestsText: "hóspedes",
      gallery: "Galeria do Hotel",
      testimonials: "O que dizem os nossos hóspedes",
      navigation: {
        home: "Início",
        rooms: "Quartos",
        amenities: "Comodidades",
        contact: "Contacto"
      },
      amenitiesList: {
        wifi: "WiFi Gratuito",
        parking: "Estacionamento",
        restaurant: "Restaurante",
        fitness: "Centro de Fitness",
        spa: "Spa & Wellness",
        pool: "Piscina",
        concierge: "Concierge 24h",
        business: "Centro de Negócios"
      },
      footer: {
        about: "Sobre o Hotel",
        aboutText: "O Grand Palace Hotel oferece uma experiência única de luxo e conforto, com mais de 50 anos de tradição em hospitalidade.",
        quickLinks: "Links Rápidos",
        contact: "Contacto",
        followUs: "Siga-nos",
        newsletter: "Newsletter",
        newsletterText: "Subscreva para receber ofertas exclusivas",
        subscribe: "Subscrever",
        rights: "Todos os direitos reservados."
      }
    },
    en: {
      title: "Grand Palace Hotel",
      subtitle: "Luxury and elegance in the heart of the city",
      location: "123 Ocean Drive, Miami Beach, FL",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      searchRooms: "Search Rooms",
      amenities: "Hotel Amenities",
      availableRooms: "Available Rooms",
      viewAllRooms: "View All Rooms",
      bookNow: "Book Now",
      perNight: "per night",
      upTo: "Up to",
      guestsText: "guests",
      gallery: "Hotel Gallery",
      testimonials: "What our guests say",
      navigation: {
        home: "Home",
        rooms: "Rooms",
        amenities: "Amenities",
        contact: "Contact"
      },
      amenitiesList: {
        wifi: "Free WiFi",
        parking: "Parking",
        restaurant: "Restaurant",
        fitness: "Fitness Center",
        spa: "Spa & Wellness",
        pool: "Swimming Pool",
        concierge: "24h Concierge",
        business: "Business Center"
      },
      footer: {
        about: "About Hotel",
        aboutText: "Grand Palace Hotel offers a unique experience of luxury and comfort, with over 50 years of tradition in hospitality.",
        quickLinks: "Quick Links",
        contact: "Contact",
        followUs: "Follow Us",
        newsletter: "Newsletter",
        newsletterText: "Subscribe to receive exclusive offers",
        subscribe: "Subscribe",
        rights: "All rights reserved."
      }
    },
    es: {
      title: "Grand Palace Hotel",
      subtitle: "Lujo y elegancia en el corazón de la ciudad",
      location: "123 Ocean Drive, Miami Beach, FL",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      searchRooms: "Buscar Habitaciones",
      amenities: "Servicios del Hotel",
      availableRooms: "Habitaciones Disponibles",
      viewAllRooms: "Ver Todas las Habitaciones",
      bookNow: "Reservar Ahora",
      perNight: "por noche",
      upTo: "Hasta",
      guestsText: "huéspedes",
      gallery: "Galería del Hotel",
      testimonials: "Lo que dicen nuestros huéspedes",
      navigation: {
        home: "Inicio",
        rooms: "Habitaciones",
        amenities: "Servicios",
        contact: "Contacto"
      },
      amenitiesList: {
        wifi: "WiFi Gratuito",
        parking: "Aparcamiento",
        restaurant: "Restaurante",
        fitness: "Centro de Fitness",
        spa: "Spa & Bienestar",
        pool: "Piscina",
        concierge: "Conserjería 24h",
        business: "Centro de Negocios"
      },
      footer: {
        about: "Sobre el Hotel",
        aboutText: "Grand Palace Hotel ofrece una experiencia única de lujo y comodidad, con más de 50 años de tradición en hospitalidad.",
        quickLinks: "Enlaces Rápidos",
        contact: "Contacto",
        followUs: "Síguenos",
        newsletter: "Newsletter",
        newsletterText: "Suscríbete para recibir ofertas exclusivas",
        subscribe: "Suscribirse",
        rights: "Todos los derechos reservados."
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  const currencySymbols = {
    EUR: "€",
    USD: "$",
    GBP: "£"
  };

  const rooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      price: 299,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      amenities: ["Ocean View", "King Bed", "WiFi", "Mini Bar"],
      maxGuests: 2
    },
    {
      id: 2,
      name: "Executive Suite",
      price: 459,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      amenities: ["City View", "Separate Living Area", "WiFi", "Kitchenette"],
      maxGuests: 4
    },
    {
      id: 3,
      name: "Standard Double",
      price: 199,
      image: "https://images.unsplash.com/photo-1631049552240-59c37f38802b",
      amenities: ["Garden View", "Double Bed", "WiFi", "Coffee Maker"],
      maxGuests: 2
    }
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      title: "Luxury Lounge",
      description: "Relax in our sophisticated lobby lounge"
    },
    {
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      title: "Natural Surroundings",
      description: "Enjoy the beautiful nature views from our property"
    },
    {
      url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      title: "Elegant Architecture",
      description: "Our hotel combines modern luxury with timeless design"
    },
    {
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      title: "Evening Ambiance",
      description: "Experience magical evenings at our outdoor spaces"
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Waterfront Views",
      description: "Wake up to stunning water views every morning"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      location: "Lisboa, Portugal",
      rating: 5,
      comment: "Uma experiência absolutamente incrível! O atendimento foi impecável e as instalações de primeira classe. Recomendo vivamente!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "John Smith",
      location: "London, UK",
      rating: 5,
      comment: "Outstanding service and beautiful facilities. The ocean view from our room was breathtaking. We'll definitely be back!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Carlos Rodriguez",
      location: "Madrid, España",
      rating: 5,
      comment: "Un hotel excepcional con un personal muy atento. La ubicación es perfecta y las habitaciones son lujosas. ¡Volveremos sin duda!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sophie Dubois",
      location: "Paris, France",
      rating: 5,
      comment: "Un séjour magnifique dans un cadre exceptionnel. Le service est irréprochable et l'attention aux détails remarquable.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <PublicNavbar active="home" />

      {/* Responsive Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="Grand Palace Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 lg:mb-8 font-light">{t.subtitle}</p>
              <div className="flex items-center justify-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                <MapPin className="h-4 w-4 lg:h-6 lg:w-6 text-blue-300" />
                <span className="text-sm sm:text-base lg:text-xl">{t.location}</span>
              </div>
              <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-6 lg:mb-8">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-4 w-4 lg:h-6 lg:w-6 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 lg:ml-3 text-sm lg:text-lg">4.8 (1,247 reviews)</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400" />
                  <span>Luxury Hotel Award 2023</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-300" />
                  <span>24/7 Concierge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Search Bar */}
      <div className="bg-white shadow-2xl -mt-10 lg:-mt-20 relative z-10 mx-4 lg:mx-8 rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-blue-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
            <div className="space-y-2">
              <label className="block text-xs lg:text-sm font-semibold text-gray-700">{t.checkIn}</label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value)}
                className="w-full h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs lg:text-sm font-semibold text-gray-700">{t.checkOut}</label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckOut(e.target.value)}
                className="w-full h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs lg:text-sm font-semibold text-gray-700">{t.guests}</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 {t.guestsText}</SelectItem>
                  <SelectItem value="2">2 {t.guestsText}</SelectItem>
                  <SelectItem value="3">3 {t.guestsText}</SelectItem>
                  <SelectItem value="4">4 {t.guestsText}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/room-search" className="sm:col-span-2 lg:col-span-1">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full h-10 lg:h-12 rounded-lg lg:rounded-xl text-sm lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                {t.searchRooms}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hotel Gallery Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-8 lg:mb-16 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            {t.gallery}
          </h2>

          <div className="relative">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                              <p className="text-sm opacity-90">{image.description}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 lg:-left-8" />
              <CarouselNext className="hidden md:flex -right-4 lg:-right-8" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Amenities */}
      <section id="amenities" className="py-12 lg:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-8 lg:mb-16 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            {t.amenities}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { icon: Wifi, name: t.amenitiesList.wifi, color: "bg-blue-500" },
              { icon: Car, name: t.amenitiesList.parking, color: "bg-green-500" },
              { icon: Utensils, name: t.amenitiesList.restaurant, color: "bg-orange-500" },
              { icon: Dumbbell, name: t.amenitiesList.fitness, color: "bg-red-500" },
            ].map((amenity, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`${amenity.color} w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <amenity.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <span className="text-xs lg:text-base text-gray-700 font-medium">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Available Rooms */}
      <section className="py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 lg:mb-16 space-y-4 sm:space-y-0">
            <h2 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              {t.availableRooms}
            </h2>
            <Link href="/room-search">
              <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm lg:text-base">
                {t.viewAllRooms}
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 lg:gap-8">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group">
                <div className="grid lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-1 relative overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-48 sm:h-56 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold text-gray-800">
                        {t.upTo} {room.maxGuests} {t.guestsText}
                      </div>
                    </div>
                  </div>
                  <CardContent className="lg:col-span-2 p-4 lg:p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start mb-4 lg:mb-6 space-y-3 lg:space-y-0">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">{room.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500" />
                          <span className="text-sm lg:text-base text-gray-600">{t.upTo} {room.maxGuests} {t.guestsText}</span>
                        </div>
                      </div>
                      <div className="text-left lg:text-right">
                        <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                          {currencySymbols[currency as keyof typeof currencySymbols]}{room.price}
                        </div>
                        <div className="text-sm lg:text-base text-gray-500">{t.perNight}</div>
                      </div>
                    </div>

                    <div className="mb-4 lg:mb-6">
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 lg:px-4 py-1 lg:py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-xs lg:text-sm font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link href={`/booking/${room.id}`}>
                      <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 lg:px-8 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
                        {t.bookNow}
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 lg:py-20 px-4 bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold text-center mb-8 lg:mb-16 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            {t.testimonials}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 lg:p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg lg:text-xl font-bold text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm lg:text-base text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                  <p className="text-sm lg:text-base text-gray-700 leading-relaxed pl-6 italic">
                    "{testimonial.comment}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 py-12 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <div className="space-y-3 lg:space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-1.5 lg:p-2 rounded-lg lg:rounded-xl">
                  <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <span className="text-lg lg:text-2xl font-bold text-white">{t.title}</span>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed">{t.footer.aboutText}</p>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm lg:text-base text-gray-300">4.8/5</span>
              </div>
            </div>

            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">{t.footer.quickLinks}</h3>
              <ul className="space-y-1 lg:space-y-2">
                <li><Link href="/demo-hotel" className="text-sm lg:text-base text-gray-300 hover:text-blue-400 transition-colors">{t.navigation.home}</Link></li>
                <li><Link href="/room-search" className="text-sm lg:text-base text-gray-300 hover:text-blue-400 transition-colors">{t.navigation.rooms}</Link></li>
                <li><a href="#amenities" className="text-sm lg:text-base text-gray-300 hover:text-blue-400 transition-colors">{t.navigation.amenities}</a></li>
                <li><a href="#contact" className="text-sm lg:text-base text-gray-300 hover:text-blue-400 transition-colors">{t.navigation.contact}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">{t.footer.contact}</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs lg:text-base text-gray-300">{t.location}</span>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs lg:text-base text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-xs lg:text-base text-gray-300">info@grandpalace.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">{t.footer.newsletter}</h3>
              <p className="text-xs lg:text-base text-gray-300 mb-3 lg:mb-4">{t.footer.newsletterText}</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input placeholder="Email" className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm lg:text-base h-8 lg:h-10" />
                <Button className="bg-blue-600 hover:bg-blue-700 text-xs lg:text-sm h-8 lg:h-10 px-3 lg:px-4">{t.footer.subscribe}</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 lg:pt-8 text-center">
            <p className="text-xs lg:text-base text-gray-400">© 2024 {t.title}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

