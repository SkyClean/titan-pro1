// const closeButton = document.getElementById('titlebar-button-close')
//
// closeButton.addEventListener('click', function(event) {
//     window.close()
// })

$('document').ready(function(){
  $('.nav-div').click(function(){
    $('.nav-div').removeClass('active');
    $(this).addClass('active');
    console.log('nav div clicked');
  });


  const links = document.querySelectorAll('link.import')

  // Scan every import and add the html to the DOM, they are hidden
  // but they will be shown upon clicking one of the navbar's buttons
  Array.prototype.forEach.call(links, function (link) {
    let template = link.import.getElementsByTagName("template")[0];
    let clone = document.importNode(template.content, true)
    document.querySelector('#main-div').appendChild(clone)
  })

  const sectionButtons = document.querySelectorAll('[data-section]')

  function changeSection (sectionId) {
      // hide the current section that is being shown
      const sections = document.querySelectorAll('.is-shown')
      console.log('button clicked');


      Array.prototype.forEach.call(sections, function (section) {
          section.classList.remove('is-shown')
      })

      // Show the section associated with the button
      let section = document.getElementById(sectionId)
      section.classList.add('is-shown')
  }

  Array.prototype.forEach.call(sectionButtons, function (button) {
      button.addEventListener('click', function(event) {
          changeSection(button.getAttribute('data-section'))
      })
  })


  const coinlinks = document.querySelectorAll('link.importcoin')

  // Scan every import and add the html to the DOM, they are hidden
  // but they will be shown upon clicking one of the navbar's buttons
  Array.prototype.forEach.call(coinlinks, function (link) {
    console.log('link');
    let template = link.import.getElementsByTagName("template")[0];
    let clone = document.importNode(template.content, true)
    document.querySelector('#main-div-coin').appendChild(clone)
  })


  const sectioncoinButtons = document.querySelectorAll('[data-section-coin]')

  function changeSectionCoin (sectionId) {
      // hide the current section that is being shown
      const sections = document.querySelectorAll('.is-shown-coin')
      console.log(sectionId);
      coin = sectionId.split('section-coin-')[1];
      console.log('coin', coin);
      $('.wallet-nav').removeClass('color-eos');
      $('.wallet-nav').removeClass('color-ethereum');
      $('.wallet-nav').removeClass('color-bitcoin');
      $('.wallet-nav').removeClass('color-lite');

      $('.wallet-nav').addClass('color-' + coin);
      Array.prototype.forEach.call(sections, function (section) {
          section.classList.remove('is-shown-coin')
      })

      // Show the section associated with the button
      let section = document.getElementById(sectionId)
      section.classList.add('is-shown-coin')
  }

  Array.prototype.forEach.call(sectioncoinButtons, function (button) {
      button.addEventListener('click', function(event) {
          $('.wallet-link-div').removeClass('active');
          $(this).addClass('active');
          changeSectionCoin(button.getAttribute('data-section-coin'))
      })
  })
});



var ethers = require('ethers');
const {shell} = require('electron')
const {dialog} = require('electron').remote
const clipboardy = require('clipboardy');
var fs = require('fs');
const BN = require('bn.js');
