<!--
$summary = 'The following chart displays the different cut angles for segmented bowl ring segments. A sample segmented bowl segment is displayed above.';
$title = 'Segmented Bowl Ring Cut Angles Chart';
$url = 'segmented-bowl-ring-cut-angles-chart';
$featuredImage = 'segment.200x100.png';
-->
<div class="row">
	<div class="col-sm-8">
		<img src="/images/<?=$subdomain?>/<?=$featuredImage?>" alt="Dimensions of segments - <?=$title?>" class="pull-right" />
		<?=$summary?>
	</div>
        <div class="col-sm-4">&nbsp;</div>
</div>

<div ng-app="lec.utility" ng-controller="lec.utility.controller.segmentedRingCutAnglesChart">
	<div ng-cloak class="row">
		<div class="col-sm-4">
	
<table class="table table-striped">
	<thead>
		<tr>
			<th>Number of Ring Segments</th>
			<th>Cut Angle</th>
		</tr>
	</thead>
	<tbody>

		<tr ng-repeat="s in arrSegments">
			<td>
				{{ s }}
			</td>
			<td>
				{{ angle(s) }}&nbsp;{{ anglelabel }}
			</td>
		</tr>

	</tbody>
</table>
	
		</div>
		<div class="col-sm-8">&nbsp;</div>
	</div>
<?php

require_once(LEC_PATH_INCLUDE .  '/disabled.inc.php');

?>
</div>
