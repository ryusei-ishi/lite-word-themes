#!/usr/bin/env python3
"""
apiVersion 3 対応ブロックの useBlockProps 修正スクリプト

block.json が存在するブロックで、save関数に useBlockProps.save() が
正しく適用されていないものを修正する
"""

import os
import re
import json
from pathlib import Path

# ブロックのソースディレクトリ
SRC_DIR = Path(__file__).parent / "src"

def get_blocks_with_block_json():
    """block.json が存在するブロックを取得"""
    blocks = []
    for block_dir in SRC_DIR.iterdir():
        if block_dir.is_dir():
            block_json = block_dir / "block.json"
            index_js = block_dir / "index.js"
            if block_json.exists() and index_js.exists():
                blocks.append(block_dir)
    return blocks

def check_useblockprops_in_save(content):
    """save関数で useBlockProps.save() が使われているかチェック"""
    # save関数内で useBlockProps.save を使っているかチェック
    # パターン: save: ... useBlockProps.save(
    save_match = re.search(r'save:\s*\([^)]*\)\s*=>\s*\{', content)
    if not save_match:
        save_match = re.search(r'save:\s*function\s*\([^)]*\)\s*\{', content)

    if not save_match:
        return None  # save関数が見つからない

    # save関数の開始位置から useBlockProps.save を探す
    save_start = save_match.start()
    # 簡易的にsave関数の終わりを探す（次のトップレベル関数まで）
    remaining = content[save_start:]

    if 'useBlockProps.save(' in remaining[:2000]:  # save関数内の最初の2000文字をチェック
        return True
    return False

def extract_class_name_from_save(content):
    """save関数内のclassNameを抽出"""
    # <div className="xxx" のパターンを探す
    patterns = [
        r'<div\s+className=["\']([^"\']+)["\']',
        r'<section\s+className=["\']([^"\']+)["\']',
        r'<article\s+className=["\']([^"\']+)["\']',
    ]

    # save関数の位置を特定
    save_match = re.search(r'save:\s*\([^)]*\)\s*=>\s*\{', content)
    if not save_match:
        save_match = re.search(r'save:\s*function\s*\([^)]*\)\s*\{', content)

    if not save_match:
        return None

    save_start = save_match.start()
    save_content = content[save_start:save_start + 3000]  # save関数の最初の3000文字

    for pattern in patterns:
        match = re.search(pattern, save_content)
        if match:
            return match.group(1)

    return None

def fix_save_function(content, class_name):
    """save関数を修正してuseBlockProps.save()を使用するように変更"""

    # 既に修正済みならスキップ
    if 'useBlockProps.save(' in content:
        return content, False

    # save関数内の return 文を探す
    # パターン1: return ( <div className="xxx" style={...}> を
    #           return ( <div {...blockProps}> に変更

    # style変数名を探す（inlineStyle, style, styleObj など）
    style_var_match = re.search(r'const\s+(inlineStyle|style|styleObj|blockStyle)\s*=\s*\{', content)
    style_var = style_var_match.group(1) if style_var_match else None

    # save関数の開始位置を特定
    save_match = re.search(r'(save:\s*\(\s*\{\s*attributes\s*\}\s*\)\s*=>\s*\{)', content)
    if not save_match:
        return content, False

    save_start = save_match.end()

    # save関数内で最初の return 文を探す
    save_content = content[save_start:]

    # return ( の後の <div className="xxx" を探す
    # 複数のパターンに対応
    patterns_to_fix = [
        # <div className="xxx" style={inlineStyle}>
        (rf'return\s*\(\s*<div\s+className=["\']({re.escape(class_name)})["\'](\s+style=\{{[^}}]+\}})?\s*>',
         lambda m: f'return (\n            <div {{...blockProps}}>'),
        # <div className="xxx">
        (rf'return\s*\(\s*<div\s+className=["\']({re.escape(class_name)})["\']\s*>',
         lambda m: 'return (\n            <div {...blockProps}>'),
    ]

    modified = False
    for pattern, replacement in patterns_to_fix:
        if re.search(pattern, save_content):
            # blockProps の定義を追加
            # style変数がある場合はそれを使用
            if style_var:
                blockprops_def = f'''const blockProps = useBlockProps.save({{
            className: '{class_name}',
            style: {style_var},
        }});

        '''
            else:
                blockprops_def = f'''const blockProps = useBlockProps.save({{
            className: '{class_name}',
        }});

        '''

            # return文の前にblockProps定義を挿入
            # まず、return文の位置を特定
            return_match = re.search(r'(\n\s*)return\s*\(', save_content)
            if return_match:
                indent = return_match.group(1)
                insert_pos = save_start + return_match.start()

                # blockPropsの定義を挿入
                content = content[:insert_pos] + indent + blockprops_def + content[insert_pos:]

                # return文を修正（再度検索が必要）
                content = re.sub(pattern, replacement, content)
                modified = True
                break

    return content, modified

def fix_block(block_dir):
    """ブロックを修正"""
    index_js = block_dir / "index.js"
    block_name = block_dir.name

    with open(index_js, 'r', encoding='utf-8') as f:
        content = f.read()

    # useBlockProps.save() が使われているかチェック
    has_useblockprops_save = check_useblockprops_in_save(content)

    if has_useblockprops_save:
        return "already_fixed"

    if has_useblockprops_save is None:
        return "no_save_function"

    # クラス名を抽出
    class_name = extract_class_name_from_save(content)
    if not class_name:
        return "no_classname"

    # 修正
    new_content, modified = fix_save_function(content, class_name)

    if modified:
        with open(index_js, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return "fixed"

    return "could_not_fix"

def main():
    print("=" * 60)
    print("useBlockProps.save() 修正スクリプト")
    print("=" * 60)

    blocks = get_blocks_with_block_json()
    print(f"\nblock.json が存在するブロック: {len(blocks)}個\n")

    results = {
        "already_fixed": [],
        "fixed": [],
        "no_save_function": [],
        "no_classname": [],
        "could_not_fix": [],
    }

    for block_dir in sorted(blocks):
        block_name = block_dir.name
        result = fix_block(block_dir)
        results[result].append(block_name)

        status_emoji = {
            "already_fixed": "✓",
            "fixed": "🔧",
            "no_save_function": "⚠",
            "no_classname": "⚠",
            "could_not_fix": "❌",
        }
        print(f"  {status_emoji[result]} {block_name}: {result}")

    print("\n" + "=" * 60)
    print("結果サマリー")
    print("=" * 60)
    print(f"  修正済み（変更なし）: {len(results['already_fixed'])}個")
    print(f"  今回修正: {len(results['fixed'])}個")
    print(f"  save関数なし: {len(results['no_save_function'])}個")
    print(f"  className未検出: {len(results['no_classname'])}個")
    print(f"  修正失敗: {len(results['could_not_fix'])}個")

    if results['fixed']:
        print("\n修正されたブロック:")
        for name in results['fixed']:
            print(f"  - {name}")

    if results['could_not_fix']:
        print("\n手動修正が必要なブロック:")
        for name in results['could_not_fix']:
            print(f"  - {name}")

if __name__ == "__main__":
    main()
