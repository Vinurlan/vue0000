Vue.component('form-request', {
    props: ["propsform", "propsfunc"],
    template: `
    <div class="madalContainer">
        <form id="madalFormCallback" class="madalFormContainer" >
            <label class="formCallback">
                <label class="inputsFormCallback">
                    <form-request-input                                                         
                        v-for="(prop, index) of propsform"
                        v-bind:key="index"
                        v-bind:propsinput="prop"
                        v-on:handle-valid="propsfunc"
                        v-on:input="prop.value = $event"
                    ></form-request-input>
                </label>
                <label for="" class="madalContainerButtons">
                    <button form="madalFormCallback" type="reset" v-on:click="$emit('handlerclear')" class="madalClearBtn">ОЧИСТИТЬ</button>
                    <button type="submit" v-on:click.prevent="$emit('handlersubmit')" class="madalSubmitBtn">ОТПРАВИТЬ</button>      
                </label>
            </label> 
        </form>
    </div>
    `
})

Vue.component('form-request-input', {
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

Vue.component('list-request', {
    props: ["reqlist"],
    template: `
        <div class="madalListRequest">
            <list-prop-request
                v-for="(prop, index) in reqlist"
                v-bind:key="index"
                v-bind:proplist="prop"
            >
            </list-prop-request>
        </div>
    `
})

Vue.component('list-prop-request', {
    props: ["proplist"],
    template: `
        <div class="madalListPropRequest">
            {{ proplist.name }} 
            {{ proplist.number }} 
            {{ proplist.comment }}
        </div>
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
        madalContent: [
            { html: "form-request", inputs: "madalFormInputs" },
            { html: "list-request", inputs: "" }
        ],
        madalViewCurrent: "",
        dataListRequests: {},
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
            console.log("!")
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
            axios.post("https://basebackpack.firebaseio.com/client-request.json", this.dataCallback)
                .then(response => response.json);
            this.closeMadal();
            this.isValid = false;
            this.madalMessage = true;
        },

    }
})

var callbackApp = new Vue({
    el: "#callback-app",
    methods: {
        openMadalCallback(madalSetContent, func) {
            madalView.madalCallback = true;
            madalView.madalViewCurrent = madalSetContent;
            func ? func() : null;
        },
        onloadListRequests: function() {
            axios.get("https://basebackpack.firebaseio.com/client-request.json")
                .then(response => madalView.dataListRequests = response.data)
            
        }
    }
})