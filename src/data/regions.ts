import { MainRegionDefinition, MainRegionId } from '../types';

export const MAIN_REGIONS: MainRegionDefinition[] = [
  {
    id: 'mazraa',
    name: 'المزرعة ومحيطها',
    description: 'تشمل كورنيش المزرعة، طريق الجديدة، البربير، بدارو، الأشرفية والأحياء المجاورة',
    subDistricts: [
      'كورنيش المزرعة',
      'طريق الجديدة',
      'البربير',
      'قصقص',
      'راس النبع',
      'بشارة الخوري',
      'السوديكو',
      'الصنايع',
      'الكولا',
      'بدارو',
      'المتحف',
      'عين الرمانة',
      'فرن الشباك',
      'الأشرفية',
      'الجناح',
    ],
  },
  {
    id: 'msaitbeh',
    name: 'المصيطبة ومحيطها',
    description: 'تشمل مار الياس، فردان، تلة الخياط، طلعة يزبك، عين التينة، برج أبي حيدر والأحياء المجاورة',
    subDistricts: [
      'مار الياس',
      'طلعة يزبك',
      'تلة الخياط',
      'فردان',
      'ساقية الجنزير',
      'عين التينة',
      'عائشة بكار',
      'كركول الدروز',
      'برج أبي حيدر',
      'بربور',
      'الظريف',
      'وطى المصيطبة',
      'الزيدانية',
      'البسطة',
      'الضناوي',
      'الباشورة',
      'حوض الولاية',
      'النويري',
      'الملا',
      'زقاق البلاط',
      'سليم سلام',
      'البطركية',
    ],
  },
  {
    id: 'ras_beirut',
    name: 'راس بيروت ومحيطها',
    description: 'تشمل الحمرا، كركاس، القنطاري، كليمنصو، الروشة، المنارة، عين المريسة، الرملة البيضاء، قريطم',
    subDistricts: [
      'الحمرا',
      'كركاس',
      'القنطاري',
      'كليمنصو',
      'الروشة',
      'المنارة',
      'عين المريسة',
      'الرملة البيضاء',
      'قريطم',
    ],
  },
  {
    id: 'outside',
    name: 'خارج بيروت',
    description: 'تشمل الجبل ومناطق لبنانية أخرى مختارة',
    subDistricts: [
      'الجبل',
      'مناطق أخرى',
    ],
  },
];

export const ALL_SUB_DISTRICTS: { mainRegionId: MainRegionId; mainRegionName: string; name: string }[] = [];

MAIN_REGIONS.forEach((region) => {
  region.subDistricts.forEach((sub) => {
    ALL_SUB_DISTRICTS.push({
      mainRegionId: region.id,
      mainRegionName: region.name,
      name: sub,
    });
  });
});

export const PROPERTY_CATEGORIES = [
  { id: 'residential', label: 'شقق سكنية' },
  { id: 'commercial', label: 'عقار تجاري' },
] as const;

export const COMMERCIAL_SUB_TYPES = [
  { id: 'shop', label: 'محل' },
  { id: 'warehouse', label: 'مستودع' },
  { id: 'office', label: 'مكتب' },
] as const;

export const LISTING_TYPES = [
  { id: 'sale', label: 'بيع' },
  { id: 'rent', label: 'إيجار' },
] as const;
