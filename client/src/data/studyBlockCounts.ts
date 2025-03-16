export const YEAR_MULTIPLIERS = [2.0, 1.6, 1.3, 1.1, 1.0]; // 1st to 5th year

export const BASE_BLOCK_COUNTS: { [key: string]: number } = {
  "Acute and emergency": 15,
  "Cancer": 7,
  "Cardiovascular": 15, // Cardiology
  "Child health": 15,
  "Clinical Haematology": 8,
  "Clinical Imaging": 5,
  "Dermatology": 12,
  "ENT": 6,
  "Endocrine and Metabolic": 10,
  "Gastrointestinal": 12,
  "General Practice": 15,
  "Infection": 12,
  "Medicine of Older Adult": 8,
  "Mental Health": 12,
  "Musculoskeletal": 8,
  "Neuroscience": 12,
  "Obstetrics and Gynaecology": 12,
  "Ophthalmology": 8,
  "Palliative and end of life Care": 4,
  "Perioperative and Anaesthetics": 4,
  "Renal and Urology": 9,
  "Respiratory": 13,
  "Sexual Health": 5,
  "Surgery": 12
};

// Constants for time calculations
export const HOURS_PER_BLOCK = 2;
export const BLOCKS_PER_WEEK = 5;
export const MAX_BLOCKS_PER_SUBJECT = 20; // Cap to prevent unrealistic schedules

export function calculateBlocksForYear(baseBlocks: number, yearGroup: number): number {
  // Adjust year group to 0-based index for array access
  const multiplier = YEAR_MULTIPLIERS[yearGroup - 1];
  const adjustedBlocks = Math.ceil(baseBlocks * multiplier);
  return Math.min(adjustedBlocks, MAX_BLOCKS_PER_SUBJECT);
}
