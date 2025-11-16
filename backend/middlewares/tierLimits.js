const TIER_LIMITS = {
  free: { 
    maxMedia: 100,
    maxFileSize: 50 * 1024 * 1024 // 50MB
  },
  pro: { 
    maxMedia: 500,
    maxFileSize: 100 * 1024 * 1024 // 100MB
  },
  proPlus: { 
    maxMedia: 1000,
    maxFileSize: 200 * 1024 * 1024 // 200MB
  }
};