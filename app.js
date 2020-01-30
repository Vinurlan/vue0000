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
    props: ["propsinput"],
    template: `
        <label>
        
            <label v-bind:for=propsinput.id >{{propsinput.label}}</label>
            <input 
                v-bind:type=propsinput.type
                v-bind:id=propsinput.id
                v-bind:value=propsinput.value
                v-on:input="$emit('input', $event.target.value)"
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
            { label: "Ваше имя*", id: "madalName", type: "text", value: "", valid: "validHandler"},
            { label: "Ваш номер телефона*", id: "madalPhone", type: "number", value: "", valid: "validHandler"},
            { label: "Комментарий к заявке", id: "madalComment", type: "text", value: "", valid: ""},
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
            this.madalFormInputs.forEach((item) => item.value="")
        },
        submitMadalHandle: function() {
            
            let arr = this.madalFormInputs.map((item, index) => {
                item.value != "" ? this.isValid = true : index != 2 ? document.querySelector("#madalFormCallback").querySelectorAll("input")[index].classList.add("invalidInput") : null;
                return item.value
            });
            this.dataCallback = { name: arr[0], number: arr[1], comment: arr[2] };
            
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