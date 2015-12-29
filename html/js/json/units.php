<?php
/*
 this page is a json generator for units of measure
  GET vars:
    u: units, valid values are e, m
    f: english units fractional value, valid values are 2,4,8,16,32,64
    min: (optional) the minimum range of unit values to return, an integer
    max: (optional) the maximum range of unit values to return, an integer
*/
//
// ** method for use in reducing inch fractions
function gcd($a,$b) {
    $a = abs($a); $b = abs($b);
    if( $a < $b) list($b,$a) = Array($a,$b);
    if( $b == 0) return $a;
    $r = $a % $b;
    while($r > 0) {
        $a = $b;
        $b = $r;
        $r = $a % $b;
    }
    return $b;
}
// ** end method gcd
//

if ($_SERVER['HTTP_HOST'] == 'utility.lec') {
    error_reporting(-1);
    ini_set('display_errors', 'On');
}

// if the u value is not a GET var then exit
if (!array_key_exists('u', $_GET)) exit(0);

// e is english units, m is metric units
$units = array('e', 'm');

// if the desired units is a valid value then continue, else exit
if (in_array($_GET['u'], $units)) $u = $_GET['u'];
else exit(0);

// lines is var that builds the base json output
$lines = <<<_OUT

[

_OUT;

// assign default min and max values
$min = 0;
$max = 1;
// verify optional min and max values
if (array_key_exists('min', $_GET) &&
    array_key_exists('max', $_GET) && 
    is_numeric($_GET['min']) &&
    is_numeric($_GET['max']) &&
    strstr($_GET['min'], '.') == false &&
    strstr($_GET['max'], '.') == false) {
        $min = $_GET['min'];
        $max = $_GET['max'];
}

// if english units are desired
if ($u == 'e') {
    // if f does not exist, then exit
    if (!array_key_exists('f', $_GET)) exit(0);
    // define the valid fractional denominators
    $arr = array(2, 4, 8, 16, 32, 64);
    // if the f value is a valid fractional denominator, then continue, else exit
    if (in_array($_GET['f'], $arr)) $f = $_GET['f'];
    else exit(0);

    for ($whole = $min; $whole < $max; $whole++) {
        // special case for first whole value
        if ($whole > 0) {
            $lines .= <<<_OUT

        {
            "display": "{$whole}",
            "value": {$whole}
        },

_OUT;
        }
        // start at the first fractional value, NOT first whole value
        for ($i = 1; $i < $f; $i++) {
            $value = $whole + ($i / $f);
            // calculate the gcd of the fraction, so it can be reduced
            $gcd = gcd($i, $f);
            // reduce the fraction
            if ($gcd > 1) $display = ($whole > 0 ? ($whole . ' ') : '') . ($i / $gcd) . '/' . ($f / $gcd);
            // else if it can't be reduced, display the fraction
            else $display = ($whole > 0 ? ($whole . ' ') : '') . $i . '/' . $f;
            
            $lines .= <<<_OUT
        
            {
                "display": "{$display}",
                "value": {$value}
            },
    
_OUT;

        }  
    }
// if metric units are wanted
} else if ($u == 'm') {
    $d = 10;

    for ($whole = $min; $whole < $max; $whole++) {
        // special case for first whole value
        if ($whole > 0) {
            $lines .= <<<_OUT

        {
            "display": "{$whole}",
            "value": {$whole}
        },

_OUT;
        }
        // start at the first fractional value, NOT first whole value
        for ($i = 1; $i < 10; $i++) {
            $value = $whole + ($i / $d);
            $display = $value;
            
            $lines .= <<<_OUT
        
            {
                "display": "{$display}",
                "value": {$value}
            },
    
_OUT;
        }
    }
}

// special case for one value
$lines .= <<<_OUT

        {
            "display": "{$max}",
            "value": {$max}
        }

]

_OUT;

echo $lines;
?>
