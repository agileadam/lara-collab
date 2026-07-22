<?php

namespace App\Notifications\Concerns;

trait FormatsHtmlContent
{
    /**
     * Convert rich text editor HTML into plain, readable text for mail.
     */
    protected function plainText(?string $html): string
    {
        $withBreaks = str_replace(['</p>', '<br>', '<br/>', '<br />'], "\n", $html ?? '');

        return trim(html_entity_decode(strip_tags($withBreaks)));
    }
}
