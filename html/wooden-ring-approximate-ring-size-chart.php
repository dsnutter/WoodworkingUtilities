<?php
/*
 * finds the closest ring diameter to a given list of drill bit size values
 * @diameter: the ring diameter to evaluate
 * @arr: the array of fractional values to compare the ring values to
 * @return: array(minimum fractional value, maximum fractional value, closest value: either 'min' or 'max'),
 * 	invalid returns array('none', 'none', 'neither')
 */
function findMinMax($diameter, $arr) {
	$min = '';
	$max = '';
	$boolFirst = true;
	foreach ($arr as $display => $value) {
		if ($boolFirst) {
			$boolFirst = false;
			$min = $display;
			continue;
		}
		$max = $display;
		// if the diameter is between two measurements, then return the display string of those measurements
		if ($diameter >= $arr[$min] && $diameter <= $arr[$max]) {
			// find the value differences
			$diffmin = $diameter - $arr[$min];
			$diffmax = $arr[$max] - $diameter;
			if ($diffmax > $diffmin) $closest = 'min';
			else $closest = 'max';
			
			if ($value == 1) $max = '1';
			return array($min, $max, $closest);
		}
		$min = $max;
	}
	// array(minimum value display, maximum value display, closest min or max)
	return array('none', 'none', 'neither');
}

// fractional inches strings and their equivalent decimal values
$arr16ths = array('0/16' => 0/16, '1/16'=>1/16, '1/8'=>1/8, '3/16'=>3/16, '1/4'=>1/4, '5/16'=>5/16, '3/8'=>3/8, '7/16'=>7/16, '1/2'=>1/2, '9/16'=>9/16, '5/8'=>5/8, '11/16'=>11/16, '3/4'=>3/4, '13/16'=>13/16, '7/8'=>7/8, '15/16'=>15/16, '16/16' => 16/16);
$arr8ths = array('0/8' => 0/8, '1/8'=>1/8, '1/4'=>1/4, '3/8'=>3/8, '1/2'=>1/2, '5/8'=>5/8, '3/4'=>3/4, '7/8'=>7/8, '8/8' => 8/8);

$ringSizes = array('0000' => 0.390, '00' => 0.442, '0' => 0.454, '1/2' => 0.474,
		'3/4' => 0.482, '1' => 0.487, '1 1/4' => 0.496, '1 1/2' => 0.503,
		'1 3/4' => 0.512, '2' => 0.520, '2 1/4' => 0.528, '2 1/2' => 0.536,
		'2 3/4' => 0.544, '3' => 0.553, '3 1/8' => 0.557, '3 1/4' => 0.561,
		'3 3/8' => 0.565, '3 1/2' => '0.569', '3 5/8' => 0.573, '3 3/4' => 0.577,
		'4' => 0.585, '4 1/4' => 0.592, '4 1/2'=>0.601, '4 5/8'=>0.606,
		'4 3/4'=>0.611, '5'=>0.618, '5 1/8'=>0.622, '5 1/4'=>0.626, '5 3/8'=>0.63,
		'5 1/2'=>0.634,'5 3/4'=>0.642,'5 7/8'=>0.646,'6'=>0.65,
		'6 1/4'=>0.658,'6 1/2'=>0.666,'6 3/4'=>0.674,'7'=>0.683,
		'7 1/4'=>0.687,'7 1/2'=>0.699,'7 3/4'=>0.707,'8'=>0.716,
		'8 1/4'=>0.722,'8 1/2'=>0.729,'8 5/8'=>0.733,'8 3/4'=>0.736,
		'8 7/8'=>0.74,'9'=>0.748,'9 1/8'=>0.752,'9 1/4'=>0.757,
		'9 3/8'=>0.76,'9 1/2'=>0.764,'9 5/8'=>0.768,'9 3/4'=>0.772,
		'10'=>0.781,'10 1/4'=>0.788,'10 1/2'=>0.797,'10 5/8'=>0.8,
		'10 3/4'=>0.805,'11'=>0.814,'11 1/8'=>0.817,'11 1/4'=>0.821,
		'11 3/8'=>0.824,'11 1/2'=>0.83,'11 5/8'=>0.834,'11 3/4'=>0.836,
		'11 7/8'=>0.839,'12'=>0.846,'12 1/4'=>0.854,'12 1/2'=>0.862,
		'12 3/4'=>0.87,'13'=>0.879,'13.5'=>0.89);
?>

<div class="row">
	<div class="col-sm-12">&nbsp;</div>
</div>
<div class="row">
	<div class="col-sm-8">
		<?=$summary?>
	</div>
        <div class="col-sm-4">&nbsp;</div>
</div>
<div class="row">
	<div class="col-sm-12">&nbsp;</div>
</div>
<div class="row">
	<div class="col-sm-8">

<table class="table table-striped">
	<thead>
		<th>Ring Size</th>
		<th>Diameter</th>
		<th>1/8" Smaller Bit</th>
		<th>1/8" Larger Bit</th>
		<th>1/16" Smaller Bit</th>
		<th>1/16" Larger Bit</th>
	</thead>
	<tbody>
		
<?php
	foreach ($ringSizes as $rs => $diameter) {
?>
		<tr>
			<!-- list the US ring size and equivalent diameter -->
			<td><?= $rs ?></td>
			<td><?= $diameter ?></td>

<?php
		// 1/8" drill bits
		$result = findMinMax($diameter, $arr8ths);

		if ($result[2] == 'min') echo '<td class="chartemphasis">';
		else echo '<td>';
		echo $result[0] . '"</td>';

		if ($result[2] == 'max') echo '<td class="chartemphasis">';
		else echo '<td>';
		echo $result[1] . '"</td>';

		// 1/16" drill bits
		$result = findMinMax($diameter, $arr16ths);
		if ($result[2] == 'min') echo '<td class="chartemphasis">';
		else echo '<td>';
		echo $result[0] . '"</td>';

		if ($result[2] == 'max') echo '<td class="chartemphasis">';
		else echo '<td>';
		echo $result[1] . '"</td>';

		// close out table row
		echo '</tr>' . "\r\n";
	}
?>

	</tbody>
</table>

	</div>
</div>
