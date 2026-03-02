# Render Deployment Checklist

## ✅ Code Ready
- [x] All optimizations committed to GitHub
- [x] Build successful locally
- [x] All 53 pages generated
- [x] Memory optimizations in place

## 📋 Pre-Deployment Steps

### 1. Verify GitHub Push
```bash
git log --oneline -5
# Should show: "Add Render deployment optimizations and memory fixes"
```
✅ **Status**: Pushed to main branch

### 2. Prepare Environment Variables
You'll need these values ready:

```
MONGODB_URI=mongodb+srv://developerduco:p2nDgP07paBQewdi@cluster0.sms0okt.mongodb.net/shilajit-store?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_SECRET=shilajit_nextauth_secret_2024_secure_key_production_v1

NEXTAUTH_URL=https://your-app-name.onrender.com

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_URL=cloudinary://135323965146833:EGciyFFaJD3TqYdzOnCqxDVQi6c@dsejv31js
```

## 🚀 Deployment Steps

### Step 1: Go to Render Dashboard
1. Visit https://render.com
2. Sign in to your account
3. Click "New +" button

### Step 2: Create Web Service
1. Select "Web Service"
2. Connect GitHub account (if not already connected)
3. Search for "shilajeet-ecommerce" repository
4. Select it and click "Connect"

### Step 3: Configure Service
- **Name**: `agnishila-website` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `bash render-build.sh`
- **Start Command**: `npm start`
- **Plan**: Standard (or higher if needed)

### Step 4: Add Environment Variables
Click "Advanced" and add each variable:

1. `MONGODB_URI` = (your MongoDB connection string)
2. `NEXTAUTH_SECRET` = (your secret key)
3. `NEXTAUTH_URL` = (your Render URL)
4. `RAZORPAY_KEY_ID` = (your Razorpay key)
5. `RAZORPAY_KEY_SECRET` = (your Razorpay secret)
6. `CLOUDINARY_URL` = (your Cloudinary URL)

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (3-5 minutes)
3. Check build logs for any errors
4. Once deployed, you'll get a URL like: `https://agnishila-website.onrender.com`

## ✅ Post-Deployment Verification

### 1. Check Service Status
- [ ] Service shows "Live" status
- [ ] No errors in logs
- [ ] Build completed successfully

### 2. Test Application
- [ ] Homepage loads: `https://your-app.onrender.com`
- [ ] Products page works
- [ ] Can add items to cart
- [ ] Checkout process works
- [ ] Admin panel accessible

### 3. Monitor Performance
- [ ] Check Render dashboard for memory usage
- [ ] Verify no OOM errors
- [ ] Check response times

## 🔧 Troubleshooting

### Build Fails
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Check `.renderignore` is working
4. Try redeploying

### OOM Errors Still Occurring
1. Increase memory in `render-build.sh`:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=3072"
   ```
2. Commit and push changes
3. Redeploy from Render dashboard

### Application Won't Start
1. Check environment variables
2. Verify MongoDB connection string
3. Check Render logs for specific errors
4. Ensure all required env vars are set

### Slow Performance
1. Check Render dashboard metrics
2. Verify database queries are optimized
3. Check Cloudinary image delivery
4. Consider upgrading plan

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Razorpay Docs**: https://razorpay.com/docs/

## 🎯 Success Criteria

- [x] Code pushed to GitHub
- [ ] Service deployed on Render
- [ ] All environment variables configured
- [ ] Application accessible via URL
- [ ] No memory errors
- [ ] All pages loading correctly
- [ ] Database connected
- [ ] Payment gateway working

---

**Next Action**: Go to https://render.com and create a new Web Service

**Estimated Time**: 10-15 minutes for deployment + 3-5 minutes for build
