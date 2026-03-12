# Shannon Tools - Security Testing Docker Image
# Build: docker build -t shannon-tools .
# This container runs as a dumb tool executor. OpenCode's AI reasons about results.
#
# ============================================================
# REVERSE ENGINEERING TOOLS INSTALLATION
# ============================================================
# This Dockerfile automatically downloads and installs:
# - jadx: Android APK decompiler
# - ghidra: Software reverse engineering suite
# - frida: Dynamic instrumentation toolkit
# - imhex: Hex editor for binary analysis
# - wireshark: Network protocol analyzer
# - Il2CppDumper: Unity IL2CPP metadata extractor
# - rizin/radare2: Binary analysis
# - binwalk: Firmware analysis
# - yara: Malware detection
#
# All tools are downloaded during build - no manual setup needed!

FROM kalilinux/kali-rolling

ENV DEBIAN_FRONTEND=noninteractive

# Use direct Kali mirror
RUN echo "deb http://kali.download/kali kali-rolling main non-free non-free-firmware contrib" > /etc/apt/sources.list

# ============================================================
# CORE SYSTEM PACKAGES + SECURITY TOOLS
# ============================================================
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y --no-install-recommends \
    bash curl wget git ca-certificates gnupg unzip jq \
    python3 python3-pip python3-venv \
    nmap dnsutils whois whatweb \
    nikto sqlmap gobuster dirb \
    hydra netcat-openbsd \
    hashcat john \
    ffuf testssl.sh python3-tk \
    pandoc weasyprint fonts-recommended \
    xvfb zenity libnotify-bin \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# PROJECTDISCOVERY TOOLS
# ============================================================

# Install nuclei
RUN curl -sL https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_$(curl -sL https://api.github.com/repos/projectdiscovery/nuclei/releases/latest | jq -r '.tag_name' | sed 's/v//')_linux_amd64.zip -o /tmp/nuclei.zip && \
    unzip /tmp/nuclei.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/nuclei && \
    rm /tmp/nuclei.zip || true

# Install httpx
RUN curl -sL https://github.com/projectdiscovery/httpx/releases/latest/download/httpx_$(curl -sL https://api.github.com/repos/projectdiscovery/httpx/releases/latest | jq -r '.tag_name' | sed 's/v//')_linux_amd64.zip -o /tmp/httpx.zip && \
    unzip /tmp/httpx.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/httpx && \
    rm /tmp/httpx.zip || true

# Install subfinder
RUN curl -sL https://github.com/projectdiscovery/subfinder/releases/latest/download/subfinder_$(curl -sL https://api.github.com/repos/projectdiscovery/subfinder/releases/latest | jq -r '.tag_name' | sed 's/v//')_linux_amd64.zip -o /tmp/subfinder.zip && \
    unzip /tmp/subfinder.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/subfinder && \
    rm /tmp/subfinder.zip || true

# Install grpcurl
RUN curl -sL https://github.com/fullstorydev/grpcurl/releases/latest/download/grpcurl_$(curl -sL https://api.github.com/repos/fullstorydev/grpcurl/releases/latest | jq -r ".tag_name" | sed "s/v//")_linux_x86_64.tar.gz -o /tmp/grpcurl.tar.gz && \
    tar -xvf /tmp/grpcurl.tar.gz -C /usr/local/bin grpcurl && \
    rm /tmp/grpcurl.tar.gz || true

# ============================================================
# GOWITNESS - Web Screenshots
# ============================================================
RUN GOWITNESS_VERSION=$(curl -sL https://api.github.com/repos/sensepost/gowitness/releases/latest | jq -r '.tag_name') && \
    curl -sL "https://github.com/sensepost/gowitness/releases/download/${GOWITNESS_VERSION}/gowitness-${GOWITNESS_VERSION}-linux-amd64" -o /usr/local/bin/gowitness && \
    chmod +x /usr/local/bin/gowitness || true

# ============================================================
# CHROMIUM + PLAYWRIGHT
# ============================================================
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y \
    chromium chromium-driver \
    fonts-liberation xdg-utils \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages --no-cache-dir \
    requests beautifulsoup4 lxml \
    playwright pyyaml \
    selenium selenium-wire 2>/dev/null || true

RUN python3 -m playwright install chromium 2>/dev/null || true

# ============================================================
# BROWSERBRUTER
# ============================================================
RUN git clone --depth 1 https://github.com/netsquare/BrowserBruter.git /opt/BrowserBruter && \
    cd /opt/BrowserBruter && \
    pip3 install --break-system-packages --no-cache-dir -r requirements.txt 2>/dev/null || true && \
    printf '#!/bin/sh\npython3 /opt/BrowserBruter/BrowserBruter.py "$@"\n' > /usr/local/bin/browserbruter && \
    chmod +x /usr/local/bin/browserbruter

# ============================================================
# REVERSE ENGINEERING TOOLS
# ============================================================

# ---- JADX (Android APK Decompiler) ----
# Download and install jadx
RUN curl -sL https://github.com/skylot/jadx/releases/download/v1.5.0/jadx-1.5.0-all.jar -o /usr/share/jadx/jadx-1.5.0-all.jar && \
    curl -sL https://github.com/skylot/jadx/releases/download/v1.5.0/jadx -o /usr/bin/jadx && \
    chmod +x /usr/bin/jadx

RUN echo '#!/bin/bash\ncd /usr/share/jadx && java -jar jadx-1.5.0-all.jar "$@"' > /usr/bin/jadx && \
    chmod +x /usr/bin/jadx

# ---- GHIDRA (Binary Analysis) ----
# Download and install Ghidra
RUN curl -sL https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_12.0.4_build/ghidra_12.0.4_PUBLIC_20260303.zip -o /tmp/ghidra.zip && \
    unzip -q /tmp/ghidra.zip -d /opt/ && \
    rm /tmp/ghidra.zip

# Download and install Temurin JDK 21 (required for Ghidra)
RUN curl -sL https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.10%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.10_7.tar.gz -o /tmp/jdk21.tar.gz && \
    tar -xzf /tmp/jdk21.tar.gz -C /opt/java/ && \
    rm /tmp/jdk21.tar.gz

# Create Ghidra launcher wrapper
RUN echo '#!/bin/bash\nexport JAVA_HOME=/opt/java/jdk-21.0.10+7\nexec /usr/bin/xvfb-run -a /opt/ghidra_12.0.4_PUBLIC/ghidraRun "$@"' > /usr/local/bin/ghidra && \
    chmod +x /usr/local/bin/ghidra

# ---- FRIDA (Dynamic Instrumentation) ----
RUN pip3 install --break-system-packages frida frida-tools

# ---- IMHEX (Hex Editor) ----
# Download ImHex AppImage
RUN curl -sL https://github.com/WerWolv/ImHex/releases/download/v1.38.1/imhex-1.38.1-x86_64.AppImage -o /tmp/imhex.AppImage && \
    chmod +x /tmp/imhex.AppImage

# Create ImHex wrapper with xvfb-run
RUN echo '#!/bin/bash\nif [ "$1" = "--version" ] || [ "$1" = "-v" ]; then\n    exec /tmp/imhex.AppImage --appimage-version\nfi\nexec /usr/bin/xvfb-run -a /tmp/imhex.AppImage --appimage-extract-and-run "$@"' > /usr/local/bin/imhex && \
    chmod +x /usr/local/bin/imhex

# ---- WIRESHARK (Network Analyzer) ----
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y wireshark && \
    rm -rf /var/lib/apt/lists/*

# ---- IL2CPPDUMPER (Unity) ----
RUN git clone --depth 1 https://github.com/Perfare/Il2CppDumper.git /opt/Il2CppDumper

# ---- RIZIN/RADARE2 (Binary Analysis) ----
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y radare2 binutils objdump strace ltrace && \
    rm -rf /var/lib/apt/lists/*

# ---- BINWALK (Firmware Analysis) ----
RUN pip3 install --break-system-packages binwalk

# ---- YARA (Malware Detection) ----
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y yara && \
    rm -rf /var/lib/apt/lists/*

# ---- PYTHON RE TOOLS ----
RUN pip3 install --break-system-packages \
    pwntools \
    angr \
    capstone \
    ropper \
    r2pipe \
    pefile

# ============================================================
# WORKSPACE SETUP
# ============================================================
WORKDIR /workspace

# Download wordlists
RUN mkdir -p /usr/share/wordlists/dirb && \
    [ -f /usr/share/wordlists/rockyou.txt ] || \
    (curl -sL https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt -o /usr/share/wordlists/rockyou.txt 2>/dev/null || true) && \
    [ -f /usr/share/wordlists/dirb/common.txt ] || \
    curl -sL https://raw.githubusercontent.com/v0re/dirb/master/wordlists/common.txt \
    -o /usr/share/wordlists/dirb/common.txt 2>/dev/null || true

# Container stays alive for `docker exec` commands
CMD ["tail", "-f", "/dev/null"]
