#!/usr/bin/env python3
"""
カスタムブロックのuseBlockProps修正スクリプト
edit関数内の<div className="...">を<div {...blockProps}>に置き換える
"""

import os
import re
import sys

# 対象ブロックのリスト
TARGET_BLOCKS = [
    'shin-gas-station-01-shop-list-1',
    'lw-content-8',
    'paid-block-content-3',
    'paid-block-content-4',
    'paid-block-content-5',
    'paid-block-content-6',
    'paid-block-content-7',
    'shin-gas-station-01-message-01',
    'shin-gas-station-01-cta',
    'shin-gas-station-01-cta2',
    'shin-gas-station-01-fv-lower-01',
    'shin-gas-station-01-fv-top',
    'shin-gas-station-01-custom-title-2',
    'shin-gas-station-01-list-1',
    'shin-gas-station-01-list-2',
    'shin-gas-station-01-list-3',
    'shin-gas-station-01-list-4',
    'lw-pr-step-7',
    'lw-step-1',
    'paid-block-lw-step-3',
    'paid-block-lw-step-4',
    'paid-block-lw-step-6',
    'shin-gas-station-01-step-1',
    'shin-gas-station-01-company-01',
    'paid-block-voice-2',
    'paid-block-voice-3',
]

BASE_DIR = r'C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\block-dev\src'

def fix_block(block_name):
    """ブロックのindex.jsを修正"""
    file_path = os.path.join(BASE_DIR, block_name, 'index.js')

    if not os.path.exists(file_path):
        return f"❌ {block_name}: ファイルが見つかりません"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # useBlockPropsがインポートされているか確認
    if 'useBlockProps' not in content:
        return f"⚠️ {block_name}: useBlockPropsがインポートされていません（スキップ）"

    # 既にuseBlockPropsが使われているか確認（簡易チェック）
    if 'const blockProps = useBlockProps' in content:
        # edit関数内の最初のdivが{...blockProps}を使っているか確認
        if re.search(r'<div\s+\{\.\.\.blockProps\}', content):
            return f"✅ {block_name}: 既に修正済み"

    # edit関数の位置を探す
    edit_match = re.search(r'edit\s*[:\(]', content)
    if not edit_match:
        return f"⚠️ {block_name}: edit関数が見つかりません"

    # return文の位置を探す（edit関数内）
    return_match = re.search(r'return\s*\(', content[edit_match.end():])
    if not return_match:
        return f"⚠️ {block_name}: return文が見つかりません"

    return_pos = edit_match.end() + return_match.start()

    # return直前にblockPropsを挿入（まだない場合）
    if 'const blockProps = useBlockProps' not in content[:return_pos]:
        # return文の直前に挿入
        insert_code = "\n        const blockProps = useBlockProps({\n"
        insert_code += f"            className: '{block_name}'\n"
        insert_code += "        });\n\n"

        # returnの行頭を見つける
        lines_before = content[:return_pos].split('\n')
        indent = len(lines_before[-1]) - len(lines_before[-1].lstrip())

        content = content[:return_pos] + insert_code + content[return_pos:]

    # edit関数内の最初の<div className="block-name">を<div {...blockProps}>に置き換え
    # より正確なパターンマッチング
    pattern = rf'(<InspectorControls>.*?</InspectorControls>\s*)\s*<div\s+className=["\']({block_name})["\'](\s+style=\{{[^}}]+\}})?>'

    def replace_div(match):
        before = match.group(1)
        class_name = match.group(2)
        style_attr = match.group(3) if match.group(3) else ''

        # style属性がある場合は警告（手動で確認が必要）
        if style_attr:
            print(f"  ⚠️ {block_name}: style属性があります。手動で確認してください")

        return before + '\n                <div {...blockProps}>'

    content = re.sub(pattern, replace_div, content, flags=re.DOTALL, count=1)

    # 変更があった場合のみ保存
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"✅ {block_name}: 修正完了"
    else:
        return f"ℹ️ {block_name}: 変更なし"

def main():
    print("=" * 60)
    print("カスタムブロック useBlockProps 一括修正")
    print("=" * 60)
    print(f"\n対象: {len(TARGET_BLOCKS)} ブロック\n")

    results = {
        'success': [],
        'already_fixed': [],
        'warning': [],
        'error': []
    }

    for block_name in TARGET_BLOCKS:
        result = fix_block(block_name)
        print(result)

        if result.startswith('✅') and '修正完了' in result:
            results['success'].append(block_name)
        elif result.startswith('✅') and '既に修正済み' in result:
            results['already_fixed'].append(block_name)
        elif result.startswith('⚠️'):
            results['warning'].append(block_name)
        else:
            results['error'].append(block_name)

    # サマリー
    print("\n" + "=" * 60)
    print("修正結果サマリー")
    print("=" * 60)
    print(f"✅ 修正完了: {len(results['success'])} 件")
    print(f"✅ 既に修正済み: {len(results['already_fixed'])} 件")
    print(f"⚠️ 警告: {len(results['warning'])} 件")
    print(f"❌ エラー: {len(results['error'])} 件")
    print()

    if results['warning']:
        print("⚠️ 警告が出たブロック:")
        for block in results['warning']:
            print(f"  - {block}")
        print()

    if results['error']:
        print("❌ エラーが出たブロック:")
        for block in results['error']:
            print(f"  - {block}")
        print()

    print("完了しました！")
    print("\n次のステップ:")
    print("1. npm run build を実行")
    print("2. WordPressエディターで動作確認")

if __name__ == '__main__':
    main()
