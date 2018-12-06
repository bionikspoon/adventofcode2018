import moment from 'moment'
import util from 'util'

moment.prototype[util.inspect.custom] = function inspect() {
  return this.inspect()
}
