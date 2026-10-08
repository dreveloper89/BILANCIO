import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Car,
  Fuel,
  CreditCard,
  Briefcase,
  Gift,
  Sun,
  Award,
  Baby,
  RotateCcw,
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
} from 'lucide-react';
import type { TransactionCategory } from '../types';

interface CategoryIconProps {
  category: TransactionCategory;
  className?: string;
}

export function CategoryIcon({ category, className = 'w-5 h-5' }: CategoryIconProps) {
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
      return <HelpCircle className={className} />;
  }
}
