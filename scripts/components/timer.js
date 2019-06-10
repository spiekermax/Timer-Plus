class Timer
{
    constructor(parent, collector, duration, description = "My timer", accuracy = 40)
    {
        // References
        this.r_collector = collector;

        // Constants
        this.c_id = genID();
        
        // Variables
        this.v_duration = duration;
        this.v_description = description;
        this.v_accuracy = accuracy;
        
        this.v_currentOut = this.v_duration;
        this.v_lastOut = null;
        this.v_intervall = null;
        this.v_elapsedMillis = 0;
        this.v_currentTickMillis = null;
        this.v_lastTickMillis = null;
        this.v_running = false;
        this.v_paused = false;
        this.v_expired = false;

        // DOM
        this.dom_parent = parent; // Parent
        this.dom_container = document.createElement("div");   // Container
        this.dom_container.className = "timerContainer";      //
        this.dom_container.id = "timerContainer" + this.c_id; //

        this.dom_description = document.createElement("div");                                      // Description
        this.dom_description.append(document.createTextNode("\u00A0\u00A0" + this.v_description)); //
        this.dom_description.className = "timerDescription";                                       //
        this.dom_description.id = "timerDescription" + this.c_id;                                  //

        this.dom_progress = document.createElement("div");  // Progressbar
        this.dom_progress.className = "timerProgress";      //
        this.dom_progress.id = "timerProgress" + this.c_id; //

        this.dom_number = document.createElement("div");                               // Countdown number
        this.dom_number.append( document.createTextNode( String(this.v_currentOut) )); //
        this.dom_number.className = "timerNumber";                                     //
        this.dom_number.id = "timerNumber" + this.c_id;                                //

        this.dom_startinuebtn = document.createElement("button");       // Buttons
        this.dom_startinuebtn.className = "timerBtn timerBtnStartinue"; //
        this.dom_startinuebtn.id = "timerBtnStartinue" + this.c_id;     //
        this.dom_resetbtn = document.createElement("button");           //
        this.dom_resetbtn.className = "timerBtn timerBtnReset";         //
        this.dom_resetbtn.id = "timerBtnReset" + this.c_id;             //
        this.dom_deletebtn = document.createElement("button");          //
        this.dom_deletebtn.className = "timerBtn timerBtnDelete";       //
        this.dom_deletebtn.id = "timerBtnDelete" + this.c_id;           //

        this.dom_buttons = document.createElement("div");               //     
        this.dom_buttons.className = "timerButtons";                    //
        this.dom_buttons.id = "timerButtons" + this.c_id;               //
        this.dom_buttons.append(this.dom_startinuebtn);                 //
        this.dom_buttons.append(this.dom_resetbtn);                     //
        this.dom_buttons.append(this.dom_deletebtn);                    //
        
        this.dom_container.append(this.dom_description); // Add to document
        this.dom_container.append(this.dom_progress);    //
        this.dom_container.append(this.dom_number);      //
        this.dom_container.append(this.dom_buttons);     //  
        this.dom_parent.append(this.dom_container);      //
    }

    init()
    {
        // Define event handling
        const self = this;
        $("#" + this.dom_startinuebtn.id).on("click", function()                    // User events
        {                                                                           //
            if(!self.v_running)                                                     //
            {                                                                       //
                self.start();                                                       //
            } else {                                                                //
                if(!self.v_paused)                                                  //
                {                                                                   //
                    self.pause();                                                   //
                } else {                                                            //
                    self.resume();                                                  //
                }                                                                   //
            }                                                                       //
        });                                                                         //
        $("#" + this.dom_resetbtn.id).on("click", function()                        //
        {                                                                           //
            self.reset();                                                           //
        });                                                                         //
        $(this.dom_deletebtn).on("click", function()                                //
        {                                                                           //
            self.destroy();                                                         //
        });                                                                         //

        $(this).on("Timer:Expired", function()                          // Auto events
        {                                                               //
            this.v_expired = true;                                      //
            self.dom_startinuebtn.className = "timerBtn timerBtnEmpty"; //
            cordova.plugins.notification.local.schedule({
                title: "Timer+",
                text: this.v_description + " expired",
                foreground: true
            });
            navigator.vibrate(0);
            navigator.vibrate([500, 250, 500, 250, 500, 250, 500, 250]);
            navigator.notification.beep(3);
        });
    }

    start()
    {
        // Check states
        if(this.v_running || this.v_expired) return 0;
        
        // Execute tasks
        const self = this;
        this.v_lastTickMillis = Date.now();

        this.v_intervall = setInterval(function() {
            if(!self.v_paused) // Check states
            {
                self.update();
            }
        }, this.v_accuracy);
        this.v_running = true; // Update state

        // Update DOM
        $(this.dom_progress).attr("style", "transition: width " + this.v_duration + "s linear; width: 100% !important"); // Start animation
        this.dom_startinuebtn.className = "timerBtn timerBtnPause"; // Switch buttons to 'pause'

        // Trigger events
        $(this).trigger("Timer:Started");
        return 1;
    }

    update()
    {
        // Check states
        if(!this.v_running || this.v_expired || this.v_paused) return 0;

        // Execute tasks
        if(this.v_currentOut <= 0)
        {
            // Tasks
            this.v_running = false; // Update state

            // Trigger events
            $(this).trigger("Timer:Expired");

            // Update background tasks
            let timerRunning = false;
            this.r_collector.forEach(element => {
                timerRunning = (timerRunning || element.v_running || !element.v_paused);
            });
            if(!timerRunning) cordova.plugins.backgroundMode.disable();
        } else {
            // Tasks
            this.v_currentTickMillis = Date.now();
            this.v_elapsedMillis += this.v_currentTickMillis - this.v_lastTickMillis;
            this.v_currentOut = (this.v_duration - (this.v_elapsedMillis / 1000)).toFixed(1);
            if(this.v_currentOut < 0) this.v_currentOut = 0;

            // Update DOM
            if(this.v_currentOut != this.v_lastOut)
            {
                $("#" + this.dom_number.id).text(this.v_currentOut); // Update text
            }

            // Post-Update-Tasks
            this.v_lastTickMillis = this.v_currentTickMillis;
            this.v_lastOut = this.v_currentOut;

            // Trigger events
            // $(this).trigger("Timer:Tick");   REMOVED for: not needed
        }
        return 1;
    }

    pause()
    {
        // Check states
        if(!this.v_running || this.v_expired) return 0;

        // Execute tasks
        this.v_paused = true; // Update state

        // Update DOM
        let computedStyle = $(this.dom_progress).css("width"); // Pause animation
        $(this.dom_progress).attr("style", "");                //
        $(this.dom_progress).css("width", computedStyle);      //
        this.dom_startinuebtn.className = "timerBtn timerBtnStartinue"; // Switch buttons to 'resume'

        // Trigger events
        $(this).trigger("Timer:Paused");
        return 1;
    }

    resume()
    {
        // Check states
        if(!this.v_paused || this.v_expired || !this.v_running) return 0;

        // Execute tasks
        this.v_lastTickMillis = Date.now();
        this.v_paused = false; // Update state

        // Update DOM
        $(this.dom_progress).attr("style", "transition: width " + (this.v_duration - (this.v_elapsedMillis / 1000)) + "s linear; width: 100% !important"); // Resume animation
        this.dom_startinuebtn.className = "timerBtn timerBtnPause"; // Switch buttons to 'pause'

        // Trigger events
        $(this).trigger("Timer:Resumed");
        return 1;
    }

    reset()
    {
        // Execute tasks
        this.v_currentOut = this.v_duration;
        this.v_lastOut = null;
        this.v_intervall = null;
        this.v_elapsedMillis = 0;
        this.v_currentTickMillis = null;
        this.v_lastTickMillis = null;
        this.v_running = false; // Update state
        this.v_paused = false;  //
        this.v_expired = false; //

        clearInterval(this.v_intervall);

        // Update DOM
        $("#" + this.dom_number.id).text(this.v_currentOut); // Reset number
        $(this.dom_progress).attr("style", "transition: width 0.1s"); // Reset animation
        this.dom_progress.style.width = "0%";                         //
        this.dom_startinuebtn.className = "timerBtn timerBtnStartinue"; // Reset 'startinue' button

        // Trigger events
        $(this).trigger("Timer:Reset");
        return 1;
    }

    destroy()
    {
        let index = this.r_collector.indexOf(this);
        if(index !== -1) {
            this.r_collector.splice(index, 1);
        }
        this.reset();
        $(this.dom_container).remove();
    }

}