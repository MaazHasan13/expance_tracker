import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Clapperboard,
  HeartPulse,
  ShoppingCart,
  Home,
  Plane,
  MoreHorizontal,
  Tag,
} from 'lucide-react'

const ICONS = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  receipt: Receipt,
  clapperboard: Clapperboard,
  'heart-pulse': HeartPulse,
  'shopping-cart': ShoppingCart,
  home: Home,
  plane: Plane,
  'more-horizontal': MoreHorizontal,
}

export const getCategoryIcon = (name) => ICONS[name] || Tag
