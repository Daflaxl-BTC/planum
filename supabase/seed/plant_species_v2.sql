-- 30 weitere haeufige Zimmerpflanzen (Erweiterung der initialen 20).
-- Bereits angewendet auf project ref `snttiuvcpryobleinmxs` am 2026-04-25.
-- Nutzt `on conflict do nothing`, daher idempotent gegen Re-Runs.

insert into public.plant_species
  (scientific_name, common_name_de, common_name_en, water_interval_days, fertilize_interval_days, repot_interval_months, light_requirement, emoji)
values
  ('Phalaenopsis amabilis', 'Schmetterlingsorchidee', 'Moth orchid', 7, 14, 24, 'bright', '🌸'),
  ('Echeveria elegans', 'Mexikanische Felsenrose', 'Mexican snowball', 14, 90, 24, 'direct', '🌵'),
  ('Haworthia fasciata', 'Zebrahaworthie', 'Zebra plant', 14, 90, 24, 'bright', '🌵'),
  ('Ficus benjamina', 'Birkenfeige', 'Weeping fig', 7, 30, 24, 'bright', '🌿'),
  ('Yucca elephantipes', 'Yucca-Palme', 'Spineless yucca', 14, 60, 36, 'direct', '🌴'),
  ('Beaucarnea recurvata', 'Elefantenfuß', 'Ponytail palm', 14, 60, 36, 'bright', '🌴'),
  ('Howea forsteriana', 'Kentia-Palme', 'Kentia palm', 7, 30, 36, 'medium', '🌴'),
  ('Chamaedorea elegans', 'Bergpalme', 'Parlor palm', 7, 30, 24, 'medium', '🌴'),
  ('Nephrolepis exaltata', 'Schwertfarn', 'Boston fern', 4, 30, 12, 'medium', '🌿'),
  ('Adiantum raddianum', 'Frauenhaarfarn', 'Maidenhair fern', 3, 30, 12, 'medium', '🍃'),
  ('Maranta leuconeura', 'Pfeilwurz', 'Prayer plant', 5, 30, 18, 'medium', '🍃'),
  ('Tradescantia zebrina', 'Zebrakraut', 'Wandering jew', 7, 30, 12, 'bright', '🌿'),
  ('Begonia maculata', 'Forellenbegonie', 'Polka dot begonia', 5, 28, 18, 'bright', '🌸'),
  ('Coffea arabica', 'Kaffeestrauch', 'Coffee plant', 7, 30, 24, 'bright', '🌱'),
  ('Citrus limon', 'Zitronenbaum', 'Lemon tree', 7, 21, 24, 'direct', '🍋'),
  ('Saintpaulia ionantha', 'Usambaraveilchen', 'African violet', 5, 28, 12, 'bright', '🌸'),
  ('Senecio rowleyanus', 'Erbsenpflanze', 'String of pearls', 14, 60, 18, 'bright', '🌵'),
  ('Kalanchoe blossfeldiana', 'Flammendes Käthchen', 'Flaming Katy', 14, 60, 18, 'bright', '🌸'),
  ('Schlumbergera truncata', 'Weihnachtskaktus', 'Christmas cactus', 10, 30, 24, 'bright', '🌵'),
  ('Dieffenbachia seguine', 'Dieffenbachie', 'Dumb cane', 7, 30, 18, 'medium', '🌿'),
  ('Aglaonema commutatum', 'Kolbenfaden', 'Chinese evergreen', 7, 42, 24, 'medium', '🌿'),
  ('Codiaeum variegatum', 'Kroton', 'Croton', 5, 28, 18, 'bright', '🍃'),
  ('Cordyline fruticosa', 'Keulenlilie', 'Ti plant', 7, 30, 24, 'bright', '🌿'),
  ('Pachira aquatica', 'Glückskastanie', 'Money tree', 14, 42, 24, 'bright', '🌳'),
  ('Ficus microcarpa', 'Chinesische Feige', 'Chinese banyan', 7, 30, 24, 'bright', '🌳'),
  ('Asparagus setaceus', 'Zierspargel', 'Common asparagus fern', 7, 30, 18, 'bright', '🌿'),
  ('Cycas revoluta', 'Palmfarn', 'Sago palm', 14, 60, 36, 'bright', '🌴'),
  ('Aspidistra elatior', 'Schusterpalme', 'Cast iron plant', 14, 60, 36, 'low', '🌿'),
  ('Cissus rhombifolia', 'Klimmlilie', 'Grape ivy', 7, 30, 24, 'medium', '🌿'),
  ('Polyscias fruticosa', 'Federpolyscias', 'Ming aralia', 7, 30, 24, 'bright', '🌿')
on conflict (scientific_name) do nothing;
