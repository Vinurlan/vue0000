

var madalView = new Vue({
    el: "#madal-view",
    data: {
        madalCallback: false,
        dataCallback: {
            name: "",
            number: "",
            comment: "",
        },
        isValid: false,
        madalMessage: false,
    },
    methods: {
        closeMadal: function() {
            this.madalCallback = false;
            this.clearContent();
            
        },
        closeMadalMessage: function() {
            this.madalMessage = false;
        },
        validHandler: function(event) {
            if (event.target.value == "") {
                event.target.classList.add("invalidInput")
            } else {event.target.classList.remove("invalidInput")}
        },
        clearContent: function() {
            this.dataCallback = {name: "", number: "", comment: ""}
        },
        submitMadalHandle: function() {
            let arr = Object.values(this.dataCallback);
            for (let i = 0; i < arr.length; i++) {
                if ( arr[i] != "" ) {
                    this.isValid = true
                } else {
                    this.isValid = false;
                    if (i != 2) {
                        document.querySelector("#madalFormCallback").querySelectorAll("input")[i].classList.add("invalidInput");
                    }
                }
            }
            
            if (!this.isValid) {
                return;
            }
            axios.post("https://basebackpack.firebaseio.com/client-request.json", this.dataCallback)
                .then(response => response.json);
            this.closeMadal();
            this.isValid = false;
            this.madalMessage = true;
        }
    }
})

var callbackApp = new Vue({
    el: "#callback-app",
    methods: {
        openMadalCallback() {
            madalView.madalCallback = true;
        }
    }
})