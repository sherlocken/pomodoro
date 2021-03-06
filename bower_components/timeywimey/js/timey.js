define(['parameterCheck'],function(parameterCheck){
  'use strict';
   
  var isInteger = parameterCheck.isInteger;
  
      var _startDate;
      var _countdownFromMillis;
      var _timeoutId;
      //start these each at 0 in the case where we want to 
      //run a timer with 0 value
      var _elapsedMillis = 0;
      var _remain = 0;
      var _updatePeriodMillis = 250;
      var _isPaused = false;
      var _observers = [];
      var  _initialCountdown = 0;

      var startTimer = function(countdownFromMillis){
	      startTimerWithUpdatePeriodMillis(countdownFromMillis,250);
      };
      
      var startTimerWithUpdatePeriodMillis = function(countdownFromMillis,updatePeriodMillis){
  	if(typeof(countdownFromMillis) !== "number" || !isInteger(countdownFromMillis)){
            throw "countdownFromMillis must be an integer";
  	}
  	if(countdownFromMillis < 0){
            throw "cannot start timer with a value < 0";
  	}
	//must make sure any previously started interval is cancelled before starting a new one.
	//since the reassignment to _timeoutId will make is so we lose hold of any previously defined
	//timeout id for a timeout that may still be ongoing
	_initialCountdown = countdownFromMillis;
	resumeTimer(countdownFromMillis,updatePeriodMillis);
      };

      var resumeTimer = function(countdownFromMillis,updatePeriodMillis){
	reset();
        _countdownFromMillis = countdownFromMillis;
	_isPaused =false;
  	_startDate = Date.now(); 
	_updatePeriodMillis = updatePeriodMillis;
	_remain = countdownFromMillis;
  	_timeoutId = window.setInterval(function(){
            updateTimeRemaining();
            }, _updatePeriodMillis);
      };

      var GetUpdatePeriodMillis = function(){
	      return _updatePeriodMillis;
      };

  
      var updateTimeRemaining = function() {
	var datenow = Date.now();
        _elapsedMillis = datenow - _startDate;
        if (_elapsedMillis >= _countdownFromMillis){
	    //the elapsed millis should not show elapsing past the interval, 
	    //since we are approximating stopping there
	        _elapsedMillis = _countdownFromMillis;
                cancelCountdown(_timeoutId);
		fireTimerFinished({
		  completedCountdownMillis: _initialCountdown,
		  finishedAt: Date.now(),
	         });
                _remain = 0;
        }
        else{
          //if this calculation is delayed, could still be negative
          _remain = _countdownFromMillis - _elapsedMillis;
        }
      };
  
      var getTimeRemainingMillis = function(){
  	return _remain;
      };
  
      var getElapsedMillis = function(){
  	return _elapsedMillis;
      };
  
      var cancelCountdown = function(){
        window.clearInterval(_timeoutId);
      };
  
      var getHourMinuteSecondRemainString = function() {
  	return getHourMinuteSecondString(_remain);
      };
  
      var reset = function(){
  	cancelCountdown();
          _startDate = 0;
          _countdownFromMillis = 0;
          _timeoutId = 0;
          //start these each at 0 in the case where we want to 
          //run a timer with 0 value
          _elapsedMillis = 0;
          _remain = 0;
	  _isPaused = false;
      };

      var MAX_REPRESENTABLE = 359999000; // 99 h 59 m 59 s, max time period representable with 2 digits for each unit
  
      var getHourMinuteSecondString = function(millis) {
	if(millis > MAX_REPRESENTABLE) {
		throw "Max representable is " + MAX_REPRESENTABLE;
	}
	var hourMinuteSecond = getHourMinuteSecondObj(millis);
	var outputString = padTimeWithLeading0(hourMinuteSecond.hour) + ":" + 
		padTimeWithLeading0(hourMinuteSecond.minute) + ":" + 
		padTimeWithLeading0(hourMinuteSecond.second);
  	return outputString;
      };

      var getPaddedHourMinuteSecondObj = function(millis){
	if(millis > MAX_REPRESENTABLE) {
		throw "Max representable is " + MAX_REPRESENTABLE;
	}
	      var hourMinuteSecond = getHourMinuteSecondObj(millis);
	      return {
		hour: padTimeWithLeading0(hourMinuteSecond.hour),
		minute: padTimeWithLeading0(hourMinuteSecond.minute),
		second: padTimeWithLeading0(hourMinuteSecond.second)
	      };
      };

      var HOUR_AS_MILLIS = 3600000;
      var MINUTE_AS_MILLIS = 60000;
      var SECOND_AS_MILLIS = 1000;

      var getHourMinuteSecondObj = function(millis){
	var h = 0;
	var hr = millis;
	var m = 0;
	var mr = millis;
	var s = 0;
	if(millis >= HOUR_AS_MILLIS){
		h = Math.floor(millis/HOUR_AS_MILLIS);
		hr = millis % HOUR_AS_MILLIS;
	}
	if(hr >= MINUTE_AS_MILLIS){
		m = Math.floor(hr/MINUTE_AS_MILLIS);
		mr = hr % MINUTE_AS_MILLIS;
	}	
	s = Math.floor(mr/SECOND_AS_MILLIS);

	var hourMinuteSecond = {
		hour: h,
		minute: m, 
		second: s
	};
	return hourMinuteSecond;
      };

      var getLocalTimeString = function(millis){
  	var dateFromMillis = new Date(millis); 
	var outputString = padTimeWithLeading0(dateFromMillis.getHours()) + ":" + 
		padTimeWithLeading0(dateFromMillis.getMinutes()) + ":" + 
		padTimeWithLeading0(dateFromMillis.getSeconds());
  	return outputString;
      };

      var padTimeWithLeading0 = function(number){
	      if(number.toString().length === 0){
		      return "00";
	      }
	      if(number.toString().length === 1){
		      return "0" + number.toString();
	      }
	      return number.toString();
      };

      var pause = function(){
	      cancelCountdown();
	      _isPaused=true;
      };

      var resume = function(){
	      //depends on this function resetting _isPaused
	      resumeTimer(_remain,_updatePeriodMillis);
      };

      var registerObserver = function(observerFunc){
	      _observers.push(observerFunc);
      };

      var fireTimerFinished = function(timerFinishedEventObj){
	      var i = 0;
	      for (i; i < _observers.length; i++){
	        if(typeof _observers[i] === "function"){
	          _observers[i](timerFinishedEventObj);
	        }
	      }
      };
  
      return {
  	startTimer : startTimer,
        getHourMinuteSecondString : getHourMinuteSecondString,
        getPaddedHourMinuteSecondObj:getPaddedHourMinuteSecondObj,
        getHourMinuteSecondObj : getHourMinuteSecondObj,
        getLocalTimeString : getLocalTimeString,
  	reset : reset,
  	getTimeRemainingMillis: getTimeRemainingMillis,
  	getHourMinuteSecondRemainString: getHourMinuteSecondRemainString,
        getElapsedMillis: getElapsedMillis,
  	cancelCountdown : cancelCountdown,
        GetUpdatePeriodMillis : GetUpdatePeriodMillis,
	pause : pause,
	resume: resume,
	registerObserver : registerObserver
      };
});

