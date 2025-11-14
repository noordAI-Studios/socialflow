// src/utils/helpers.js
import { VIDEO_EXTENSIONS } from './constants';

export const getStatusColor = (status, darkMode = true) => {

switch (status) {
 case  '📦 Not Assigned':
 return darkMode ? 'bg-yellow-900/30 text-yellow-900' : 'bg-yellow-100 text-yellow-800';
 case  '✏️ Work in Progress':
      return darkMode ? 'bg-indigo-900/30 text-indigo-900' : 'bg-indigo-100 text-indigo-800';
 case  '📝 Copy Needed':
      return darkMode ? 'bg-blue-900/30 text-blue-900' : 'bg-blue-100 text-blue-800';
 case  '❓ Needs Review':
      return darkMode ? 'bg-orange-900/30 text-orange-900' : 'bg-orange-100 text-orange-800';
 case  '🖼️ Media Needed':
      return darkMode ? 'bg-red-900/30 text-red-900' : 'bg-red-100 text-red-800';
 case  '⚙️ Scheduled':
      return darkMode ? 'bg-teal-900/30 text-teal-900' : 'bg-teal-100 text-teal-800';
 case  '⏳ Awaiting Posting':
      return darkMode ? 'bg-purple-900/30 text-purple-900' : 'bg-purple-100 text-purple-800';
 case  '✅ Published':
      return darkMode ? 'bg-green-900/30 text-green-900' : 'bg-green-100 text-green-800';
    default:
      return darkMode ? 'bg-gray-700 text-gray-900' : 'bg-gray-100 text-gray-800';
  }
};

export const isVideo = (url) => {
  if (!url) return false;
  return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().includes(ext));
};

export const getMediaType = (file) => {
  if (file.type && file.type.startsWith('video/')) {
    return 'video';
  }
  if (file.name) {
    return isVideo(file.name) ? 'video' : 'image';
  }
  return 'image';
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getAspectRatioClass = (ratio) => {
  switch (ratio) {
    case '1:1': return 'aspect-square';
    case '4:5': return 'aspect-[4/5]';
    case '9:16': return 'aspect-[9/16]';
    default: return 'aspect-square';
  }
};

export const getPrimaryMedia = (post) => {
  if (post.images && post.images.length > 0) {
    return post.images;
  }
  if (post.imageData || post.imageUrl) {
    return [{ imageData: post.imageData, imageUrl: post.imageUrl, mediaType: 'image' }];
  }
  return null;
};

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};