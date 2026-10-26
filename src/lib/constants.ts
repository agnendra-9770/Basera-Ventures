/**
 * Shared option lists used by both the CMS schema and the website.
 * Keep labels guest-facing — several are shown on the site as-is.
 */

type Option = { label: string; value: string }

export const MOMENTS: Option[] = [
  { label: 'Couples', value: 'couples' },
  { label: 'Families', value: 'families' },
  { label: 'Groups & friends', value: 'groups' },
  { label: 'Remote work', value: 'remote' },
  { label: 'Corporate stays', value: 'corporate' },
  { label: 'Long stays', value: 'longstay' },
  { label: 'Photo & film shoots', value: 'shoots' },
  { label: 'Solo travellers', value: 'solo' },
]

export const STAY_TYPES: Option[] = [
  { label: 'Studio', value: 'studio' },
  { label: 'Room', value: 'room' },
  { label: 'Suite', value: 'suite' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Cottage', value: 'cottage' },
  { label: 'Homestay', value: 'homestay' },
  { label: 'Other', value: 'other' },
]

export const MEDIA_CATEGORIES: Option[] = [
  { label: 'Rooms & studios', value: 'studios' },
  { label: 'Bathrooms', value: 'bath' },
  { label: 'Pool', value: 'pool' },
  { label: 'Dining', value: 'dining' },
  { label: 'Spaces & architecture', value: 'spaces' },
  { label: 'Details', value: 'details' },
  { label: 'The destination', value: 'destination' },
  { label: 'People', value: 'people' },
  { label: 'Exterior', value: 'exterior' },
  { label: 'Other', value: 'other' },
]

export const AMENITY_CATEGORIES: Option[] = [
  { label: 'Sleep & comfort', value: 'comfort' },
  { label: 'Kitchen & dining', value: 'kitchen' },
  { label: 'Work & connectivity', value: 'work' },
  { label: 'Bathroom', value: 'bath' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Safety & privacy', value: 'safety' },
  { label: 'Family', value: 'family' },
  { label: 'Outdoors & leisure', value: 'leisure' },
  { label: 'Accessibility', value: 'access' },
  { label: 'Services', value: 'services' },
]

/** Icon names available in components/ui/Icon.tsx. */
export const ICON_NAMES = [
  'bed',
  'guests',
  'bath',
  'size',
  'kitchen',
  'kettle',
  'fridge',
  'microwave',
  'desk',
  'tv',
  'wardrobe',
  'sofa',
  'mirror',
  'fan',
  'ac',
  'lock',
  'wifi',
  'pool',
  'dining',
  'coffee',
  'parking',
  'lift',
  'balcony',
  'garden',
  'washer',
  'iron',
  'towel',
  'child',
  'accessible',
  'pet',
  'no-smoking',
  'safe',
  'first-aid',
  'sun',
  'moon',
  'leaf',
  'sparkle',
  'lamp',
  'gym',
  'ev',
  'key',
  'camera',
  'delivery',
  'door',
] as const

export type IconName =
  | (typeof ICON_NAMES)[number]
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'close'
  | 'menu'
  | 'plus'
  | 'minus'
  | 'calendar'
  | 'clock'
  | 'pin'
  | 'compass'
  | 'phone'
  | 'mail'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'play'
  | 'pause'
  | 'expand'
  | 'check'
  | 'info'
  | 'plane'
  | 'train'
  | 'car'
  | 'walk'
  | 'sunrise'
  | 'sunset'
  | 'quote'
  | 'external'
  | 'grid'

export const PLACE_CATEGORIES: Option[] = [
  { label: 'Sights & landmarks', value: 'sight' },
  { label: 'Nature & walks', value: 'nature' },
  { label: 'Food & cafés', value: 'food' },
  { label: 'Culture & heritage', value: 'culture' },
  { label: 'Markets & shopping', value: 'shopping' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Getting here', value: 'transport' },
  { label: 'Essentials', value: 'essentials' },
]

export const DIRECTIONS: Option[] = [
  { label: 'North', value: 'N' },
  { label: 'North-east', value: 'NE' },
  { label: 'East', value: 'E' },
  { label: 'South-east', value: 'SE' },
  { label: 'South', value: 'S' },
  { label: 'South-west', value: 'SW' },
  { label: 'West', value: 'W' },
  { label: 'North-west', value: 'NW' },
]

export const TRAVEL_MODES: Option[] = [
  { label: 'On foot', value: 'walk' },
  { label: 'By car or taxi', value: 'car' },
  { label: 'By auto-rickshaw', value: 'auto' },
  { label: 'By train', value: 'train' },
  { label: 'By air', value: 'plane' },
]

export const ROUTE_MODES: Option[] = [
  { label: 'By air', value: 'plane' },
  { label: 'By rail', value: 'train' },
  { label: 'By road', value: 'car' },
  { label: 'Getting around', value: 'walk' },
]

export const BOOKING_PLATFORMS: Option[] = [
  { label: 'Airbnb', value: 'airbnb' },
  { label: 'Booking.com', value: 'booking' },
  { label: 'Agoda', value: 'agoda' },
  { label: 'MakeMyTrip', value: 'makemytrip' },
  { label: 'Goibibo', value: 'goibibo' },
  { label: 'Vrbo', value: 'vrbo' },
  { label: 'Our booking engine', value: 'direct' },
  { label: 'Other', value: 'other' },
]

export const REVIEW_SOURCES: Option[] = [
  { label: 'Google', value: 'google' },
  { label: 'Airbnb', value: 'airbnb' },
  { label: 'Booking.com', value: 'booking' },
  { label: 'Tripadvisor', value: 'tripadvisor' },
  { label: 'Agoda', value: 'agoda' },
  { label: 'MakeMyTrip', value: 'makemytrip' },
  { label: 'Message to us (with consent)', value: 'direct' },
  { label: 'Other', value: 'other' },
]

export const JOURNAL_CATEGORIES: Option[] = [
  { label: 'Destination guide', value: 'guide' },
  { label: 'Inside the stay', value: 'stay' },
  { label: 'Seasons & events', value: 'seasonal' },
  { label: 'People & places', value: 'people' },
  { label: 'Notes', value: 'notes' },
]

export const FAQ_CATEGORIES: Option[] = [
  { label: 'Booking', value: 'booking' },
  { label: 'Arrival', value: 'arrival' },
  { label: 'The stay', value: 'stay' },
  { label: 'Food', value: 'food' },
  { label: 'Getting here', value: 'location' },
  { label: 'Policies', value: 'policies' },
]

export const DAY_TIMES: Option[] = [
  { label: 'Dawn', value: 'dawn' },
  { label: 'Morning', value: 'morning' },
  { label: 'Midday', value: 'midday' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Golden hour', value: 'golden' },
  { label: 'Evening', value: 'evening' },
  { label: 'Night', value: 'night' },
]

export const CURRENCIES: Option[] = [
  { label: 'Indian rupee (₹)', value: 'INR' },
  { label: 'US dollar ($)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' },
  { label: 'British pound (£)', value: 'GBP' },
  { label: 'UAE dirham (AED)', value: 'AED' },
]

export const labelFor = (options: Option[], value?: string | null) =>
  options.find((o) => o.value === value)?.label ?? value ?? ''
