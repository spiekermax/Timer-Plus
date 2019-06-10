// Global variables
const activeTimers = new Array();
const timersParent = $("#timers");
const modalsParent = $("#modals");
const titleModal = new TextModal(modalsParent, "Description", "Please enter the name of your timer."); titleModal.init();
const timeModal = new TimeModal(modalsParent, "Duration"); timeModal.init();
var queuedTitle = null;
var queuedHours = null;
var queuedMinutes = null;
var queuedSeconds = null;

// On: App Ready
$(document).on("deviceready", function () {
    // Enable background mode
    cordova.plugins.backgroundMode.setDefaults({
        title: "Timer+",
        text: "Some timers are running in the background"
    });
    // Load saved data
    let load = JSON.parse(window.localStorage.getItem("timers"));
    for(let i = 0; i < (load.length / 3); i++)
    {
        let description = load[i * 3 + 0];
        let duration = load[i * 3 + 1];
        let accuracy = load[i * 3 + 2];
        let newTimer = new Timer(timersParent, activeTimers, duration, description, accuracy);
        newTimer.init();
        activeTimers.push(newTimer);
    }
    window.localStorage.setItem("timers", null);
    window.localStorage.removeItem("timers");

    // Admob
    var admobid = {};
    if( /(android)/i.test(navigator.userAgent) ) {
      admobid = {
        banner: 'ca-app-pub-5728333006668529/3996252853'
      };
    }
    // Show advertisement
    if(AdMob) {
        AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            isTesting: false,
            autoShow: true });
    }
});

function onBrowserReady()
{
    

}

// On: Moved to background
$(document).on("pause", function()
{
    let timerRunning = false;
    activeTimers.forEach(element => { 
        timerRunning = (timerRunning || (element.v_running && !element.v_paused));
    });
    if(timerRunning)
    {
        cordova.plugins.backgroundMode.enable();
    } else {
        cordova.plugins.backgroundMode.disable();
    }

    let save = new Array();
    activeTimers.forEach(element => {
        save.push(element.v_description, element.v_duration, element.v_accuracy);
    });
    window.localStorage.setItem("timers", JSON.stringify(save));
});

$("#addButton").on("click", function()         // AppBar
{                                              //
    // Start dialog                            //
    timeModal.show();                          //
});                                            //

$("#startAllButton").on("click", function()    //
{                                              //
    // Start or resume all active timers       //
    activeTimers.forEach(element => {          //
        if(!element.start()) element.resume(); // 
    });
});

$("#pauseAllButton").on("click", function()    //
{                                              //
    // Pause all active timers                 //
    activeTimers.forEach(element => {          //
        element.pause();                       //
    });                                        //
});                                            //

// Time modal
$(document).on("TimeModal:Confirmed", function(evt, modal, hours, minutes, seconds)
{
    // On: Time modal confirmed  
    if(modal == timeModal)
    {
        titleModal.show();
        queuedHours = Number(hours);
        queuedMinutes = Number(minutes);
        queuedSeconds = Number(seconds);
    }
});

// Text modal
$(document).on("TextModal:Confirmed", function(evt, modal, text)
{
    // On: Title modal confirmed
    if(modal == titleModal)
    {
        queuedTitle = text;
        let totalSeconds = (queuedHours * 60 * 60) + (queuedMinutes * 60) + queuedSeconds;
        let newTimer = new Timer(timersParent, activeTimers, totalSeconds, queuedTitle); // Add new timer
        newTimer.init();                                                                 //
        activeTimers.push(newTimer);                                                     //
    }
});