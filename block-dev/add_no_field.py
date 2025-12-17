import os
import json
import re

# block-dev/src ディレクトリのパス
src_dir = r"C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\block-dev\src"

def extract_number_from_title(title):
    """タイトルから数字を抽出する"""
    # 数字を探す（01, 1, 02, 2, 10など）
    matches = re.findall(r'\d+', title)
    if matches:
        # 最後の数字を使用（"見出しタイトル 01" → 01 → 1）
        return int(matches[-1])
    return None

def process_block_json(file_path):
    """block.jsonを処理してnoフィールドを追加/更新"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        title = data.get('title', '')
        no_value = extract_number_from_title(title)

        if no_value is not None:
            data['no'] = no_value

            # JSONを整形して保存（インデントはタブ）
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent='\t')

            print(f"Updated: {file_path}")
            print(f"  title: {title} -> no: {no_value}")
            return True
        else:
            print(f"Skipped (no number in title): {file_path}")
            print(f"  title: {title}")
            return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    updated_count = 0
    skipped_count = 0
    error_count = 0

    # srcディレクトリ内の各フォルダを処理
    for folder_name in os.listdir(src_dir):
        folder_path = os.path.join(src_dir, folder_name)

        if os.path.isdir(folder_path):
            block_json_path = os.path.join(folder_path, 'block.json')

            if os.path.exists(block_json_path):
                result = process_block_json(block_json_path)
                if result:
                    updated_count += 1
                else:
                    skipped_count += 1
            else:
                error_count += 1

    print("\n" + "="*50)
    print(f"処理完了:")
    print(f"  更新: {updated_count} ファイル")
    print(f"  スキップ（タイトルに数字なし）: {skipped_count} ファイル")
    print(f"  エラー/block.jsonなし: {error_count} フォルダ")

if __name__ == "__main__":
    main()
