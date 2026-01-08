package main

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

var (
	totalSize    int64
	backendSize  int64
	frontendSize int64 // src excluding assets
	assetsSize   int64 // public + src/assets
	distSize     int64 // dist folder
)

type PackageInfo struct {
	Name string
	Size int64
}

func main() {
	// 1. Walk project for sizes (excluding node_modules and dist for main stats)
	err := filepath.WalkDir(".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			name := d.Name()
			if name == ".git" || name == "dist" || name == "docs" || name == "node_modules" {
				return filepath.SkipDir
			}
			return nil
		}

		info, err := d.Info()
		if err != nil {
			return nil
		}
		size := info.Size()
		totalSize += size

		normalized := filepath.ToSlash(path)
		if strings.HasPrefix(normalized, "server/") {
			backendSize += size
		} else if strings.HasPrefix(normalized, "src/") {
			if strings.HasPrefix(normalized, "src/assets/") {
				assetsSize += size
			} else {
				frontendSize += size
			}
		} else if strings.HasPrefix(normalized, "public/") {
			assetsSize += size
		}

		return nil
	})
	if err != nil {
		fmt.Println("Error walking dir:", err)
	}

	// 2. Analyze node_modules
	pkgStats, totalPkgSize := analyzePackages("node_modules")

	// 3. Analyze dist
	distSize = getDirSize("dist")

	// 4. Generate Trees
	backendTree := generateTree("server")
	frontendTree := generateTree("src")
	distTree := generateTree("dist")

	// 5. Generate Markdown
	report := generateMarkdown(pkgStats, totalPkgSize, backendTree, frontendTree, distTree)

	// 6. Write to file
	err = os.WriteFile("docs/project_analysis.md", []byte(report), 0644)
	if err != nil {
		fmt.Printf("Error writing report: %v\n", err)
	} else {
		fmt.Println("Report generated at docs/project_analysis.md")
	}
}

func analyzePackages(root string) ([]PackageInfo, int64) {
	stats := make(map[string]int64)
	var total int64

	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, 0
	}

	for _, entry := range entries {
		if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
			continue
		}

		pkgName := entry.Name()
		fullPath := filepath.Join(root, pkgName)

		// Handle scoped packages (e.g., @types)
		if strings.HasPrefix(pkgName, "@") {
			subEntries, err := os.ReadDir(fullPath)
			if err == nil {
				for _, sub := range subEntries {
					if sub.IsDir() {
						subPkgName := pkgName + "/" + sub.Name()
						subPath := filepath.Join(fullPath, sub.Name())
						size := getDirSize(subPath)
						stats[subPkgName] = size
						total += size
					}
				}
			}
			continue
		}

		size := getDirSize(fullPath)
		stats[pkgName] = size
		total += size
	}

	var sortedPackages []PackageInfo
	for k, v := range stats {
		sortedPackages = append(sortedPackages, PackageInfo{Name: k, Size: v})
	}
	sort.Slice(sortedPackages, func(i, j int) bool {
		return sortedPackages[i].Size > sortedPackages[j].Size
	})

	return sortedPackages, total
}

func getDirSize(path string) int64 {
	var size int64
	filepath.WalkDir(path, func(_ string, d fs.DirEntry, err error) error {
		if err == nil && !d.IsDir() {
			info, _ := d.Info()
			size += info.Size()
		}
		return nil
	})
	return size
}

func formatBytes(b int64) string {
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(b)/float64(div), "KMGTPE"[exp])
}

func generateTree(root string) string {
	var sb strings.Builder
	sb.WriteString("```\n")
	sb.WriteString(root + "\n")
	
	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil { return nil }
		if path == root { return nil }
		
		rel, _ := filepath.Rel(root, path)
		depth := strings.Count(rel, string(os.PathSeparator))
		if depth > 4 { return filepath.SkipDir } // Limit depth

		indent := strings.Repeat("  ", depth)
		if d.IsDir() {
			sb.WriteString(fmt.Sprintf("%s└─ %s/\n", indent, d.Name()))
		} else {
			sb.WriteString(fmt.Sprintf("%s├─ %s\n", indent, d.Name()))
		}
		return nil
	})
	sb.WriteString("```\n")
	return sb.String()
}

func generateMarkdown(pkgs []PackageInfo, totalPkgSize int64, backendTree, frontendTree, distTree string) string {
	var code strings.Builder

	code.WriteString("# Project Codebase Analysis\n\n")

	// 1. File Sizes
	code.WriteString("## 1. File Sizes\n\n")
	code.WriteString("| Category | Size |\n")
	code.WriteString("| :--- | :--- |\n")
	code.WriteString(fmt.Sprintf("| **Total Source Code** | **%s** |\n", formatBytes(totalSize)))
	code.WriteString(fmt.Sprintf("| Backend (`server/`) | %s |\n", formatBytes(backendSize)))
	code.WriteString(fmt.Sprintf("| Frontend (`src/`) | %s |\n", formatBytes(frontendSize)))
	code.WriteString(fmt.Sprintf("| Assets (`public/` + `src/assets/`) | %s |\n", formatBytes(assetsSize)))
	code.WriteString(fmt.Sprintf("| Dependencies (`node_modules`) | %s |\n", formatBytes(totalPkgSize)))
	code.WriteString(fmt.Sprintf("| **Optimized Build (`dist/`)** | **%s** |\n", formatBytes(distSize)))
	code.WriteString("\n")

	// 2. Packages by Size
	code.WriteString("## 2. Top Large Packages\n\n")
	code.WriteString("List of largest dependencies folders in `node_modules`.\n\n")
	code.WriteString("| Package | Size | % of modules  |\n")
	code.WriteString("| :--- | :--- | :--- |\n")
	
	limit := 20
	if len(pkgs) < limit {
		limit = len(pkgs)
	}
	
	for i := 0; i < limit; i++ {
		p := pkgs[i]
		percent := 0.0
		if totalPkgSize > 0 {
			percent = (float64(p.Size) / float64(totalPkgSize)) * 100
		}
		
		// Bar graph using block characters
		// barLen := int(percent / 2) // scale down
		// if barLen > 20 { barLen = 20 }
		// bar := strings.Repeat("█", barLen)
		
		code.WriteString(fmt.Sprintf("| `%s` | %s | %.1f%% |\n", p.Name, formatBytes(p.Size), percent))
	}
	code.WriteString("\n")

    // ASCII Graph
    code.WriteString("### Size Distribution (Top 10)\n```\n")
    for i := 0; i < 10 && i < len(pkgs); i++ {
        p := pkgs[i]
        percent := 0.0
        if totalPkgSize > 0 {
            percent = (float64(p.Size) / float64(totalPkgSize)) * 100
        }
        barLen := int(percent)
        bar := strings.Repeat("█", barLen)
        code.WriteString(fmt.Sprintf("%-25s |%s %.1f%%\n", p.Name, bar, percent))
    }
    code.WriteString("```\n\n")


	// 3. Directory Structure
	code.WriteString("## 3. Directory Structure\n\n")
	
	code.WriteString("### Backend (`server/`)\n")
	code.WriteString(backendTree)
	code.WriteString("\n")
	
	code.WriteString("### Frontend (`src/`)\n")
	code.WriteString(frontendTree)
	code.WriteString("\n")

	code.WriteString("### Build Artifacts (`dist/`)\n")
	code.WriteString(distTree)
	
	return code.String()
}
