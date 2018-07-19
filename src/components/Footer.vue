<template>
   <footer>
    <footer-link
    text="Github"
    tooltipText = "Checkout my github project"
    iconName = "github"
    href = "https://phmngocnghia.github.io"/>

    <footer-link
    text="LinkedIn"
    tooltipText = "View my LinkedIn profile"
    iconName = "linkedin"
    href = "https://www.linkedin.com/in/ph%E1%BA%A1m-ng%E1%BB%8Dc-ngh%C4%A9a-ba4437159/"/>

    <footer-link
    text="Facebook"
    tooltipText = "View my LinkedIn profile"
    iconName = "facebook-square"
    href = "https://www.facebook.com/ngocnghia.pham.9822/"/>

    <footer-link
    text="Stackoverflow"
    tooltipText = "See my Stackoverflow profile"
    iconName = "stack-overflow"
    href = "https://stackoverflow.com/users/9454494/phmngocnghia"/>
  </footer>
</template>

<script>
import FooterLink from './FooterLink';

export default {
  data() {
    return {
    };
  },
  components: {
    FooterLink,
  },
};
</script>

<style>
footer{
  /*Alwasy at bottom*/
  position: absolute;
  bottom:0;
  left: 0;
  width: 100%;

  /*Theme*/
  padding: 10px 0px;
  background: #343a40!important
}

</style>
