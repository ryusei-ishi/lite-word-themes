const fs = require('fs');
const path = require('path');

// block-dev/src ディレクトリのパス
const srcDir = path.join(__dirname, 'src');

function extractNumberFromTitle(title) {
    // 数字を探す（01, 1, 02, 2, 10など）
    const matches = title.match(/\d+/g);
    if (matches && matches.length > 0) {
        // 最後の数字を使用（"見出しタイトル 01" → 01 → 1）
        return parseInt(matches[matches.length - 1], 10);
    }
    return null;
}

function processBlockJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        const title = data.title || '';
        const noValue = extractNumberFromTitle(title);

        if (noValue !== null) {
            data.no = noValue;

            // JSONを整形して保存（インデントはタブ）
            fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'), 'utf8');

            console.log(`Updated: ${filePath}`);
            console.log(`  title: ${title} -> no: ${noValue}`);
            return true;
        } else {
            console.log(`Skipped (no number in title): ${filePath}`);
            console.log(`  title: ${title}`);
            return false;
        }
    } catch (e) {
        console.log(`Error processing ${filePath}: ${e.message}`);
        return false;
    }
}

function main() {
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // srcディレクトリ内の各フォルダを処理
    const folders = fs.readdirSync(srcDir);

    for (const folderName of folders) {
        const folderPath = path.join(srcDir, folderName);

        if (fs.statSync(folderPath).isDirectory()) {
            const blockJsonPath = path.join(folderPath, 'block.json');

            if (fs.existsSync(blockJsonPath)) {
                const result = processBlockJson(blockJsonPath);
                if (result) {
                    updatedCount++;
                } else {
                    skippedCount++;
                }
            } else {
                errorCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('処理完了:');
    console.log(`  更新: ${updatedCount} ファイル`);
    console.log(`  スキップ（タイトルに数字なし）: ${skippedCount} ファイル`);
    console.log(`  エラー/block.jsonなし: ${errorCount} フォルダ`);
}

main();
