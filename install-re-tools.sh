#!/bin/bash
# Install RE tools in shannon-tools container

echo "Step 1: Starting container..."
docker rm -f shannon-tools-re 2>/dev/null
docker run -d --name shannon-tools-re shannon-tools tail -f /dev/null

echo "Step 2: Installing RE tools (may take 5+ minutes)..."
docker exec shannon-tools-re bash -c "
echo 'deb http://kali.download/kali kali-rolling main non-free non-free-firmware contrib' > /etc/apt/sources.list
apt-get update -qq
apt-get install -y rizin binwalk jadx apktool yara hashdeep ssdeep squashfs-tools checksec
"

echo "Step 3: Verifying..."
docker exec shannon-tools-re which rizin jadx apktool yara binwalk

echo "Step 4: Committing to image..."
docker commit shannon-tools-re shannon-tools:latest

echo "Step 5: Cleanup..."
docker stop shannon-tools-re && docker rm shannon-tools-re

echo "✅ Done! RE tools installed in shannon-tools image."
