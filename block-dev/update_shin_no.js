const fs = require('fs');
const path = require('path');

// block-dev/src ディレクトリのパス
const srcDir = path.join(__dirname, 'src');

function processBlockJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        data.no = 15;

        // JSONを整形して保存（インデントはタブ）
        fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'), 'utf8');

        console.log(`Updated: ${path.basename(path.dirname(filePath))} -> no: 15`);
        return true;
    } catch (e) {
        console.log(`Error processing ${filePath}: ${e.message}`);
        return false;
    }
}

function main() {
    let updatedCount = 0;

    // srcディレクトリ内の各フォルダを処理
    const folders = fs.readdirSync(srcDir);

    for (const folderName of folders) {
        // shin-gas-station-01* にマッチするフォルダのみ処理
        if (!folderName.startsWith('shin-gas-station-01')) {
            continue;
        }

        const folderPath = path.join(srcDir, folderName);

        if (fs.statSync(folderPath).isDirectory()) {
            const blockJsonPath = path.join(folderPath, 'block.json');

            if (fs.existsSync(blockJsonPath)) {
                processBlockJson(blockJsonPath);
                updatedCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`処理完了: ${updatedCount} ファイル更新`);
}

main();
