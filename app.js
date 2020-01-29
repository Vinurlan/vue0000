Vue.component('madal-form', {
    props: ["propsform"],
    template: `
        <form id="madalFormCallback" class="madalFormContainer">
            <madal-input
                v-for="(prop, index) of propsform"
                v-bind:key="index"
                v-bind:propsinput="prop"
            ></madal-input>
        </form>
    `
})

Vue.component('madal-input', {
    props: ["propsinput", "propvalue"],
    template: `
        <label>
        
            <label v-bind:for=propsinput.id >{{propsinput.label}}</label>
            <input 
                v-bind:type=propsinput.type
                v-bind:id=propsinput.id
                v-bind:v-model=propvalue
                v-on:keyUp="$emit('handle-valid')"
                >
        </label>
    `
})


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
        madalFormInputs: [
            { label: "Ваше имя*", id: "madalName", type: "text", value: "dataCallback.name", valid: "validHandler"},
            { label: "Ваш номер телефона*", id: "madalPhone", type: "number", value: "dataCallback.number", valid: "validHandler"},
            { label: "Комментарий к заявке", id: "madalComment", type: "text", value: "dataCallback.comment", valid: ""},
        ],
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
            /*axios.post("https://basebackpack.firebaseio.com/client-request.json", this.dataCallback)
                .then(response => response.json);*/
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