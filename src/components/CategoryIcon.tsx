import React from 'react';
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Car,
  Fuel,
  CreditCard,
  Briefcase,
  Gift,
  Award,
  Baby,
  Trash2,
  Wrench,
  TrendingUp,
  PlusCircle,
  HelpCircle,
  Shirt,
  GraduationCap,
  BookOpen,
  Building2,
  Sparkles,
  Heart,
  Dumbbell,
  Dog,
  Cat,
  Plane,
  Coffee,
  Utensils,
  Film,
  Tv,
  Gamepad2,
  Music,
  Home,
  Hammer,
  Bike,
  Scissors,
  ShoppingBag,
  Tag,
  Phone,
  Bus,
  Smile,
  Flame,
  Stethoscope,
  Pill,
  Camera,
  Palette,
  Compass,
  Hotel,
  Store,
  Trophy,
  Gem,
  Wifi,
  Sparkle,
} from 'lucide-react';
import type { TransactionCategory } from '../types';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Zap,
  Trash2,
  ShieldCheck,
  Car,
  Wrench,
  Fuel,
  Building2,
  BookOpen,
  GraduationCap,
  Shirt,
  Sparkles,
  CreditCard,
  Briefcase,
  Award,
  Baby,
  Gift,
  TrendingUp,
  PlusCircle,
  Heart,
  Dumbbell,
  Dog,
  Cat,
  Plane,
  Coffee,
  Utensils,
  Film,
  Tv,
  Gamepad2,
  Music,
  Home,
  Hammer,
  Bike,
  Scissors,
  ShoppingBag,
  Tag,
  Phone,
  Bus,
  Smile,
  Flame,
  Stethoscope,
  Pill,
  Camera,
  Palette,
  Compass,
  Hotel,
  Store,
  Trophy,
  Gem,
  Wifi,
  Sparkle,
};

export const AVAILABLE_CATEGORY_ICONS: { id: string; name: string }[] = [
  { id: 'Dumbbell', name: 'Sport / Palestra' },
  { id: 'Dog', name: 'Animali / Cane' },
  { id: 'Cat', name: 'Animali / Gatto' },
  { id: 'Heart', name: 'Salute / Benessere' },
  { id: 'Stethoscope', name: 'Medico / Visite' },
  { id: 'Pill', name: 'Farmacia / Cure' },
  { id: 'Plane', name: 'Viaggi / Vacanze' },
  { id: 'Hotel', name: 'Hotel / Soggiorni' },
  { id: 'Coffee', name: 'Bar / Caffetteria' },
  { id: 'Utensils', name: 'Ristoranti / Cene' },
  { id: 'Tv', name: 'Streaming / Abbonamenti' },
  { id: 'Gamepad2', name: 'Giochi / Console' },
  { id: 'Film', name: 'Cinema / Spettacoli' },
  { id: 'Music', name: 'Musica / Concerti' },
  { id: 'Home', name: 'Casa / Arredamento' },
  { id: 'Hammer', name: 'Brico / Fai-da-te' },
  { id: 'Bike', name: 'Bici / Mobilità' },
  { id: 'ShoppingBag', name: 'Shopping / Negozi' },
  { id: 'Scissors', name: 'Parrucchiere / Cura' },
  { id: 'Palette', name: 'Arte / Hobby' },
  { id: 'Camera', name: 'Fotografia / Ricordi' },
  { id: 'Phone', name: 'Telefonia / Tech' },
  { id: 'Wifi', name: 'Connessione / IT' },
  { id: 'Trophy', name: 'Competizioni / Gare' },
  { id: 'Gem', name: 'Gioielli / Lusso' },
  { id: 'Smile', name: 'Tempo Libero' },
  { id: 'Tag', name: 'Generico / Altro' },
  { id: 'ShoppingCart', name: 'Supermercato' },
  { id: 'Zap', name: 'Bollette' },
  { id: 'Building2', name: 'Condominio' },
  { id: 'Fuel', name: 'Carburante' },
  { id: 'BookOpen', name: 'Scuola / Libri' },
  { id: 'GraduationCap', name: 'Corsi / Danza' },
  { id: 'Shirt', name: 'Vestiario' },
  { id: 'ShieldCheck', name: 'Assicurazione' },
  { id: 'Car', name: 'Automobile' },
  { id: 'Wrench', name: 'Manutenzione' },
  { id: 'Trash2', name: 'Rifiuti / TARI' },
];

interface CategoryIconProps {
  category?: TransactionCategory;
  iconName?: string;
  className?: string;
}

export function CategoryIcon({
  category,
  iconName,
  className = 'w-5 h-5',
}: CategoryIconProps) {
  // If explicit iconName is passed
  if (iconName && ICON_MAP[iconName]) {
    const IconComponent = ICON_MAP[iconName];
    return <IconComponent className={className} />;
  }

  // Switch for standard category keys
  switch (category) {
    case 'spesa_generica':
      return <ShoppingCart className={className} />;
    case 'bollette':
      return <Zap className={className} />;
    case 'tari':
      return <Trash2 className={className} />;
    case 'assicurazioni':
      return <ShieldCheck className={className} />;
    case 'bollo_auto':
      return <Car className={className} />;
    case 'tagliando_auto':
      return <Wrench className={className} />;
    case 'carburante_pedaggi':
    case 'benzina' as any:
      return <Fuel className={className} />;
    case 'condominio':
      return <Building2 className={className} />;
    case 'scuola':
      return <BookOpen className={className} />;
    case 'corsi':
      return <GraduationCap className={className} />;
    case 'vestiario_bambini':
      return <Shirt className={className} />;
    case 'extra':
      return <Sparkles className={className} />;
    case 'altre_uscite':
      return <CreditCard className={className} />;
    case 'stipendio':
      return <Briefcase className={className} />;
    case 'bonus_lavoro':
      return <Award className={className} />;
    case 'assegno_figli':
      return <Baby className={className} />;
    case 'regali':
      return <Gift className={className} />;
    case 'rendita':
      return <TrendingUp className={className} />;
    case 'altre_entrate':
      return <PlusCircle className={className} />;
    default:
      // Try to find if category string itself is an icon name
      if (category && ICON_MAP[category]) {
        const Comp = ICON_MAP[category];
        return <Comp className={className} />;
      }
      return <Tag className={className} />;
  }
}
