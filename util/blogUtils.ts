import type { BlogPreviewType } from '@/types';

export const mapBlogCategoryToPreviewType = (type: string): BlogPreviewType => {
  switch (type) {
    case 'announcements':
    case 'javascript-bites':
    case 'whats-new':
      return type;
    case 'journal':
      return 'javascript-bites';
    case 'events':
      return 'announcements';
    default:
      return 'announcements';
  }
};
