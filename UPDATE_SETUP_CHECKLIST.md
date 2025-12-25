# In-App Update Setup Checklist

## ✅ Completed
- [x] Added updater plugin to Cargo.toml
- [x] Added updater plugin to package.json
- [x] Created useUpdater hook
- [x] Configured updater in tauri.conf.json (currently disabled)
- [x] Fixed port configuration
- [x] Created helper scripts and documentation

## 📋 Next Steps

### Phase 1: Generate Signing Keys

1. **Generate keypair:**
   ```powershell
   npx @tauri-apps/cli signer generate -w $env:USERPROFILE\.tauri\blimey.key
   ```

2. **Copy your public key:**
   - Open `$env:USERPROFILE\.tauri\blimey.pub`
   - Copy the entire public key string

3. **Update tauri.conf.json:**
   - Replace `YOUR_PUBLIC_KEY_HERE` with your actual public key

### Phase 2: Set Up Azure Storage

1. **Create Azure Storage Account:**
   - See `scripts/setup-azure-storage.md` for detailed instructions
   - Note your storage account name

2. **Create `releases` container:**
   - Set public access to "Blob"

3. **Update tauri.conf.json:**
   - Replace `YOUR_STORAGE_ACCOUNT` with your actual storage account name
   - Set `"active": true` in the updater plugin config

### Phase 3: Build and Upload First Release

1. **Build your app:**
   ```bash
   npm run tauri:build
   ```

2. **Sign the installer:**
   ```powershell
   npx @tauri-apps/cli signer sign $env:USERPROFILE\.tauri\blimey.key "src-tauri\target\release\bundle\nsis\blimey-desktop_0.1.0_x64-setup.exe"
   ```

3. **Create manifest file:**
   - Create `manifests/windows-x86_64/0.1.0/latest.json`
   - Use the template in `scripts/create-manifest.js` or create manually

4. **Upload to Azure Storage:**
   - Upload installer: `releases/windows-x86_64/0.1.0/blimey-desktop_0.1.0_x64-setup.exe`
   - Upload manifest: `releases/windows-x86_64/0.1.0/latest.json`
   - See `scripts/sign-and-upload.md` for detailed instructions

### Phase 4: Enable Update Checking

1. **Update useUpdater.ts:**
   - Uncomment the `checkForUpdates()` call in useEffect
   - Uncomment the interval for periodic checks

2. **Test the update flow:**
   - Install version 0.1.0
   - Create and upload version 0.2.0
   - Verify the app detects and installs the update

### Phase 5: Create Update UI (Optional)

Add update notification UI to your App.tsx:

```typescript
import { useUpdater } from './hooks/useUpdater';

function App() {
  const { updateAvailable, updateInfo, installUpdate } = useUpdater();
  
  return (
    <div>
      {/* Your app content */}
      
      {updateAvailable && (
        <div className="update-banner">
          <p>Update available: {updateInfo?.version}</p>
          <button onClick={installUpdate}>Install Update</button>
        </div>
      )}
    </div>
  );
}
```

### Phase 6: Future - CI/CD Setup

Once manual uploads are working:
- Set up GitHub Actions workflow
- Automate build → sign → upload process
- See future documentation for CI/CD setup

## 📝 Important Notes

- **Never commit your private key** (`.key` files are in `.gitignore`)
- **Keep your private key secure** - you'll need it for every release
- **Test updates thoroughly** before deploying to production
- **Version numbers** must match between `tauri.conf.json` and your manifests

## 🔗 Reference Files

- `scripts/generate-keys.md` - Key generation guide
- `scripts/setup-azure-storage.md` - Azure Storage setup
- `scripts/sign-and-upload.md` - Manual upload process
- `scripts/create-manifest.js` - Manifest creation helper

