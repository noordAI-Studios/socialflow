// src/utils/constants.js

export const API_URL = 'http://localhost:5001/api';

export const PLATFORMS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'LinkedIn',
  'Twitter',
  'YouTube'
];

export const STATUSES = [
  'Brouillon',
  'Prêt',
  'Publié'
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
  { value: '1:1', label: '1:1 Carré', class: 'aspect-square' },
  { value: '4:5', label: '4:5 Portrait', class: 'aspect-[4/5]' },
  { value: '9:16', label: '9:16 Story', class: 'aspect-[9/16]' }
];

export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
export const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/quicktime,video/x-msvideo';
export const ACCEPTED_MEDIA_TYPES = `${ACCEPTED_IMAGE_TYPES},${ACCEPTED_VIDEO_TYPES}`;

export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm'];