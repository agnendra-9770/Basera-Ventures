/**
 * Seeds the site with Basera Venture's homes, photographs and starter copy.
 *
 *   npm run seed              — only runs on an empty database
 *   SEED_FORCE=1 npm run seed — wipes content (not users or inquiries) and seeds again
 *
 * Sources: the Basera Venture link page, the four Airbnb listings (checked
 * 26 Oct 2026) and the photographs. Anything we could not confirm — times,
 * policies, exact addresses, your own story — is left as a [PLACEHOLDER].
 */
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

import config from '../payload.config'
import { rich } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const context = { disableRevalidate: true }
const CHECKED = '2026-10-26T12:00:00.000Z'

const PHOTOS = [
  { key: 'evening', file: 'sage-studio-evening.jpg', category: 'studios', focal: [50, 55],
    alt: 'Laxom studio at night with warm cove lighting, a double bed, a sage sofa, a work desk, wall shelves and a kitchenette at the far end',
    caption: 'Laxom, after dark' },
  { key: 'pool', file: 'courtyard-pool.jpg', category: 'pool', focal: [50, 60], postcard: true,
    alt: 'Swimming pool lined with blue mosaic tiles and steel handrails, with a smaller adjoining pool, the glass-fronted restaurant and white balconies behind',
    caption: 'The pool, with the restaurant beyond the glass' },
  { key: 'dining', file: 'dining-room-mosaic-lamps.jpg', category: 'dining', focal: [40, 45], postcard: true,
    alt: 'In-house restaurant with blue mosaic glass pendant lamps, mustard leather banquettes, tufted grey chairs and a painted floral panel in an arched niche',
    caption: 'The in-house restaurant, under mosaic glass lamps' },
  { key: 'eclipse-moon', file: 'eclipse-full-moon-wall-bedroom.jpg', category: 'studios', focal: [45, 40],
    alt: 'Eclipse bedroom with an illuminated full-moon panel above a charcoal upholstered headboard, grey bedding, potted palms, candles and a botanical print',
    caption: 'Eclipse — the full-moon wall' },
  { key: 'portrait', file: 'sage-studio-portrait.jpg', category: 'studios', focal: [45, 55], postcard: true,
    alt: 'Laxom studio with a double bed, rattan wall lights, botanical prints, a sage sofa, a work desk and a tall mirror',
    caption: 'Laxom — botanical prints, rattan lights and room to spread out' },
  { key: 'khushom-wide', file: 'khushom-studio-blue-headboard.jpg', category: 'studios', focal: [55, 55],
    alt: 'Bright studio with a teal upholstered headboard, white bedding, botanical panels with wall lights, and a teal sofa by a door with a digital lock',
    caption: 'Khushom and Lovom — crisp whites and a teal headboard' },
  { key: 'kitchenette', file: 'sage-studio-kitchenette.jpg', category: 'studios', focal: [62, 45],
    alt: 'Laxom studio with a sage velvet headboard and globe wall light beside a kitchenette with a sink, kettle and induction cooktop beneath a jaali lattice screen',
    caption: 'Laxom — a kitchenette beneath a lattice screen' },
  { key: 'eclipse-night', file: 'eclipse-moonlit-night.jpg', category: 'studios', focal: [50, 45], postcard: true,
    alt: 'Eclipse at night: dark walls, thin lines of ceiling light and the glowing full moon above the bed',
    caption: 'Eclipse, lit by its moon' },
  { key: 'desk', file: 'oak-studio-desk-and-mirror.jpg', category: 'studios', focal: [55, 50],
    alt: 'Laxom studio with a work desk and lamp, open shelving above, an oak media wall with a smart TV and a full-length mirror lit from behind',
    caption: 'Laxom — a desk, shelves and a mirror framed in light' },
  { key: 'khushom-portrait', file: 'khushom-studio-portrait.jpg', category: 'studios', focal: [50, 55],
    alt: 'Studio with a double bed, a teal sofa chair, a work desk with a blue chair, black open shelving, a wall-mounted TV and a full-length mirror',
    caption: 'Khushom and Lovom — desk, shelves and a sofa corner' },
  { key: 'eclipse-bath', file: 'eclipse-bathroom-lit-niche.jpg', category: 'bath', focal: [50, 45],
    alt: 'Eclipse shower room with stone-textured walls, a glowing wall niche with plants and toiletries, a backlit round mirror and a wall-hung basin',
    caption: 'Eclipse — a glowing niche in the shower room' },
  { key: 'bath', file: 'bathroom-marble-backlit-mirror.jpg', category: 'bath', focal: [50, 45],
    alt: 'Bathroom with marble-veined walls, a round vessel basin on a dark stone ledge and a backlit oval mirror',
    caption: 'Marble-veined walls and a mirror lit from behind' },
  { key: 'bed', file: 'sage-studio-bed.jpg', category: 'studios', focal: [55, 55],
    alt: 'Laxom: double bed with a sage velvet headboard, globe wall lights and botanical prints, with a sofa corner and a door with a digital lock',
    caption: 'Laxom — sage velvet, globe lights and a corner sofa' },
  { key: 'khushom-desk', file: 'khushom-studio-desk-shelves.jpg', category: 'studios', focal: [55, 50],
    alt: 'White studio with a teal headboard, black open shelving, a wall-mounted TV and a work desk',
    caption: 'Khushom and Lovom — a desk under open shelving' },
  { key: 'eclipse-blossom', file: 'eclipse-moon-wall-blossom.jpg', category: 'studios', focal: [45, 40],
    alt: 'The full-moon wall at Eclipse glowing above the bed, with blossom stems and wall-mounted bedside shelves',
    caption: 'Eclipse — moonlight and blossom' },
  { key: 'media-wall', file: 'oak-studio-media-wall.jpg', category: 'studios', focal: [45, 50],
    alt: 'Laxom studio with a backlit oak media wall and smart TV, a work desk, a tall oak wardrobe, a mini fridge with microwave and a lounge chair',
    caption: 'Laxom — oak, lamplight and a lounge chair' },
  { key: 'khushom-kitchenette', file: 'khushom-kitchenette-jaali.jpg', category: 'studios', focal: [60, 45],
    alt: 'Studio kitchenette with dark cabinets and a kettle beside the entrance door, beneath a jaali lattice screen, with a small fridge',
    caption: 'Khushom and Lovom — the kitchenette' },
  { key: 'pool-above', file: 'courtyard-pool-from-above.jpg', category: 'pool', focal: [45, 50],
    alt: 'Rectangular pool lined with blue mosaic tiles and a smaller adjoining pool, seen from an upper floor',
    caption: 'The pool from above' },
  { key: 'eclipse-dark', file: 'eclipse-dark-walls-moon.jpg', category: 'studios', focal: [55, 40],
    alt: 'Dark-walled Eclipse bedroom with the full-moon panel, navy bedding and a tall plant by the door',
    caption: 'Eclipse — dark walls, navy linen' },
  { key: 'khushom-tall', file: 'khushom-studio-wide-portrait.jpg', category: 'studios', focal: [50, 55],
    alt: 'Long view of a white studio with a teal headboard, wall lights, open shelving, desk and the kitchenette at the far end',
    caption: 'Khushom and Lovom — the whole studio' },
] as const

type PhotoKey = (typeof PHOTOS)[number]['key']

const AMENITIES = [
  { key: 'kitchenette', name: 'Kitchenette', note: 'For light meals — a kettle and the basics', category: 'kitchen', icon: 'kitchen' },
  { key: 'fridge', name: 'Refrigerator', category: 'kitchen', icon: 'fridge' },
  { key: 'microwave', name: 'Microwave', category: 'kitchen', icon: 'microwave' },
  { key: 'kettle', name: 'Electric kettle', category: 'kitchen', icon: 'kettle' },
  { key: 'wifi', name: 'High-speed Wi-Fi', category: 'work', icon: 'wifi' },
  { key: 'workspace', name: 'Dedicated workspace', category: 'work', icon: 'desk' },
  { key: 'tv', name: 'Smart TV', category: 'entertainment', icon: 'tv' },
  { key: 'ac', name: 'Air conditioning', category: 'comfort', icon: 'ac' },
  { key: 'wardrobe', name: 'Full-height wardrobe', category: 'comfort', icon: 'wardrobe' },
  { key: 'sofa', name: 'Sofa corner', category: 'comfort', icon: 'sofa' },
  { key: 'mirror', name: 'Full-length mirror', category: 'comfort', icon: 'mirror' },
  { key: 'fan', name: 'Ceiling fan', category: 'comfort', icon: 'fan' },
  { key: 'balcony', name: 'Private balcony', category: 'leisure', icon: 'balcony' },
  { key: 'lock', name: 'Digital door lock', category: 'safety', icon: 'lock' },
  { key: 'selfCheckIn', name: 'Self check-in', note: 'With a lockbox', category: 'safety', icon: 'key' },
  { key: 'entrance', name: 'Private entrance', category: 'safety', icon: 'door' },
  { key: 'parking', name: 'Free parking on the premises', category: 'services', icon: 'parking' },
  { key: 'delivery', name: '24/7 online delivery', note: 'Right up to the main gate', category: 'services', icon: 'delivery' },
  { key: 'pets', name: 'Pets allowed', category: 'family', icon: 'pet' },
  { key: 'pool', name: 'Swimming pool', note: 'Open daily at set hours', category: 'leisure', icon: 'pool', shared: true },
  { key: 'gym', name: 'Gym', category: 'leisure', icon: 'gym', shared: true },
  { key: 'garden', name: 'Garden', category: 'leisure', icon: 'garden', shared: true },
  { key: 'restaurant', name: 'In-house restaurant', category: 'kitchen', icon: 'dining', shared: true },
  { key: 'ev', name: 'EV charging', category: 'services', icon: 'ev', shared: true },
] as const

type AmenityKey = (typeof AMENITIES)[number]['key']

const run = async () => {
  const payload = await getPayload({ config })
  const force = process.env.SEED_FORCE === '1' || process.argv.includes('--force')

  const { totalDocs } = await payload.count({ collection: 'stays' })
  if (totalDocs > 0 && !force) {
    payload.logger.info('Content already exists — skipping seed. Use SEED_FORCE=1 to start again.')
    return
  }

  if (force) {
    payload.logger.info('Removing existing content…')
    for (const collection of ['journal', 'testimonials', 'faqs', 'experiences', 'stays', 'amenities', 'places', 'media'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } }, context })
    }
  }

  payload.logger.info('Uploading photographs…')
  const media = {} as Record<PhotoKey, number>
  for (const photo of PHOTOS) {
    const doc = await payload.create({
      collection: 'media',
      filePath: path.resolve(dirname, 'photos', photo.file),
      data: {
        alt: photo.alt,
        caption: photo.caption,
        category: photo.category,
        showInGallery: true,
        postcard: 'postcard' in photo ? photo.postcard : false,
        focalX: photo.focal[0],
        focalY: photo.focal[1],
      },
      context,
    })
    media[photo.key] = doc.id
  }

  payload.logger.info('Creating amenities…')
  const amenity = {} as Record<AmenityKey, number>
  for (const { key, ...data } of AMENITIES) {
    const doc = await payload.create({ collection: 'amenities', data, context })
    amenity[key] = doc.id
  }
  const pick = (...keys: AmenityKey[]) => keys.map((k) => amenity[k])
  const community = pick('pool', 'gym', 'garden', 'restaurant', 'ev', 'delivery')

  const communityNote =
    'Within the community: a swimming pool open daily at set hours, a gym, a garden, an in-house restaurant and EV charging. Online deliveries reach the main gate around the clock. [AREA — the neighbourhood and nearest landmark]'

  payload.logger.info('Creating the four homes…')
  const laxom = await payload.create({
    collection: 'stays',
    context,
    data: {
      _status: 'published',
      name: 'Laxom By Basera',
      slug: 'laxom',
      stayType: 'studio',
      tagline: 'Sage velvet, warm oak and lamplight — with a private balcony',
      summary:
        'A stylish studio crafted for a relaxing stay, in a quiet gated community in Jaipur: a king bed, a sofa and a cot, a dedicated workspace, a fully equipped kitchenette and a private balcony — with the pool, gym and in-house restaurant on site.',
      description: rich(
        '*Laxom by Basera is a stylish studio crafted for a relaxing stay.*',
        'Modern interiors in sage velvet and warm oak, lit in layers — cove light along the walls, globe and rattan sconces by the bed, a brass lamp on the desk. There is a cozy king bed, a sofa corner, a Smart TV, high-speed Wi-Fi, a dedicated workspace, and a fully equipped kitchenette tucked beneath a jaali lattice screen.',
        'Step out onto your private balcony, or down to the community’s swimming pool (open daily at set hours), gym, garden and in-house restaurant. There is EV charging and free parking on the premises, and online deliveries reach the main gate 24/7.',
        'Ideal for work, leisure or extended stays.',
      ),
      highlights: [
        { title: 'In a quiet gated community', text: 'A peaceful retreat set away from the city’s bustle.' },
        { title: 'Pool, kitchenette and balcony', text: 'A pool open daily, a kitchenette for light meals, and a private balcony to unwind.' },
        { title: 'Room for four', text: 'A king bed, a sofa and a cot — sleeps up to four.' },
      ],
      moments: ['couples', 'families', 'remote', 'corporate', 'longstay', 'shoots'],
      locationNote: communityNote,
      heroImage: media.evening,
      gallery: [media.evening, media.bed, media.portrait, media.kitchenette, media.desk, media['media-wall'], media.bath],
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
      sleeping: [{ space: 'Studio', beds: '1 king bed · 1 sofa · 1 cot' }],
      amenities: [
        ...pick('kitchenette', 'fridge', 'microwave', 'kettle', 'wifi', 'workspace', 'tv', 'wardrobe', 'sofa', 'mirror', 'fan', 'balcony', 'lock', 'parking'),
        ...community,
      ],
      rating: { score: 5, count: 54, platform: 'airbnb', badge: 'Guest favourite', checkedOn: CHECKED },
      bookingLinks: [{ platform: 'airbnb', url: 'https://www.airbnb.co.in/rooms/1717430738299443243' }],
      faqs: [
        { question: 'Is there a cot?', answer: 'Yes — the studio has a cot, as well as the king bed and a sofa, so it sleeps up to four.' },
        { question: 'Can I cook?', answer: 'Yes — the kitchenette is fully equipped for light meals, and the in-house restaurant is on site. [COOKWARE — what is provided]' },
      ],
      seo: {
        title: 'Laxom By Basera — studio with pool & balcony in Jaipur',
        description:
          'A sage-and-oak studio in a quiet gated community in Jaipur: king bed, workspace, kitchenette, private balcony, pool, gym and in-house restaurant. Sleeps 4.',
      },
    },
  })

  const khushom = await payload.create({
    collection: 'stays',
    context,
    data: {
      _status: 'published',
      name: 'Khushom By Basera',
      slug: 'khushom',
      stayType: 'studio',
      tagline: 'Crisp whites, a teal headboard and a lattice-screened kitchenette',
      summary:
        'A stylish studio in crisp whites and teal: a king bed and a sofa, a dedicated workspace, high-speed Wi-Fi, a Smart TV and a kitchenette — with self check-in, and the pool, gym, garden and in-house restaurant on site.',
      description: rich(
        '*Khushom by Basera is a stylish studio crafted for a relaxing stay.*',
        'Modern interiors in white and soft grey with a teal upholstered headboard, botanical panels and wall lights. There is a cozy king bed and a sofa, a Smart TV, high-speed Wi-Fi, a dedicated workspace under open black shelving, and a kitchenette beneath a jaali lattice screen.',
        'Check yourself in with the lockbox, then make use of the swimming pool, gym, garden, in-house restaurant and EV charging. Parking on the premises is free, and online deliveries reach the main gate 24/7.',
      ),
      highlights: [
        { title: 'One of the few places in the area with a pool', text: 'Open daily at set hours.' },
        { title: 'Self check-in', text: 'Arrive when it suits you — the key is in a lockbox.' },
        { title: 'Set up for work', text: 'A dedicated workspace and high-speed Wi-Fi.' },
      ],
      moments: ['couples', 'remote', 'corporate', 'longstay', 'shoots'],
      locationNote: communityNote,
      heroImage: media['khushom-portrait'],
      gallery: [media['khushom-portrait'], media['khushom-wide'], media['khushom-desk'], media['khushom-kitchenette'], media['khushom-tall']],
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      sleeping: [{ space: 'Studio', beds: '1 king bed · 1 sofa' }],
      amenities: [...pick('kitchenette', 'fridge', 'kettle', 'wifi', 'workspace', 'tv', 'sofa', 'mirror', 'fan', 'lock', 'selfCheckIn', 'parking'), ...community],
      rating: { score: 5, count: 5, platform: 'airbnb', badge: 'Guest favourite', checkedOn: CHECKED },
      bookingLinks: [{ platform: 'airbnb', url: 'https://www.airbnb.co.in/rooms/1794210217937970863' }],
      seo: {
        title: 'Khushom By Basera — studio with pool in Jaipur',
        description:
          'A crisp white-and-teal studio in Jaipur with a king bed, workspace, Wi-Fi, kitchenette and self check-in — plus pool, gym, garden and in-house restaurant.',
      },
    },
  })

  const lovom = await payload.create({
    collection: 'stays',
    context,
    data: {
      _status: 'published',
      name: 'Lovom By Basera',
      slug: 'lovom',
      stayType: 'studio',
      tagline: 'Khushom’s twin — calm, bright and set up for a longer stay',
      summary:
        'A stylish studio in the same crisp whites and teal: a king bed and a sofa, a dedicated workspace, high-speed Wi-Fi, a Smart TV and a kitchenette — with self check-in, and the pool, gym, garden and in-house restaurant on site.',
      description: rich(
        '*Lovom by Basera is a stylish studio crafted for a relaxing stay.*',
        'It shares Khushom’s look — white and soft grey with a teal headboard — with a cozy king bed and a sofa, a Smart TV, high-speed Wi-Fi, a dedicated workspace and a kitchenette.',
        'Self check-in is by lockbox. On site there is a swimming pool, a gym, a garden, an in-house restaurant and EV charging, with free parking and 24/7 online delivery to the main gate.',
      ),
      highlights: [
        { title: 'Guests love the location', text: 'Every guest in the past year rated the location five stars on Airbnb.' },
        { title: 'One of the few places in the area with a pool', text: 'Open daily at set hours.' },
        { title: 'Self check-in', text: 'The key is waiting in a lockbox.' },
      ],
      moments: ['couples', 'remote', 'corporate', 'longstay'],
      locationNote: communityNote,
      nearby: [
        { place: 'Hare Krishna Movement temple', distance: '1.9 km' },
        { place: 'VIP — restaurant and shopping', distance: '1.3 km' },
      ],
      heroImage: media['khushom-desk'],
      gallery: [media['khushom-desk'], media['khushom-wide'], media['khushom-portrait'], media['khushom-tall'], media['khushom-kitchenette']],
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      sleeping: [{ space: 'Studio', beds: '1 king bed · 1 sofa' }],
      amenities: [...pick('kitchenette', 'fridge', 'kettle', 'wifi', 'workspace', 'tv', 'sofa', 'mirror', 'fan', 'lock', 'selfCheckIn', 'parking'), ...community],
      rating: { score: 5, count: 4, platform: 'airbnb', checkedOn: CHECKED },
      bookingLinks: [{ platform: 'airbnb', url: 'https://www.airbnb.co.in/rooms/1794220674961648332' }],
      seo: {
        title: 'Lovom By Basera — studio with pool in Jaipur',
        description:
          'A bright studio in Jaipur with a king bed, workspace, Wi-Fi, kitchenette and self check-in — plus pool, gym, garden and in-house restaurant. Sleeps 3.',
      },
    },
  })

  const eclipse = await payload.create({
    collection: 'stays',
    context,
    data: {
      _status: 'published',
      name: 'Eclipse By Royal Basera',
      slug: 'eclipse',
      stayType: 'studio',
      tagline: 'A dark, dreamy studio under a glowing full moon',
      summary:
        'An aesthetic dark-themed sanctuary featuring a signature illuminated full-moon wall — a luxury studio in Raja Park with AC, a Smart TV, high-speed Wi-Fi, a dedicated workspace and a modular kitchenette. Pets welcome.',
      description: rich(
        '*Eclipse is an aesthetic dark-themed sanctuary featuring a signature illuminated full-moon wall.*',
        'A luxury studio designed with elegant, modern interiors: charcoal walls, warm lines of light across the ceiling, and the moon glowing above a king bed. There is air conditioning, a Smart TV, high-speed Wi-Fi, a dedicated workspace, an attached bathroom with a softly lit niche, and a modular kitchenette.',
        'The whole studio is yours, with a private entrance, self check-in by lockbox and one dedicated free parking space. Malls, cafés and restaurants are nearby, and Blinkit and Instamart deliver groceries quickly.',
      ),
      highlights: [
        { title: 'The full-moon wall', text: 'The signature of the room — and of every photograph taken in it.' },
        { title: 'Top 5% of homes on Airbnb', text: 'A guest favourite, rated 5.0.' },
        { title: 'Pets welcome', text: 'Bring the whole family, four legs included.' },
      ],
      moments: ['couples', 'remote', 'corporate', 'shoots'],
      area: 'Raja Park',
      locationNote:
        'In Raja Park, with malls, cafés and restaurants nearby; Blinkit and Instamart deliver quickly. [DIRECTIONS — nearest landmark and time to Hawa Mahal]',
      heroImage: media['eclipse-moon'],
      gallery: [media['eclipse-moon'], media['eclipse-night'], media['eclipse-blossom'], media['eclipse-dark'], media['eclipse-bath']],
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      sleeping: [{ space: 'Studio', beds: '1 king bed · 1 sofa bed · 1 floor mattress' }],
      amenities: pick('kitchenette', 'wifi', 'workspace', 'tv', 'ac', 'fan', 'selfCheckIn', 'entrance', 'parking', 'pets'),
      houseRules: [{ rule: 'A government-approved ID is needed before check-in.' }, { rule: '[QUIET HOURS]' }, { rule: '[SMOKING POLICY]' }],
      rating: { score: 5, count: 27, platform: 'airbnb', badge: 'Guest favourite · Top 5% of homes', checkedOn: CHECKED },
      bookingLinks: [{ platform: 'airbnb', url: 'https://www.airbnb.co.in/rooms/1745750263710754006' }],
      faqs: [
        { question: 'Can I bring my dog?', answer: 'Yes — pets are welcome at Eclipse. [PET RULES — size, fees, anything to know]' },
        { question: 'Is there parking?', answer: 'Yes — one dedicated free parking space comes with the studio.' },
      ],
      seo: {
        title: 'Eclipse By Royal Basera — moon-wall studio in Raja Park, Jaipur',
        description:
          'A dark, aesthetic studio in Raja Park, Jaipur, with a signature illuminated full-moon wall, AC, Wi-Fi, workspace and kitchenette. Pets welcome. Sleeps 3.',
      },
    },
  })

  const all = [laxom.id, khushom.id, lovom.id, eclipse.id]
  const communityStays = [laxom.id, khushom.id, lovom.id]

  payload.logger.info('Creating experiences…')
  const experiences = [
    {
      title: 'The pool',
      kind: 'onsite',
      moments: ['families', 'couples'],
      summary:
        'Blue mosaic tile, a smaller pool alongside the main one, and white balconies rising on every side — open daily at set hours for guests at Laxom, Khushom and Lovom.',
      image: media.pool,
      detailImage: media['pool-above'],
      details: { when: 'Daily · [POOL HOURS]' },
      relatedStays: communityStays,
      featured: true,
    },
    {
      title: 'The in-house restaurant',
      kind: 'onsite',
      moments: ['couples', 'families', 'groups'],
      summary:
        'Mosaic glass lamps, mustard banquettes and a flowering plant painted inside an arched niche — the community’s in-house restaurant, for the evenings nobody wants to cook. [MENU & HOURS]',
      image: media.dining,
      details: { when: '[OPENING HOURS]' },
      relatedStays: communityStays,
      featured: true,
    },
    {
      title: 'The full-moon wall',
      kind: 'onsite',
      moments: ['couples', 'shoots'],
      summary:
        'Eclipse’s signature: an illuminated full moon above the bed in a dark, dreamy room. Switch off everything else and let the moon light the room.',
      image: media['eclipse-moon'],
      detailImage: media['eclipse-night'],
      relatedStays: [eclipse.id],
      featured: true,
    },
    {
      title: 'Lamplight at Laxom',
      kind: 'onsite',
      moments: ['couples', 'solo'],
      summary:
        'Laxom is lit in layers — cove light washing the walls, globe and rattan sconces by the bed, a brass lamp on the desk. By evening the room glows amber, and staying in becomes the plan.',
      image: media.evening,
      detailImage: media.bed,
      details: { when: 'From dusk' },
      relatedStays: [laxom.id],
      featured: true,
    },
    {
      title: 'Corporate stays',
      kind: 'onsite',
      moments: ['remote', 'corporate', 'longstay'],
      summary:
        'Every home has a dedicated workspace and high-speed Wi-Fi, with a Smart TV and a kitchenette for the evenings — comfortable corporate stays by the night, the week or the month.',
      image: media.desk,
      detailImage: media['khushom-desk'],
      details: { price: '[CORPORATE RATES]', booking: 'Ask us about longer and company bookings' },
      relatedStays: all,
      featured: true,
    },
    {
      title: 'Aesthetic shoot locations',
      kind: 'arranged',
      moments: ['shoots'],
      summary:
        'Our homes double as shoot locations for photographers, creators and brands — warm oak and sage at Laxom, crisp whites at Khushom and Lovom, moonlit dark at Eclipse.',
      image: media['eclipse-blossom'],
      detailImage: media['khushom-portrait'],
      details: { booking: 'Send your date, hours and crew size', price: '[SHOOT RATES]' },
      relatedStays: all,
      featured: false,
    },
    {
      title: 'Gym, garden and EV charging',
      kind: 'onsite',
      moments: ['longstay', 'corporate'],
      summary: 'Within the community: a gym for the morning routine, a garden for an evening walk, and EV charging if you have driven in.',
      relatedStays: communityStays,
      featured: false,
    },
    {
      title: 'Hawa Mahal and the old city',
      kind: 'nearby',
      moments: ['couples', 'families', 'solo'],
      summary:
        'The honeycombed pink sandstone façade of Hawa Mahal, built in 1799 so the royal women could watch street life unseen, anchors the old walled city — with City Palace and the Jantar Mantar observatory a short walk away.',
      details: { when: 'Early morning, before the heat and the crowds', distance: '[TRAVEL TIME from each home]' },
      featured: false,
    },
    {
      title: 'Amber Fort',
      kind: 'nearby',
      moments: ['families', 'couples'],
      summary:
        'On a hillside at Amer, about 11 km north of the old city: a fort-palace of honey-coloured stone, mirror-work halls and long views over Maota Lake.',
      details: { when: 'Go at opening time', distance: '[TRAVEL TIME from each home]' },
      featured: false,
    },
    {
      title: 'Nahargarh at sunset',
      kind: 'nearby',
      moments: ['couples', 'solo'],
      summary: 'The fort on the Aravalli ridge above the city, where Jaipur goes to watch the sun set over the Pink City.',
      details: { when: 'Golden hour', distance: '[TRAVEL TIME from each home]' },
      featured: false,
    },
    {
      title: 'The Pink City bazaars',
      kind: 'nearby',
      moments: ['couples', 'families', 'groups'],
      summary:
        'Johari Bazaar for jewellery, Bapu Bazaar for textiles and juttis, and street chaat at every corner. Bargaining is expected — and half the fun.',
      details: { when: 'Late afternoon into evening', distance: '[TRAVEL TIME from each home]' },
      featured: false,
    },
  ] as const
  for (const experience of experiences) {
    const related: number[] = 'relatedStays' in experience ? [...experience.relatedStays] : []
    await payload.create({
      collection: 'experiences',
      context,
      data: { _status: 'published', ...experience, moments: [...experience.moments], relatedStays: related },
    })
  }

  payload.logger.info('Adding guest reviews (copied word for word from Airbnb)…')
  const profileUrl = 'https://www.airbnb.co.in/users/show/551974506'
  const reviews = [
    {
      guestName: 'Akhlez',
      quote:
        'Clean, cozy, and great vibes all around. The room is beautifully maintained, the location is super convenient, and Love is an absolute gem of a host. Truly worth the price—can’t wait to stay here again',
    },
    {
      guestName: 'Jitendra',
      quote:
        'I have been needing a peaceful get away for a long time and this property provided just that it was quite peaceful and look exactly like pictures nice room decor, book collection is amazing, clean room fully equipped kitchen. Overall best experience. … I will definitely visit again and also recommend to others.',
    },
    {
      guestName: 'Priyanka',
      quote:
        'I had a wonderful stay! The property was clean, comfortable, and well-maintained. The host was friendly, helpful, and responsive throughout the stay. The location was convenient, and everything was just as expected.',
    },
    {
      guestName: 'Himanshu',
      quote:
        'I had a wonderful stay at Love Kumar’s place. Everything was comfortable and well-maintained. The experience was smooth, and I would happily recommend it to others.',
    },
  ]
  for (const review of reviews) {
    await payload.create({
      collection: 'testimonials',
      context,
      data: {
        ...review,
        stayedIn: 'October 2026',
        source: 'airbnb',
        sourceUrl: profileUrl,
        rating: 5,
        verified: true,
        featured: true,
      },
    })
  }

  payload.logger.info('Creating FAQs…')
  const faqs = [
    {
      category: 'booking',
      question: 'How do I book?',
      answer:
        'Send your dates through our Contact & Book page or call us on +91 92511 42426. We check availability personally and reply with the rate — usually within {responseTime}. Every home can also be booked on Airbnb.',
    },
    { category: 'booking', question: 'Is my stay confirmed when I send an inquiry?', answer: 'Not yet. An inquiry tells us your dates, and we reply with availability and the rate. {payment}' },
    { category: 'booking', question: 'What is your cancellation policy?', answer: '{cancellation}' },
    {
      category: 'booking',
      question: 'Do you host corporate and long stays?',
      answer:
        'Yes. Every home has a dedicated workspace and high-speed Wi-Fi, and we host comfortable corporate stays by the week or the month. [CORPORATE TERMS — invoices, GST, monthly rates]',
    },
    {
      category: 'booking',
      question: 'Can we book a home for a photo or film shoot?',
      answer: 'Yes — our homes are available as aesthetic shoot locations. Tell us the date, the hours and the size of your crew. [SHOOT TERMS — rates, hours, equipment]',
    },
    {
      category: 'arrival',
      question: 'What time are check-in and check-out?',
      answer: 'Check-in is from {checkIn} and check-out is by {checkOut}. Khushom, Lovom and Eclipse have self check-in with a lockbox.',
    },
    { category: 'arrival', question: 'What do I need to bring for check-in?', answer: '{idPolicy}' },
    {
      category: 'location',
      question: 'Where are your homes?',
      answer:
        'All four are in Jaipur. Laxom, Khushom and Lovom have a pool, gym, garden and in-house restaurant on site; Eclipse By Royal Basera is in Raja Park. [EXACT AREAS — or note that you share them once booked]',
    },
    { category: 'location', question: 'Is there parking?', answer: 'Yes — free parking on the premises at all four homes; Eclipse has one dedicated space.' },
    { category: 'location', question: 'How do I get to Jaipur?', answer: 'Our destination guide covers arriving by air, rail and road, getting around, and the best months to visit.' },
    { category: 'stay', question: 'How many guests can stay?', answer: 'Laxom sleeps up to four (a king bed, a sofa and a cot). Khushom, Lovom and Eclipse each sleep up to three.' },
    { category: 'stay', question: 'Is there Wi-Fi?', answer: 'Yes — high-speed Wi-Fi and a dedicated workspace in every home.' },
    { category: 'stay', question: 'When is the pool open?', answer: 'The pool at Laxom, Khushom and Lovom is open daily at set hours. [POOL HOURS]' },
    {
      category: 'food',
      question: 'Can I cook, or order in?',
      answer:
        'Every home has a kitchenette for light meals. Laxom, Khushom and Lovom have an in-house restaurant on site and online delivery to the main gate 24/7; near Eclipse, Blinkit and Instamart deliver quickly.',
    },
    { category: 'policies', question: 'Can children stay?', answer: '{children}' },
    { category: 'policies', question: 'Do you allow pets?', answer: '{pets}' },
  ] as const
  for (const faq of faqs) await payload.create({ collection: 'faqs', data: faq, context })

  payload.logger.info('Writing the journal…')
  await payload.create({
    collection: 'journal',
    context,
    data: {
      _status: 'published',
      title: 'Inside Laxom: a walk-through of the studio',
      slug: 'inside-laxom',
      category: 'stay',
      publishedAt: CHECKED,
      excerpt: 'What you will actually find when you open the door at Laxom — the bed, the light, the kitchenette, the desk and the bathroom, corner by corner.',
      coverImage: media.evening,
      relatedStays: [laxom.id],
      body: rich(
        'Photographs flatter and floor plans bore, so here is the plain version: a walk around Laxom By Basera, corner by corner, so you know exactly what you are booking.',
        { h2: 'The bed and the light' },
        'A king bed sits against a padded headboard in sage velvet, with a wall light on either side and a strip of cove lighting running along the wall above — so the room can glow without a single bright bulb. A sofa and a cot mean the studio sleeps up to four.',
        { image: media.bed },
        { h2: 'The kitchenette' },
        'The kitchenette sits in its own alcove under a jaali lattice screen: a sink, an induction cooktop, an electric kettle, cabinets above and drawers below, with a refrigerator and microwave alongside. Useful on long stays, and for late-night cravings on short ones.',
        '[COOKWARE — list the pans, crockery, cutlery and basics such as tea and coffee that you provide]',
        { image: media.kitchenette },
        { h2: 'The desk' },
        'A dedicated workspace with a lamp and an upholstered chair, open shelving above, and high-speed Wi-Fi — set up for corporate stays as much as holidays.',
        { image: media.desk },
        { h2: 'Somewhere to sit — and a balcony' },
        'A sofa corner and coffee table turn one room into two, a full-length mirror framed in light makes it feel larger, and a private balcony gives you the air outside.',
        { h2: 'Downstairs' },
        'Beyond the studio: a swimming pool open daily at set hours, a gym, a garden, an in-house restaurant hung with mosaic glass lamps, and EV charging. There is more on [the experiences page](/experiences), and the usual questions are answered in our [FAQs](/faqs).',
      ),
      seo: {
        title: 'Inside Laxom By Basera — a walk-through of the Jaipur studio',
        description: 'King bed, kitchenette under a jaali screen, workspace, private balcony, pool and in-house restaurant: a corner-by-corner look at Laxom in Jaipur.',
      },
    },
  })

  await payload.create({
    collection: 'journal',
    context,
    data: {
      _status: 'draft',
      title: 'Getting to Jaipur by air, rail and road',
      slug: 'getting-to-jaipur',
      category: 'guide',
      excerpt: 'The quickest ways to reach Jaipur — and our homes — from the airport, the station and the Delhi road.',
      body: rich(
        'Jaipur is one of the easiest cities in Rajasthan to reach. Here is how our guests usually arrive, and what to expect for the last few kilometres. [CHECK AND COMPLETE THIS GUIDE BEFORE PUBLISHING]',
        { h2: 'By air' },
        'Jaipur International Airport (JAI) is at Sanganer, south of the city, with direct flights from most major Indian cities. App cabs and prepaid taxis wait outside arrivals. [TRAVEL TIME from the airport to each home]',
        { h2: 'By rail' },
        'Jaipur Junction is the main station; Gandhinagar Jaipur and Durgapura can be closer depending on your train. Fast daytime trains from Delhi take roughly four to five hours. [CLOSEST STATION to each home]',
        { h2: 'By road' },
        'From Delhi it is about 270 km on NH 48 — five to six hours depending on traffic. [ROUTE TIPS — the last turn people miss, parking on arrival]',
        { h2: 'When you arrive' },
        'Khushom, Lovom and Eclipse have self check-in with a lockbox; parking is free on the premises at every home. [ARRIVAL STEPS — gate, lift, who to call]',
      ),
    },
  })

  payload.logger.info('Filling in the pages…')
  await payload.updateGlobal({
    slug: 'settings',
    context,
    data: {
      brandName: 'Basera Venture',
      propertyType: 'Luxury homestays',
      usp: 'luxury homestays, corporate stays and aesthetic shoot locations',
      tagline: 'Luxury homestays, comfortable corporate stays and aesthetic shoot locations in Jaipur.',
      location: 'Jaipur',
      nearbyCity: 'Delhi',
      address: { city: 'Jaipur', region: 'Rajasthan', country: 'India' },
      contact: { phone: '+91 92511 42426', email: 'baseraventure@gmail.com', responseTime: 'an hour' },
      policies: {
        idRequirements: 'A government-approved ID is needed before check-in.',
        pets: 'Pets are welcome at Eclipse By Royal Basera. [PET POLICY for Laxom, Khushom and Lovom]',
        houseRules: [{ rule: 'A government-approved ID is needed before check-in.' }, { rule: '[QUIET HOURS]' }, { rule: '[SMOKING POLICY]' }],
      },
      booking: {
        whatsappMessage: 'Hello Basera Venture! I would like to ask about a stay in Jaipur.',
        channels: [{ platform: 'airbnb', url: profileUrl }],
      },
      seo: {
        shareImage: media['eclipse-moon'],
        defaultDescription:
          'Basera Venture: luxury homestays, corporate stays and shoot locations in Jaipur — four studios with Wi-Fi, workspaces and kitchenettes, three with a pool, gym and in-house restaurant.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'home',
    context,
    data: {
      hero: {
        eyebrow: '{propertyType} · {location}',
        headline: 'Some places are visited. *Others stay with you.*',
        subheadline:
          'Four studios in Jaipur for slow mornings and late lamplight — three beside a pool, gym, garden and in-house restaurant, and Eclipse in Raja Park with its glowing full-moon wall.',
        image: media.evening,
        mobileImage: media.portrait,
        primaryLabel: 'Explore the Stays',
        secondaryLabel: 'Check Availability',
      },
      story: {
        eyebrow: 'Basera — a place to settle',
        heading: 'Built around the hours you *actually spend* here.',
        lines: [
          { text: 'Light that is amber by evening and soft by morning.' },
          { text: 'A desk and fast Wi-Fi for the email you can’t avoid — and a sofa for when you’re done with it.' },
          { text: 'A kitchenette for late chai and early fruit.' },
          { text: 'Lattice screens that turn plain light into pattern.' },
          { text: 'A pool to come back to, and an in-house restaurant when nobody wants to cook.' },
          { text: 'Everything here is meant to be used.' },
        ],
        image: media.dining,
        detailImage: media['eclipse-bath'],
        linkLabel: 'Read our story',
      },
      moments: {
        eyebrow: 'Find your moment',
        heading: 'What brings you *to Jaipur?*',
        intro: 'Four homes, each with its own mood. Tell us the trip, and we’ll show you the one that suits it.',
        items: [
          {
            label: 'Two of you',
            title: 'A slow escape for two',
            description:
              'A king bed under a glowing full moon at Eclipse, or Laxom’s amber lamplight and private balcony. Long mornings, late films, nowhere to be.',
            image: media['eclipse-moon'],
            highlights: [
              { text: 'Eclipse’s illuminated full-moon wall' },
              { text: 'A private balcony at Laxom' },
              { text: 'Self check-in at Eclipse, Khushom and Lovom' },
            ],
            stay: eclipse.id,
          },
          {
            label: 'The family',
            title: 'Room for everyone',
            description:
              'Laxom sleeps four with a king bed, a sofa and a cot. The pool is open daily, and the in-house restaurant feeds everyone at once.',
            image: media.pool,
            highlights: [
              { text: 'Laxom sleeps up to four — king bed, sofa and cot' },
              { text: 'A swimming pool, open daily at set hours' },
              { text: 'An in-house restaurant on site' },
            ],
            stay: laxom.id,
          },
          {
            label: 'Corporate stays',
            title: 'Work, but make it slower',
            description:
              'Every home has a dedicated workspace and high-speed Wi-Fi, with a Smart TV for the evening and a kitchenette for the week’s groceries.',
            image: media.desk,
            highlights: [
              { text: 'A dedicated workspace in every home' },
              { text: 'High-speed Wi-Fi throughout' },
              { text: '[CORPORATE TERMS — invoices, GST, monthly rates]' },
            ],
            stay: khushom.id,
          },
          {
            label: 'A shoot',
            title: 'A backdrop with a point of view',
            description:
              'Aesthetic shoot locations for photographers, creators and brands: Laxom’s warm oak and sage, crisp whites at Khushom and Lovom, Eclipse’s moonlit dark.',
            image: media['eclipse-night'],
            highlights: [
              { text: 'Four distinct interiors, from amber to moonlit' },
              { text: 'Free parking on the premises' },
              { text: '[SHOOT TERMS — rates, hours, crew size]' },
            ],
            stay: eclipse.id,
          },
          {
            label: 'Staying a while',
            title: 'A month that feels like yours',
            description:
              'A kitchenette for everyday meals, deliveries to the gate around the clock, a gym for the routine — and a pool for the weekend.',
            image: media.kitchenette,
            highlights: [
              { text: 'Kitchenette in every home' },
              { text: '24/7 online delivery to the main gate' },
              { text: '[LONG-STAY RATES — weekly or monthly]' },
            ],
            stay: lovom.id,
          },
        ],
      },
      signature: {
        eyebrow: 'Signature experiences',
        heading: 'Places within *the place*',
        intro: 'A pool, an in-house restaurant under mosaic lamps, studios lit like lanterns — and one with its own moon.',
      },
      day: {
        eyebrow: 'A day here',
        heading: 'From first light *to lamplight*',
        intro: 'How the hours tend to unfold — in photographs and a few lines each.',
      },
      collage: {
        eyebrow: 'Visual journal',
        heading: 'Four homes, *four moods*',
        intro: 'Sage and oak, crisp white and teal, charcoal and moonlight — and a pool tiled in impossible blue.',
        images: [media.dining, media.evening, media['eclipse-moon'], media['khushom-portrait'], media['pool-above'], media['eclipse-bath'], media.bed],
      },
      stories: { eyebrow: 'Guest reviews', heading: 'Rated by *our guests*' },
      destination: {
        eyebrow: 'The destination',
        heading: 'Around *{location}*',
        intro: 'How to arrive, when to come, and the forts, bazaars and sunsets worth leaving the studio for — a practical guide from your hosts.',
      },
      invitation: {
        eyebrow: 'Your dates',
        heading: 'Come and see which kind *of place this is.*',
        intro: 'Tell us when you’d like to come and who’s coming. We reply personally — usually within {responseTime}. No countdown timers, no pressure.',
        image: media['eclipse-night'],
        buttonLabel: 'Check Availability',
      },
      seo: {
        title: 'Basera Venture — luxury homestays in Jaipur with a pool',
        description:
          'Four studios in Jaipur for couples, families, corporate stays and shoots — workspaces, Wi-Fi and kitchenettes; three with a pool, gym and in-house restaurant.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'story',
    context,
    data: {
      hero: {
        eyebrow: 'Our story',
        heading: 'A place shaped by *how people actually stay*',
        intro: 'Basera means a dwelling — a place to settle. Four homes in Jaipur, built around a few simple ideas about what makes a room easy to live in.',
        image: media.portrait,
      },
      people: {
        heading: 'The people behind {brand}',
        text:
          'Basera Venture is run by Love Kumar, with co-hosts Prakhar, Gaurav and Suyash. In Love’s words: “My entrepreneurial journey began on the ground in the food industry, spending years building multiple restaurants across different cities to master hospitality & operations. Today, I’ve blended my academic background & field experience to create ‘Basera Venture’—offering premium, aesthetic stays.”\n\nOn Airbnb, Love is a Superhost with a 100% response rate who usually replies within an hour.',
        members: [
          {
            name: 'Love Kumar',
            role: 'Founder & host',
            bio: 'BSc (Bio) and a Master’s in Ops & Data Sciences (NMIMS, Mumbai); years building restaurants across different cities before founding Basera Venture. Lives a disciplined lifestyle and loves mountain travel.',
          },
          { name: 'Prakhar', role: 'Co-host' },
          { name: 'Gaurav', role: 'Co-host' },
          { name: 'Suyash', role: 'Co-host' },
        ],
      },
      philosophy: {
        eyebrow: 'Design & philosophy',
        heading: 'Four ideas *you can see*',
        intro: 'Look closely at the photographs and you will find the same few ideas, again and again.',
        pillars: [
          { title: 'Four moods, one standard', text: 'Amber at Laxom, crisp white at Khushom and Lovom, moonlit dark at Eclipse — and in every one, a workspace, fast Wi-Fi, a kitchenette and free parking.', image: media['eclipse-moon'] },
          { title: 'Light in layers', text: 'Cove light washing the walls, sconces by the bed, a lamp on the desk — and at Eclipse, a moon. Nothing glares.', image: media.evening },
          { title: 'The lattice and the arch', text: 'Jaali screens above the kitchenettes scatter light into pattern, and an arched niche in the restaurant frames a painted flowering plant — quiet echoes of Rajasthan’s craft traditions.', image: media.kitchenette },
          { title: 'Rooms you can live in', text: 'A desk you can work at, a sofa you can sink into, a kitchenette for real groceries. Studios that work as well at noon as at midnight.', image: media.desk },
        ],
      },
      local: {
        heading: 'Local connections',
        text: '[LOCAL CONNECTIONS — the makers, cooks, drivers and neighbours you work with in Jaipur. Name them; it matters.]',
      },
      timeline: { heading: 'How we got here' },
      promise: {
        heading: 'What we promise',
        items: [
          { title: 'Real prices, or none', text: 'If you see a rate on this site, we keep it current. If we can’t, we leave it off and give you the real figure when you ask.' },
          { title: 'No pressure', text: 'No countdown timers, no “only one room left” banners. Take the time you need.' },
          { title: 'A person replies', text: 'Every inquiry is read and answered by us — usually within {responseTime}.' },
        ],
      },
      seo: {
        title: 'Our story — the people behind Basera Venture, Jaipur',
        description: 'Basera means a place to settle. Meet the hosts behind four Jaipur homes, and the ideas behind their design.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'day',
    context,
    data: {
      intro: {
        eyebrow: 'A day here',
        heading: 'From first light *to lamplight*',
        intro: 'No itinerary — just the shape the hours tend to take. Scroll slowly; the light changes as you go.',
      },
      moments: [
        { time: 'dawn', title: 'Before anyone else is up', text: 'The building is quiet. The pool lies perfectly still, and the first light finds the balconies before it finds you.' },
        { time: 'morning', title: 'Chai, then a plan (or not)', text: 'The kettle clicks off in the kitchenette. Open the curtains, pull out the desk chair and decide what kind of day this is going to be.', image: media.portrait },
        { time: 'midday', title: 'The pool at its bluest', text: 'By noon the mosaic tiles turn the water an almost impossible blue. A towel on the stone edge, a book, and a swim whenever the mood strikes.', image: media.pool },
        { time: 'afternoon', title: 'The slow hours', text: 'Curtains half-drawn, the room hushed and still. A nap, a film, a chapter — the afternoon belongs to whoever claims it first.', image: media.bed },
        { time: 'evening', title: 'Lamps on in the restaurant', text: 'In the in-house restaurant the mosaic lamps glow blue and gold above the banquettes. [DINNER — what is served in the evening, and when]', image: media.dining },
        { time: 'night', title: 'Amber, then dark', text: 'Back at Laxom the cove lights are low and warm. One more chapter, one more episode, and then the particular kind of sleep you only find away from home.', image: media['media-wall'] },
        { time: 'night', title: 'Or, by moonlight', text: 'Across town at Eclipse, switch everything off but the moon on the wall.', image: media['eclipse-night'] },
      ],
      closing: {
        heading: 'Your version of the day *starts with a date.*',
        text: 'Tell us when you would like to come — we will take care of the rest of the details.',
      },
      seo: {
        title: 'A day at Basera Venture, Jaipur — from first light to lamplight',
        description: 'Chai in a lamplit studio, the pool at noon, mosaic lamps in the evening and a moon on the wall: a day at Basera Venture in Jaipur, hour by hour.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'destination',
    context,
    data: {
      hero: {
        eyebrow: 'Destination guide',
        heading: 'Around *{location}*',
        intro: 'How to get to Jaipur, when to come, and where to go once you are here — a practical guide from your hosts, updated as things change.',
      },
      gettingHere: {
        eyebrow: 'Getting here',
        heading: 'Finding *your way*',
        intro: 'Jaipur, the capital of Rajasthan, is easy to reach by air, rail and road. [LAST MILE — the easiest way to reach each home, and its nearest landmark]',
        routes: [
          { mode: 'plane', title: 'By air', text: 'Jaipur International Airport (JAI) is at Sanganer, south of the city, with direct flights from most major Indian cities. App cabs and prepaid taxis wait outside arrivals. [TRAVEL TIME to each home]' },
          { mode: 'train', title: 'By rail', text: 'Jaipur Junction is the main station; Gandhinagar Jaipur and Durgapura can be closer depending on your train. Fast daytime trains from Delhi take roughly four to five hours. [CLOSEST STATION to each home]' },
          { mode: 'car', title: 'By road', text: 'From {nearbyCity} it is about 270 km on NH 48 — five to six hours depending on traffic. Parking is free at every Basera home.' },
          { mode: 'walk', title: 'Getting around', text: 'App cabs (Uber, Ola, Rapido) and autos are everywhere, and the Pink Line metro runs from Mansarovar to Badi Chaupar in the old city. Self-drive cars are easy to rent.' },
        ],
      },
      explorer: {
        eyebrow: 'The compass',
        heading: 'What’s *near*',
        intro: 'Places we send our own guests, plotted by direction and travel time from the front door. Choose one for the details.',
      },
      seasons: {
        eyebrow: 'When to come',
        heading: 'The year *in Jaipur*',
        intro: 'Jaipur has three clear seasons. Each has its pleasures — and the pool helps with one of them.',
        items: [
          { months: 'October – March', title: 'The cool season', text: 'Warm days and cool nights — the best weather for forts and bazaars. Festival crowds gather around Diwali and the Jaipur Literature Festival in January; book early.' },
          { months: 'April – June', title: 'Summer', text: 'Hot and dry, often above 40°C by May. Sightsee early and late, and spend the afternoons by the pool.' },
          { months: 'July – September', title: 'Monsoon', text: 'Passing showers turn the Aravalli hills green, and the crowds thin out.' },
        ],
      },
      practical: {
        heading: 'Good to know',
        items: [
          { title: 'Cash & cards', text: 'UPI works almost everywhere, even at street stalls; carry a little cash for autos and markets.' },
          { title: 'Groceries & food', text: 'Online deliveries reach the main gate 24/7 at Laxom, Khushom and Lovom; near Eclipse, Blinkit and Instamart deliver quickly.' },
          { title: 'Staying connected', text: 'Every Basera home has high-speed Wi-Fi and a dedicated workspace.' },
          { title: 'Local customs', text: 'Dress modestly and remove your shoes at temples; bargaining is expected in the old-city bazaars.' },
          { title: 'Pharmacy & medical', text: '[NEAREST PHARMACY AND HOSPITAL to each home]' },
        ],
      },
      seo: {
        title: 'Jaipur travel guide — getting here, best time to visit & nearby',
        description: 'Plan a trip to Jaipur: arriving by air, rail and road, the best months to visit, and the forts and bazaars nearby — from the hosts of Basera Venture.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'pages',
    context,
    data: {
      stays: {
        eyebrow: 'Our stays',
        heading: 'Four homes, *four moods*',
        intro: 'Amber and sage at Laxom, crisp whites at Khushom and Lovom, moonlit dark at Eclipse — each with a workspace, high-speed Wi-Fi, a kitchenette and free parking.',
        seo: {
          title: 'Jaipur homestays — compare our four studios | Basera Venture',
          description: 'Compare Laxom, Khushom, Lovom and Eclipse: guests, beds, amenities and ratings — then check availability with the hosts or book on Airbnb.',
        },
      },
      experiences: {
        eyebrow: 'Experiences',
        heading: 'Things to do, *and not do*',
        intro: 'Swim, work, shoot, eat in — or head into the Pink City. Here is what is on offer at {brand} and around {location}.',
        image: media.pool,
        seo: {
          title: 'Experiences at Basera Venture — pool, dining & Jaipur days out',
          description: 'A pool, an in-house restaurant, a moon on the wall and the forts and bazaars of Jaipur nearby — things to do when you stay with Basera Venture.',
        },
      },
      gallery: {
        eyebrow: 'Gallery',
        heading: 'The visual *journal*',
        intro: 'Laxom’s lamplight, the moon at Eclipse, crisp whites at Khushom and Lovom, the pool and the in-house restaurant.',
        postcardsHeading: 'Postcards *from here*',
        postcardsIntro: 'Scenes we love, and moments guests have shared with us. Have one of your own? Send it our way — with your name, if you would like the credit.',
        seo: {
          title: 'Photo gallery — Basera Venture homestays, Jaipur',
          description: 'See Laxom, Khushom, Lovom and Eclipse, the pool and the in-house restaurant before you book your stay in Jaipur.',
        },
      },
      journal: {
        eyebrow: 'Journal',
        heading: 'Notes *from here*',
        intro: 'Guides, seasons and stories from {location} — the things we tell guests when they ask, written down.',
        seo: {
          title: 'Journal — Jaipur guides & stories | Basera Venture',
          description: 'Practical guides and stories from Jaipur — getting here, seasons, where to go — and a closer look at our homes.',
        },
      },
      faqs: {
        eyebrow: 'FAQs',
        heading: 'Good *questions*',
        intro: 'Everything guests usually ask before they book. Can’t find yours? Call us — a person will answer.',
        seo: {
          title: 'FAQs — booking, check-in & policies | Basera Venture Jaipur',
          description: 'Check-in, parking, Wi-Fi, pool, food, pets and corporate or shoot bookings — answers about staying with Basera Venture in Jaipur.',
        },
      },
      contact: {
        eyebrow: 'Contact & book',
        heading: 'Let’s find *your dates*',
        intro: 'Send your dates and we will come back to you personally with availability and the rate — usually within {responseTime}. An inquiry costs nothing and commits you to nothing.',
        nextSteps: [
          { title: 'We check your dates', text: 'Availability is checked by a person, not a bot.' },
          { title: 'We reply with the rate', text: 'Usually within {responseTime}, by the channel you prefer, with what is included spelled out.' },
          { title: 'You confirm', text: '{payment}' },
        ],
        seo: {
          title: 'Contact & book — Basera Venture homestays, Jaipur',
          description: 'Check availability and rates for Basera Venture’s homes in Jaipur. Send your dates or call +91 92511 42426 — the hosts reply personally.',
        },
      },
      privacy: {
        eyebrow: 'Privacy',
        heading: 'Privacy *notice*',
        intro: 'What we collect when you contact us, why, and what we do with it.',
        body: rich(
          { h2: 'What we collect' },
          'When you send an inquiry we receive your name, email address, phone number (if you give it), your dates, the number of guests and your message.',
          { h2: 'Why we collect it' },
          'Only to answer your inquiry and, if you book, to look after your stay. We do not sell your details or share them with anyone for marketing.',
          { h2: 'Analytics' },
          'If you accept analytics cookies, we use Google Analytics to understand which pages are useful. If you decline, no analytics cookies are set.',
          { h2: 'How long we keep it' },
          '[RETENTION PERIOD — e.g. inquiries are deleted after 24 months]',
          { h2: 'Your choices' },
          'You can ask us at any time to show, correct or delete what we hold about you — write to baseraventure@gmail.com.',
          '[LEGAL REVIEW — have this notice checked under India’s Digital Personal Data Protection Act, 2023, and the GDPR if you host guests from the EU.]',
        ),
        seo: { title: 'Privacy notice — Basera Venture' },
      },
    },
  })

  payload.logger.info('Done. Open http://localhost:3000 — and /admin to create your account.')
}

try {
  await run()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
