class Promise {
    constructor(executor) {
        if (typeof executor !== 'function') {
            throw(`Promis resolver ${executor} is not a function.`)
        }

        this.initValue()
        this.initBind()

        try {
            executor(this.resolve, this.reject);
        } catch(e) {
            this.reject(e)
        }
    }

    initValue() {
        this.value = null
        this.status = Promise.PENDING
        this.reason = null
        this.onFulfilledCallback = []
        this.onRejectedCallback= []
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(val) {
        if (this.status === Promise.PENDING) {
            this.status = Promise.FULFILLED
            this.value = val
            this.onFulfilledCallback.forEach(fn => {
                fn(this.value)
            })
        }
    }

    reject(reason) {
        if (this.status === Promise.PENDING) {
            this.status = Promise.REJECT
            this.reason = reason
            this.onRejectedCallback.forEach(fn => {
                fn(this.reason)
            })
        }
    }

    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = vlaue => {
                return value
            }
        }

        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                return reason
            }
        }

        return new Promise((resolve, reject) => {
            if (this.status === Promise.PENDING) {
                this.onFulfilledCallback.push((value) => {
                    queueMicrotask(() => {
                        try {
                            resolve(onFulfilled(value))
                        } catch (e) {
                            reject(e)
                        }
                    })
                        
                })
    
                this.onRejectedCallback.push((reason) => {
                    queueMicrotask(() => {
                        try {
                            resolve(onRejected(reason))
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
    
            if (this.status === Promise.FULFILLED) {
                queueMicrotask(() => {
                    try {
                        resolve(onFulfilled(this.value))
                    } catch (e) {
                        reject(e)
                    }
                })
            }
    
            if (this.status === Promise.REJECT) {
                queueMicrotask(() => {
                    try {
                        resolve(onRejected(this.reason))
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
    }
}
Promise.PENDING = 'PENDING'
Promise.FULFILLED = 'FULFILLED'
Promise.REJECT = 'REJECT'

module.exports = Promise