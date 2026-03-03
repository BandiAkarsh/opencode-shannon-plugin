export const SHANNON_RE_FIRMWARE_DESCRIPTION = `Execute firmware reverse engineering and security analysis inside the Shannon RE Docker container.

Analyzes embedded firmware images to discover vulnerabilities, backdoors, hardcoded credentials, and insecure configurations in IoT devices, routers, and embedded systems.

Analysis capabilities:
1. Firmware extraction (binwalk, firmware-mod-kit)
2. Filesystem extraction and analysis
3. Binary analysis of embedded executables
4. Configuration file analysis
5. Hardcoded passwords and API keys detection
6. Backdoor detection
7. Outdated/vulnerable component identification
8. Default credentials discovery

Tools available: binwalk, firmware-mod-kit, squashfs-tools, cramfs-tools, ubi_reader, jefferson

Example commands:
- Extract firmware: binwalk -e /workspace/firmware.bin
- Extract filesystem: unsquashfs /workspace/firmware.squashfs
- Analyze extracted: find /workspace/extracted -name "*.conf" -o -name "passwd"
- Find secrets: strings /workspace/firmware.bin | grep -i "password\|key\|token"`
