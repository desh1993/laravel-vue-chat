<template>
    <div class="container">
        <li class="list-group-item" :class="className">
            <slot></slot>
            <span id="time">{{ time }}</span>
        </li>
        <small class="badge float-right" :class="badgeColor" :random="random" >{{users}}</small>
    </div>
</template>

<script>
    export default {
        name: 'Message' ,
        mounted() {
            console.log('Component mounted.')
        } ,
        props : ['colors' , 'random' , 'users' , 'time' ] , 
        computed : {
            className() {
                return 'list-group-item-' + this.colors;
            } , 
            badgeColor() {
                return 'badge-' + this.color; 
            }
        }

    }
</script>
<style>
    #time{
        font-size: 9px;
        margin-top: 10px;
        color: black;
    }
</style>