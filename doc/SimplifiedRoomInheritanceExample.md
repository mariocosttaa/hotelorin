# Exemplo da Estrutura Simplificada de Herança

## 🎯 **Como Funciona Agora**

Com a estrutura simplificada, você tem controle total sobre o que cada quarto herda do tipo de quarto através de simples campos boolean.

## 📊 **Estrutura das Tabelas**

### `room_galleries`
- `room_type_id` + `use_type_gallery_in_room = true` → Galeria do tipo de quarto
- `room_id` + `use_type_gallery_in_room = false` → Galeria específica do quarto

### `room_comodites`  
- `room_type_id` + `use_type_comodites_in_room = true` → Comodidades do tipo de quarto
- `room_id` + `use_type_comodites_in_room = false` → Comodidades específicas do quarto

### `room_prices`
- `room_type_id` + `use_type_price_in_room = true` → Preços do tipo de quarto
- `room_id` + `use_type_price_in_room = false` → Preços específicos do quarto

## 🚀 **Exemplo Prático**

### 1. Criando Tipo de Quarto "Luxo"

```php
// Criar tipo de quarto
$roomType = RoomTypeModel::create([
    'name_pt' => 'Quarto Luxo',
    'name_en' => 'Luxury Room',
    'description_pt' => 'Quarto espaçoso com vista para o mar'
]);

// Galeria do tipo de quarto
RoomGalleryModel::create([
    'room_type_id' => $roomType->id,
    'use_type_gallery_in_room' => true,
    'type' => 'image',
    'src' => '/luxury-room-1.jpg'
]);

RoomGalleryModel::create([
    'room_type_id' => $roomType->id,
    'use_type_gallery_in_room' => true,
    'type' => 'image', 
    'src' => '/luxury-room-2.jpg'
]);

// Comodidades do tipo de quarto
$comodites = ComoditeModel::whereIn('name_pt', ['Wi-Fi', 'Ar Condicionado', 'TV'])->get();
foreach ($comodites as $comodite) {
    RoomComoditeModel::create([
        'room_type_id' => $roomType->id,
        'comodite_id' => $comodite->id,
        'use_type_comodites_in_room' => true
    ]);
}

// Preços do tipo de quarto
RoomPriceModel::create([
    'room_type_id' => $roomType->id,
    'use_type_price_in_room' => true,
    'price' => 20000, // $200.00
    'currency_code' => 'USD',
    'status' => true
]);
```

### 2. Criando Quartos

```php
// Quarto 101 - Herda tudo do tipo
$room101 = RoomModel::create([
    'room_type_id' => $roomType->id,
    'max_adults' => 2,
    'max_children' => 1
]);

// Quarto 102 - Herda + personalizações
$room102 = RoomModel::create([
    'room_type_id' => $roomType->id,
    'max_adults' => 3,
    'max_children' => 2
]);

// Adicionar galeria específica do quarto 102
RoomGalleryModel::create([
    'room_id' => $room102->id,
    'use_type_gallery_in_room' => false,
    'type' => 'image',
    'src' => '/room-102-terrace.jpg'
]);

// Adicionar comodidade específica do quarto 102
$terraceComodite = ComoditeModel::where('name_pt', 'Terraço')->first();
RoomComoditeModel::create([
    'room_id' => $room102->id,
    'comodite_id' => $terraceComodite->id,
    'use_type_comodites_in_room' => false
]);

// Preço específico do quarto 102 (mais caro pelo terraço)
RoomPriceModel::create([
    'room_id' => $room102->id,
    'use_type_price_in_room' => false,
    'price' => 25000, // $250.00
    'currency_code' => 'USD',
    'status' => true
]);
```

### 3. Buscando Dados dos Quartos

```php
// Buscar quarto
$room = RoomModel::find(102);

// Galeria completa (própria + do tipo)
$gallery = $room->getFullGallery();
// Resultado: 3 imagens (2 do tipo + 1 específica)

// Comodidades completas (próprias + do tipo)
$comodites = $room->getFullComodites();
// Resultado: 4 comodidades (3 do tipo + 1 específica)

// Preços (apenas específicos, pois não herda preços)
$prices = $room->getFullPrices();
// Resultado: 1 preço específico ($250)
```

### 4. Interface do Usuário

```php
// Controller
public function show(RoomModel $room)
{
    return Inertia::render('Room/Show', [
        'room' => [
            'id' => $room->id,
            'name' => $room->name, // Herdado do room_type
            'description' => $room->description, // Herdado do room_type
            'gallery' => $room->getFullGallery()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'src' => $item->src,
                    'type' => $item->type,
                    'is_from_type' => $item->use_type_gallery_in_room
                ];
            }),
            'comodites' => $room->getFullComodites()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->comodite->name,
                    'is_from_type' => $item->use_type_comodites_in_room
                ];
            }),
            'prices' => $room->getFullPrices()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'price' => $item->price_formatted,
                    'is_from_type' => $item->use_type_price_in_room
                ];
            })
        ]
    ]);
}
```

## 🎨 **Interface Visual**

```typescript
// Componente React/Vue
const RoomGallery = ({ gallery }) => {
  return (
    <div className="gallery">
      {gallery.map(item => (
        <div key={item.id} className="gallery-item">
          <img src={item.src} alt="" />
          {item.is_from_type && (
            <span className="badge">Do Tipo</span>
          )}
        </div>
      ))}
    </div>
  );
};
```

## ✅ **Vantagens da Estrutura Simplificada**

1. **Simplicidade**: Apenas um campo boolean para controlar herança
2. **Flexibilidade**: Cada item pode ser herdado ou personalizado individualmente
3. **Performance**: Consultas simples e eficientes
4. **Manutenibilidade**: Código limpo e fácil de entender
5. **Escalabilidade**: Fácil adicionar novos quartos e tipos

## 🔧 **Métodos Úteis no Modelo**

```php
// Buscar galeria completa
$room->getFullGallery();

// Buscar comodidades completas  
$room->getFullComodites();

// Buscar preços completos
$room->getFullPrices();
```

Esta estrutura é muito mais prática e funcional que a anterior! 🎉 
