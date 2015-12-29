<div class="row">
	<div class="col-sm-6">
<img src="/images/<?=$subdomain?>/<?=$featuredImage?>" alt="Dimensions of segments - <?=$title?>" class="pull-right" />
<?=$summary?>		
	</div>
</div>
<div class="row">
	<div class="col-sm-6">&nbsp;</div>
</div>

<div class="row">
	<div class="col-sm-6 col-xs-12">

<div ng-app="lec.utility" ng-controller="lec.utility.controller.segmentedBowlRingCalculator">

<?php
$typeDisplay = 'tabbed'; // flat or accordion or tabbed

require_once(LEC_PATH_CONTENT . '/segmented-calc-' . $typeDisplay . '.html');

require_once(LEC_PATH_INCLUDE . '/disabled.inc.php');

?>
</div>

	</div>
</div>
