var serviceTests = serviceTests || {};
serviceTests.countdownTests = (function(){

  var elapseMillis = clockmock.elapseMillis;

  var doStartElapseTests = function(startTime,timeElapsed,expectedDisplay){
      var runTests = function(){
        describe('when start time was ' +  startTime + ' milliseconds and ' + timeElapsed + ' seconds have passed ', function() {
              var _startTime;
              var _elapse;
              beforeEach(function(){
                this.clock = sinon.useFakeTimers();
                _startTime = startTime;
                _elapse = timeElapsed;
              });

              it('elapsedMillis is supposed to be the time elapsed', 
                inject(function($rootScope,$interval,countdownService) {
                    countdownService.startTimer(_startTime);
        	    elapseMillis($interval,this.clock,_elapse);
                    var elapsedMillis = countdownService.getElapsedMillis();
                    expect(elapsedMillis).toEqual(_elapse);
              }));
              
              it('timeRemaining is supposed to be the time remaining', 
                inject(function($rootScope,$interval,countdownService) {
                    countdownService.startTimer(_startTime);
        	    elapseMillis($interval,this.clock,_elapse);
                    var elapsedMillis = countdownService.getElapsedMillis();
                    expect(elapsedMillis).toEqual(_elapse);
              }));

              it('elapsedMillis + timeRemainingMillis should == startime', 
                inject(function($rootScope,$interval,countdownService) {
                    countdownService.startTimer(_startTime);
                    elapseMillis($interval,this.clock,_elapse);
                    var elapsedMillis = countdownService.getElapsedMillis();
                    var timeRemainingMillis = countdownService.getTimeRemainingMillis();
                    expect(elapsedMillis + timeRemainingMillis).toEqual(startTime);
                    expect(elapsedMillis).toEqual(_elapse);
              }));
        
        
              it('getHourMinuteSecondRemainString shows ' +  expectedDisplay, 
                inject(function($rootScope,$interval,countdownService) {
                    countdownService.startTimer(_startTime);
                    elapseMillis($interval,this.clock,_elapse);
                    var result = countdownService.getHourMinuteSecondRemainString();
                    expect(result).toEqual(expectedDisplay);
              }));
        
              afterEach(function(){
                this.clock.restore();
        	_startTime = 0;
        	_elapse = 0;
              });
          });
      };
      return runTests;
  };

  return {
      doStartElapseTests : doStartElapseTests
  };
})();