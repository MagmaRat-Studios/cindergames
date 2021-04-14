@@ -14,7 +14,7 @@
	<div class="timeline-list-item-title timeline-list-item-title-small -title">
		<translate
		:translate-n="stickerCount"
		:translate-params="{ count: fuzzynumber(stickerCount) }"
		:translate-params="{ count: number(stickerCount) }"
		translate-plural="You have %{ count } stickers."
		>
		You have %{ count } sticker.
