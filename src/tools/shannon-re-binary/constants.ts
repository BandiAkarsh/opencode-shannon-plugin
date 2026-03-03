export const SHANNON_RE_BINARY_DESCRIPTION = `Execute binary/reverse engineering analysis inside the Shannon RE Docker container.

Analyzes ELF binaries, executables, and compiled code to discover vulnerabilities, backdoors, and security weaknesses through static and dynamic analysis.

Analysis capabilities:
1. Disassembly and decompilation (rizin/radare2)
2. String extraction and analysis
3. Function detection and call graph analysis
4. Binary structure inspection (headers, sections, segments)
5. Entropy analysis for packed/encrypted sections
6. Library dependency analysis
7. Finding security-relevant functions (crypto, auth, memory operations)

Tools available: rizin, radare2, binwalk, strings, readelf, objdump, ltrace, strace

Example commands:
- Analyze ELF: rizin -c "aaa; afl; pdf main" /path/to/binary
- Extract strings: strings -n 8 /path/to/binary
- Check sections: readelf -S /path/to/binary
- Binwalk entropy: binwalk -E /path/to/binary
- Find crypto: rizin -c "/c crypto|encrypt|decrypt" /path/to/binary`
