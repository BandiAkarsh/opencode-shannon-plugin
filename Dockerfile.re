# Shannon RE Tools - Reverse Engineering Docker Image
# Build: docker build -t shannon-re-tools -f Dockerfile.re .
# This container runs reverse engineering tools. OpenCode's AI reasons about results.

FROM kalilinux/kali-rolling

ENV DEBIAN_FRONTEND=noninteractive

# Use direct Kali mirror
RUN echo "deb http://kali.download/kali kali-rolling main non-free non-free-firmware contrib" > /etc/apt/sources.list

# Core system packages
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y --no-install-recommends \
    bash curl wget git ca-certificates gnupg unzip jq \
    python3 python3-pip python3-venv \
    file binutils xxd \
    && rm -rf /var/lib/apt/lists/*

# === Reverse Engineering Tools (from Kali repos) ===
RUN apt-get update -o Acquire::Retries=3 && \
    apt-get install -y --no-install-recommends \
    rizin \
    binwalk \
    jadx \
    apktool \
    yara \
    hashdeep \
    ssdeep \
    squashfs-tools \
    checksec \
    && rm -rf /var/lib/apt/lists/*

# Create workspace directory
WORKDIR /workspace

# Container stays alive for `docker exec` commands
CMD ["tail", "-f", "/dev/null"]
