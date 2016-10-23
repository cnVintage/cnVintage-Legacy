<?php

header("Content-Type:text/html; charset=GB18030");

function localprint($string) {
    echo iconv('UTF-8', 'GB18030', $string);
}

