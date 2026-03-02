# Blog System Guide

## Overview
Complete blog system with admin management and public blog pages.

## Features
- **Admin Panel**: Create, edit, delete, publish blogs
- **Public Blog Page**: Browse and search published blogs
- **Blog Details**: Read full blog posts with view tracking
- **Categories**: Organize blogs by category
- **Tags**: Add multiple tags for organization
- **SEO**: Meta descriptions and keywords
- **Featured Images**: Upload custom cover images

## Admin Access

### Create Blog
1. Go to Admin → Blog
2. Click "New Blog"
3. Fill in details:
   - Title, Excerpt, Content
   - Featured Image, Category
   - Author, Read Time, Tags
   - Meta Description, Keywords
4. Check "Publish this blog" to make public
5. Click "Save Blog"

### Edit Blog
1. Click Edit icon on any blog
2. Modify content
3. Click "Save Blog"

### Delete Blog
1. Click Delete icon
2. Confirm deletion

### Publish/Unpublish
1. Click Status button (Eye icon)
2. Toggle visibility

## Public Pages

### Blog Listing
- URL: `/blog`
- Browse all published blogs
- Filter by category
- Search functionality

### Blog Detail
- URL: `/blog/[slug]`
- Read full content
- View count tracking
- Share on social media

## Database Model

```
Blog {
  title: String (required)
  slug: String (auto-generated)
  excerpt: String (required)
  content: String (required)
  category: String (Health, Wellness, Fitness, Nutrition, Lifestyle, Science)
  author: String
  readTime: Number
  views: Number
  published: Boolean
  tags: [String]
  featuredImage: { url, publicId }
  metaDescription: String
  metaKeywords: String
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Admin (Protected)
- `GET /api/admin/blogs` - List blogs
- `POST /api/admin/blogs` - Create blog
- `GET /api/admin/blogs/[id]` - Get blog
- `PUT /api/admin/blogs/[id]` - Update blog
- `DELETE /api/admin/blogs/[id]` - Delete blog

### Public
- `GET /api/blogs` - List published blogs
- `GET /api/blogs/[slug]` - Get blog by slug

## Content Tips

- **Title**: 50-60 characters, include keywords
- **Excerpt**: 150-160 characters, compelling
- **Content**: Use Markdown formatting
- **Featured Image**: 1200x600px, under 500KB
- **Tags**: 3-5 relevant tags
- **Meta Description**: 150-160 characters

## Markdown Support

- `# Heading 1`
- `## Heading 2`
- `### Heading 3`
- `- Bullet points`
- Regular paragraphs

## Admin Credentials
- Email: `admin@agnishila.com`
- Password: `admin123`
