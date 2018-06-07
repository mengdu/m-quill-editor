/**
* 基于transform定位的移动指令
* 兼容性ie9+
* v-move:target:box.x.y.body.out=cb
* target 移动元素，请在v-move在父级元素中设置data-target
* box 移动范围，默认body，如果指定盒子，请在v-move在父级元素中设置data-box
* x/y 规定移动方向，默认x,y都可以
* out 是否移出当前指令元素则停止
**/

function getParent (el, name) {
  var node = el.parentNode
  if (node.hasAttribute('data-' + name)) {
    return node
  } else if (node.nodeName === 'BODY') {
    return false
  } else {
    return getParent(node, name)
  }
}
function css (el, field) {
  return getComputedStyle ? getComputedStyle(el).getPropertyValue(field) : el.currentStyle[field]
}
function setTransform (el, transform) {
  el.style.transform = transform
  el.style.webkitTransform = transform
  el.style.msTransform = transform
  el.style.OTransform = transform
  el.style.MozTransform = transform
}
function getTransform (el) {
  var matrix = css(el, 'transform')
  var result = matrix.match(/matrix\(((-?\d+?\.?\d?,?\s?)+)\)/)
  // console.log(matrix, result)
  return (result && result[1]) ? result[1].split(/,\s?/) : null
}
/**
* target 移动元素
* box 移动范围元素
* el 触发移动元素
**/

function dropMove (target, box, el, op, cb) {
  var startPoint = null
  var boxScope = {}
  function init () {
    var elBound = target.getBoundingClientRect()
    var boxBound = box.getBoundingClientRect()
    // 初始化获得box在Transform坐标系位置信息
    boxScope = {
      x: -(elBound.left - boxBound.left),
      y: -(elBound.top - boxBound.top),
      w: boxBound.width,
      h: boxBound.height
    }
    if (box === document.body) {
      boxScope.w = document.documentElement.clientWidth
      boxScope.h = document.documentElement.clientHeight
    }
    // console.log(boxScope, box)
  }
  init()
  el.addEventListener('mousedown', (e) => {
    if (!e.preventDefault) {
      window.event.cancelBubble = true // for ie阻止冒泡
      window.event.returnValue = false // 阻止默认行为
    } else {
      e.preventDefault()
      e.stopPropagation()
    }
    // console.log('click')
    var bound = target.getBoundingClientRect()
    // var boxBound = box.getBoundingClientRect()
    var left = 0
    var top = 0
    var matrix = getTransform(target)
    if (matrix) {
      left = matrix[4] || 0
      top = matrix[5] || 0
    }
    startPoint = {
      clientX: e.clientX,
      clientY: e.clientY,
      offsetX: e.clientX - bound.left,
      offsetY: e.clientY - bound.top,
      left: ~~left,
      top: ~~top
    }
    // console.log(e.clientX, e.clientY)
    // console.log(startPoint)
    document.addEventListener('mousemove', move, false)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move)
    }, false)
  }, false)
  function move (e) {
    if (!e.preventDefault) {
      window.event.cancelBubble = true // for ie阻止冒泡
      window.event.returnValue = false // 阻止默认行为
    } else {
      e.preventDefault()
      e.stopPropagation()
    }
    var bound = target.getBoundingClientRect()
    var offsetX = e.clientX - startPoint.clientX
    var offsetY = e.clientY - startPoint.clientY
    var left = startPoint.left + offsetX
    var top = startPoint.top + offsetY
    // 溢出处理
    left = left < boxScope.x ? boxScope.x : (left + bound.width > boxScope.x + boxScope.w ? boxScope.x + boxScope.w - bound.width : left)
    top = top < boxScope.y ? boxScope.y : (top + bound.height > boxScope.y + boxScope.h ? boxScope.y + boxScope.h - bound.height : top)
    // console.log(e.clientX, e.clientY, left, top)
    // translate3d的位置是相对初始化时的位置
    // target.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0px)'
    if (!op.x && !op.y) {
      setTransform(target, 'translateX(' + left + 'px) translateY(' + top + 'px)')
    }
    if (op.x) {
      setTransform(target, 'translateX(' + left + 'px)')
    }
    if (op.y) {
      setTransform(target, 'translateY(' + top + 'px)')
    }
    var boxBound = box.getBoundingClientRect()

    if (cb) {
      op = {
        offsetX,
        offsetY,
        left,
        top,
        bound,
        boxBound
      }
      cb(op)
    }
    return false // for ie
  }
  if (op.out) {
    el.addEventListener('mouseout', (e) => {
      // console.log('out')
      document.removeEventListener('mousemove', move)
    }, false)
  }
}
const directive = {
  inserted (el, binding) {
    // console.log(binding)
    var targetName = binding.arg && binding.arg.split(':')[0]
    var boxName = binding.arg && binding.arg.split(':')[1]
    // binding.modifiers.body
    var target = targetName ? getParent(el, targetName) || el : el
    var box = null
    if (binding.modifiers.body) {
      box = document.body
    } else {
      box = boxName ? getParent(el, boxName) || document.body : document.body
    }
    // console.log(target, box)
    var op = {
      x: binding.modifiers.x,
      y: binding.modifiers.y,
      out: binding.modifiers.out
    }
    dropMove(target, box, el, op, binding.value)
  }
}
const name = 'move'
const install = function (Vue) {
  Vue.directive(name, directive)
}
export default {
  name,
  directive,
  install
}
