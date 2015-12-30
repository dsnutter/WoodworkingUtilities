<p>
<?=$summary?>
</p>
<div ng-app="lec.utility" ng-controller="lec.utility.controller.fractionalInches">
    <div ng-cloak class="form" role="form">
        <div class="row">
            <div class="form-group col-sm-4">
                <label class="control-label" for="decimal">
                    Enter the decimal number:
                </label>
                <input type="text" name="decimal" class="form-control" id="decimal" ng-model="decimal" placeholder="Enter decimal inches..." />
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-4">
                <button class="btn btn-primary btn-md btn-color" role="button" id="submit" ng-click="calculate()">Calculate</button>
            </div>
        </div>
    </div>
    <div ng-cloak class="row formresultslabel" ng-show="showresult">
        <div class="col-sm-4" for="calcfractional">
            <span class="glyphicon glyphicon-asterisk"></span> <strong>RESULTS</strong> <span class="glyphicon glyphicon-asterisk"></span>
            <div class="bg-success" id="fractional">{{result}}&nbsp;{{unitslabel}}</div>
        </div>
        <div class="col-sm-8">&nbsp;</div>
    </div>
<?php

require_once(LEC_PATH_CONTENT . '/disabled.inc.php');

?>
</div>
