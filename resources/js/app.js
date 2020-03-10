/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue'
 
import VueChatScroll from 'vue-chat-scroll'
import Axios from 'axios';
Vue.use(VueChatScroll);

//toastr
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('message', require('./components/Message.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data() {
        return {
            chat : {
                messages: [] ,
                
            } , 
            message: '' ,
            random: 9999 ,
            users: [] ,
            colors: [] , 
            typing: null ,
            time: [] ,
            onlineUsers: [] ,
        }
    } , 
    methods: {
        sendMessage() {
            if (this.message.length !== 0) 
            {
                this.chat.messages.push(this.message);
                this.users.push('you');
                this.colors.push('success');
                this.time.push(this.getTime());
                Axios.post('/send' ,{
                    'message' : this.message ,
                    'chat' : this.chat.messages , 
                    'colors' : this.colors , 
                    'users' : this.users ,
                    'time' : this.time
                })
                .then((response) => {
                    console.log('RESPONSE');
                    console.log(response);
                    this.message = '';
                    // this.time.push(this.getTime());
                })
                .catch(err => {
                    console.log(err);
                });
            }
            else
            {
                this.message = '';
            }
        } , 
        getTime() {
            let time = new Date();
            return time.getHours() + ':' + time.getMinutes();
        } , 
        getOldMessages() {
            Axios.post('/getOldMessage')
            .then(response => {
                console.log('==========================');
                console.log(response.data)
                if (response.data.length !== 0) 
                {
                    this.chat.messages = response.data.chat;
                    this.colors = response.data.colors;
                    this.users = response.data.users;
                    this.time = response.data.time;
                }
            })
            .catch(err => {
                console.log(err.message)
            });
        } , 
        deleteChat() {
            // send axios request to delete session
            Axios.post('/deleteSession')
            .then(response => {
                // this.chat.messages = ''
                // reinitilize chat messages array
                this.chat.messages = [];
                // send notification to user 
                this.$toaster.success(`Chat Deleted`);
            })
            .catch(err => {
                console.log(err);
            });
        }
    } , 
    watch: {
       message() {
            Echo.private('chat')
            .whisper('typing', {
                name: this.message
            });
       }
    } ,
    mounted() {
        this.getOldMessages();
        //Listening to Events
        Echo
        .private('chat')
        .listen('ChatEvent', (e) => {
            this.chat.messages.push(e.message);
            this.time.push(this.getTime());
            let username = e.user.name;
            this.users.push(username);
            this.colors.push('warning');
            // send axios request to saveToSession
            Axios.post('/saveToSession' ,{
                'message' : this.message ,
                'chat' : this.chat.messages , 
                'colors' : this.colors , 
                'users' : this.users ,
                'time' : this.time
            })
            .then((response) => {
            })
            .catch(err => {
                console.log(err);
            });
        })
        .listenForWhisper('typing', (e) => {
            if (e.name !== '') 
            {
                this.typing = 'typing...';
            }
            else
            {
                this.typing = null;
            }
        });

    } , // end of mounted
    created()
    {
        // Join
        Echo.join(`chat`)
        .here((users) => {
            this.onlineUsers = users;
            // console.log(this.onlineUsers)
        })
        .joining((user) => {
            if (user) {
                this.onlineUsers.push(user);
                this.$toaster.success(`${user.name} has joined the chat`);
            }
        })
        .leaving((user) => {
            this.onlineUsers = this.onlineUsers.filter(onlineUser => {
                return onlineUser.name !== user.name;
            })
            this.$toaster.warning(`${user.name} has left the chat`)
        });
    }
 });
