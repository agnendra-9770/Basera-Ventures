import type { Amenity, Stay } from '@/payload-types'

import { AMENITY_CATEGORIES, type IconName, labelFor, STAY_TYPES } from './constants'
import { formatDate, formatPrice } from './format'

export const stayTypeLabel = (stay: Pick<Stay, 'stayType'>) => labelFor(STAY_TYPES, stay.stayType)

export const amenitiesOf = (stay: Stay): Amenity[] =>
  (stay.amenities ?? []).filter((a): a is Amenity => typeof a === 'object' && a !== null)

export type Fact = { icon: IconName; label: string }

/**
 * The at-a-glance facts for a stay. Missing essentials appear as
 * placeholders before launch so they are noticed — and vanish after.
 */
export const stayFacts = (stay: Stay, showMissing: boolean): Fact[] => {
  const facts: Fact[] = []
  if (stay.maxGuests) facts.push({ icon: 'guests', label: `Sleeps ${stay.maxGuests}` })
  else if (showMissing) facts.push({ icon: 'guests', label: 'Sleeps [MAX GUESTS]' })

  const beds = (stay.sleeping ?? []).map((s) => s.beds).filter(Boolean)
  if (beds.length) facts.push({ icon: 'bed', label: beds.join(' + ') })

  if (stay.bedrooms) facts.push({ icon: 'lamp', label: `${stay.bedrooms} bedroom${stay.bedrooms === 1 ? '' : 's'}` })
  if (stay.bathrooms) facts.push({ icon: 'bath', label: `${stay.bathrooms} bathroom${stay.bathrooms === 1 ? '' : 's'}` })
  if (stay.size) facts.push({ icon: 'size', label: `${stay.size.toLocaleString('en-IN')} ${stay.sizeUnit === 'sqm' ? 'm²' : 'sq ft'}` })

  if (amenitiesOf(stay).some((a) => a.icon === 'kitchen')) facts.push({ icon: 'kitchen', label: 'Kitchenette' })
  return facts
}

const UNIT = { night: 'night', week: 'week', month: 'month' } as const

/** "From ₹4,500 a night" — only when the owner maintains a real rate. */
export const priceLine = (stay: Stay, currency = 'INR') =>
  stay.priceFrom && stay.priceFrom > 0
    ? {
        amount: formatPrice(stay.priceFrom, currency),
        unit: UNIT[stay.priceUnit ?? 'night'] ?? 'night',
        checked: stay.ratesCheckedOn ? formatDate(stay.ratesCheckedOn) : null,
        note: stay.priceNote ?? null,
      }
    : null

/** Amenities grouped by category, in the order the categories are defined. */
export const groupAmenities = (amenities: Amenity[]) =>
  AMENITY_CATEGORIES.map((category) => ({
    ...category,
    items: amenities.filter((a) => a.category === category.value),
  })).filter((group) => group.items.length > 0)
