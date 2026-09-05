<?php
if ( !defined( 'ABSPATH' ) ) exit;
wp_enqueue_style('follow_bottom_cta_11_style', get_template_directory_uri() . '/templates/follow_bottom_cta/ptn_11/style.min.css', array(), css_version(), 'all');

$responsive = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_responsive_switch","sp_pc");
$responsive_class = '';
if ($responsive === 'sp_only') $responsive_class = ' lw_follow_cta_sp_only';
if ($responsive === 'pc_only') $responsive_class = ' lw_follow_cta_pc_only';

$label_text       = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_label_text","無料資料を今すぐ受け取る");
$placeholder_text = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_placeholder_text","メールアドレス");
$btn_text         = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_btn_text","送信する");
$btn_link         = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_btn_link","");
$color_btn        = Lw_theme_mod_set("follow_bottom_cta_ptn_11_set_color_btn","");

$ajax_url = esc_url( admin_url('admin-ajax.php') );
$nonce    = wp_create_nonce('lw_cta_lead_nonce');
$post_id  = get_the_ID();
$post_id  = $post_id ? (int) $post_id : 0;
?>
<div class="follow_bottom_cta_11 follow_bottom_cta<?= $responsive_class ?>">
    <form class="follow_bottom_cta_11__form"
          data-lw_cta_lead_form
          data-lw_cta_lead_ajax="<?= $ajax_url ?>"
          data-lw_cta_lead_nonce="<?= esc_attr($nonce) ?>"
          data-lw_cta_lead_post_id="<?= $post_id ?>"
          data-lw_cta_lead_link="<?= esc_url($btn_link) ?>">
        <span class="follow_bottom_cta_11__label"><?= esc_html($label_text) ?></span>
        <div class="follow_bottom_cta_11__field">
            <input type="email" name="email" required placeholder="<?= esc_attr($placeholder_text) ?>">
            <button type="submit" style="background-color:<?=$color_btn?>;"><?= esc_html($btn_text) ?></button>
        </div>
        <input type="text" name="lw_cta_lead_hp" class="follow_bottom_cta_11__hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="follow_bottom_cta_11__msg" role="status" aria-live="polite"></p>
    </form>
</div>
<style>
    @media (min-width: 1081px) {
        .lw_follow_cta_sp_only { display: none !important; }
    }
    @media (max-width: 1080px) {
        .lw_follow_cta_pc_only { display: none !important; }
    }
</style>
<script>
'use strict';
{
    document.querySelectorAll('.follow_bottom_cta_11__form[data-lw_cta_lead_form]').forEach(function(form){
        var msg   = form.querySelector('.follow_bottom_cta_11__msg');
        var btn   = form.querySelector('button[type="submit"]');
        var input = form.querySelector('input[name="email"]');
        var hp    = form.querySelector('input[name="lw_cta_lead_hp"]');

        form.addEventListener('submit', function(e){
            e.preventDefault();
            if (btn.disabled) return;

            msg.textContent = '';
            msg.classList.remove('is_success', 'is_error');

            btn.disabled = true;
            var originalText = btn.textContent;
            btn.textContent = '送信中…';

            var body = new URLSearchParams();
            body.set('action', 'lw_cta_lead_submit');
            body.set('nonce', form.getAttribute('data-lw_cta_lead_nonce'));
            body.set('email', input.value.trim());
            body.set('post_id', form.getAttribute('data-lw_cta_lead_post_id') || '0');
            body.set('lw_cta_lead_hp', hp ? hp.value : '');

            fetch(form.getAttribute('data-lw_cta_lead_ajax'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            })
            .then(function(res){ return res.json(); })
            .then(function(json){
                btn.disabled = false;
                btn.textContent = originalText;

                if (json && json.success) {
                    msg.textContent = (json.data && json.data.message) ? json.data.message : '送信しました。';
                    msg.classList.add('is_success');
                    input.value = '';
                    var link = form.getAttribute('data-lw_cta_lead_link');
                    if (link) {
                        setTimeout(function(){ window.location.href = link; }, 1200);
                    }
                } else {
                    msg.textContent = (json && json.data && json.data.message) ? json.data.message : '送信に失敗しました。もう一度お試しください。';
                    msg.classList.add('is_error');
                }
            })
            .catch(function(){
                btn.disabled = false;
                btn.textContent = originalText;
                msg.textContent = '通信エラーが発生しました。もう一度お試しください。';
                msg.classList.add('is_error');
            });
        });
    });
}
</script>
