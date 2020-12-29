import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'


export default {
  //mutation唯一的目的就是为了修改state中的状态
  //mutation中每个方法尽可能完成的事件单一一点
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = false
    state.cartList.push(payload)
  }
}
