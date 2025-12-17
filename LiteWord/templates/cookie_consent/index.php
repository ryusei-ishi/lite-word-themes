<?php 
if ( !defined( 'ABSPATH' ) ) exit; 
$switch = Lw_theme_mod_set("cookie_consent_switch","off");
$bg_color = Lw_theme_mod_set("cookie_consent_bg_color","var(--color-accent)");
if($switch == "on"):
?>
<div id="LwCookieConsent">
    <div class="in_text">
        当サイトではクッキーを使用しています。<br class="on_750px">続行するには同意をお願いします。
    </div>
    <button id="LwAcceptCookies">同意する</button>
</div>
<style>
#LwCookieConsent {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999999;
  padding: 16px 8px;
  width: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap:8px;
  line-height: 1.4em;
  background: <?=$bg_color?>;
  color: #fff;
  @media (max-width: 750px) {
    padding: 12px 8px;
    
  }
  .in_text{
    max-width: calc(100% - 80px);
    font-size: 16px;
    @media (max-width: 750px) {
      font-size: 14px;
    }
    @media (max-width: 420px) {
      font-size: 12px;
    }
  }
  #LwAcceptCookies{
    width: 72px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    white-space: nowrap;
    &:hover{
      opacity: 0.8;
    }
  }
}

</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // クッキーの存在確認
    if (!document.cookie.includes('cookie_consent=1')) {
        // メッセージを表示
        document.getElementById('LwCookieConsent').style.display = 'flex';
    }
    
    // 同意ボタンのクリックイベント
    document.getElementById('LwAcceptCookies').addEventListener('click', function() {
        // クッキーを設定（1年間有効）
        document.cookie = 'cookie_consent=1; max-age=' + 60 * 60 * 24 * 365 + '; path=/';
        // メッセージを非表示
        document.getElementById('LwCookieConsent').style.display = 'none';
    });
});
</script>
<?php endif; ?>