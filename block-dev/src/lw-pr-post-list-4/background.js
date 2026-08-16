import { filterStyle } from './helpers.js';

/**
 * 背景レイヤー（画像 ＋ 色フィルター）
 * エディタ（edit.js）と保存HTML（save.js）の両方から呼ぶ。
 * 別々に書くと保存HTMLと食い違ってブロックの検証エラーになるので、必ずここを共通で使う。
 *
 * 重なり順は CSS 側で指定（.bg_image = z-index:-2 / .filter = z-index:-1 / カードは通常）
 */
export default function Background( { attributes } ) {
    const { bgImage } = attributes;

    return (
        <>
            {bgImage && (
                <div className="bg_image">
                    <img src={bgImage} alt="" loading="lazy" />
                </div>
            )}
            <div className="filter" style={filterStyle(attributes)}></div>
        </>
    );
}
