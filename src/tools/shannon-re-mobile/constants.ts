export const SHANNON_RE_MOBILE_DESCRIPTION = `Execute mobile application reverse engineering and security analysis inside the Shannon RE Docker container.

Analyzes Android (APK) and iOS (IPA) applications to discover vulnerabilities, hardcoded secrets, insecure data storage, and other mobile-specific security issues.

Analysis capabilities:
1. APK extraction and decompilation (jadx, apktool)
2. Static code analysis for security issues
3. Hardcoded API keys, passwords, and secrets detection
4. Insecure data storage detection (SharedPreferences, SQLite, files)
5. Intent/Broadcast receiver analysis
6. Certificate and signature analysis
7. Network traffic analysis preparation
8. Component enumeration (Activities, Services, Receivers, Providers)

Tools available: jadx, apktool, androguard, android-scripts, mobsf (optional)

Example commands:
- Decompile APK: jadx -d /workspace/output /workspace/app.apk
- Extract APK resources: apktool d /workspace/app.apk -o /workspace/extracted
- Find secrets: grep -r "api.key\|password\|secret" /workspace/extracted
- List components: aapt dump badging /workspace/app.apk
- Analyze with MobSF: (requires separate container)`
