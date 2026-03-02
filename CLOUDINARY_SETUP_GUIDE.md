# Cloudinary Setup Guide

## Get Your Cloudinary Credentials

1. **Go to Cloudinary Dashboard**
   - Visit: https://cloudinary.com/console/dashboard
   - Log in to your account (or create one if needed)

2. **Find Your Credentials**
   - Your **Cloud Name** is displayed at the top (should be: `dsejv31js`)
   - Click on the **Settings** icon (gear icon)
   - Go to **API Keys** tab
   - You'll see:
     - **API Key** (copy this)
     - **API Secret** (copy this)

3. **Update .env File**
   - Open `.env` in your project
   - Find these lines:
     ```
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
   - Replace with your actual credentials:
     ```
     CLOUDINARY_API_KEY=your_actual_api_key_here
     CLOUDINARY_API_SECRET=your_actual_api_secret_here
     ```

4. **Restart Your Dev Server**
   - Stop the current server (Ctrl+C)
   - Run: `npm run dev`
   - The new environment variables will be loaded

## Verify Setup

After updating .env and restarting:
1. Go to `http://localhost:3000/admin/carousel-hero`
2. Try uploading an image
3. You should see "Image uploaded successfully!" message
4. The image URL will be stored from Cloudinary

## Troubleshooting

**Still getting 400 error?**
- Make sure you copied the API Key and Secret correctly
- Check that there are no extra spaces in .env
- Restart the dev server after updating .env
- Check browser console for detailed error messages

**Image not showing after upload?**
- Verify the Cloudinary URL is correct
- Check that your Cloudinary account has the image
- Make sure the image folder "agnishila/carousel" exists in Cloudinary

## Security Note

- Never commit `.env` with real credentials to git
- API Secret should never be exposed in client-side code
- The backend API route handles authentication securely
