import { warn, hasOwn } from './utils/index'
import shallowEqual from './shallowEqual'

export default function mergeState(state, mapStateToProps, data, isFirstCall, context) {
    let keys

    if (typeof mapStateToProps === 'function') {
        state = mapStateToProps(state)
        keys = Object.keys(state)
    } else if (mapStateToProps instanceof Array) {
        keys = mapStateToProps.filter(p => typeof p === 'string')
    } else {
        return
    }

    if (isFirstCall) {
        keys.forEach(key => {
            if (hasOwn(data, key)) {
                warn(`Merge state from store:${key} already exists will be covered`)
            }
            data[key] = state[key]
        })
    } else {
        let difference
        keys.forEach(key => {
            if (!shallowEqual(data[key], state[key])) {
                if (!context[`__watch_${key}`]) {
                    !difference && (difference = Object.create(null))
                    difference[key] = state[key]
                } else {
                    context[`__watch_${key}`].call(context, state[key], data[key])
                }
            }
        })

        return difference
    }
}