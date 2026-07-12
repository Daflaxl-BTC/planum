-- Seed: 10 Platzhalter-Produkte fuer den Pflegeshop.
-- ASINs sind TBD-Marker (B0_TBD_xxx) und MUESSEN ersetzt werden, sobald
-- Felix Amazon PartnerNet aktiviert hat. Affiliate-Tag ebenfalls Platzhalter
-- (PARTNER_ID_TBD). Bilder bewusst NULL -- Frontend rendert dann ein
-- Kategorie-Symbol (kein Hotlink auf Amazon-CDN, AGB-Verstoss).
--
-- Idempotent: laeuft auch nach Re-Run sauber, weil id deterministisch
-- ueber gen_random_uuid() bei Insert vergeben wird; daher pre-Check via
-- title (eindeutig genug fuer Seed).

begin;

insert into public.shop_products
  (category, title, subtitle, description, image_url, affiliate_url, affiliate_network, price_hint, badge, sort_order, active)
select * from (values
  ('duenger',
   'Compo Gruenpflanzen-Duenger 500 ml',
   'Universal-Fluessigduenger',
   'Bewaehrter Mineralduenger fuer alle Zimmer- und Gruenpflanzen. Sparsame Dosierung, lange haltbar.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0001?tag=PARTNER_ID_TBD',
   'amazon', 'ab 6,99 €', 'Empfehlung', 10, true),

  ('duenger',
   'Substral Naturen Bio Zimmerpflanzen-Duenger',
   'Bio-zertifiziert',
   'Organischer Fluessigduenger auf pflanzlicher Basis, fuer alle Zimmerpflanzen geeignet.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0002?tag=PARTNER_ID_TBD',
   'amazon', 'ab 8,49 €', null, 20, true),

  ('erde',
   'Floragard Bio-Zimmerpflanzenerde 5 L',
   'Torffrei',
   'Torffreie Bio-Erde mit Kompost und Holzfasern. Geeignet fuer alle Gruenpflanzen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0003?tag=PARTNER_ID_TBD',
   'amazon', 'ab 7,99 €', 'Bestseller', 30, true),

  ('erde',
   'Compo Sana Kakteen- und Sukkulentenerde 5 L',
   'Mineralisch',
   'Spezialerde mit hohem Sand-/Lavaanteil fuer Kakteen, Sukkulenten und mediterrane Pflanzen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0004?tag=PARTNER_ID_TBD',
   'amazon', 'ab 6,49 €', null, 40, true),

  ('toepfe',
   'LECHUZA Classico LS 28 Selbstbewaesserungstopf',
   'Mit Wasserstandsanzeige',
   'Hochwertiger Pflanztopf mit integriertem Bewaesserungssystem -- bis zu 12 Wochen ohne Giessen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0005?tag=PARTNER_ID_TBD',
   'amazon', 'ab 39,99 €', null, 50, true),

  ('toepfe',
   'Uebertopf Keramik 14 cm (3er-Set)',
   'Schlichtes Design',
   'Mattes Keramik-Set in neutralen Farben -- passt zu jedem Einrichtungsstil.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0006?tag=PARTNER_ID_TBD',
   'amazon', 'ab 19,99 €', null, 60, true),

  ('bewaesserung',
   'Gardena Bewaesserungssystem fuer Zimmerpflanzen',
   'Urlaubsbewaesserung',
   'Automatisches Tropf-Set fuer bis zu 36 Pflanzen -- ideal fuer den Urlaub.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0007?tag=PARTNER_ID_TBD',
   'amazon', 'ab 49,99 €', 'Empfehlung', 70, true),

  ('bewaesserung',
   'Spruehflasche 500 ml mit feinem Nebel',
   'Fuer Blattpflege',
   'Feiner Spruehnebel zur Blattbefeuchtung -- besonders wichtig fuer tropische Pflanzen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0008?tag=PARTNER_ID_TBD',
   'amazon', 'ab 4,99 €', null, 80, true),

  ('werkzeug',
   'Mini-Gartenwerkzeug-Set 3-teilig',
   'Schaufel, Harke, Forke',
   'Kompaktes Werkzeug-Set fuer Umtopf- und Pflegearbeiten an Zimmerpflanzen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0009?tag=PARTNER_ID_TBD',
   'amazon', 'ab 9,99 €', null, 90, true),

  ('sonstiges',
   'Pflanzenleuchte LED-Vollspektrum',
   'Fuer dunkle Standorte',
   'Vollspektrum-LED zur Foerderung des Wachstums lichtbeduerftiger Pflanzen.',
   null,
   'https://www.amazon.de/dp/B0_TBD_0010?tag=PARTNER_ID_TBD',
   'amazon', 'ab 29,99 €', null, 100, true)
) as v(category, title, subtitle, description, image_url, affiliate_url, affiliate_network, price_hint, badge, sort_order, active)
where not exists (
  select 1 from public.shop_products sp where sp.title = v.title
);

commit;
