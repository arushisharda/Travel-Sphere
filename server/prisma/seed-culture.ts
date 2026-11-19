import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type CultureItem = {
  topic: string;
  title: string;
  body: string;
  contextNote?: string;
  pronunciation?: string;
  sourceNote?: string;
};

const cultureData: Record<string, CultureItem[]> = {
  'amsterdam-netherlands': [
    {
      topic: 'ETIQUETTE',
      title: 'Bike Lane Priority',
      body: 'Never walk in reddish-brown bike lanes. Cyclists have right of way and ring bells loudly if you obstruct them. Always look both ways before stepping across.',
      contextNote: 'Over 60% of all trips in Amsterdam happen on bikes.',
    },
    {
      topic: 'FOOD',
      title: 'Stroopwafel & Herring Rituals',
      body: 'Eat stroopwafels warm over steam from hot coffee or tea to melt the caramel syrup inside. Raw soused herring (Hollandse Nieuwe) is traditionally eaten by holding it by the tail and sliding it into your mouth with chopped raw onions and pickles.',
      contextNote: 'Herring season begins annually in early June.',
    },
    {
      topic: 'MONEY',
      title: 'Pin Only (Card-First Culture)',
      body: 'Many cafes, Albert Heijn supermarkets, and public transit stations are completely cashless ("Pin Only"). Debit cards and contactless credit cards are universally expected.',
      contextNote: 'Mastercard and Visa debit/credit cards with chip & PIN or Apple Pay work everywhere.',
    },
    {
      topic: 'DRESS',
      title: 'Practical Weather-Proof Layers',
      body: 'Dutch locals dress smartly casual but prioritize comfort for cycling. Rain showers pass quickly; carry a wind-resistant shell jacket rather than an umbrella, which will flip inside out in canal winds.',
    },
    {
      topic: 'TRANSPORT',
      title: 'GVB Public Transport & Ferry Access',
      body: 'Tap in and tap out with OVpay (contactless bank card) on all trams, buses, and metros. The free GVB pedestrian/cyclist ferries behind Central Station take you across to Amsterdam Noord.',
    },
    {
      topic: 'SAFETY',
      title: 'Canal Edge Awareness at Night',
      body: 'Most historic canals have no guardrails. Watch your footing after dark, especially near busy nightlife districts like Leidseplein and De Wallen.',
    },
  ],

  'austin-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Keep Austin Weird',
      body: 'Austin has a friendly, laid-back Texas demeanor mixed with creative culture. Casual friendliness is standard; always say hello or acknowledge bartenders, clerks, and neighbors.',
      contextNote: 'Tipping 18-20% at seated restaurants and $1-$2 per drink at bars is customary.',
    },
    {
      topic: 'FOOD',
      title: 'Texas Craft BBQ Pilgrimage',
      body: 'Central Texas barbecue is dry-rubbed, slow-smoked with post oak wood, and sold by weight by the pound on butcher paper. Expect lines starting by 8:30 AM at spots like Franklin BBQ or Micklethwait.',
      contextNote: 'Brisket "moist" (fatty) or "lean" is the signature test of any Texas pitmaster.',
    },
    {
      topic: 'MUSIC',
      title: 'Live Music Capital of the World',
      body: 'Venues on Red River Cultural District, East 6th Street, and South Congress host live bands 7 nights a week. Always tip musicians in the jar or via their Venmo QR codes on stage.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Rideshare and Electric Scooters',
      body: 'Austin is car-centric; downtown and South Congress are walkable, but getting to Zilker Park, Rainey Street, or Mueller is easiest via Uber/Lyft or city bike rentals.',
    },
    {
      topic: 'DRESS',
      title: 'Comfortable Western Casual',
      body: 'Cowboy boots paired with jeans or sundresses are welcomed everywhere from honky-tonks like the White Horse to upscale dining on South Congress.',
    },
  ],

  'bali-indonesia': [
    {
      topic: 'ETIQUETTE',
      title: 'Canang Sari Offerings',
      body: 'Small woven palm-leaf baskets with flowers and incense (Canang Sari) sit on sidewalks and temple entrances. Step around them carefully; stepping on them or kicking them is deeply disrespectful.',
      contextNote: 'Daily offerings express gratitude and balance between visible and invisible worlds.',
    },
    {
      topic: 'DRESS',
      title: 'Temple Sarong and Sash Requirements',
      body: 'Both men and women must cover shoulders and knees to enter any Balinese Hindu temple (Pura). Renting or bringing a sarong and tying a selendang sash around the waist is mandatory.',
    },
    {
      topic: 'FOOD',
      title: 'Warung Dining and Babi Guling',
      body: 'Traditional family-run eateries (warungs) serve authentic Nasi Campur and roasted suckling pig (Babi Guling). Food is traditionally eaten with the right hand; never use your left hand to eat or hand things to elders.',
    },
    {
      topic: 'MONEY',
      title: 'Bargaining at Art Markets',
      body: 'Polite, cheerful bargaining is standard at Ubud Art Market and beach stalls. Start at roughly half the quoted price with a smile, but accept market prices in modern boutiques and supermarkets.',
    },
    {
      topic: 'SAFETY',
      title: 'Scooter Safety & Bali Belly',
      body: 'Only ride scooters if you hold an international permit and wear a helmet; traffic moves on the left. Drink bottled or filtered water and avoid tap water for brushing teeth.',
    },
  ],

  'bangkok-thailand': [
    {
      topic: 'ETIQUETTE',
      title: 'Wai Greeting & Royal Reverence',
      body: 'Place palms together at chest level and bow slightly (the Wai) to greet elders and monks. Speaking disrespectfully of the Thai monarchy is taken very seriously culturally and legally.',
      pronunciation: 'Sawasdee khrup (male) / Sawasdee ka (female)',
    },
    {
      topic: 'FOOD',
      title: 'Street Food Etiquette',
      body: 'Bangkok street food vendors specialize in 1-2 dishes perfected over decades. Condiments like prik nam pla (chilies in fish sauce) and sugar allow personal seasoning balance.',
    },
    {
      topic: 'DRESS',
      title: 'Grand Palace Strict Dress Code',
      body: 'Shoulders, upper arms, and knees must be completely covered at temples like Wat Phra Kaew and Wat Pho. Tight leggings, ripped jeans, and sleeveless shirts are refused entry at the gate.',
    },
    {
      topic: 'TRANSPORT',
      title: 'BTS Skytrain and Chao Phraya Express Boat',
      body: 'Avoid rush-hour road traffic by riding the BTS Skytrain and MRT subway. Blue and orange flag boats along the Chao Phraya River provide scenic, inexpensive transportation to riverside temples.',
    },
    {
      topic: 'MONEY',
      title: 'Cash for Street Stalls and Markets',
      body: 'While malls accept cards and QR PromptPay, cash (Thai Baht) is essential for taxis, tuk-tuks, night markets like Chatuchak, and roadside food vendors.',
    },
  ],

  'barcelona-spain': [
    {
      topic: 'ETIQUETTE',
      title: 'Catalan Pride and Language',
      body: 'Barcelona is the proud capital of Catalonia. While everyone speaks Castilian Spanish, greeting with "Bon dia" (good day) or "Gràcies" (thank you) in Catalan is warmly appreciated.',
      pronunciation: 'Bon dia (bon DEE-ah)',
    },
    {
      topic: 'FOOD',
      title: 'Late Dining and Tapas Crawling',
      body: 'Lunch runs from 1:30 PM to 4:00 PM, and dinner rarely begins before 9:00 PM or 9:30 PM. For an authentic experience, hop between tapas bars in El Born or Gràcia for vermouth and pintxos.',
    },
    {
      topic: 'SAFETY',
      title: 'Pickpocket Awareness in Crowded Spots',
      body: 'Keep bags zipped across your chest on Las Ramblas, near Sagrada Família, and inside busy metro stations like Sants and Plaça de Catalunya.',
    },
    {
      topic: 'DRESS',
      title: 'Smart European Coastal Chic',
      body: 'Locals dress stylishly even in summer heat. Swimwear and shirtless walking are strictly reserved for the beach; wearing swimsuits on city streets can result in fines.',
    },
    {
      topic: 'TRANSPORT',
      title: 'T-Usual and T-Casual Metro Passes',
      body: 'Barcelona has an efficient, air-conditioned metro and bus grid. Buy a multi-trip transit card at any station kiosk for cost-effective travel throughout zone 1.',
    },
  ],

  'boston-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Direct, Civic-Minded Warmth',
      body: 'Bostonians may seem fast-paced and direct, but they are fiercely proud of their historic city and eager to offer directions if asked with genuine curiosity.',
    },
    {
      topic: 'FOOD',
      title: 'Seafood and North End Italian',
      body: 'New England clam chowder is creamy (never tomato-based). Head to the historic North End for authentic wood-fired pizza and cannoli from Mike\'s Pastry or Modern Pastry.',
    },
    {
      topic: 'TRANSPORT',
      title: 'The "T" (MBTA Subway)',
      body: 'Boston is America\'s most walkable major city, tied together by the "T" subway lines (Red, Green, Orange, Blue). The Freedom Trail is marked by a red brick line along sidewalks.',
    },
    {
      topic: 'DRESS',
      title: 'Historic Academic Casual & Weather Layers',
      body: 'Collegiate preppy style is common near Harvard and MIT. Winters demand heavy wool coats and waterproof boots; spring and fall require windbreakers near Boston Harbor.',
    },
  ],

  'cape-town-south-africa': [
    {
      topic: 'ETIQUETTE',
      title: 'The Warm Ubuntu Greeting',
      body: 'South Africa\'s cultural philosophy of "Ubuntu" emphasizes communal respect and interconnectedness. Take time to ask "How are you?" before jumping to business or transactions.',
    },
    {
      topic: 'FOOD',
      title: 'Braai and Cape Malay Cuisine',
      body: 'A braai (wood-fired barbecue) is a sacred social tradition. In the colorful Bo-Kaap neighborhood, try aromatic Cape Malay curries, bobotie, and samosas.',
    },
    {
      topic: 'SAFETY',
      title: 'Urban Situational Awareness',
      body: 'Use registered rideshares (Uber) after dark rather than walking alone through quiet streets. Keep valuables out of plain sight when driving or exploring scenic lookouts.',
    },
    {
      topic: 'DRESS',
      title: 'Outdoor Adventure Gear & Sun Protection',
      body: 'Cape Town weather shifts rapidly with Atlantic and Indian ocean currents ("Four seasons in one day"). Carry layers for Table Mountain cable cars and strong UV sunscreen.',
    },
    {
      topic: 'MONEY',
      title: 'Tipping Norms and Car Guards',
      body: '10-15% is standard in restaurants. Unofficial "car guards" watch parked street cars; giving 5 to 10 South African Rand upon returning to your vehicle is customary.',
    },
  ],

  'charleston-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Southern Hospitality and Courtesies',
      body: 'Charlestonians pride themselves on genuine Southern warmth. Eye contact, gentle smiles, and "ma\'am" or "sir" remain everyday courtesies.',
    },
    {
      topic: 'FOOD',
      title: 'Lowcountry Culinary Heritage',
      body: 'Sample authentic Lowcountry specialties including shrimp and stone-ground grits, she-crab soup with sherry, and Hoppin\' John, deeply influenced by West African Gullah Geechee traditions.',
    },
    {
      topic: 'DRESS',
      title: 'Resort Pastels and Cobblestone Shoes',
      body: 'Historic downtown streets feature uneven colonial cobblestones; opt for stylish flats or sturdy loafers instead of high heels. Light linen and breathable fabrics beat summer humidity.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Historic Walkability and Carriage Tours',
      body: 'Downtown Charleston south of Calhoun Street is best explored on foot or via horse-drawn historic carriages. The free downtown DASH trolley connects major visitor points.',
    },
  ],

  'chicago-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Midwestern Kindness and Neighborhood Pride',
      body: 'Chicago has a grounded, welcoming Midwestern spirit across its 77 distinct community neighborhoods. Locals love discussing sports, architecture, and food.',
    },
    {
      topic: 'FOOD',
      title: 'Deep Dish vs. Tavern-Style Pizza',
      body: 'While tourists flock to deep-dish at Lou Malnati\'s or Pequod\'s, everyday locals often order square-cut, crispy "tavern-style" thin crust. Never put ketchup on an authentic Chicago hot dog.',
    },
    {
      topic: 'TRANSPORT',
      title: 'The ' + 'CTA "L" Train',
      body: 'The elevated "L" train loops through downtown (the Loop) and connects O\'Hare and Midway airports directly to city center for under $5.',
    },
    {
      topic: 'DRESS',
      title: 'Dressing for Lake Effect Winds',
      body: 'Lake Michigan generates brisk winds year-round. In winter, an insulated parka and thermal accessories are essential; summers are vibrant for lakefront beach and rooftop wear.',
    },
  ],

  'denver-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Outdoor Mountain Culture',
      body: 'Denverites prioritize outdoor recreation, fitness, and environmental mindfulness. "Leave No Trace" principles are taken seriously in parks and nearby Rocky Mountain trails.',
    },
    {
      topic: 'FOOD',
      title: 'Craft Beer & Green Chile',
      body: 'Denver has one of the highest densities of microbreweries in the world. Colorado green chile (pork-based green chili sauce) is poured generously over breakfast burritos and eggs.',
    },
    {
      topic: 'SAFETY',
      title: 'Mile High Altitude Acclimatization',
      body: 'At 5,280 feet (1,600m), alcohol hits faster and dehydration occurs quickly. Drink twice as much water as usual and take it easy on strenuous hikes for your first 24-48 hours.',
    },
    {
      topic: 'DRESS',
      title: 'Performance Athleisure & Fleece',
      body: 'Technical outdoor brands (Patagonia, Arc\'teryx, Smartwool) are accepted dress code everywhere from brewery patios to upscale downtown restaurants.',
    },
  ],

  'dubai-uae': [
    {
      topic: 'ETIQUETTE',
      title: 'Respecting Islamic Customs and Modesty',
      body: 'Public displays of romantic affection (hugging, kissing) should be kept private. Avoid handshakes with members of the opposite sex unless they extend their hand first.',
    },
    {
      topic: 'DRESS',
      title: 'Mall and Public Space Dress Codes',
      body: 'In luxury hotels, beach clubs, and private resorts, modern resort-wear is standard. In public malls and cultural heritage zones like Al Fahidi, cover shoulders and knees.',
    },
    {
      topic: 'MONEY',
      title: 'Tax-Free Shopping and Service Charges',
      body: 'Restaurants typically add a 10% service charge, but rounding up 5-10% in cash for staff is appreciated for attentive service. Gold Souk merchants expect polite bargaining.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Driverless Metro and Abra Boats',
      body: 'The Dubai Metro is immaculate with designated Gold Class and Women/Children cars. Cross the historic Dubai Creek on a traditional wooden Abra for only 1 AED (roughly $0.25).',
    },
  ],

  'honolulu-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'The Meaning of Aloha and Malama Aina',
      body: 'Aloha is a philosophy of mutual kindness, humility, and patience. Always practice "Malama Aina" (care and respect for the land and ocean). Never touch green sea turtles (honu) or monk seals.',
    },
    {
      topic: 'FOOD',
      title: 'Plate Lunches and Authentic Poke',
      body: 'Hawaiian food culture blends Native Hawaiian, Japanese, Filipino, and Portuguese culinary roots. Traditional poke is fresh seasoned raw ahi tuna (never drenched in salad toppings like mainland bowls).',
    },
    {
      topic: 'DRESS',
      title: 'Aloha Shirts as Formalwear',
      body: 'High-quality collared Aloha shirts with tailored trousers are considered formal business attire in Hawaii. Always remove slippers (flip-flops) before entering someone\'s home.',
    },
    {
      topic: 'SAFETY',
      title: 'Ocean Currents and Reef-Safe Sunscreen',
      body: 'Hawaii law requires mineral reef-safe sunscreen (no oxybenzone or octinoxate) to protect fragile coral reefs. Always respect lifeguard warning flags and never turn your back on ocean waves.',
    },
  ],

  'istanbul-turkey': [
    {
      topic: 'ETIQUETTE',
      title: 'Turkish Hospitality and Cay Offering',
      body: 'Accepting a glass of hot black tea (cay) served in a tulip-shaped glass is a sign of friendship and goodwill. Never refuse rudely; if full, leave your teaspoon resting across the glass brim.',
    },
    {
      topic: 'DRESS',
      title: 'Mosque Etiquette at Blue Mosque & Hagia Sophia',
      body: 'Remove your shoes at the entrance and place them in the provided racks. Women must cover their hair, shoulders, and legs; men should wear trousers past the knee.',
    },
    {
      topic: 'FOOD',
      title: 'Meze and Kahvalti Breakfast Rituals',
      body: 'Turkish breakfast (Serpme Kahvalti) is a grand weekend affair featuring cheeses, olives, jams, eggs, and simit bread. Pair street food like balik ekmek (fish sandwich) by Galata Bridge.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Intercontinental Bosphorus Ferries',
      body: 'Ride the public Sehir Hatlari ferry between Eminonu (Europe) and Kadikoy (Asia) using your Istanbulkart transit card for the world\'s best commuter boat crossing.',
    },
    {
      topic: 'MONEY',
      title: 'Bargaining in the Grand Bazaar',
      body: 'Bargaining is expected in historical bazaars for rugs, leather goods, and spices. Maintain good humor and treat negotiations as an enjoyable social conversation over tea.',
    },
  ],

  'jaipur-india': [
    {
      topic: 'ETIQUETTE',
      title: 'Namaste & Right Hand Etiquette',
      body: 'Greet with a folded hands "Namaste" bow. Use your right hand for eating, passing money, or handing items to shopkeepers, as the left hand is reserved for personal ablutions.',
      pronunciation: 'Nah-mah-stay',
    },
    {
      topic: 'FOOD',
      title: 'Rajasthani Thali and Dal Baati Churma',
      body: 'Dal Baati Churma (baked wheat balls with spiced lentils and sweet ground wheat) is Rajasthan\'s culinary masterpiece. Jaipur sweets like Ghewar are seasonal delicacies.',
    },
    {
      topic: 'DRESS',
      title: 'Respectful Modest Clothing in Old City',
      body: 'Loose, breathable cotton kurtas or linen pants that cover shoulders and knees keep you cool in desert heat while respecting temple and market traditions.',
    },
    {
      topic: 'MONEY',
      title: 'UPI Payments & Market Bargaining',
      body: 'UPI digital payments (PhonePe, Google Pay) are accepted everywhere from palaces to roadside chai stalls. At Johari and Bapu Bazaars, gentle bargaining is customary.',
    },
    {
      topic: 'SAFETY',
      title: 'Authorized Tourism Guides',
      body: 'Hire officially licensed guides displaying government ID badges at Amer Fort and City Palace to avoid unaccredited touts directing you to commission shops.',
    },
  ],

  'kathmandu-nepal': [
    {
      topic: 'ETIQUETTE',
      title: 'Circumambulate Stupas Clockwise',
      body: 'Always walk clockwise (kora) around Buddhist stupas (Boudhanath, Swayambhunath) and prayer wheels. Never point the soles of your feet at shrines, statues, or people.',
    },
    {
      topic: 'FOOD',
      title: 'Dal Bhat Power & Steamed Momos',
      body: 'Dal Bhat (lentils, rice, vegetable curry, and spicy pickles) is eaten twice daily; restaurants offer unlimited refills. Steamed buff or chicken momos with fiery sesame chutney are staple street food.',
    },
    {
      topic: 'DRESS',
      title: 'Conservative Dress & Removing Footwear',
      body: 'Remove shoes and leather belts before entering Hindu temple sanctuaries (some inner sanctums like Pashupatinath are reserved for Hindu worshippers only).',
    },
    {
      topic: 'TRANSPORT',
      title: 'Pathao Ridesharing and Walking',
      body: 'Narrow alleys in Thamel and Patan Durbar Square are best walked. For longer trips across the valley, local ridesharing app Pathao or metered taxis are convenient.',
    },
  ],

  'kyoto-japan': [
    {
      topic: 'ETIQUETTE',
      title: 'Respecting Geiko and Maiko in Gion',
      body: 'Do not chase, touch, or photograph Geiko and Maiko apprentices walking to appointments in Gion. Certain private alleys have strict photography bans with posted signs and fines.',
    },
    {
      topic: 'ETIQUETTE',
      title: 'Quiet Public Transport Voices',
      body: 'Do not speak on mobile phones inside city buses or trains. Set phones to silent ("manner mode") and keep conversations to quiet whispers.',
    },
    {
      topic: 'FOOD',
      title: 'Kaiseki Dining and Matcha Traditions',
      body: 'Kyoto is the birthplace of the traditional multi-course Kaiseki banquet and the Japanese tea ceremony (Chado). Savor subtle seasonal flavors using chopsticks gently without stabbing food.',
    },
    {
      topic: 'DRESS',
      title: 'Kimono Rental Culture',
      body: 'Renting a yukata (summer cotton) or kimono is a celebrated, respectful way for visitors to tour temple gardens like Kiyomizu-dera and Arashiyama bamboo groves.',
    },
    {
      topic: 'MONEY',
      title: 'No Tipping Under Any Circumstance',
      body: 'Tipping does not exist in Japan and will cause confusion or embarrassment. Excellent service is considered the baseline and included in the posted bill.',
    },
  ],

  'las-vegas-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Casino Dealer and Service Tipping',
      body: 'Tip table game dealers by placing bets for them or tipping chips directly ($5-$10 per session). Tip cocktail servers $1-$2 in cash per complimentary drink delivered on the casino floor.',
    },
    {
      topic: 'SAFETY',
      title: 'Desert Dehydration and Distances',
      body: 'Casino resorts on the Las Vegas Strip look close together but walking between adjacent properties often takes 20-30 minutes through pedestrian flyovers and expansive casino floors. Drink plenty of water.',
    },
    {
      topic: 'DRESS',
      title: 'Day-to-Night Wardrobe Shift',
      body: 'Pool parties and dayclubs permit stylish swimwear, while upscale nightclubs and celebrity chef restaurants enforce strict evening dress codes (collared shirts, dress shoes, no athletic wear).',
    },
    {
      topic: 'TRANSPORT',
      title: 'The Deuce Bus and Rideshare Zones',
      body: 'The Deuce 24-hour double-decker bus runs up and down the Strip to Fremont Street. At casino hotels, rideshares pick up only at dedicated valet or underground rideshare zones.',
    },
  ],

  'lisbon-portugal': [
    {
      topic: 'ETIQUETTE',
      title: 'Portuguese Warmth and Pace',
      body: 'Greet with "Bom dia" in the morning and "Boa tarde" in the afternoon. Locals take their time over coffee and meals; rushing a server or asking for the check immediately upon eating is uncommon.',
      pronunciation: 'Obrigado (male) / Obrigada (female)',
    },
    {
      topic: 'FOOD',
      title: 'Pastel de Nata and Sardines',
      body: 'Sample warm custard tarts sprinkled with cinnamon and powdered sugar at Pasteis de Belem or Manteigaria. Fresh grilled sardines are celebrated throughout June festivals.',
    },
    {
      topic: 'MUSIC',
      title: 'Fado in Alfama and Mouraria',
      body: 'Fado is Portugal\'s soulful musical poetry of "saudade" (longing and nostalgia). Silence during live performances in neighborhood tavernas is strictly observed as a mark of respect.',
    },
    {
      topic: 'DRESS',
      title: 'Grip Shoes for Calcada Portuguesa',
      body: 'Lisbon\'s seven hills are paved with polished white limestone cobblestones (Calcada Portuguesa) which become remarkably slippery, especially when damp. Wear shoes with reliable rubber tread.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Tram 28 & Viva Viagem Card',
      body: 'Historic yellow Tram 28 climbs steep alleys through Alfama and Graca. Buy a 24-hour Viva Viagem or Navegante card at metro stations for unlimited tram and funicular rides.',
    },
  ],

  'london-england': [
    {
      topic: 'ETIQUETTE',
      title: 'Stand on the Right on Escalators',
      body: 'On all London Underground escalators, stand on the right and walk on the left. Blocking the left side is the quickest way to irk commuting Londoners.',
    },
    {
      topic: 'FOOD',
      title: 'Pub Etiquette & Sunday Roast',
      body: 'At British pubs, order drinks and food at the bar counter; table service is rare. Savor a traditional Sunday roast with Yorkshire pudding, roast potatoes, and rich gravy.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Contactless Tap on the Tube',
      body: 'You do not need an Oyster card; simply tap your contactless credit card, phone, or smartwatch at the yellow card readers when entering and exiting all Underground and Overground stations.',
    },
    {
      topic: 'DRESS',
      title: 'Smart Layers and Compact Umbrellas',
      body: 'London style is smart casual with tailored coats, blazers, and waterproof boots. An umbrella or water-resistant trench coat is handy year-round.',
    },
  ],

  'los-angeles-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Casual Creative Ambition',
      body: 'Angelenos are generally relaxed, health-conscious, and conversational. Respect celebrity privacy if you spot familiar actors in restaurants or coffee shops; locals play it cool.',
    },
    {
      topic: 'FOOD',
      title: 'Taco Trucks and Global Diversity',
      body: 'LA boasts one of the world\'s greatest culinary scenes: street-corner taco trucks serving al pastor, Korean barbecue in K-town, and fresh farm-to-table California fare.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Traffic Realism & Neighborhood Hubs',
      body: 'Budget extra driving time for notorious 405 and 10 freeway traffic. Plan your day around single geographic clusters (e.g., Santa Monica/Venice, Downtown/Silver Lake, or Hollywood/West Hollywood).',
    },
    {
      topic: 'DRESS',
      title: 'Elevated Coastal Athleisure',
      body: 'High-end sneakers, designer sunglasses, and tailored sportswear are socially acceptable virtually everywhere from brunch to casual meetings.',
    },
  ],

  'marrakech-morocco': [
    {
      topic: 'ETIQUETTE',
      title: 'Bargaining and Mint Tea in the Souks',
      body: 'Bargaining in the Medina is an art form. Accept sweet hot mint tea ("Berber whiskey") poured from high above as an opening gesture of hospitality and negotiate with good humor.',
    },
    {
      topic: 'DRESS',
      title: 'Medina Modesty Standards',
      body: 'Cover shoulders and wear pants or skirts reaching past the knees out of respect for local Islamic culture. Bring a light scarf to drape over your neck and shoulders.',
    },
    {
      topic: 'FOOD',
      title: 'Tagines, Couscous, and Jemaa el-Fnaa',
      body: 'Slow-cooked lamb and prune tagines in earthenware pots represent Moroccan comfort food. In the evening, the central Jemaa el-Fnaa square transforms into an open-air food market.',
    },
    {
      topic: 'SAFETY',
      title: 'Medina Direction Helpers',
      body: 'Young men offering unsolicited directions in the labyrinthine souks will expect a tip upon arrival. Rely instead on offline map apps (like Maps.me) or ask shopkeepers inside their stores.',
    },
  ],

  'mexico-city-mexico': [
    {
      topic: 'ETIQUETTE',
      title: 'Polite Formalities and Warmth',
      body: 'Always greet clerks and diners when entering small spaces with "Buenos dias" or "Provecho" (enjoy your meal) to fellow diners when passing their table.',
      pronunciation: 'Con permiso / Provecho',
    },
    {
      topic: 'FOOD',
      title: 'Tacos al Pastor & Culinary Eminence',
      body: 'CDMX is a global culinary capital. Watch taqueros slice spit-roasted pork (al pastor) and flick a slice of pineapple straight into the tortilla. Always check salsa spice levels first with a tiny drop.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Metrobus and Uber for Safety',
      body: 'Uber and official airport/hotel taxi stands are safe, reliable, and affordable. Avoid hailing unmetered green-and-gold street cabs outside tourist zones at night.',
    },
    {
      topic: 'MONEY',
      title: 'Tipping ("La Propina") Expectation',
      body: '10-15% tip is standard in seated cafes and restaurants. Keep small change (10 and 20 peso coins) handy for restroom attendants, musicians, and street baggers.',
    },
  ],

  'miami-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Bilingual Rhythm and Spanish Fluency',
      body: 'Miami is the crossroads of Latin America; Spanish is spoken as frequently as English across Little Havana, Brickell, and Wynwood. Greet with a warm "Hola" or "Buenos dias".',
    },
    {
      topic: 'FOOD',
      title: 'Cuban Sandwiches and Cafecito Breaks',
      body: 'Order a Cuban sandwich (pressed with ham, roasted pork, Swiss cheese, pickles, and mustard) and a tiny, sweet, powerful shot of Cuban espresso (colada or cafecito) at roadside ventanitas.',
    },
    {
      topic: 'DRESS',
      title: 'South Beach Vibrant Resort Glamour',
      body: 'Miami embraces bold colors, swimwear by day, and glamorous fashion by night. Nightclubs like LIV enforce discerning velvet-rope dress codes; athletic shoes and shorts are barred.',
    },
    {
      topic: 'MONEY',
      title: 'Automatic Gratuity on Ocean Drive',
      body: 'Many beachside restaurants along Ocean Drive and Lincoln Road automatically include an 18-20% service charge on your bill. Always review the receipt before adding an extra tip.',
    },
  ],

  'nashville-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Honky Tonk Etiquette & Southern Hospitality',
      body: 'Musicians playing in honky-tonks on Lower Broadway play for tips, not venue wages. Tip the band generously ($5-$20) when you request songs or enjoy the set.',
    },
    {
      topic: 'FOOD',
      title: 'Nashville Hot Chicken Heat Levels',
      body: 'Hot chicken (invented by Prince\'s and popularized by Hattie B\'s) is fried chicken coated in spicy cayenne paste. Beginners should start at "Mild" or "Medium"; "Hot" and "Shut the Cluck Up" are intense.',
    },
    {
      topic: 'DRESS',
      title: 'Broadway Boots and Denim',
      body: 'Western boots, wide-brim hats, and denim jackets dominate Lower Broadway and the Gulch. Wear comfortable boots broken in before walking down the neon strip.',
    },
  ],

  'new-orleans-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Laissez les Bons Temps Rouler',
      body: '"Let the good times roll." New Orleans culture centers around music, communal celebration, and open conviviality. Say good morning to neighbors sitting on front porches in the Marigny and Garden District.',
    },
    {
      topic: 'FOOD',
      title: 'Creole vs. Cajun & Beignet Rituals',
      body: 'Enjoy gumbo, jambalaya, and crawfish etouffee. At Cafe du Monde in the French Quarter, eat hot powdered-sugar beignets paired with chicory cafe au lait; don\'t wear dark clothes while eating!',
    },
    {
      topic: 'MUSIC',
      title: 'Frenchmen Street Live Jazz',
      body: 'While Bourbon Street is lively with street drinks, Frenchmen Street in the Faubourg Marigny offers the city\'s finest authentic brass bands, blues, and live traditional jazz.',
    },
    {
      topic: 'SAFETY',
      title: 'French Quarter Night Awareness',
      body: 'Keep within well-lit, populated streets in the French Quarter. Don\'t accept sidewalk bets from scam artists claiming "I bet I can tell you where you got your shoes." (The punchline: "On your feet!").',
    },
  ],

  'new-york-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Walk with Purpose and Keep Right',
      body: 'New York sidewalks have unspoken traffic rules. Walk briskly, keep to the right, and never stop abruptly in the middle of a crowded sidewalk to check your phone or gaze up at skyscrapers.',
    },
    {
      topic: 'FOOD',
      title: 'Classic Bagels & Dollar Slices',
      body: 'Order your morning bagel "toasted with a schmear" (cream cheese) and lox. A classic New York pizza slice is folded in half lengthwise with one hand to eat on the go.',
    },
    {
      topic: 'TRANSPORT',
      title: 'MTA Subway Mastery with OMNY',
      body: 'Simply tap your contactless bank card or phone at the subway turnstile using OMNY. The subway runs 24/7; pay attention to local vs. express trains to avoid missing your stop.',
    },
    {
      topic: 'MONEY',
      title: 'Tipping Expectations in NYC',
      body: 'Tipping 18-22% is standard in full-service dining, 15-20% for yellow cabs, and $1-$2 per drink at cocktail bars. Many bodegas and food carts accept cash or small-card charges.',
    },
  ],

  'paris-france': [
    {
      topic: 'ETIQUETTE',
      title: 'The Mandatory "Bonjour" Golden Rule',
      body: 'Always say "Bonjour, Madame" or "Bonjour, Monsieur" the moment you enter any bakery, shop, cafe, or taxi. Failing to greet is considered openly discourteous by French cultural standards.',
      pronunciation: 'Bonjour (bohn-ZHOOR) / Merci (mair-SEE)',
    },
    {
      topic: 'FOOD',
      title: 'Cafe Culture and Terrace Etiquette',
      body: 'Sit where you like at outdoor cafe terraces unless marked reserved; a waiter will arrive shortly. Once served your espresso or glass of wine, the table is yours as long as you wish without being rushed.',
    },
    {
      topic: 'DRESS',
      title: 'Understated Parisian Chic',
      body: 'Parisians dress with understated, well-tailored elegance in neutral tones (navy, black, beige, gray). Running shoes are fine for sightseeing, but avoid overly bright athletic wear in evening restaurants.',
    },
    {
      topic: 'MONEY',
      title: 'Service Compris and Small Change',
      body: 'By law, all restaurant bills include "service compris" (15% service charge). Leaving a couple of euros on the table for polite, attentive service is customary but not legally required.',
    },
  ],

  'portland-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Ecological Consciousness & Community',
      body: 'Portland is renowned for progressive sustainability, indie bookstores, and neighborhood civility. Bringing reusable shopping bags and sorting recycling/compost correctly is taken seriously.',
    },
    {
      topic: 'FOOD',
      title: 'Food Cart Pods & Third-Wave Coffee',
      body: 'Portland pioneered food cart pods (like Pioneer Courthouse Square or Hawthorne). Savor single-origin specialty roast coffee from pioneers like Stumptown and Coava.',
    },
    {
      topic: 'TRANSPORT',
      title: 'TriMet MAX Light Rail and Streetcar',
      body: 'Hop on the MAX light rail directly from Portland Airport into downtown for $2.80. Portland is one of the most bicycle-friendly cities in North America with dedicated greenways.',
    },
    {
      topic: 'MONEY',
      title: 'Zero Sales Tax in Oregon',
      body: 'The price you see on the shelf in Oregon is the exact price you pay at the register, as there is 0% state sales tax on retail goods.',
    },
  ],

  'prague-czechia': [
    {
      topic: 'ETIQUETTE',
      title: 'Pilsner Beer Hall Customs',
      body: 'When toasting with Czech beer, look your companion in the eye, say "Na zdravi!", clink glasses, and lightly tap the bottom of the mug against the table before taking your first sip.',
      pronunciation: 'Na zdravi (nah ZDRAH-vee)',
    },
    {
      topic: 'FOOD',
      title: 'Svíčková and Trdelník',
      body: 'Sample authentic Czech Svíčková (braised beef sirloin in creamy root vegetable sauce with bread dumplings and cranberries). Fresh Pilsner Urquell is drafted with specific foam styles (Hladinka, Snyt).',
    },
    {
      topic: 'MONEY',
      title: 'Czech Koruna (CZK) vs. Euro',
      body: 'While in the EU, the Czech Republic uses Czech Koruna (CZK), not Euros. Always decline dynamic currency conversion at ATMs and pay in local currency (CZK).',
    },
    {
      topic: 'SAFETY',
      title: 'Charles Bridge & Astronomical Clock Pickpockets',
      body: 'Keep bags closed and secured in the tight crowds watching the hourly Astronomical Clock show in Old Town Square and while crossing the Charles Bridge.',
    },
  ],

  'reykjavik-iceland': [
    {
      topic: 'ETIQUETTE',
      title: 'Strict Geothermal Pool Hygiene',
      body: 'Showering thoroughly naked with soap before entering any geothermal pool or hot spring (Sundhöllin, Sky Lagoon, Blue Lagoon) is mandatory and strictly enforced for community hygiene.',
    },
    {
      topic: 'FOOD',
      title: 'Fresh Arctic Seafood and Rye Bread',
      body: 'Sample Icelandic Arctic char, langoustine, and sweet dark rye bread (Rúgbrauð) baked underground using geothermal steam. Tap water in Iceland is pure spring water; never buy bottled water.',
    },
    {
      topic: 'DRESS',
      title: 'Thermal Windproof Layers & Crampons',
      body: 'Icelandic weather changes within minutes. Dress in thermal merino wool base layers, a fleece mid-layer, and waterproof GORE-TEX outer shells. Spikes (crampons) are essential for winter icy walkways.',
    },
    {
      topic: 'MONEY',
      title: '100% Cashless Economy',
      body: 'Iceland is completely cashless. Contactless credit cards, debit cards, and Apple Pay are accepted everywhere from parking meters to remote roadside hot dog stands.',
    },
  ],

  'rio-de-janeiro-brazil': [
    {
      topic: 'ETIQUETTE',
      title: 'The Carioca Spirit and Warmth',
      body: 'Locals of Rio (Cariocas) are famous for vibrant joy, music, and beach lifestyle. Greetings often involve two kisses on the cheeks (one on each side) in social settings.',
      pronunciation: 'Tudo bem? (TOO-doo bayng)',
    },
    {
      topic: 'FOOD',
      title: 'Feijoada and Caipirinhas',
      body: 'Feijoada (rich black bean and pork stew) is traditionally enjoyed on Saturdays accompanied by farofa, collard greens, and a fresh lime-and-cachaça Caipirinha.',
    },
    {
      topic: 'DRESS',
      title: 'Beach Culture & Sunga/Bikini Norms',
      body: 'On Copacabana and Ipanema beaches, locals wear fitted swim trunks (sungas) and Brazilian-cut bikinis regardless of body type. Never carry expensive jewelry or cameras onto the sand.',
    },
    {
      topic: 'SAFETY',
      title: 'Street Awareness & Rideshare Use',
      body: 'Leave passports and expensive watches in hotel safes. Use Uber or registered radio-taxis after dark, particularly when returning from nightlife spots in Lapa.',
    },
  ],

  'rome-italy': [
    {
      topic: 'ETIQUETTE',
      title: 'Coffee Rules: No Cappuccino After 11 AM',
      body: 'Italians view milk as heavy for digestion and drink cappuccino or caffe latte strictly in the morning. After meals or in the afternoon, order an espresso ("un caffe") and drink it standing at the counter.',
      pronunciation: 'Grazie mille (GRAHT-syeh MEE-leh)',
    },
    {
      topic: 'FOOD',
      title: 'The Four Classic Roman Pastas',
      body: 'Rome\'s culinary soul rests on four pastas: Cacio e Pepe, Gricia, Carbonara (made with guanciale and egg yolks, never cream!), and Amatriciana. Pair with local red vino dei Castelli Romani.',
    },
    {
      topic: 'DRESS',
      title: 'Modest Dress for Vatican & Churches',
      body: 'St. Peter\'s Basilica, the Vatican Museums, and all Roman basilicas enforce modest dress: shoulders, chest, and knees must be covered. Carry a lightweight scarf in summer.',
    },
    {
      topic: 'MONEY',
      title: 'Coperto Cover Charge Understanding',
      body: 'Many Italian restaurants charge a modest "coperto" (cover charge per person for bread and table setting) on the bill. Extra tipping beyond rounding up a few coins is not necessary.',
    },
  ],

  'san-francisco-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Tech Savvy & Neighborhood Diversity',
      body: 'San Francisco thrives on progressive values, environmental stewardship, and tech innovation. Each neighborhood (the Mission, Haight-Ashbury, Chinatown, Castro) possesses its own distinct identity.',
    },
    {
      topic: 'FOOD',
      title: 'Mission Burritos and Sourdough Bread',
      body: 'Eat a foil-wrapped Mission-style super burrito in Dolores Park. Savor freshly baked sourdough bread from Boudin or Tartine Bakery alongside fresh Dungeness crab at Fisherman\'s Wharf.',
    },
    {
      topic: 'DRESS',
      title: 'Karl the Fog & Microclimates',
      body: 'Mark Twain famously observed how cold summer in SF can be. Summer afternoon marine layer fog ("Karl") drops temperatures into the 50s°F (12°C). Always carry a windproof fleece or light puffer jacket.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Cable Cars, Muni & BART',
      body: 'Ride historic National Landmark cable cars along California and Powell-Hyde streets. Use a digital Clipper card on your phone for all Muni buses, light rail, and regional BART trains.',
    },
  ],

  'seattle-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'The "Seattle Chill" and Genuine Polite Culture',
      body: 'Locals are polite, eco-conscious, and respectful, though quiet and reserved with strangers until getting to know them. Coffee shops and bookshops serve as central community hubs.',
    },
    {
      topic: 'FOOD',
      title: 'Pacific Salmon and Pike Place Chowder',
      body: 'Watch fishmongers throw giant king salmon at historic Pike Place Market. Enjoy freshly shucked Pacific oysters, geoduck clams, and Dungeness crab paired with Washington craft cider.',
    },
    {
      topic: 'DRESS',
      title: 'Waterproof Rain Shells (No Umbrellas)',
      body: 'Seattle gets frequent light drizzle rather than heavy downpours. Locals rarely carry umbrellas; waterproof hooded technical jackets (REI, Columbia, Outdoor Research) are standard uniforms.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Light Rail & Washington State Ferries',
      body: 'The Sound Transit Link light rail connects Sea-Tac Airport directly into downtown Seattle. Take the Bainbridge Island ferry from Colman Dock for spectacular views of the Seattle skyline and Mount Rainier.',
    },
  ],

  'singapore': [
    {
      topic: 'ETIQUETTE',
      title: 'The Chope Ritual in Hawker Centres',
      body: 'At bustling open-air hawker centres (like Maxwell or Lau Pa Sat), diners reserve ("chope") vacant tables by placing a small packet of tissue paper on the table before ordering food.',
    },
    {
      topic: 'FOOD',
      title: 'UNESCO World Heritage Hawker Cuisine',
      body: 'Singapore\'s diverse culinary heritage blends Chinese, Malay, Indian, and Peranakan traditions. Must-try dishes include Hainanese chicken rice, laksa, and chili crab with fried mantou buns.',
    },
    {
      topic: 'SAFETY',
      title: 'Clean & Green City Laws and Fines',
      body: 'Singapore maintains strict laws to protect public cleanliness: chewing gum sales, littering, jaywalking, and eating or drinking on MRT trains and station platforms carry heavy fines.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Air-Conditioned MRT Grid',
      body: 'The Mass Rapid Transit (MRT) subway system is world-class, spotlessly clean, and air-conditioned. Tap in and tap out with any contactless credit or debit card.',
    },
  ],

  'sydney-australia': [
    {
      topic: 'ETIQUETTE',
      title: 'The Egalitarian "No Worries" Mindset',
      body: 'Australian culture values an informal, egalitarian "fair go" for everyone. Greet with "G\'day" or "How ya going?". Solo taxi riders often sit in the front passenger seat next to the driver.',
    },
    {
      topic: 'FOOD',
      title: 'Flat White Coffee and Bondi Brunches',
      body: 'Sydney boasts elite coffee culture; order an authentic velvety "Flat White". Weekends feature long outdoor oceanfront brunches with smashed avocado on seeded sourdough toast.',
    },
    {
      topic: 'SAFETY',
      title: 'Swim Between the Red and Yellow Flags',
      body: 'Ocean currents and rip tides at Bondi, Manly, and Coogee can be deceptively powerful. Always swim strictly between the red and yellow flags patrolled by volunteer surf lifesavers.',
    },
    {
      topic: 'TRANSPORT',
      title: 'Sydney Harbour Ferries on Opal',
      body: 'The green-and-yellow public ferries departing Circular Quay for Manly Beach offer world-class views of the Sydney Opera House and Harbour Bridge for standard public transit fares.',
    },
  ],

  'tokyo-japan': [
    {
      topic: 'ETIQUETTE',
      title: 'Train Carriage Etiquette & Escalators',
      body: 'Do not eat, drink, or speak loudly on Tokyo commuter trains. In the Kanto (Tokyo) region, stand on the left side of escalators and leave the right open for passing pedestrians.',
      pronunciation: 'Arigatou gozaimasu / Sumimasen',
    },
    {
      topic: 'FOOD',
      title: 'Slurping Ramen and Counter Dining',
      body: 'Slurping noodles loudly is considered polite in Japan; it aerates the noodles and shows the chef you are enjoying the broth. Many ramen shops use automated vending ticket machines outside the counter.',
    },
    {
      topic: 'MONEY',
      title: 'Suica/Pasmo IC Cards for Everything',
      body: 'Add a digital Suica or Pasmo card to your Apple/Google Wallet. These contactless IC cards pay for subways, convenience stores (7-Eleven, Lawson), vending machines, and coin lockers.',
    },
    {
      topic: 'SAFETY',
      title: 'Carry Your Rubbish with You',
      body: 'Public trash bins are virtually nonexistent on Tokyo streets for historical safety reasons. Carry a small plastic bag in your daypack to hold your trash until you return to your hotel room.',
    },
  ],

  'vienna-austria': [
    {
      topic: 'ETIQUETTE',
      title: 'The Viennese Kaffeehaus Tradition',
      body: 'Traditional Viennese coffee houses (Café Central, Café Sacher) are UNESCO intangible cultural heritage spaces. Order a Melange (espresso with steamed milk and foam) served on a silver tray with a small glass of water.',
    },
    {
      topic: 'FOOD',
      title: 'Wiener Schnitzel and Sachertorte',
      body: 'Authentic Wiener Schnitzel is made of thinly pounded veal (kalb) in golden breadcrumbs, served with lemon and warm Austrian potato salad. End with decadent chocolate Sachertorte.',
    },
    {
      topic: 'MUSIC',
      title: 'Classical Heritage and Opera Standing Tickets',
      body: 'Vienna is the musical home of Mozart, Beethoven, and Strauss. The Vienna State Opera sells budget-friendly standing room tickets (Stehplatz) on the day of performances.',
    },
    {
      topic: 'TRANSPORT',
      title: 'U-Bahn & Ringstrasse Tram 1',
      body: 'Hop on Tram 1 around the historic Ringstrasse boulevard to admire the Parliament, City Hall, and Imperial Hofburg Palace.',
    },
  ],

  'washington-dc-usa': [
    {
      topic: 'ETIQUETTE',
      title: 'Civic Pride and Escalator Etiquette',
      body: 'Washington DC is a hub of international diplomacy, government, and world-class museums. Escalator etiquette on the DC Metro is serious: stand on the right, walk on the left.',
    },
    {
      topic: 'FOOD',
      title: 'Half-Smokes and Global Diplomacy Fare',
      body: 'Ben\'s Chili Bowl on U Street is legendary for its "half-smoke" sausage topped with spicy chili con carne. DC also boasts the world\'s largest Ethiopian dining community outside Addis Ababa.',
    },
    {
      topic: 'DRESS',
      title: 'Smart Business Casual in Public Buildings',
      body: 'Many government buildings, Senate galleries, and historic memorials welcome respectful casual attire, though athletic wear may feel out of place in finer dining spots near Capitol Hill.',
    },
    {
      topic: 'TRANSPORT',
      title: 'The National Mall & Free Smithsonian Museums',
      body: 'All 17 Smithsonian museums in Washington DC and the National Zoo are 100% free of admission charge. Wear comfortable walking shoes—the National Mall spans two full miles.',
    },
  ],
};

async function main() {
  console.log('Clearing existing culture entries...');
  await prisma.cultureEntry.deleteMany({});
  console.log('Cleared existing culture entries.');

  let total = 0;
  for (const [slug, entries] of Object.entries(cultureData)) {
    const dest = await prisma.destination.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!dest) {
      console.warn(`Destination not found for slug: ${slug}`);
      continue;
    }

    for (const item of entries) {
      await prisma.cultureEntry.create({
        data: {
          destinationId: dest.id,
          topic: item.topic.toUpperCase(),
          title: item.title,
          body: item.body,
          contextNote: item.contextNote ?? null,
          pronunciation: item.pronunciation ?? null,
          sourceNote: 'TravelSphere Cultural Advisory Council',
        },
      });
      total++;
    }
    console.log(`✓ Seeded ${entries.length} entries for ${dest.name} (${slug})`);
  }

  console.log(`\nAll done! Successfully seeded ${total} comprehensive culture entries across ${Object.keys(cultureData).length} destinations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
