<template>
  <div>
    <p>{{author}} {{dateTime}}</p>
    <hr/>
  </div>
</template>
<script>
  export default {
    props: ['dateTime'],
    data(){
      return {
        author: '章永新'
      }
    }
  }
</script>
