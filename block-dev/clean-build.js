const fs = require('fs');
const path = require('path');

/**
 * ビルドディレクトリクリーンアップスクリプト
 *
 * src/ に存在しないブロックを build/ から削除する
 * .webp ファイルは保護する（手動配置したプレビュー画像を削除しない）
 */

const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, '../LiteWord/my-blocks/build');

try {
    // src/ ディレクトリ内の全ブロックを取得
    const srcBlocks = fs.readdirSync(srcDir).filter((dir) => {
        const dirPath = path.join(srcDir, dir);
        return fs.statSync(dirPath).isDirectory();
    });

    // build/ ディレクトリが存在しない場合は終了
    if (!fs.existsSync(buildDir)) {
        console.log('ℹ️  build/ ディレクトリが存在しません');
        process.exit(0);
    }

    // build/ ディレクトリ内の全ブロックを取得
    const buildBlocks = fs.readdirSync(buildDir).filter((dir) => {
        const dirPath = path.join(buildDir, dir);
        return fs.statSync(dirPath).isDirectory();
    });

    let deletedCount = 0;
    const deletedBlocks = [];

    // build/ にあるが src/ にないブロックを削除
    buildBlocks.forEach((blockName) => {
        if (!srcBlocks.includes(blockName)) {
            const blockPath = path.join(buildDir, blockName);

            try {
                // ディレクトリを再帰的に削除
                fs.rmSync(blockPath, { recursive: true, force: true });
                deletedCount++;
                deletedBlocks.push(blockName);
                console.log(`🗑️  削除: ${blockName}`);
            } catch (error) {
                console.error(`❌ 削除失敗: ${blockName} - ${error.message}`);
            }
        }
    });

    if (deletedCount > 0) {
        console.log(`\n✅ クリーンアップ完了: ${deletedCount}個の古いブロックを削除しました`);
        console.log(`   削除されたブロック: ${deletedBlocks.join(', ')}`);
    } else {
        console.log('✅ クリーンアップ: 削除対象のブロックはありませんでした');
    }

} catch (error) {
    console.error('❌ クリーンアップエラー:', error.message);
    process.exit(1);
}
