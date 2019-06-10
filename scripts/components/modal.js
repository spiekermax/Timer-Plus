class TextModal
{
    constructor(parent, title, description)
    {
        // Constants
        this.c_id = genID();
        this.c_title = title;
        this.c_description = description;

        // DOM
        this.dom_parent = parent;
        this.dom_container = document.createElement("div");        // Container
        this.dom_container.className = "modalContainer textModal"; //
        this.dom_container.id = "textModalContainer" +  this.c_id; //

        this.dom_header = document.createElement("div");              // Header
        this.dom_header.className = "modalHeader";                    //
        this.dom_header.id = "textModalHeader" + this.c_id;           //
        
        this.dom_title = document.createElement("span");              //
        this.dom_title.append(document.createTextNode(this.c_title)); //
        this.dom_title.className = "modalTitle";                      //
        this.dom_title.id = "textModalTitle" + this.c_id;             //

        this.dom_header.append(this.dom_title);                       //
        
        this.dom_body = document.createElement("div");                            // Body
        this.dom_body.className = "modalBody";                                    //
        this.dom_body.id = "textModalBody" + this.c_id;                           //

        this.dom_description = document.createElement("span");                    //
        this.dom_description.append(document.createTextNode(this.c_description)); //
        this.dom_description.className = "modalDescription";                      //
        this.dom_description.id = "textModalDescription" + this.c_id;             //

        this.dom_input = document.createElement("input");                         //
        this.dom_input.type = "text"; this.dom_input.name = "Description";        //
        this.dom_input.className = "modalTextInput";                              //
        this.dom_input.id = "textModalInput" + this.c_id;                         //

        this.dom_body.append(this.dom_description);                               //
        this.dom_body.append(document.createElement("br"));                       //
        this.dom_body.append(this.dom_input);                                     //

        this.dom_footer = document.createElement("div");                     // Footer
        this.dom_footer.className = "modalFooter";                           //
        this.dom_footer.id = "textModalFooter" + this.c_id;                  //
        
        this.dom_cancelButton = document.createElement("button");            //
        this.dom_cancelButton.append(document.createTextNode("Cancel"));     //
        this.dom_cancelButton.className = "modalButton modalCancelButton";   //
        this.dom_cancelButton.id = "textModalCancelButton" + this.c_id;      //

        this.dom_confirmButton = document.createElement("button");           //
        this.dom_confirmButton.append(document.createTextNode("Confirm"));   //
        this.dom_confirmButton.className = "modalButton modalConfirmButton"; //
        this.dom_confirmButton.id = "textModalConfirmButton" + this.c_id;    //

        this.dom_footer.append(this.dom_cancelButton);                       //
        this.dom_footer.append(this.dom_confirmButton);                      //

        this.dom_container.append(this.dom_header);    // Append to document
        this.dom_container.append(this.dom_body);      //
        this.dom_container.append(this.dom_footer);    //
        this.dom_parent.append(this.dom_container);    //
    }

    init()
    {
        const self = this;
        $(this.dom_confirmButton).on("click", function()
        {
            self.hide();
            $(document).trigger("TextModal:Confirmed", [self, self.dom_input.value]);
            self.dom_input.value = "";
        });
        $(this.dom_cancelButton).on("click", function()
        {
            self.hide();
            $(document).trigger("TextModal:Canceled", [self, self.dom_input.value]);
            self.dom_input.value = "";
        });
    }

    show() 
    {
        $(this.dom_container).show(); // Show modal
        this.dom_input.focus(); // Focus input
    }

    hide()
    {
        $(this.dom_container).hide(); // Hide modal
    }
}

class TimeModal
{
    constructor(parent, title)
    {
        // Constants
        this.c_id = genID();
        this.c_title = title;
        this.c_holdButton = null;

        // DOM
        this.dom_parent = parent;
        this.dom_container = document.createElement("div");         // Container
        this.dom_container.className = "modalContainer timeModal";  //
        this.dom_container.id = "timerModalContainer" +  this.c_id; //

        this.dom_header = document.createElement("div");              // Header
        this.dom_header.className = "modalHeader";                    //
        this.dom_header.id = "timerModalHeader" + this.c_id;          //
        
        this.dom_title = document.createElement("span");              //
        this.dom_title.append(document.createTextNode(this.c_title)); //
        this.dom_title.className = "modalTitle";                      //
        this.dom_title.id = "timerModalTitle" + this.c_id;            //

        this.dom_header.append(this.dom_title);                       //

        this.dom_body = document.createElement("div");                            // Body
        this.dom_body.className = "modalBody";                                    //
        this.dom_body.id = "timerModalBody" + this.c_id;                          //

        this.dom_bodyheader = document.createElement("div");
        this.dom_bodyheader.className = "modalBodyHeader";
        this.dom_bodyheader.id = "timerModalBodyHeader" + this.c_id;

        this.dom_plushours = document.createElement("button");
        this.dom_plushours.className = "modalArrowButton arrowUp";
        this.dom_plushours.id = "modalPlusHours" + this.c_id;
        this.dom_plusminutes = document.createElement("button");
        this.dom_plusminutes.className = "modalArrowButton arrowUp";
        this.dom_plusminutes.id = "modalPlusMinutes" + this.c_id;
        this.dom_plusseconds = document.createElement("button");
        this.dom_plusseconds.className = "modalArrowButton arrowUp";
        this.dom_plusseconds.id = "modalPlusSeconds" + this.c_id;

        this.dom_bodyheader.append(this.dom_plushours);
        this.dom_bodyheader.append(this.dom_plusminutes);
        this.dom_bodyheader.append(this.dom_plusseconds);

        this.dom_bodybody = document.createElement("div");
        this.dom_bodybody.className = "modalBodyBody";
        this.dom_bodybody.id = "timerModalBodyBody" + this.c_id;

        this.dom_texthours = document.createElement("input");
        this.dom_texthours.value = 0; this.dom_texthours.type = "number";
        this.dom_texthours.min = 0; this.dom_texthours.max = 23;
        this.dom_texthours.className = "modalHours";
        this.dom_texthours.id = "timerTextHours" + this.c_id;

        this.dom_textminutes = document.createElement("input");
        this.dom_textminutes.value = 0; this.dom_textminutes.type = "number";
        this.dom_textminutes.min = 0; this.dom_textminutes.max = 59;
        this.dom_textminutes.className = "modalMinutes";
        this.dom_textminutes.id = "timerTextMinutes" + this.c_id;

        this.dom_textseconds = document.createElement("input");
        this.dom_textseconds.value = 10; this.dom_textseconds.type = "number";
        this.dom_textseconds.min = 0; this.dom_textseconds.max = 59;
        this.dom_textseconds.className = "modalSeconds";
        this.dom_textseconds.id = "timerTextSeconds" + this.c_id;

        this.dom_bodybody.append(this.dom_texthours);
        this.dom_bodybody.append(this.dom_textminutes);
        this.dom_bodybody.append(this.dom_textseconds);

        this.dom_bodyfooter = document.createElement("div");
        this.dom_bodyfooter.className = "modalBodyFooter";
        this.dom_bodyfooter.id = "timerModalBodyFooter" + this.c_id;

        this.dom_minushours = document.createElement("button");
        this.dom_minushours.className = "modalArrowButton arrowDown";
        this.dom_minushours.id = "modalMinusHours" + this.c_id;
        this.dom_minusminutes = document.createElement("button");
        this.dom_minusminutes.className = "modalArrowButton arrowDown";
        this.dom_minusminutes.id = "modalMinusMinutes" + this.c_id;
        this.dom_minusseconds = document.createElement("button");
        this.dom_minusseconds.className = "modalArrowButton arrowDown";
        this.dom_minusseconds.id = "modalMinusSeconds" + this.c_id;

        this.dom_bodyfooter.append(this.dom_minushours);
        this.dom_bodyfooter.append(this.dom_minusminutes);
        this.dom_bodyfooter.append(this.dom_minusseconds);

        this.dom_body.append(this.dom_bodyheader);
        this.dom_body.append(this.dom_bodybody);
        this.dom_body.append(this.dom_bodyfooter);

        this.dom_footer = document.createElement("div");                     // Footer
        this.dom_footer.className = "modalFooter";                           //
        this.dom_footer.id = "timerModalFooter" + this.c_id;                 //
        
        this.dom_cancelButton = document.createElement("button");            //
        this.dom_cancelButton.append(document.createTextNode("Cancel"));     //
        this.dom_cancelButton.className = "modalButton modalCancelButton";   //
        this.dom_cancelButton.id = "timerModalCancelButton" + this.c_id;     //

        this.dom_confirmButton = document.createElement("button");           //
        this.dom_confirmButton.append(document.createTextNode("Confirm"));   //
        this.dom_confirmButton.className = "modalButton modalConfirmButton"; //
        this.dom_confirmButton.id = "timerModalConfirmButton" + this.c_id;   //

        this.dom_footer.append(this.dom_cancelButton);                       //
        this.dom_footer.append(this.dom_confirmButton);                      //

        this.dom_container.append(this.dom_header);    // Append to document
        this.dom_container.append(this.dom_body);      //
        this.dom_container.append(this.dom_footer);    //
        this.dom_parent.append(this.dom_container);    //
    }

    init()
    {
        const self = this;
        // Buttons: Hold
        $(this.dom_confirmButton).on("click", function()
        {
            self.hide();
            $(document).trigger("TimeModal:Confirmed", [self, self.dom_texthours.value, self.dom_textminutes.value, self.dom_textseconds.value]);
            self.dom_texthours.value = 0;
            self.dom_textminutes.value = 0;
            self.dom_textseconds.value = 10;
        });
        $(this.dom_cancelButton).on("click", function()
        {
            self.hide();
            $(document).trigger("TimeModal:Canceled", [self, self.dom_texthours.value, self.dom_textminutes.value, self.dom_textseconds.value]);
            self.dom_texthours.value = 0;
            self.dom_textminutes.value = 0;
            self.dom_textseconds.value = 10;
        });

        $(this.dom_plushours).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_texthours.value;
                if(old < 23) self.dom_texthours.value = ++old;
            }, 200);
        });
        $(this.dom_minushours).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_texthours.value;
                if(old > 0) self.dom_texthours.value = --old;
            }, 200);
        });

        $(this.dom_plusminutes).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_textminutes.value;
                if(old < 59) self.dom_textminutes.value = ++old;
            }, 100);
        });
        $(this.dom_minusminutes).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_textminutes.value;
                if(old > 0) self.dom_textminutes.value = --old;
            }, 100);
        });

        $(this.dom_plusseconds).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_textseconds.value;
                if(old < 59) self.dom_textseconds.value = ++old;
            }, 100);
        });
        $(this.dom_minusseconds).on("mousedown touchstart", function()
        {
            self.c_holdButton = setInterval(function()
            {
                let old = self.dom_textseconds.value;
                if(old > 0) self.dom_textseconds.value = --old;
            }, 100);
        });

        $(".modalArrowButton").on("mouseup mouseleave touchend", function()
        {
           clearInterval(self.c_holdButton); 
        });

        // Buttons: Press
        $(this.dom_plushours).on("click", function()
        {
            let old = self.dom_texthours.value;
            if(old < 23) self.dom_texthours.value = ++old;
        });
        $(this.dom_minushours).on("click", function()
        {
            let old = self.dom_texthours.value;
            if(old > 0) self.dom_texthours.value = --old;
        });

        $(this.dom_plusminutes).on("click", function()
        {
            let old = self.dom_textminutes.value;
            if(old < 59) self.dom_textminutes.value = ++old;
        });
        $(this.dom_minusminutes).on("click", function()
        {
            let old = self.dom_textminutes.value;
            if(old > 0) self.dom_textminutes.value = --old;
        });

        $(this.dom_plusseconds).on("click", function()
        {
            let old = self.dom_textseconds.value;
            if(old < 59) self.dom_textseconds.value = ++old;
        });
        $(this.dom_minusseconds).on("click", function()
        {
            let old = self.dom_textseconds.value;
            if(old > 0) self.dom_textseconds.value = --old;
        });

        $(this.dom_texthours).on("input", function()
        {
            let max = Number(this.max);

            if (Number(this.value) > max) {
                this.value = max;
            } else if (this.value == "")
            {
                this.value = 0;
            }
            this.value = parseInt(this.value);
        })
        $(this.dom_textminutes).on("input", function()
        {
            let max = Number(this.max);

            if (Number(this.value) > max) {
                this.value = max;
            } else if (this.value == "")
            {
                this.value = 0;
            }
            this.value = parseInt(this.value);
        })
        $(this.dom_textseconds).on("input", function()
        {
            let max = Number(this.max);

            if (Number(this.value) > max) {
                this.value = max;
            } else if (this.value == "")
            {
                this.value = 0;
            }
            this.value = parseInt(this.value);
        })
    }

    show()
    {
        $(this.dom_container).show(); // Show modal
    }

    hide()
    {
        $(this.dom_container).hide(); // Hide modal
    }
}