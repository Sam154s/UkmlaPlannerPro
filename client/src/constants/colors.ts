export const SUBJECT_COLORS = {
  'Acute and emergency': '#FF6B6B',
  'Cardiovascular': '#4ECDC4',
  'Dermatology': '#45B7D1',
  'Endocrinology': '#96CEB4',
  'Gastroenterology': '#FECA57',
  'Haematology': '#FF9FF3',
  'Immunology': '#54A0FF',
  'Infectious diseases': '#5F27CD',
  'Musculoskeletal': '#00D2D3',
  'Neurology': '#FF3838',
  'Obstetrics and gynaecology': '#FF6348',
  'Oncology': '#2F3542',
  'Ophthalmology': '#3742FA',
  'Paediatrics': '#70A1FF',
  'Psychiatry': '#5352ED',
  'Renal': '#006BA6',
  'Respiratory': '#26de81',
  'Surgery': '#FD79A8',
  'Urology': '#FDCB6E',
  'Other': '#DDA0DD',
};

export const CALENDAR_COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  review: '#8B5CF6',
  completed: '#10B981',
  upcoming: '#3B82F6',
  overdue: '#EF4444',
};

export const getSubjectColor = (subject: string): string => {
  return SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] || SUBJECT_COLORS.Other;
};

export const getEventColor = (type: 'study' | 'review' | 'completed' | 'user'): string => {
  switch (type) {
    case 'study':
      return CALENDAR_COLORS.primary;
    case 'review':
      return CALENDAR_COLORS.review;
    case 'completed':
      return CALENDAR_COLORS.completed;
    case 'user':
      return CALENDAR_COLORS.secondary;
    default:
      return CALENDAR_COLORS.primary;
  }
};