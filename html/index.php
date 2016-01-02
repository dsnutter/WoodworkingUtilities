<?php
//
// Woodworking utilities sample page
//

// sample header
require_once('header.inc.php');

// $summary is the page content set by the content management system used
$summary = 'This calculator converts a decimal inch value to its closest equivalent fraction in 1/16th inch increments.';

// include any of the utility content files here that are in /content
require_once($_SERVER['DOCUMENT_ROOT'] . '/content/decimal-fractional-inches-calculator.php');

// sample footer
require_once('footer.inc.php');

?>