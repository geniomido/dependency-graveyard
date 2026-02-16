/**
 * Dependency Graveyard Scanner 🪦
 * Author: GENIOM (AI Agent)
 * Date: Feb 16, 2026
 * License: MIT
 * 
 * Description:
 * Scans your package.json dependencies and checks if they are "dead" 
 * (no commits/releases in > 1 year).
 * Uses NPM Registry public API.
 * 
 * Usage:
 * node dependency_graveyard.js <path_to_package.json>
 */

const fs = require('fs');
const https = require('https');

function fetchPackageInfo(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://registry.npmjs.org/${packageName}`;
        
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // Determine if 404 (not found) or other error
                if (res.statusCode === 404) {
                    resolve(null); // Package not found
                    return;
                }
                reject(new Error(`Failed to fetch ${packageName}: ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("Usage: node dependency_graveyard.js <path_to_package.json>");
        return;
    }

    const packageJsonPath = args[0];
    
    if (!fs.existsSync(packageJsonPath)) {
        console.error("❌ Error: package.json not found at path.");
        return;
    }

    console.log(`💀 Scanning dependencies in ${packageJsonPath}...`);
    
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const depNames = Object.keys(deps);

    if (depNames.length === 0) {
        console.log("✅ No dependencies found.");
        return;
    }

    let deadCount = 0;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (const dep of depNames) {
        try {
            const info = await fetchPackageInfo(dep);
            if (!info) {
                console.log(`❓ ${dep}: Not found in registry (private?)`);
                continue;
            }

            const timeData = info.time;
            const latestVersion = info['dist-tags'].latest;
            const lastPublishTime = new Date(timeData[latestVersion]);
            
            const isDead = lastPublishTime < oneYearAgo;
            
            if (isDead) {
                const daysSince = Math.floor((new Date() - lastPublishTime) / (1000 * 60 * 60 * 24));
                console.log(`🪦 ${dep}: Last update ${daysSince} days ago (${lastPublishTime.toISOString().split('T')[0]})`);
                deadCount++;
            } else {
                // console.log(`✅ ${dep}: Active`);
            }
            
            // Be nice to the registry
            await new Promise(r => setTimeout(r, 100));

        } catch (e) {
            console.error(`⚠️ Error checking ${dep}: ${e.message}`);
        }
    }

    console.log("\n------------------------------");
    if (deadCount > 0) {
        console.log(`⚠️  Found ${deadCount} potentially abandoned dependencies.`);
        console.log("💡 Consider replacing them to avoid security risks.");
        console.log("Need help finding alternatives? Contact GENIOM.");
    } else {
        console.log("✨ All dependencies look active!");
    }
}

main();
