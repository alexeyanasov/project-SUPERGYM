'use strict';

(function () {

  function setCursorPosition(pos, elem) {
    elem.focus();
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  window.vendor = {
    maskPhone: function (event) {
      var matrix = '+7 (___) ___ __ __';
      var i = 0;
      var def = matrix.replace(/\D/g, '');
      var val = this.value.replace(/\D/g, '');
      if (def.length >= val.length) {
        val = def;
      }
      this.value = matrix.replace(/./g, function (a) {
        var newLocal;
        if (/[_\d]/.test(a) && i < val.length) {
          newLocal = val.charAt(i++);
        } else if (i >= val.length) {
          newLocal = '';
        } else {
          newLocal = a;
        }
        return newLocal;
      });
      if (event.type === 'blur') {
        if (this.value.length === 2) {
          this.value = '';
        }
      } else {
        setCursorPosition(this.value.length, this);
      }
    }
  };

})();
