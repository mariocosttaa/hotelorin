<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Seeder;
use App\Models\Tenant\ComoditeModel;

class ComoditeSeeder extends Seeder
{
    public function run()
    {
        $comodites = [
            // Basic Amenities
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>',
                'name_en' => 'Air Conditioning',
                'name_pt' => 'Ar Condicionado',
                'name_es' => 'Aire Acondicionado',
                'name_fr' => 'Climatisation',
                'description_en' => 'Individual climate control for your comfort',
                'description_pt' => 'Controle climático individual para seu conforto',
                'description_es' => 'Control climático individual para su comodidad',
                'description_fr' => 'Contrôle climatique individuel pour votre confort',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
                'name_en' => 'Heating',
                'name_pt' => 'Aquecimento',
                'name_es' => 'Calefacción',
                'name_fr' => 'Chauffage',
                'description_en' => 'Central heating system for cold weather',
                'description_pt' => 'Sistema de aquecimento central para clima frio',
                'description_es' => 'Sistema de calefacción central para clima frío',
                'description_fr' => 'Système de chauffage central pour temps froid',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
                'name_en' => 'Wi-Fi',
                'name_pt' => 'Wi-Fi',
                'name_es' => 'Wi-Fi',
                'name_fr' => 'Wi-Fi',
                'description_en' => 'High-speed wireless internet access',
                'description_pt' => 'Acesso à internet sem fio de alta velocidade',
                'description_es' => 'Acceso a internet inalámbrico de alta velocidad',
                'description_fr' => 'Accès Internet sans fil haute vitesse',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
                'name_en' => 'TV',
                'name_pt' => 'TV',
                'name_es' => 'TV',
                'name_fr' => 'TV',
                'description_en' => 'Flat-screen television with cable channels',
                'description_pt' => 'Televisão de tela plana com canais a cabo',
                'description_es' => 'Televisión de pantalla plana con canales por cable',
                'description_fr' => 'Télévision à écran plat avec chaînes câblées',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path></svg>',
                'name_en' => 'Mini Fridge',
                'name_pt' => 'Frigobar',
                'name_es' => 'Minibar',
                'name_fr' => 'Mini-réfrigérateur',
                'description_en' => 'In-room refrigerator for beverages and snacks',
                'description_pt' => 'Frigorífico no quarto para bebidas e lanches',
                'description_es' => 'Refrigerador en la habitación para bebidas y aperitivos',
                'description_fr' => 'Réfrigérateur dans la chambre pour boissons et collations',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
                'name_en' => 'Safe',
                'name_pt' => 'Cofre',
                'name_es' => 'Caja Fuerte',
                'name_fr' => 'Coffre-fort',
                'description_en' => 'In-room safe for valuables and documents',
                'description_pt' => 'Cofre no quarto para objetos de valor e documentos',
                'description_es' => 'Caja fuerte en la habitación para objetos de valor y documentos',
                'description_fr' => 'Coffre-fort dans la chambre pour objets de valeur et documents',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
                'name_en' => 'Waste Bin',
                'name_pt' => 'Lixeira',
                'name_es' => 'Papelera',
                'name_fr' => 'Corbeille',
                'description_en' => 'Waste bin for daily cleaning',
                'description_pt' => 'Lixeira para limpeza diária',
                'description_es' => 'Papelera para limpieza diaria',
                'description_fr' => 'Corbeille pour nettoyage quotidien',
            ],

            // Bathroom Amenities
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>',
                'name_en' => 'Private Bathroom',
                'name_pt' => 'Banheiro Privativo',
                'name_es' => 'Baño Privado',
                'name_fr' => 'Salle de Bain Privée',
                'description_en' => 'En-suite bathroom with shower and toilet',
                'description_pt' => 'Banheiro privativo com chuveiro e vaso sanitário',
                'description_es' => 'Baño privado con ducha y inodoro',
                'description_fr' => 'Salle de bain privée avec douche et toilettes',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path></svg>',
                'name_en' => 'Hair Dryer',
                'name_pt' => 'Secador de Cabelo',
                'name_es' => 'Secador de Pelo',
                'name_fr' => 'Sèche-cheveux',
                'description_en' => 'Hair dryer for guest convenience',
                'description_pt' => 'Secador de cabelo para conveniência do hóspede',
                'description_es' => 'Secador de pelo para la comodidad del huésped',
                'description_fr' => 'Sèche-cheveux pour la commodité des invités',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
                'name_en' => 'Toiletries',
                'name_pt' => 'Artigos de Higiene',
                'name_es' => 'Artículos de Aseo',
                'name_fr' => 'Articles de Toilette',
                'description_en' => 'Complimentary toiletries and amenities',
                'description_pt' => 'Artigos de higiene e amenidades gratuitas',
                'description_es' => 'Artículos de aseo y amenidades gratuitas',
                'description_fr' => 'Articles de toilette et commodités gratuits',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>',
                'name_en' => 'Towels',
                'name_pt' => 'Toalhas',
                'name_es' => 'Toallas',
                'name_fr' => 'Serviettes',
                'description_en' => 'Fresh towels provided daily',
                'description_pt' => 'Toalhas frescas fornecidas diariamente',
                'description_es' => 'Toallas frescas proporcionadas diariamente',
                'description_fr' => 'Serviettes fraîches fournies quotidiennement',
            ],

            // Bedding & Furniture
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>',
                'name_en' => 'Queen Bed',
                'name_pt' => 'Cama Queen',
                'name_es' => 'Cama Queen',
                'name_fr' => 'Lit Queen',
                'description_en' => 'Comfortable queen-size bed',
                'description_pt' => 'Cama queen-size confortável',
                'description_es' => 'Cama queen-size cómoda',
                'description_fr' => 'Lit queen-size confortable',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>',
                'name_en' => 'King Bed',
                'name_pt' => 'Cama King',
                'name_es' => 'Cama King',
                'name_fr' => 'Lit King',
                'description_en' => 'Spacious king-size bed',
                'description_pt' => 'Cama king-size espaçosa',
                'description_es' => 'Cama king-size espaciosa',
                'description_fr' => 'Lit king-size spacieux',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>',
                'name_en' => 'Wardrobe',
                'name_pt' => 'Guarda-roupa',
                'name_es' => 'Armario',
                'name_fr' => 'Garde-robe',
                'description_en' => 'Spacious wardrobe for clothing storage',
                'description_pt' => 'Guarda-roupa espaçoso para armazenamento de roupas',
                'description_es' => 'Armario espacioso para almacenamiento de ropa',
                'description_fr' => 'Garde-robe spacieux pour le rangement des vêtements',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
                'name_en' => 'Desk',
                'name_pt' => 'Escrivaninha',
                'name_es' => 'Escritorio',
                'name_fr' => 'Bureau',
                'description_en' => 'Work desk with chair for business travelers',
                'description_pt' => 'Escrivaninha com cadeira para viajantes a negócios',
                'description_es' => 'Escritorio con silla para viajeros de negocios',
                'description_fr' => 'Bureau avec chaise pour voyageurs d\'affaires',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
                'name_en' => 'Chair',
                'name_pt' => 'Cadeira',
                'name_es' => 'Silla',
                'name_fr' => 'Chaise',
                'description_en' => 'Comfortable seating chair',
                'description_pt' => 'Cadeira confortável para sentar',
                'description_es' => 'Silla cómoda para sentarse',
                'description_fr' => 'Chaise confortable pour s\'asseoir',
            ],

            // Additional Amenities
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
                'name_en' => 'Balcony',
                'name_pt' => 'Varanda',
                'name_es' => 'Balcón',
                'name_fr' => 'Balcon',
                'description_en' => 'Private balcony with outdoor seating',
                'description_pt' => 'Varanda privativa com assento ao ar livre',
                'description_es' => 'Balcón privado con asiento al aire libre',
                'description_fr' => 'Balcon privé avec siège extérieur',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>',
                'name_en' => 'Coffee Maker',
                'name_pt' => 'Cafeteira',
                'name_es' => 'Cafetera',
                'name_fr' => 'Machine à Café',
                'description_en' => 'In-room coffee maker with complimentary coffee',
                'description_pt' => 'Cafeteira no quarto com café gratuito',
                'description_es' => 'Cafetera en la habitación con café gratuito',
                'description_fr' => 'Machine à café dans la chambre avec café gratuit',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
                'name_en' => 'Iron & Board',
                'name_pt' => 'Ferro e Tábua',
                'name_es' => 'Plancha y Tabla',
                'name_fr' => 'Fer et Planche',
                'description_en' => 'Iron and ironing board for wrinkle-free clothes',
                'description_pt' => 'Ferro e tábua de passar para roupas sem rugas',
                'description_es' => 'Plancha y tabla de planchar para ropa sin arrugas',
                'description_fr' => 'Fer et planche à repasser pour vêtements sans plis',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
                'name_en' => 'Room Service',
                'name_pt' => 'Serviço de Quarto',
                'name_es' => 'Servicio a la Habitación',
                'name_fr' => 'Service en Chambre',
                'description_en' => '24-hour room service available',
                'description_pt' => 'Serviço de quarto 24 horas disponível',
                'description_es' => 'Servicio a la habitación 24 horas disponible',
                'description_fr' => 'Service en chambre 24h disponible',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
                'name_en' => 'Security Lock',
                'name_pt' => 'Fechadura de Segurança',
                'name_es' => 'Cerradura de Seguridad',
                'name_fr' => 'Serrure de Sécurité',
                'description_en' => 'Electronic security lock for room safety',
                'description_pt' => 'Fechadura eletrônica de segurança para segurança do quarto',
                'description_es' => 'Cerradura electrónica de seguridad para la seguridad de la habitación',
                'description_fr' => 'Serrure électronique de sécurité pour la sécurité de la chambre',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
                'name_en' => 'Smoke Detector',
                'name_pt' => 'Detector de Fumaça',
                'name_es' => 'Detector de Humo',
                'name_fr' => 'Détecteur de Fumée',
                'description_en' => 'Smoke detector for guest safety',
                'description_pt' => 'Detector de fumaça para segurança do hóspede',
                'description_es' => 'Detector de humo para la seguridad del huésped',
                'description_fr' => 'Détecteur de fumée pour la sécurité des invités',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
                'name_en' => 'Blackout Curtains',
                'name_pt' => 'Cortinas Blackout',
                'name_es' => 'Cortinas Blackout',
                'name_fr' => 'Rideaux Occultants',
                'description_en' => 'Blackout curtains for better sleep',
                'description_pt' => 'Cortinas blackout para melhor sono',
                'description_es' => 'Cortinas blackout para mejor sueño',
                'description_fr' => 'Rideaux occultants pour un meilleur sommeil',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
                'name_en' => 'City View',
                'name_pt' => 'Vista da Cidade',
                'name_es' => 'Vista de la Ciudad',
                'name_fr' => 'Vue sur la Ville',
                'description_en' => 'Room with city view',
                'description_pt' => 'Quarto com vista da cidade',
                'description_es' => 'Habitación con vista de la ciudad',
                'description_fr' => 'Chambre avec vue sur la ville',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
                'name_en' => 'Ocean View',
                'name_pt' => 'Vista do Oceano',
                'name_es' => 'Vista del Océano',
                'name_fr' => 'Vue sur l\'Océan',
                'description_en' => 'Room with ocean view',
                'description_pt' => 'Quarto com vista do oceano',
                'description_es' => 'Habitación con vista del océano',
                'description_fr' => 'Chambre avec vue sur l\'océan',
            ],
            [
                'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>',
                'name_en' => 'Mountain View',
                'name_pt' => 'Vista da Montanha',
                'name_es' => 'Vista de la Montaña',
                'name_fr' => 'Vue sur la Montagne',
                'description_en' => 'Room with mountain view',
                'description_pt' => 'Quarto com vista da montanha',
                'description_es' => 'Habitación con vista de la montaña',
                'description_fr' => 'Chambre avec vue sur la montagne',
            ],
        ];

        foreach ($comodites as $comodite) {
            ComoditeModel::updateOrCreate([
                'name_en' => $comodite['name_en'],
            ], $comodite);
        }
    }
}
