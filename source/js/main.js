'use strict';
var bodyPage = document.querySelector('body');

var sectionContact = bodyPage.querySelector('.contact');
if (sectionContact) {
  var formInputPhone = sectionContact.querySelector('#user-phone');
}

var sectionPrime = bodyPage.querySelector('.prime');
if (sectionPrime) {
  var btnPrimeBuySubscription = sectionPrime.querySelector('.btn--buy');
}

var sectionSubscription = bodyPage.querySelector('.subscription');

// прокрутка к блоку абонементы

btnPrimeBuySubscription.addEventListener('click', function (evt) {
  evt.preventDefault();
  if (sectionSubscription) {
    sectionSubscription.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

// маска телефона

window.addEventListener('DOMContentLoaded', function () {
  formInputPhone.addEventListener('input', window.vendor.maskPhone, false);
  formInputPhone.addEventListener('focus', window.vendor.maskPhone, false);
  formInputPhone.addEventListener('blur', window.vendor.maskPhone, false);
});

// Код слайдера

var multiItemSlider = (function () {

  // получаем все нужные координаты

  var isElementVisible = function (element) {
    var rect = element.getBoundingClientRect();
    var vWidth = window.innerWidth || document.documentElement.clientWidth;
    var vHeight = window.innerHeight || document.documentElement.clientHeight;

    var elemFromPoint = function (x, y) {
      return document.elementFromPoint(x, y);
    };

    if (rect.right < 0 || rect.bottom < 0 ||
      rect.left > vWidth || rect.top > vHeight) {
      return false;
    }
    return (
      element.contains(elemFromPoint(rect.left, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.top)) ||
      element.contains(elemFromPoint(rect.right, rect.bottom)) ||
      element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  };

  return function (selector) {

    var mainElement = document.querySelector(selector); // основный элемент блока
    var sliderWrapper = mainElement.querySelector('.slider-wrapper'); // обертка для .slider-item
    var sliderItems = mainElement.querySelectorAll('.slider-item'); // элементы (.slider-item)
    var wrapperWidth = parseFloat(sliderWrapper.clientWidth); // ширина обёртки
    var itemWidth = parseFloat(sliderItems[0].clientWidth); // ширина одного элемента
    var positionLeftItem = 0; // позиция левого активного элемента
    var transform = 0; // значение транфсофрмации .slider_wrapper
    var step = itemWidth / wrapperWidth * 100; // величина шага (для трансформации)
    var items = []; // массив элементов
    var html = mainElement.innerHTML;
    var states = [
      {active: false, minWidthMobile: 320, maxWidthMobile: 767, count: 1, typeDevice: 'mobile'},
      {active: false, minWidthTablet: 768, maxWidthTablet: 1199, count: 2, typeDevice: 'tablet'},
      {active: false, minWidthDesktop: 1200, count: 4, typeDevice: 'desktop'},
    ];

    // наполнение массива items

    for (var i = 0; i < sliderItems.length; i++) {
      items.push({
        item: sliderItems[i],
        position: i,
        transform: 0
      });
    }

    // проверяет текущую ширину окна браузера и меняет в массиве states active на true

    var setActive = function () {
      var currentIndex = 0;
      var width = parseFloat(document.body.clientWidth); // ширина области содержимого body + padding
      for (var c = 0; c < states.length; c++) {
        states[c].active = false;
        if (width >= states[c].minWidthMobile && width <= states[c].maxWidthMobile) {
          currentIndex = c;
        } else if (width >= states[c].minWidthTablet && width <= states[c].maxWidthTablet) {
          currentIndex = c;
        } else if (width >= states[c].minWidthDesktop) {
          currentIndex = c;
        }
      }

      states[currentIndex].active = true;
      return {
        count: states[currentIndex].count,
        type: states[currentIndex].typeDevice
      };
    };

    // получает текущую ширину браузера

    var getActive = function () {
      var currentIndex;
      for (var d = 0; d < states.length; d++) {
        if (states[d].active) {
          currentIndex = d;
        }
      }

      return currentIndex;
    };

    // проверка позиции минимального и максимального элемента

    var position = {
      getItemMin: function () {
        var indexItem = 0;

        for (var j = 0; j < items.length; j++) {
          if (items[j].position < items[indexItem].position) {
            indexItem = j;
          }
        }
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;

        for (var j = 0; j < items.length; j++) {
          if (items[j].position > items[indexItem].position) {
            indexItem = j;
          }
        }
        return indexItem;
      },
      getMin: function () {
        return items[position.getItemMin()].position;
      },
      getMax: function () {
        return items[position.getItemMax()].position;
      }
    };

    // основная функция слайдера

    var transformItem = function (direction) {
      var nextItem;

      if (!isElementVisible(mainElement)) {
        return;
      }

      if (direction === 'right') {
        positionLeftItem++;
        if ((positionLeftItem + wrapperWidth / itemWidth - 1) > position.getMax()) {
          nextItem = position.getItemMin();
          items[nextItem].position = position.getMax() + 1;
          items[nextItem].transform += items.length * 100;
          items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
        }
        transform -= step;
      }
      if (direction === 'left') {
        positionLeftItem--;
        if (positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          items[nextItem].position = position.getMin() - 1;
          items[nextItem].transform -= items.length * 100;
          items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
        }
        transform += step;
      }
      sliderWrapper.style.transform = 'translateX(' + transform + '%)';
    };

    // обработчик события click для кнопок "назад" и "вперед"

    var controlClick = function (e) {
      if (e.target.classList.contains('slider-control')) {
        e.preventDefault();
        var direction = e.target.classList.contains('slider-control-right') ? 'right' : 'left';

        if (wrapperWidth !== itemWidth) {
          var numberSlide = setActive();
          for (var b = 0; b < numberSlide.count; b++) {
            transformItem(direction);
          }
        } else {
          transformItem(direction);
        }
      }
    };

    // обновляем объкты при изменение размера окна

    var refresh = function () {
      mainElement.innerHTML = html;
      sliderWrapper = mainElement.querySelector('.slider-wrapper');
      sliderItems = mainElement.querySelectorAll('.slider-item');
      wrapperWidth = parseFloat(sliderWrapper.clientWidth);
      itemWidth = parseFloat(sliderItems[0].clientWidth);
      positionLeftItem = 0;
      transform = 0;
      step = itemWidth / wrapperWidth * 100;
      items = [];
      for (var f = 0; f < sliderItems.length; f++) {
        items.push({
          item: sliderItems[f],
          position: f,
          transform: 0
        });
      }
    };

    // добавление к кнопкам "назад" и "вперед" обрботчика controlClick для событя click

    var setUpListeners = function () {
      mainElement.addEventListener('click', controlClick);
      window.addEventListener('resize', function () {
        var currentIndex = 0;
        var width = parseFloat(document.body.clientWidth);

        for (var c = 0; c < states.length; c++) {
          states[c].active = false;
          if (width >= states[c].minWidthMobile && width <= states[c].maxWidthMobile) {
            currentIndex = c;
          } else if (width >= states[c].minWidthTablet && width <= states[c].maxWidthTablet) {
            currentIndex = c;
          } else if (width >= states[c].minWidthDesktop) {
            currentIndex = c;
          }
        }

        // проверка ширины окна браузера

        if (currentIndex !== getActive()) {
          setActive();
          refresh();
        }
      });
    };

    // инициализация

    setUpListeners();
    setActive();
    return {
      right: function () { // метод right
        transformItem('right');
      },
      left: function () { // метод left
        transformItem('left');
      }
    };

  };
}());

multiItemSlider('#slider-trainer');
multiItemSlider('#slider-recall');
