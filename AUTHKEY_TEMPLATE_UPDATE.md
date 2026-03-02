# AuthKey.io Template Update - QUICK REFERENCE

## What to Do RIGHT NOW

### 1. Go to AuthKey.io Console
https://console.authkey.io

### 2. Navigate to SMS Templates
- Click "SMS Templates" in left sidebar
- Find template ID: **33097**

### 3. Edit Template
Click the edit button for template 33097

### 4. Replace Template Text
**DELETE** the current template text and **PASTE** this exactly:

```
Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

### 5. Save
Click "Save" button

### 6. Restart Dev Server
```bash
npm run dev
```

### 7. Test
- Open homepage
- Click "Sign In"
- Enter phone number
- Click "Send OTP"
- Check phone for SMS

## Expected SMS Format

After update, users will receive:

```
Use 123456 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

## Key Points

- `{#2fa#}` = Auto-generated OTP (AuthKey.io replaces this)
- `{#company#}` = Company name (we send "Agnishila")
- Template ID must be: **33097**
- API Key: `a36c6502b63a844c` (already in .env)

## If You Can't Find Template

1. Go to https://console.authkey.io
2. Login with your credentials
3. Look for "SMS Templates" or "Templates" section
4. Search for template ID: 33097
5. If not found, create new template with ID 33097

## Troubleshooting

**Q: Where is SMS Templates?**
A: In AuthKey.io console, left sidebar → SMS Templates

**Q: Can't find template 33097?**
A: Create a new template with this ID and the text above

**Q: What if I see {#otp#} instead of {#2fa#}?**
A: Replace it with {#2fa#} - that's the correct variable name

**Q: Template saved but OTP still missing?**
A: Restart dev server and try again

## Contact AuthKey.io Support

If template update doesn't work:
- Email: support@authkey.io
- Check: https://console.authkey.io/docs
- Verify: API key and template ID are correct
