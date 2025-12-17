const fs = require('fs');
const path = require('path');

/**
 * ブロックマニフェストファイル生成スクリプト
 *
 * src/ ディレクトリ内の全ブロック名をリスト化し、.block-manifest.json を生成
 * このファイルをテーマに含めることで、テーマ更新時に有効なブロックと照合できる
 */

const srcDir = path.join(__dirname, 'src');
const outputPath = path.join(__dirname, '../LiteWord/my-blocks/.block-manifest.json');

try {
    // src/ ディレクトリ内の全ディレクトリを取得
    const blockDirs = fs.readdirSync(srcDir).filter((dir) => {
        const dirPath = path.join(srcDir, dir);
        return fs.statSync(dirPath).isDirectory();
    });

    // マニフェストオブジェクトを作成
    const manifest = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        blocks: blockDirs.sort(), // アルファベット順にソート
        totalBlocks: blockDirs.length
    };

    // JSON ファイルとして出力
    fs.writeFileSync(
        outputPath,
        JSON.stringify(manifest, null, 2),
        'utf8'
    );

    console.log(`✅ ブロックマニフェスト生成完了: ${blockDirs.length}個のブロック`);
    console.log(`   出力先: ${outputPath}`);

} catch (error) {
    console.error('❌ ブロックマニフェスト生成エラー:', error.message);
    process.exit(1);
}
