'use strict'
;(() => {
  const S = Object.defineProperty
  const a = (i, e) => S(i, 'name', { value: e, configurable: !0 })
  function l(i, e, s, n) {
    if (s === 'a' && !n)
      throw new TypeError('Private accessor was defined without a getter')
    if (typeof e == 'function' ? i !== e || !n : !e.has(i))
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      )
    return s === 'm' ? n : s === 'a' ? n.call(i) : n ? n.value : e.get(i)
  }
  a(l, '__classPrivateFieldGet')
  function m(i, e, s, n, o) {
    if (n === 'm') throw new TypeError('Private method is not writable')
    if (n === 'a' && !o)
      throw new TypeError('Private accessor was defined without a setter')
    if (typeof e == 'function' ? i !== e || !o : !e.has(i))
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      )
    return n === 'a' ? o.call(i, s) : o ? (o.value = s) : e.set(i, s), s
  }
  a(m, '__classPrivateFieldSet')
  let u,
    d,
    w,
    y,
    C,
    U = '__TAURI_TO_IPC_KEY__'
  function I(i, e = !1) {
    return window.__TAURI_INTERNALS__.transformCallback(i, e)
  }
  a(I, 'transformCallback')
  const v = class {
    static {
      a(this, 'Channel')
    }
    constructor(e) {
      u.set(this, void 0),
        d.set(this, 0),
        w.set(this, []),
        y.set(this, void 0),
        m(this, u, e || (() => {}), 'f'),
        (this.id = I(s => {
          const n = s.index
          if ('end' in s) {
            n == l(this, d, 'f') ? this.cleanupCallback() : m(this, y, n, 'f')
            return
          }
          const o = s.message
          if (n == l(this, d, 'f')) {
            for (
              l(this, u, 'f').call(this, o),
                m(this, d, l(this, d, 'f') + 1, 'f');
              l(this, d, 'f') in l(this, w, 'f');

            ) {
              const f = l(this, w, 'f')[l(this, d, 'f')]
              l(this, u, 'f').call(this, f),
                delete l(this, w, 'f')[l(this, d, 'f')],
                m(this, d, l(this, d, 'f') + 1, 'f')
            }
            l(this, d, 'f') === l(this, y, 'f') && this.cleanupCallback()
          } else l(this, w, 'f')[n] = o
        }))
    }
    cleanupCallback() {
      Reflect.deleteProperty(window, `_${this.id}`)
    }
    set onmessage(e) {
      m(this, u, e, 'f')
    }
    get onmessage() {
      return l(this, u, 'f')
    }
    [((u = new WeakMap()),
    (d = new WeakMap()),
    (w = new WeakMap()),
    (y = new WeakMap()),
    U)]() {
      return `__CHANNEL__:${this.id}`
    }
    toJSON() {
      return this[U]()
    }
  }
  async function h(i, e = {}, s) {
    return window.__TAURI_INTERNALS__.invoke(i, e, s)
  }
  a(h, 'invoke')
  C = new WeakMap()
  const x = class {
    constructor(e, s) {
      this.sendRealtime = e
      this.leaveRealtime = s
      this.listener = null
      this.trashed = !1
      ;(this.setListener = this.setListener.bind(this)),
        (this.send = this.send.bind(this)),
        (this.leave = this.leave.bind(this)),
        (this.is_trashed = this.is_trashed.bind(this))
    }
    static {
      a(this, 'RealtimeListener')
    }
    is_trashed() {
      return this.trashed
    }
    setListener(e) {
      this.listener = e
    }
    send(e) {
      if (!(e instanceof Uint8Array))
        throw new Error('realtime listener data must be a Uint8Array')
      if (this.trashed)
        throw new Error(
          'realtime listener is trashed and can no longer be used'
        )
      this.sendRealtime(Array.from(e))
    }
    leave() {
      ;(this.trashed = !0), this.leaveRealtime()
    }
  }
  ;(() => {
    let i = new TextDecoder(),
      e = null,
      s = null,
      n = 0,
      o = null,
      f = !1,
      T = !1,
      R = a(async () => {
        const t = JSON.parse(
          await h('get_webxdc_updates', { lastKnownSerial: n })
        )
        for (const r of t) (n = r.max_serial), e?.(r)
        o && (o(), (o = null))
      }, 'innerOnStatusUpdate'),
      E = a(async () => {
        if (f) {
          T = !0
          return
        }
        ;(f = !0), e && (await R()), T && ((T = !1), await E()), (f = !1)
      }, 'onStatusUpdate'),
      P = new v()
    h('register_webxdc_channel', { channel: P }),
      (P.onmessage = t => {
        t.event === 'realtimePacket'
          ? s && !s.is_trashed() && s.listener?.(Uint8Array.from(t.data))
          : t.event === 'status' && E()
      }),
      (window.webxdc = {
        selfAddr: i.decode(new Uint8Array([__TEMPLATE_SELFADDR__])),
        selfName: i.decode(new Uint8Array([__TEMPLATE_SELFNAME__])),
        sendUpdateInterval: __TEMPLATE_SEND_UPDATE_INTERVAL__,
        sendUpdateMaxSize: __TEMPLATE_SEND_UPDATE_MAX_SIZE__,
        sendUpdate(t, r) {
          r &&
            console.warn('sendUpdate: the description parameter is deprecated'),
            h('send_webxdc_update', { statusUpdate: t }).catch(
              console.error.bind(null, 'sendUpdate failed:')
            )
        },
        setUpdateListener: a((t, r = 0) => {
          ;(n = r), (e = t)
          const _ = new Promise((c, p) => {
            o = c
          })
          return E(), _
        }, 'setUpdateListener'),
        getAllUpdates: a(
          () => (
            console.error(
              'getAllUpdates is deprecated and will be removed in the future, it also returns an empty array now, so you really should use setUpdateListener instead.'
            ),
            Promise.resolve([])
          ),
          'getAllUpdates'
        ),
        joinRealtimeChannel: a(() => {
          if (s && !s.is_trashed())
            throw new Error('realtime listener already exists')
          return (
            (s = new x(
              t => h('send_webxdc_realtime_data', { data: t }),
              () => h('leave_webxdc_realtime_channel')
            )),
            h('join_webxdc_realtime_channel'),
            s
          )
        }, 'joinRealtimeChannel'),
        sendToChat: a(async t => {
          if (!t.file && !t.text)
            return Promise.reject(
              'Error from sendToChat: Invalid empty message, at least one of text or file should be provided'
            )
          let r = a(c => {
              const p = ';base64,'
              return new Promise((A, g) => {
                const b = new FileReader()
                b.readAsDataURL(c),
                  (b.onload = () => {
                    const L = b.result
                    A(L.slice(L.indexOf(p) + p.length))
                  }),
                  (b.onerror = () => g(b.error))
              })
            }, 'blob_to_base64'),
            _ = null
          if (t.file) {
            let c
            if (!t.file.name) return Promise.reject('file name is missing')
            if (
              Object.keys(t.file).filter(p =>
                ['blob', 'base64', 'plainText'].includes(p)
              ).length > 1
            )
              return Promise.reject(
                'you can only set one of `blob`, `base64` or `plainText`, not multiple ones'
              )
            if (t.file.blob instanceof Blob) c = await r(t.file.blob)
            else if (typeof t.file.base64 == 'string') c = t.file.base64
            else if (typeof t.file.plainText == 'string')
              c = await r(new Blob([t.file.plainText]))
            else
              return Promise.reject(
                'data is not set or wrong format, set one of `blob`, `base64` or `plainText`, see webxdc documentation for sendToChat'
              )
            _ = { fileName: t.file.name, fileContent: c }
          }
          await h('webxdc_send_to_chat', { options: { file: _, text: t.text } })
        }, 'sendToChat'),
        importFiles: a(t => {
          const r = document.createElement('input')
          ;(r.type = 'file'),
            (r.accept = [...(t.extensions || []), ...(t.mimeTypes || [])].join(
              ','
            )),
            (r.multiple = t.multiple || !1)
          const _ = new Promise((c, p) => {
            r.onchange = A => {
              const g = Array.from(r.files || [])
              document.body.removeChild(r), c(g)
            }
          })
          return (
            (r.style.display = 'none'),
            document.body.appendChild(r),
            r.click(),
            _
          )
        }, 'importFiles'),
      })
  })()
})()
