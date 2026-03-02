# Git History Cleanup Guide

## Problem Identified

Your `.git` folder is **188 MB** due to large image files stored in git history. This causes:

1. **Slow clones** on Render (takes longer, uses more memory)
2. **OOM errors** during build (memory consumed by git operations)
3. **Large repository** (harder to work with)

## Root Cause

Large image files were committed to git:
- `public/images/` - Multiple WebP/PNG files
- `public/main/` - Product images
- `public/selling/` - Marketing images
- `public/first/` - Product photos
- `public/background/` - Background images
- `public/certification/` - Certification logos
- `public/logo/` - Logo files

**Solution**: All images are now on Cloudinary CDN, so we can safely remove them from git.

## Cleanup Steps

### Option 1: Using PowerShell (Windows)

```powershell
# Run the cleanup script
.\scripts\clean-git-history.ps1
```

### Option 2: Using Bash (Mac/Linux)

```bash
# Run the cleanup script
bash scripts/clean-git-history.sh
```

### Option 3: Manual Cleanup

If scripts don't work, do it manually:

```bash
# Create backup
git branch backup-before-cleanup

# Install git-filter-repo (if needed)
pip install git-filter-repo

# Remove each directory
git filter-repo --path public/images --invert-paths --force
git filter-repo --path public/main --invert-paths --force
git filter-repo --path public/selling --invert-paths --force
git filter-repo --path public/out --invert-paths --force
git filter-repo --path public/out12 --invert-paths --force
git filter-repo --path public/first --invert-paths --force
git filter-repo --path public/background --invert-paths --force
git filter-repo --path public/bg --invert-paths --force
git filter-repo --path public/certification --invert-paths --force
git filter-repo --path public/logo --invert-paths --force
```

## After Cleanup

### Force Push to Remote

```bash
git push origin main --force-with-lease
```

⚠️ **WARNING**: This rewrites history. Make sure:
- No one else is working on this branch
- You have a backup (the script creates one)
- You're ready to force push

### Verify Cleanup

```bash
# Check new repository size
git rev-list --all --objects | wc -l

# Check .git folder size
du -sh .git
```

**Expected result**: `.git` folder should be ~5-10 MB (down from 188 MB)

## If Something Goes Wrong

### Restore from Backup

```bash
git reset --hard backup-before-cleanup
git push origin main --force-with-lease
```

### Restore from Remote

```bash
git fetch origin
git reset --hard origin/main
```

## Benefits After Cleanup

✅ **Faster clones** - 188 MB → 5-10 MB
✅ **Less memory usage** - Render won't OOM
✅ **Faster builds** - Less git overhead
✅ **Smaller repository** - Easier to work with
✅ **Better performance** - All images from Cloudinary CDN

## Image URLs

All images are now served from Cloudinary:

```
https://res.cloudinary.com/dsejv31js/image/upload/v{version}/agnishila/{path}
```

See `lib/cloudinary-urls.ts` for all image URLs.

## Verification Checklist

After cleanup:

- [ ] Run `npm run build` - should succeed
- [ ] Deploy to Render - should not OOM
- [ ] Check website - all images should load
- [ ] Verify git size - should be ~5-10 MB
- [ ] Delete backup branch (optional): `git branch -d backup-before-cleanup`

## Timeline

1. **Before**: 188 MB git + 512 MB Render = OOM
2. **After**: 5-10 MB git + 512 MB Render = ✅ Works!

## Questions?

- Check git-filter-repo docs: https://github.com/newren/git-filter-repo
- Check Render docs: https://render.com/docs
- Check Cloudinary docs: https://cloudinary.com/documentation

---

**Status**: Ready to clean up
**Estimated time**: 5-10 minutes
**Risk level**: Low (with backup)
