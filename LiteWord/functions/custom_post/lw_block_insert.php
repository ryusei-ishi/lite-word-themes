<?php
if ( ! defined( 'ABSPATH' ) ) exit;
?>
<!-- -------------------- Meta Box Button -------------------- -->
<div class="lw-block-meta-box">
	<button class="button button-primary" id="lw-insert-block">+ Lwブロックを挿入</button>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
	const insertBtn = document.querySelector('#lw-insert-block');

	if (insertBtn) {
		// body.wp-admin直下に移動
		const wpAdmin = document.querySelector('body.wp-admin');
		if (wpAdmin && insertBtn.parentNode !== wpAdmin) {
			wpAdmin.insertBefore(insertBtn, wpAdmin.firstChild);
		}

		insertBtn.addEventListener('click', (e) => {
			e.preventDefault();

			// Dispatch custom event to open the modal
			const event = new CustomEvent('lwOpenBlockInsertModal');
			document.dispatchEvent(event);
		});
	}
});
</script>
