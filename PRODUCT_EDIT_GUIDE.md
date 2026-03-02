# Product Edit Guide

## Overview
Admins can now edit product titles, descriptions, and all other product information through the admin panel.

## How to Edit Products

### Access Product Editor
1. Go to Admin Panel: `https://agnishila.in/admin`
2. Click on **"Products"** in the sidebar
3. Find the product you want to edit
4. Click the **"Edit"** button (pencil icon)

### Edit Product Information

The edit page allows you to modify:

#### Basic Information
- **Product Name**: Main product title
- **Short Description**: Brief summary (appears in product listings)
- **Detailed Description**: Full product description

#### Pricing
- **Price**: Current selling price
- **Original Price**: Original/crossed-out price

#### Category & Type
- **Category**: Shilajit or Ashwagandha
- **Type**: Resin, Gummies, Capsules, or Powder

#### Product Details
- **Features**: Key product features (add/remove)
- **Ingredients**: Product ingredients (add/remove)
- **Benefits**: Health benefits (add/remove)
- **Usage Instructions**: How to use the product
- **Certifications**: Product certifications (add/remove)

#### Status
- **In Stock**: Toggle product availability
- **Featured Product**: Mark as featured on homepage

### Save Changes
1. Make your edits
2. Click **"Save Changes"** button at the bottom
3. You'll be redirected to the products list
4. Changes are immediately reflected on the public site

## API Details

### Edit Product Endpoint
- **URL**: `PUT /api/products/[id]`
- **Authentication**: Not required (public endpoint)
- **Body**: Product data to update

### Example Update
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 1299,
  "originalPrice": 1599,
  "features": ["Feature 1", "Feature 2"],
  "inStock": true,
  "featured": true
}
```

## What Can Be Edited

✅ Product name/title
✅ Short description
✅ Detailed description
✅ Price and original price
✅ Category and type
✅ Features list
✅ Ingredients list
✅ Benefits list
✅ Usage instructions
✅ Certifications
✅ Stock status
✅ Featured status

## Tips

1. **Title**: Keep it clear and descriptive
2. **Description**: Make it compelling and informative
3. **Price**: Update regularly to reflect current pricing
4. **Features**: List key selling points
5. **Benefits**: Highlight health benefits
6. **Usage**: Provide clear instructions
7. **Featured**: Mark bestsellers as featured

## Troubleshooting

### Changes not saving
- Check for error messages
- Ensure all required fields are filled
- Try refreshing the page

### Product not found
- Verify the product exists
- Check if it was deleted
- Go back to products list and try again

### Changes not appearing on site
- Clear browser cache
- Wait a few seconds for updates
- Refresh the product page

## Admin Credentials
- Email: `admin@agnishila.com`
- Password: `admin123`
