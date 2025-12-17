import json
import glob
import os

# block.json ファイルを全て取得
src_dir = r"C:\MAMP\htdocs\SUPPORT_LOUNGE\LiteWord\wp-content\themes\block-dev\src"
block_json_files = glob.glob(os.path.join(src_dir, "*", "block.json"))

reset_css_path = "file:../../../assets/css/reset.min.css"

updated_count = 0

for file_path in block_json_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # editorStyle が存在するか確認
        if 'editorStyle' in data:
            editor_style = data['editorStyle']

            # 配列の場合
            if isinstance(editor_style, list) and reset_css_path in editor_style:
                editor_style.remove(reset_css_path)
                data['editorStyle'] = editor_style

                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent='\t')

                print(f"Removed reset.css from: {os.path.basename(os.path.dirname(file_path))}")
                updated_count += 1

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print(f"\n=== Complete ===")
print(f"Updated: {updated_count} files")
