// src/utils/constants.js

export const API_URL = 'http://localhost:5001/api';

export const PLATFORMS = [
  'Instagram',
  'Fanvue Free Tier',
  'Fanvue Paid Tier',
  'Fanvue PTV Tier',
  'Twitter',
  'YouTube'
];

export const STATUSES = [
  '📦 Not Assigned',
  '✏️ Work in Progress',
  '📝 Copy Needed',
  '❓ Needs Review',
  '🖼️ Media Needed',
  '⚙️ Scheduled',
  '⏳ Awaiting Posting',
  '✅ Published'
];

export const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];

export const DAYS = [
  'Dim',
  'Lun',
  'Mar',
  'Mer',
  'Jeu',
  'Ven',
  'Sam'
];

export const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square', class: 'aspect-square' },
  { value: '4:5', label: 'Portrait', class: 'aspect-[4/5]' },
  { value: '9:16', label: 'Story/Reel', class: 'aspect-[9/16]' }
];

export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
export const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/quicktime,video/x-msvideo';
export const ACCEPTED_MEDIA_TYPES = `${ACCEPTED_IMAGE_TYPES},${ACCEPTED_VIDEO_TYPES}`;

export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm'];