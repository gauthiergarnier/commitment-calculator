import { Template, TemplateType } from './types';

export const TEMPLATES: Record<TemplateType, Template> = {
  '1-marketing-website': {
    id: '1-marketing-website',
    name: '1 Marketing Website',
    description: 'Single marketing website with moderate traffic',
    icon: 'Globe',
    baseMonthlyUsage: 1200,
    variability: 0.1,
  },
  '5-marketing-websites': {
    id: '5-marketing-websites',
    name: '5 Marketing Websites',
    description: 'Multiple marketing sites for different brands',
    icon: 'LayoutGrid',
    baseMonthlyUsage: 5000,
    variability: 0.15,
  },
  '1-ecommerce-website': {
    id: '1-ecommerce-website',
    name: '1 E-commerce Website',
    description: 'Single online store with transactions',
    icon: 'ShoppingCart',
    baseMonthlyUsage: 2500,
    variability: 0.2,
  },
  '5-ecommerce-websites': {
    id: '5-ecommerce-websites',
    name: '5 E-commerce Websites',
    description: 'Multiple online stores across different brands',
    icon: 'Store',
    baseMonthlyUsage: 10000,
    variability: 0.25,
  },
  'small-agency': {
    id: 'small-agency',
    name: 'Small Agency',
    description: '10-15 client websites with mixed traffic',
    icon: 'Building2',
    baseMonthlyUsage: 8000,
    variability: 0.2,
  },
  'large-agency': {
    id: 'large-agency',
    name: 'Large Agency',
    description: '50+ client websites with high traffic',
    icon: 'Building',
    baseMonthlyUsage: 18000,
    variability: 0.3,
  },
};

export function getTemplate(id: TemplateType): Template {
  return TEMPLATES[id];
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}
