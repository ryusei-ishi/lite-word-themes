// 投稿者プロフィール画像のメディアライブラリ -------------------------------
jQuery(document).ready(function($){
    var mediaUploader;
  
    $('#profile_image_button').on('click', function(e) {
        e.preventDefault();
        // メディアライブラリが既に開かれている場合は再利用
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }
        // 新しいメディアライブラリインスタンスを作成
        mediaUploader = wp.media.frames.file_frame = wp.media({
            title: 'プロフィール画像を選択',
            button: {
                text: '画像を選択'
            },
            multiple: false // 画像を1つだけ選択可能
        });
  
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#profile_image').val(attachment.url);
            $('#profile_image_preview').html('<img src="' + attachment.url + '" style="max-width:150px;">');
            $('#profile_image_remove_button').show(); // 画像が選択されたら削除ボタンを表示
        });
  
        // メディアライブラリを開く
        mediaUploader.open();
    });
  
    $('#profile_image_remove_button').on('click', function(e) {
        e.preventDefault();
        $('#profile_image').val(''); // URLをクリア
        $('#profile_image_preview').html(''); // 画像プレビューをクリア
        $(this).hide(); // 削除ボタンを非表示
    });
  });