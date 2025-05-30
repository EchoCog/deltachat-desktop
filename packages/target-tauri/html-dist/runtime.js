const Pt = Object.create
const U = Object.defineProperty
const vt = Object.getOwnPropertyDescriptor
const Ut = Object.getOwnPropertyNames
const Ht = Object.getPrototypeOf,
  Gt = Object.prototype.hasOwnProperty
const _ = (e, t) => U(e, 'name', { value: t, configurable: !0 })
const ut = (e, t) => () => (
    t || e((t = { exports: {} }).exports, t), t.exports
  ),
  Bt = (e, t) => {
    for (const r in t) U(e, r, { get: t[r], enumerable: !0 })
  },
  Yt = (e, t, r, n) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (const i of Ut(t))
        !Gt.call(e, i) &&
          i !== r &&
          U(e, i, {
            get: () => t[i],
            enumerable: !(n = vt(t, i)) || n.enumerable,
          })
    return e
  }
const ct = (e, t, r) => (
  (r = e != null ? Pt(Ht(e)) : {}),
  Yt(
    t || !e || !e.__esModule
      ? U(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
)
const Ct = ut((be, It) => {
  let N = null
  typeof WebSocket < 'u'
    ? (N = WebSocket)
    : typeof MozWebSocket < 'u'
      ? (N = MozWebSocket)
      : typeof global < 'u'
        ? (N = global.WebSocket || global.MozWebSocket)
        : typeof window < 'u'
          ? (N = window.WebSocket || window.MozWebSocket)
          : typeof self < 'u' && (N = self.WebSocket || self.MozWebSocket)
  It.exports = N
})
const Ot = ut((He, Z) => {
  function X() {}
  _(X, 'E')
  X.prototype = {
    on: _(function (e, t, r) {
      const n = this.e || (this.e = {})
      return (n[e] || (n[e] = [])).push({ fn: t, ctx: r }), this
    }, 'on'),
    once: _(function (e, t, r) {
      const n = this
      function i() {
        n.off(e, i), t.apply(r, arguments)
      }
      return _(i, 'listener'), (i._ = t), this.on(e, i, r)
    }, 'once'),
    emit: _(function (e) {
      let t = [].slice.call(arguments, 1),
        r = ((this.e || (this.e = {}))[e] || []).slice(),
        n = 0,
        i = r.length
      for (n; n < i; n++)
        try {
          r[n].fn.apply(r[n].ctx, t)
        } catch (o) {
          console.error(
            "event listener for event '" + String(e) + "' threw an error:",
            o,
            r[n].fn
          )
        }
      return this
    }, 'emit'),
    off: _(function (e, t) {
      const r = this.e || (this.e = {}),
        n = r[e],
        i = []
      if (n && t)
        for (let o = 0, a = n.length; o < a; o++)
          n[o].fn !== t && n[o].fn._ !== t && i.push(n[o])
      return i.length ? (r[e] = i) : delete r[e], this
    }, 'off'),
  }
  Z.exports = X
  Z.exports.TinyEmitter = X
})
function u(e, t, r, n) {
  if (r === 'a' && !n)
    throw new TypeError('Private accessor was defined without a getter')
  if (typeof t == 'function' ? e !== t || !n : !t.has(e))
    throw new TypeError(
      'Cannot read private member from an object whose class did not declare it'
    )
  return r === 'm' ? n : r === 'a' ? n.call(e) : n ? n.value : t.get(e)
}
_(u, '__classPrivateFieldGet')
function g(e, t, r, n, i) {
  if (n === 'm') throw new TypeError('Private method is not writable')
  if (n === 'a' && !i)
    throw new TypeError('Private accessor was defined without a setter')
  if (typeof t == 'function' ? e !== t || !i : !t.has(e))
    throw new TypeError(
      'Cannot write private member to an object whose class did not declare it'
    )
  return n === 'a' ? i.call(e, r) : i ? (i.value = r) : t.set(e, r), r
}
_(g, '__classPrivateFieldSet')
let S,
  d,
  f,
  H,
  G,
  c = '__TAURI_TO_IPC_KEY__'
function q(e, t = !1) {
  return window.__TAURI_INTERNALS__.transformCallback(e, t)
}
_(q, 'transformCallback')
const M = class {
  static {
    _(this, 'Channel')
  }
  constructor(t) {
    S.set(this, void 0),
      d.set(this, 0),
      f.set(this, []),
      H.set(this, void 0),
      g(this, S, t || (() => {}), 'f'),
      (this.id = q(r => {
        const n = r.index
        if ('end' in r) {
          n == u(this, d, 'f') ? this.cleanupCallback() : g(this, H, n, 'f')
          return
        }
        const i = r.message
        if (n == u(this, d, 'f')) {
          for (
            u(this, S, 'f').call(this, i), g(this, d, u(this, d, 'f') + 1, 'f');
            u(this, d, 'f') in u(this, f, 'f');

          ) {
            const o = u(this, f, 'f')[u(this, d, 'f')]
            u(this, S, 'f').call(this, o),
              delete u(this, f, 'f')[u(this, d, 'f')],
              g(this, d, u(this, d, 'f') + 1, 'f')
          }
          u(this, d, 'f') === u(this, H, 'f') && this.cleanupCallback()
        } else u(this, f, 'f')[n] = i
      }))
  }
  cleanupCallback() {
    Reflect.deleteProperty(window, `_${this.id}`)
  }
  set onmessage(t) {
    g(this, S, t, 'f')
  }
  get onmessage() {
    return u(this, S, 'f')
  }
  [((S = new WeakMap()),
  (d = new WeakMap()),
  (f = new WeakMap()),
  (H = new WeakMap()),
  c)]() {
    return `__CHANNEL__:${this.id}`
  }
  toJSON() {
    return this[c]()
  }
}
async function s(e, t = {}, r) {
  return window.__TAURI_INTERNALS__.invoke(e, t, r)
}
_(s, 'invoke')
const I = class {
  static {
    _(this, 'Resource')
  }
  get rid() {
    return u(this, G, 'f')
  }
  constructor(t) {
    G.set(this, void 0), g(this, G, t, 'f')
  }
  async close() {
    return s('plugin:resources|close', { rid: this.rid })
  }
}
G = new WeakMap()
var L = class {
    static {
      _(this, 'LogicalSize')
    }
    constructor(...t) {
      ;(this.type = 'Logical'),
        t.length === 1
          ? 'Logical' in t[0]
            ? ((this.width = t[0].Logical.width),
              (this.height = t[0].Logical.height))
            : ((this.width = t[0].width), (this.height = t[0].height))
          : ((this.width = t[0]), (this.height = t[1]))
    }
    toPhysical(t) {
      return new R(this.width * t, this.height * t)
    }
    [c]() {
      return { width: this.width, height: this.height }
    }
    toJSON() {
      return this[c]()
    }
  },
  R = class {
    static {
      _(this, 'PhysicalSize')
    }
    constructor(...t) {
      ;(this.type = 'Physical'),
        t.length === 1
          ? 'Physical' in t[0]
            ? ((this.width = t[0].Physical.width),
              (this.height = t[0].Physical.height))
            : ((this.width = t[0].width), (this.height = t[0].height))
          : ((this.width = t[0]), (this.height = t[1]))
    }
    toLogical(t) {
      return new L(this.width / t, this.height / t)
    }
    [c]() {
      return { width: this.width, height: this.height }
    }
    toJSON() {
      return this[c]()
    }
  },
  p = class {
    static {
      _(this, 'Size')
    }
    constructor(t) {
      this.size = t
    }
    toLogical(t) {
      return this.size instanceof L ? this.size : this.size.toLogical(t)
    }
    toPhysical(t) {
      return this.size instanceof R ? this.size : this.size.toPhysical(t)
    }
    [c]() {
      return {
        [`${this.size.type}`]: {
          width: this.size.width,
          height: this.size.height,
        },
      }
    }
    toJSON() {
      return this[c]()
    }
  },
  P = class {
    static {
      _(this, 'LogicalPosition')
    }
    constructor(...t) {
      ;(this.type = 'Logical'),
        t.length === 1
          ? 'Logical' in t[0]
            ? ((this.x = t[0].Logical.x), (this.y = t[0].Logical.y))
            : ((this.x = t[0].x), (this.y = t[0].y))
          : ((this.x = t[0]), (this.y = t[1]))
    }
    toPhysical(t) {
      return new T(this.x * t, this.y * t)
    }
    [c]() {
      return { x: this.x, y: this.y }
    }
    toJSON() {
      return this[c]()
    }
  },
  T = class {
    static {
      _(this, 'PhysicalPosition')
    }
    constructor(...t) {
      ;(this.type = 'Physical'),
        t.length === 1
          ? 'Physical' in t[0]
            ? ((this.x = t[0].Physical.x), (this.y = t[0].Physical.y))
            : ((this.x = t[0].x), (this.y = t[0].y))
          : ((this.x = t[0]), (this.y = t[1]))
    }
    toLogical(t) {
      return new P(this.x / t, this.y / t)
    }
    [c]() {
      return { x: this.x, y: this.y }
    }
    toJSON() {
      return this[c]()
    }
  },
  m = class {
    static {
      _(this, 'Position')
    }
    constructor(t) {
      this.position = t
    }
    toLogical(t) {
      return this.position instanceof P
        ? this.position
        : this.position.toLogical(t)
    }
    toPhysical(t) {
      return this.position instanceof T
        ? this.position
        : this.position.toPhysical(t)
    }
    [c]() {
      return {
        [`${this.position.type}`]: { x: this.position.x, y: this.position.y },
      }
    }
    toJSON() {
      return this[c]()
    }
  }
let h
;(function (e) {
  ;(e.WINDOW_RESIZED = 'tauri://resize'),
    (e.WINDOW_MOVED = 'tauri://move'),
    (e.WINDOW_CLOSE_REQUESTED = 'tauri://close-requested'),
    (e.WINDOW_DESTROYED = 'tauri://destroyed'),
    (e.WINDOW_FOCUS = 'tauri://focus'),
    (e.WINDOW_BLUR = 'tauri://blur'),
    (e.WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change'),
    (e.WINDOW_THEME_CHANGED = 'tauri://theme-changed'),
    (e.WINDOW_CREATED = 'tauri://window-created'),
    (e.WEBVIEW_CREATED = 'tauri://webview-created'),
    (e.DRAG_ENTER = 'tauri://drag-enter'),
    (e.DRAG_OVER = 'tauri://drag-over'),
    (e.DRAG_DROP = 'tauri://drag-drop'),
    (e.DRAG_LEAVE = 'tauri://drag-leave')
})(h || (h = {}))
async function ht(e, t) {
  await s('plugin:event|unlisten', { event: e, eventId: t })
}
_(ht, '_unlisten')
async function C(e, t, r) {
  let n
  const i =
    typeof r?.target == 'string'
      ? { kind: 'AnyLabel', label: r.target }
      : (n = r?.target) !== null && n !== void 0
        ? n
        : { kind: 'Any' }
  return s('plugin:event|listen', { event: e, target: i, handler: q(t) }).then(
    o => async () => ht(e, o)
  )
}
_(C, 'listen')
async function Et(e, t, r) {
  return C(
    e,
    n => {
      ht(e, n.id), t(n)
    },
    r
  )
}
_(Et, 'once')
async function dt(e, t) {
  await s('plugin:event|emit', { event: e, payload: t })
}
_(dt, 'emit')
async function Tt(e, t, r) {
  await s('plugin:event|emit_to', {
    target: typeof e == 'string' ? { kind: 'AnyLabel', label: e } : e,
    event: t,
    payload: r,
  })
}
_(Tt, 'emitTo')
const B = class e extends I {
  static {
    _(this, 'Image')
  }
  constructor(t) {
    super(t)
  }
  static async new(t, r, n) {
    return s('plugin:image|new', { rgba: w(t), width: r, height: n }).then(
      i => new e(i)
    )
  }
  static async fromBytes(t) {
    return s('plugin:image|from_bytes', { bytes: w(t) }).then(r => new e(r))
  }
  static async fromPath(t) {
    return s('plugin:image|from_path', { path: t }).then(r => new e(r))
  }
  async rgba() {
    return s('plugin:image|rgba', { rid: this.rid }).then(
      t => new Uint8Array(t)
    )
  }
  async size() {
    return s('plugin:image|size', { rid: this.rid })
  }
}
function w(e) {
  return e == null
    ? null
    : typeof e == 'string'
      ? e
      : e instanceof B
        ? e.rid
        : e
}
_(w, 'transformImage')
let V
;(function (e) {
  ;(e[(e.Critical = 1)] = 'Critical'),
    (e[(e.Informational = 2)] = 'Informational')
})(V || (V = {}))
let K = class {
    static {
      _(this, 'CloseRequestedEvent')
    }
    constructor(t) {
      ;(this._preventDefault = !1), (this.event = t.event), (this.id = t.id)
    }
    preventDefault() {
      this._preventDefault = !0
    }
    isPreventDefault() {
      return this._preventDefault
    }
  },
  Dt
;(function (e) {
  ;(e.None = 'none'),
    (e.Normal = 'normal'),
    (e.Indeterminate = 'indeterminate'),
    (e.Paused = 'paused'),
    (e.Error = 'error')
})(Dt || (Dt = {}))
function z() {
  return new Y(window.__TAURI_INTERNALS__.metadata.currentWindow.label, {
    skip: !0,
  })
}
_(z, 'getCurrentWindow')
async function F() {
  return s('plugin:window|get_all_windows').then(e =>
    e.map(t => new Y(t, { skip: !0 }))
  )
}
_(F, 'getAllWindows')
var W = ['tauri://created', 'tauri://error'],
  Y = class {
    static {
      _(this, 'Window')
    }
    constructor(t, r = {}) {
      let n
      ;(this.label = t),
        (this.listeners = Object.create(null)),
        r?.skip ||
          s('plugin:window|create', {
            options: {
              ...r,
              parent:
                typeof r.parent == 'string'
                  ? r.parent
                  : (n = r.parent) === null || n === void 0
                    ? void 0
                    : n.label,
              label: t,
            },
          })
            .then(async () => this.emit('tauri://created'))
            .catch(async i => this.emit('tauri://error', i))
    }
    static async getByLabel(t) {
      let r
      return (r = (await F()).find(n => n.label === t)) !== null && r !== void 0
        ? r
        : null
    }
    static getCurrent() {
      return z()
    }
    static async getAll() {
      return F()
    }
    static async getFocusedWindow() {
      for (const t of await F()) if (await t.isFocused()) return t
      return null
    }
    async listen(t, r) {
      return this._handleTauriEvent(t, r)
        ? () => {
            const n = this.listeners[t]
            n.splice(n.indexOf(r), 1)
          }
        : C(t, r, { target: { kind: 'Window', label: this.label } })
    }
    async once(t, r) {
      return this._handleTauriEvent(t, r)
        ? () => {
            const n = this.listeners[t]
            n.splice(n.indexOf(r), 1)
          }
        : Et(t, r, { target: { kind: 'Window', label: this.label } })
    }
    async emit(t, r) {
      if (W.includes(t)) {
        for (const n of this.listeners[t] || [])
          n({ event: t, id: -1, payload: r })
        return
      }
      return dt(t, r)
    }
    async emitTo(t, r, n) {
      if (W.includes(r)) {
        for (const i of this.listeners[r] || [])
          i({ event: r, id: -1, payload: n })
        return
      }
      return Tt(t, r, n)
    }
    _handleTauriEvent(t, r) {
      return W.includes(t)
        ? (t in this.listeners
            ? this.listeners[t].push(r)
            : (this.listeners[t] = [r]),
          !0)
        : !1
    }
    async scaleFactor() {
      return s('plugin:window|scale_factor', { label: this.label })
    }
    async innerPosition() {
      return s('plugin:window|inner_position', { label: this.label }).then(
        t => new T(t)
      )
    }
    async outerPosition() {
      return s('plugin:window|outer_position', { label: this.label }).then(
        t => new T(t)
      )
    }
    async innerSize() {
      return s('plugin:window|inner_size', { label: this.label }).then(
        t => new R(t)
      )
    }
    async outerSize() {
      return s('plugin:window|outer_size', { label: this.label }).then(
        t => new R(t)
      )
    }
    async isFullscreen() {
      return s('plugin:window|is_fullscreen', { label: this.label })
    }
    async isMinimized() {
      return s('plugin:window|is_minimized', { label: this.label })
    }
    async isMaximized() {
      return s('plugin:window|is_maximized', { label: this.label })
    }
    async isFocused() {
      return s('plugin:window|is_focused', { label: this.label })
    }
    async isDecorated() {
      return s('plugin:window|is_decorated', { label: this.label })
    }
    async isResizable() {
      return s('plugin:window|is_resizable', { label: this.label })
    }
    async isMaximizable() {
      return s('plugin:window|is_maximizable', { label: this.label })
    }
    async isMinimizable() {
      return s('plugin:window|is_minimizable', { label: this.label })
    }
    async isClosable() {
      return s('plugin:window|is_closable', { label: this.label })
    }
    async isVisible() {
      return s('plugin:window|is_visible', { label: this.label })
    }
    async title() {
      return s('plugin:window|title', { label: this.label })
    }
    async theme() {
      return s('plugin:window|theme', { label: this.label })
    }
    async isAlwaysOnTop() {
      return s('plugin:window|is_always_on_top', { label: this.label })
    }
    async center() {
      return s('plugin:window|center', { label: this.label })
    }
    async requestUserAttention(t) {
      let r = null
      return (
        t &&
          (t === V.Critical
            ? (r = { type: 'Critical' })
            : (r = { type: 'Informational' })),
        s('plugin:window|request_user_attention', {
          label: this.label,
          value: r,
        })
      )
    }
    async setResizable(t) {
      return s('plugin:window|set_resizable', { label: this.label, value: t })
    }
    async setEnabled(t) {
      return s('plugin:window|set_enabled', { label: this.label, value: t })
    }
    async isEnabled() {
      return s('plugin:window|is_enabled', { label: this.label })
    }
    async setMaximizable(t) {
      return s('plugin:window|set_maximizable', { label: this.label, value: t })
    }
    async setMinimizable(t) {
      return s('plugin:window|set_minimizable', { label: this.label, value: t })
    }
    async setClosable(t) {
      return s('plugin:window|set_closable', { label: this.label, value: t })
    }
    async setTitle(t) {
      return s('plugin:window|set_title', { label: this.label, value: t })
    }
    async maximize() {
      return s('plugin:window|maximize', { label: this.label })
    }
    async unmaximize() {
      return s('plugin:window|unmaximize', { label: this.label })
    }
    async toggleMaximize() {
      return s('plugin:window|toggle_maximize', { label: this.label })
    }
    async minimize() {
      return s('plugin:window|minimize', { label: this.label })
    }
    async unminimize() {
      return s('plugin:window|unminimize', { label: this.label })
    }
    async show() {
      return s('plugin:window|show', { label: this.label })
    }
    async hide() {
      return s('plugin:window|hide', { label: this.label })
    }
    async close() {
      return s('plugin:window|close', { label: this.label })
    }
    async destroy() {
      return s('plugin:window|destroy', { label: this.label })
    }
    async setDecorations(t) {
      return s('plugin:window|set_decorations', { label: this.label, value: t })
    }
    async setShadow(t) {
      return s('plugin:window|set_shadow', { label: this.label, value: t })
    }
    async setEffects(t) {
      return s('plugin:window|set_effects', { label: this.label, value: t })
    }
    async clearEffects() {
      return s('plugin:window|set_effects', { label: this.label, value: null })
    }
    async setAlwaysOnTop(t) {
      return s('plugin:window|set_always_on_top', {
        label: this.label,
        value: t,
      })
    }
    async setAlwaysOnBottom(t) {
      return s('plugin:window|set_always_on_bottom', {
        label: this.label,
        value: t,
      })
    }
    async setContentProtected(t) {
      return s('plugin:window|set_content_protected', {
        label: this.label,
        value: t,
      })
    }
    async setSize(t) {
      return s('plugin:window|set_size', {
        label: this.label,
        value: t instanceof p ? t : new p(t),
      })
    }
    async setMinSize(t) {
      return s('plugin:window|set_min_size', {
        label: this.label,
        value: t instanceof p ? t : t ? new p(t) : null,
      })
    }
    async setMaxSize(t) {
      return s('plugin:window|set_max_size', {
        label: this.label,
        value: t instanceof p ? t : t ? new p(t) : null,
      })
    }
    async setSizeConstraints(t) {
      function r(n) {
        return n ? { Logical: n } : null
      }
      return (
        _(r, 'logical'),
        s('plugin:window|set_size_constraints', {
          label: this.label,
          value: {
            minWidth: r(t?.minWidth),
            minHeight: r(t?.minHeight),
            maxWidth: r(t?.maxWidth),
            maxHeight: r(t?.maxHeight),
          },
        })
      )
    }
    async setPosition(t) {
      return s('plugin:window|set_position', {
        label: this.label,
        value: t instanceof m ? t : new m(t),
      })
    }
    async setFullscreen(t) {
      return s('plugin:window|set_fullscreen', { label: this.label, value: t })
    }
    async setFocus() {
      return s('plugin:window|set_focus', { label: this.label })
    }
    async setIcon(t) {
      return s('plugin:window|set_icon', { label: this.label, value: w(t) })
    }
    async setSkipTaskbar(t) {
      return s('plugin:window|set_skip_taskbar', {
        label: this.label,
        value: t,
      })
    }
    async setCursorGrab(t) {
      return s('plugin:window|set_cursor_grab', { label: this.label, value: t })
    }
    async setCursorVisible(t) {
      return s('plugin:window|set_cursor_visible', {
        label: this.label,
        value: t,
      })
    }
    async setCursorIcon(t) {
      return s('plugin:window|set_cursor_icon', { label: this.label, value: t })
    }
    async setBackgroundColor(t) {
      return s('plugin:window|set_background_color', { color: t })
    }
    async setCursorPosition(t) {
      return s('plugin:window|set_cursor_position', {
        label: this.label,
        value: t instanceof m ? t : new m(t),
      })
    }
    async setIgnoreCursorEvents(t) {
      return s('plugin:window|set_ignore_cursor_events', {
        label: this.label,
        value: t,
      })
    }
    async startDragging() {
      return s('plugin:window|start_dragging', { label: this.label })
    }
    async startResizeDragging(t) {
      return s('plugin:window|start_resize_dragging', {
        label: this.label,
        value: t,
      })
    }
    async setBadgeCount(t) {
      return s('plugin:window|set_badge_count', { label: this.label, value: t })
    }
    async setBadgeLabel(t) {
      return s('plugin:window|set_badge_label', { label: this.label, value: t })
    }
    async setOverlayIcon(t) {
      return s('plugin:window|set_overlay_icon', {
        label: this.label,
        value: t ? w(t) : void 0,
      })
    }
    async setProgressBar(t) {
      return s('plugin:window|set_progress_bar', {
        label: this.label,
        value: t,
      })
    }
    async setVisibleOnAllWorkspaces(t) {
      return s('plugin:window|set_visible_on_all_workspaces', {
        label: this.label,
        value: t,
      })
    }
    async setTitleBarStyle(t) {
      return s('plugin:window|set_title_bar_style', {
        label: this.label,
        value: t,
      })
    }
    async setTheme(t) {
      return s('plugin:window|set_theme', { label: this.label, value: t })
    }
    async onResized(t) {
      return this.listen(h.WINDOW_RESIZED, r => {
        ;(r.payload = new R(r.payload)), t(r)
      })
    }
    async onMoved(t) {
      return this.listen(h.WINDOW_MOVED, r => {
        ;(r.payload = new T(r.payload)), t(r)
      })
    }
    async onCloseRequested(t) {
      return this.listen(h.WINDOW_CLOSE_REQUESTED, async r => {
        const n = new K(r)
        await t(n), n.isPreventDefault() || (await this.destroy())
      })
    }
    async onDragDropEvent(t) {
      const r = await this.listen(h.DRAG_ENTER, a => {
          t({
            ...a,
            payload: {
              type: 'enter',
              paths: a.payload.paths,
              position: new T(a.payload.position),
            },
          })
        }),
        n = await this.listen(h.DRAG_OVER, a => {
          t({
            ...a,
            payload: { type: 'over', position: new T(a.payload.position) },
          })
        }),
        i = await this.listen(h.DRAG_DROP, a => {
          t({
            ...a,
            payload: {
              type: 'drop',
              paths: a.payload.paths,
              position: new T(a.payload.position),
            },
          })
        }),
        o = await this.listen(h.DRAG_LEAVE, a => {
          t({ ...a, payload: { type: 'leave' } })
        })
      return () => {
        r(), i(), n(), o()
      }
    }
    async onFocusChanged(t) {
      const r = await this.listen(h.WINDOW_FOCUS, i => {
          t({ ...i, payload: !0 })
        }),
        n = await this.listen(h.WINDOW_BLUR, i => {
          t({ ...i, payload: !1 })
        })
      return () => {
        r(), n()
      }
    }
    async onScaleChanged(t) {
      return this.listen(h.WINDOW_SCALE_FACTOR_CHANGED, t)
    }
    async onThemeChanged(t) {
      return this.listen(h.WINDOW_THEME_CHANGED, t)
    }
  },
  pt
;(function (e) {
  ;(e.Disabled = 'disabled'), (e.Throttle = 'throttle'), (e.Suspend = 'suspend')
})(pt || (pt = {}))
let Rt
;(function (e) {
  ;(e.AppearanceBased = 'appearanceBased'),
    (e.Light = 'light'),
    (e.Dark = 'dark'),
    (e.MediumLight = 'mediumLight'),
    (e.UltraDark = 'ultraDark'),
    (e.Titlebar = 'titlebar'),
    (e.Selection = 'selection'),
    (e.Menu = 'menu'),
    (e.Popover = 'popover'),
    (e.Sidebar = 'sidebar'),
    (e.HeaderView = 'headerView'),
    (e.Sheet = 'sheet'),
    (e.WindowBackground = 'windowBackground'),
    (e.HudWindow = 'hudWindow'),
    (e.FullScreenUI = 'fullScreenUI'),
    (e.Tooltip = 'tooltip'),
    (e.ContentBackground = 'contentBackground'),
    (e.UnderWindowBackground = 'underWindowBackground'),
    (e.UnderPageBackground = 'underPageBackground'),
    (e.Mica = 'mica'),
    (e.Blur = 'blur'),
    (e.Acrylic = 'acrylic'),
    (e.Tabbed = 'tabbed'),
    (e.TabbedDark = 'tabbedDark'),
    (e.TabbedLight = 'tabbedLight')
})(Rt || (Rt = {}))
let gt
;(function (e) {
  ;(e.FollowsWindowActiveState = 'followsWindowActiveState'),
    (e.Active = 'active'),
    (e.Inactive = 'inactive')
})(gt || (gt = {}))
async function St(e) {
  return await J.get(e)
}
_(St, 'getStore')
var J = class e extends I {
  static {
    _(this, 'Store')
  }
  constructor(t) {
    super(t)
  }
  static async load(t, r) {
    const n = await s('plugin:store|load', { path: t, ...r })
    return new e(n)
  }
  static async get(t) {
    return await s('plugin:store|get_store', { path: t }).then(r =>
      r ? new e(r) : null
    )
  }
  async set(t, r) {
    await s('plugin:store|set', { rid: this.rid, key: t, value: r })
  }
  async get(t) {
    const [r, n] = await s('plugin:store|get', { rid: this.rid, key: t })
    return n ? r : void 0
  }
  async has(t) {
    return await s('plugin:store|has', { rid: this.rid, key: t })
  }
  async delete(t) {
    return await s('plugin:store|delete', { rid: this.rid, key: t })
  }
  async clear() {
    await s('plugin:store|clear', { rid: this.rid })
  }
  async reset() {
    await s('plugin:store|reset', { rid: this.rid })
  }
  async keys() {
    return await s('plugin:store|keys', { rid: this.rid })
  }
  async values() {
    return await s('plugin:store|values', { rid: this.rid })
  }
  async entries() {
    return await s('plugin:store|entries', { rid: this.rid })
  }
  async length() {
    return await s('plugin:store|length', { rid: this.rid })
  }
  async reload() {
    await s('plugin:store|reload', { rid: this.rid })
  }
  async save() {
    await s('plugin:store|save', { rid: this.rid })
  }
  async onKeyChange(t, r) {
    return await C('store://change', n => {
      n.payload.resourceId === this.rid &&
        n.payload.key === t &&
        r(n.payload.exists ? n.payload.value : void 0)
    })
  }
  async onChange(t) {
    return await C('store://change', r => {
      r.payload.resourceId === this.rid &&
        t(r.payload.key, r.payload.exists ? r.payload.value : void 0)
    })
  }
}
async function mt(e, t) {
  await s('plugin:opener|open_url', { url: e, with: t })
}
_(mt, 'openUrl')
async function Q(e, t) {
  await s('plugin:opener|open_path', { path: e, with: t })
}
_(Q, 'openPath')
async function At(e, t) {
  await s('plugin:clipboard-manager|write_text', { label: t?.label, text: e })
}
_(At, 'writeText')
async function ft() {
  return await s('plugin:clipboard-manager|read_text')
}
_(ft, 'readText')
const v = class {
  static {
    _(this, 'RawClient')
  }
  constructor(t) {
    this._transport = t
  }
  sleep(t) {
    return this._transport.request('sleep', [t])
  }
  checkEmailValidity(t) {
    return this._transport.request('check_email_validity', [t])
  }
  getSystemInfo() {
    return this._transport.request('get_system_info', [])
  }
  getNextEvent() {
    return this._transport.request('get_next_event', [])
  }
  addAccount() {
    return this._transport.request('add_account', [])
  }
  migrateAccount(t) {
    return this._transport.request('migrate_account', [t])
  }
  removeAccount(t) {
    return this._transport.request('remove_account', [t])
  }
  getAllAccountIds() {
    return this._transport.request('get_all_account_ids', [])
  }
  selectAccount(t) {
    return this._transport.request('select_account', [t])
  }
  getSelectedAccountId() {
    return this._transport.request('get_selected_account_id', [])
  }
  getAllAccounts() {
    return this._transport.request('get_all_accounts', [])
  }
  startIoForAllAccounts() {
    return this._transport.request('start_io_for_all_accounts', [])
  }
  stopIoForAllAccounts() {
    return this._transport.request('stop_io_for_all_accounts', [])
  }
  accountsBackgroundFetch(t) {
    return this._transport.request('accounts_background_fetch', [t])
  }
  startIo(t) {
    return this._transport.request('start_io', [t])
  }
  stopIo(t) {
    return this._transport.request('stop_io', [t])
  }
  getAccountInfo(t) {
    return this._transport.request('get_account_info', [t])
  }
  getAccountFileSize(t) {
    return this._transport.request('get_account_file_size', [t])
  }
  getProviderInfo(t, r) {
    return this._transport.request('get_provider_info', [t, r])
  }
  isConfigured(t) {
    return this._transport.request('is_configured', [t])
  }
  getInfo(t) {
    return this._transport.request('get_info', [t])
  }
  getBlobDir(t) {
    return this._transport.request('get_blob_dir', [t])
  }
  copyToBlobDir(t, r) {
    return this._transport.request('copy_to_blob_dir', [t, r])
  }
  draftSelfReport(t) {
    return this._transport.request('draft_self_report', [t])
  }
  setConfig(t, r, n) {
    return this._transport.request('set_config', [t, r, n])
  }
  batchSetConfig(t, r) {
    return this._transport.request('batch_set_config', [t, r])
  }
  setConfigFromQr(t, r) {
    return this._transport.request('set_config_from_qr', [t, r])
  }
  checkQr(t, r) {
    return this._transport.request('check_qr', [t, r])
  }
  getConfig(t, r) {
    return this._transport.request('get_config', [t, r])
  }
  batchGetConfig(t, r) {
    return this._transport.request('batch_get_config', [t, r])
  }
  setStockStrings(t) {
    return this._transport.request('set_stock_strings', [t])
  }
  configure(t) {
    return this._transport.request('configure', [t])
  }
  addOrUpdateTransport(t, r) {
    return this._transport.request('add_or_update_transport', [t, r])
  }
  addTransport(t, r) {
    return this._transport.request('add_transport', [t, r])
  }
  addTransportFromQr(t, r) {
    return this._transport.request('add_transport_from_qr', [t, r])
  }
  listTransports(t) {
    return this._transport.request('list_transports', [t])
  }
  deleteTransport(t, r) {
    return this._transport.request('delete_transport', [t, r])
  }
  stopOngoingProcess(t) {
    return this._transport.request('stop_ongoing_process', [t])
  }
  exportSelfKeys(t, r, n) {
    return this._transport.request('export_self_keys', [t, r, n])
  }
  importSelfKeys(t, r, n) {
    return this._transport.request('import_self_keys', [t, r, n])
  }
  getFreshMsgs(t) {
    return this._transport.request('get_fresh_msgs', [t])
  }
  getFreshMsgCnt(t, r) {
    return this._transport.request('get_fresh_msg_cnt', [t, r])
  }
  getNextMsgs(t) {
    return this._transport.request('get_next_msgs', [t])
  }
  waitNextMsgs(t) {
    return this._transport.request('wait_next_msgs', [t])
  }
  estimateAutoDeletionCount(t, r, n) {
    return this._transport.request('estimate_auto_deletion_count', [t, r, n])
  }
  initiateAutocryptKeyTransfer(t) {
    return this._transport.request('initiate_autocrypt_key_transfer', [t])
  }
  continueAutocryptKeyTransfer(t, r, n) {
    return this._transport.request('continue_autocrypt_key_transfer', [t, r, n])
  }
  getChatlistEntries(t, r, n, i) {
    return this._transport.request('get_chatlist_entries', [t, r, n, i])
  }
  getSimilarChatIds(t, r) {
    return this._transport.request('get_similar_chat_ids', [t, r])
  }
  getChatlistItemsByEntries(t, r) {
    return this._transport.request('get_chatlist_items_by_entries', [t, r])
  }
  getFullChatById(t, r) {
    return this._transport.request('get_full_chat_by_id', [t, r])
  }
  getBasicChatInfo(t, r) {
    return this._transport.request('get_basic_chat_info', [t, r])
  }
  acceptChat(t, r) {
    return this._transport.request('accept_chat', [t, r])
  }
  blockChat(t, r) {
    return this._transport.request('block_chat', [t, r])
  }
  deleteChat(t, r) {
    return this._transport.request('delete_chat', [t, r])
  }
  getChatEncryptionInfo(t, r) {
    return this._transport.request('get_chat_encryption_info', [t, r])
  }
  getChatSecurejoinQrCode(t, r) {
    return this._transport.request('get_chat_securejoin_qr_code', [t, r])
  }
  getChatSecurejoinQrCodeSvg(t, r) {
    return this._transport.request('get_chat_securejoin_qr_code_svg', [t, r])
  }
  secureJoin(t, r) {
    return this._transport.request('secure_join', [t, r])
  }
  leaveGroup(t, r) {
    return this._transport.request('leave_group', [t, r])
  }
  removeContactFromChat(t, r, n) {
    return this._transport.request('remove_contact_from_chat', [t, r, n])
  }
  addContactToChat(t, r, n) {
    return this._transport.request('add_contact_to_chat', [t, r, n])
  }
  getChatContacts(t, r) {
    return this._transport.request('get_chat_contacts', [t, r])
  }
  getPastChatContacts(t, r) {
    return this._transport.request('get_past_chat_contacts', [t, r])
  }
  createGroupChat(t, r, n) {
    return this._transport.request('create_group_chat', [t, r, n])
  }
  createBroadcastList(t) {
    return this._transport.request('create_broadcast_list', [t])
  }
  setChatName(t, r, n) {
    return this._transport.request('set_chat_name', [t, r, n])
  }
  setChatProfileImage(t, r, n) {
    return this._transport.request('set_chat_profile_image', [t, r, n])
  }
  setChatVisibility(t, r, n) {
    return this._transport.request('set_chat_visibility', [t, r, n])
  }
  setChatEphemeralTimer(t, r, n) {
    return this._transport.request('set_chat_ephemeral_timer', [t, r, n])
  }
  getChatEphemeralTimer(t, r) {
    return this._transport.request('get_chat_ephemeral_timer', [t, r])
  }
  addDeviceMessage(t, r, n) {
    return this._transport.request('add_device_message', [t, r, n])
  }
  marknoticedChat(t, r) {
    return this._transport.request('marknoticed_chat', [t, r])
  }
  getFirstUnreadMessageOfChat(t, r) {
    return this._transport.request('get_first_unread_message_of_chat', [t, r])
  }
  setChatMuteDuration(t, r, n) {
    return this._transport.request('set_chat_mute_duration', [t, r, n])
  }
  isChatMuted(t, r) {
    return this._transport.request('is_chat_muted', [t, r])
  }
  markseenMsgs(t, r) {
    return this._transport.request('markseen_msgs', [t, r])
  }
  getMessageIds(t, r, n, i) {
    return this._transport.request('get_message_ids', [t, r, n, i])
  }
  getMessageListItems(t, r, n, i) {
    return this._transport.request('get_message_list_items', [t, r, n, i])
  }
  getMessage(t, r) {
    return this._transport.request('get_message', [t, r])
  }
  getMessageHtml(t, r) {
    return this._transport.request('get_message_html', [t, r])
  }
  getMessages(t, r) {
    return this._transport.request('get_messages', [t, r])
  }
  getMessageNotificationInfo(t, r) {
    return this._transport.request('get_message_notification_info', [t, r])
  }
  deleteMessages(t, r) {
    return this._transport.request('delete_messages', [t, r])
  }
  deleteMessagesForAll(t, r) {
    return this._transport.request('delete_messages_for_all', [t, r])
  }
  getMessageInfo(t, r) {
    return this._transport.request('get_message_info', [t, r])
  }
  getMessageInfoObject(t, r) {
    return this._transport.request('get_message_info_object', [t, r])
  }
  getMessageReadReceipts(t, r) {
    return this._transport.request('get_message_read_receipts', [t, r])
  }
  downloadFullMessage(t, r) {
    return this._transport.request('download_full_message', [t, r])
  }
  searchMessages(t, r, n) {
    return this._transport.request('search_messages', [t, r, n])
  }
  messageIdsToSearchResults(t, r) {
    return this._transport.request('message_ids_to_search_results', [t, r])
  }
  saveMsgs(t, r) {
    return this._transport.request('save_msgs', [t, r])
  }
  getContact(t, r) {
    return this._transport.request('get_contact', [t, r])
  }
  createContact(t, r, n) {
    return this._transport.request('create_contact', [t, r, n])
  }
  createChatByContactId(t, r) {
    return this._transport.request('create_chat_by_contact_id', [t, r])
  }
  blockContact(t, r) {
    return this._transport.request('block_contact', [t, r])
  }
  unblockContact(t, r) {
    return this._transport.request('unblock_contact', [t, r])
  }
  getBlockedContacts(t) {
    return this._transport.request('get_blocked_contacts', [t])
  }
  getContactIds(t, r, n) {
    return this._transport.request('get_contact_ids', [t, r, n])
  }
  getContacts(t, r, n) {
    return this._transport.request('get_contacts', [t, r, n])
  }
  getContactsByIds(t, r) {
    return this._transport.request('get_contacts_by_ids', [t, r])
  }
  deleteContact(t, r) {
    return this._transport.request('delete_contact', [t, r])
  }
  resetContactEncryption(t, r) {
    return this._transport.request('reset_contact_encryption', [t, r])
  }
  changeContactName(t, r, n) {
    return this._transport.request('change_contact_name', [t, r, n])
  }
  getContactEncryptionInfo(t, r) {
    return this._transport.request('get_contact_encryption_info', [t, r])
  }
  lookupContactIdByAddr(t, r) {
    return this._transport.request('lookup_contact_id_by_addr', [t, r])
  }
  parseVcard(t) {
    return this._transport.request('parse_vcard', [t])
  }
  importVcard(t, r) {
    return this._transport.request('import_vcard', [t, r])
  }
  importVcardContents(t, r) {
    return this._transport.request('import_vcard_contents', [t, r])
  }
  makeVcard(t, r) {
    return this._transport.request('make_vcard', [t, r])
  }
  setDraftVcard(t, r, n) {
    return this._transport.request('set_draft_vcard', [t, r, n])
  }
  getChatIdByContactId(t, r) {
    return this._transport.request('get_chat_id_by_contact_id', [t, r])
  }
  getChatMedia(t, r, n, i, o) {
    return this._transport.request('get_chat_media', [t, r, n, i, o])
  }
  exportBackup(t, r, n) {
    return this._transport.request('export_backup', [t, r, n])
  }
  importBackup(t, r, n) {
    return this._transport.request('import_backup', [t, r, n])
  }
  provideBackup(t) {
    return this._transport.request('provide_backup', [t])
  }
  getBackupQr(t) {
    return this._transport.request('get_backup_qr', [t])
  }
  getBackupQrSvg(t) {
    return this._transport.request('get_backup_qr_svg', [t])
  }
  getBackup(t, r) {
    return this._transport.request('get_backup', [t, r])
  }
  maybeNetwork() {
    return this._transport.request('maybe_network', [])
  }
  getConnectivity(t) {
    return this._transport.request('get_connectivity', [t])
  }
  getConnectivityHtml(t) {
    return this._transport.request('get_connectivity_html', [t])
  }
  getLocations(t, r, n, i, o) {
    return this._transport.request('get_locations', [t, r, n, i, o])
  }
  sendWebxdcStatusUpdate(t, r, n, i) {
    return this._transport.request('send_webxdc_status_update', [t, r, n, i])
  }
  sendWebxdcRealtimeData(t, r, n) {
    return this._transport.request('send_webxdc_realtime_data', [t, r, n])
  }
  sendWebxdcRealtimeAdvertisement(t, r) {
    return this._transport.request('send_webxdc_realtime_advertisement', [t, r])
  }
  leaveWebxdcRealtime(t, r) {
    return this._transport.request('leave_webxdc_realtime', [t, r])
  }
  getWebxdcStatusUpdates(t, r, n) {
    return this._transport.request('get_webxdc_status_updates', [t, r, n])
  }
  getWebxdcInfo(t, r) {
    return this._transport.request('get_webxdc_info', [t, r])
  }
  getWebxdcHref(t, r) {
    return this._transport.request('get_webxdc_href', [t, r])
  }
  getWebxdcBlob(t, r, n) {
    return this._transport.request('get_webxdc_blob', [t, r, n])
  }
  setWebxdcIntegration(t, r) {
    return this._transport.request('set_webxdc_integration', [t, r])
  }
  initWebxdcIntegration(t, r) {
    return this._transport.request('init_webxdc_integration', [t, r])
  }
  getHttpResponse(t, r) {
    return this._transport.request('get_http_response', [t, r])
  }
  forwardMessages(t, r, n) {
    return this._transport.request('forward_messages', [t, r, n])
  }
  resendMessages(t, r) {
    return this._transport.request('resend_messages', [t, r])
  }
  sendSticker(t, r, n) {
    return this._transport.request('send_sticker', [t, r, n])
  }
  sendReaction(t, r, n) {
    return this._transport.request('send_reaction', [t, r, n])
  }
  getMessageReactions(t, r) {
    return this._transport.request('get_message_reactions', [t, r])
  }
  sendMsg(t, r, n) {
    return this._transport.request('send_msg', [t, r, n])
  }
  sendEditRequest(t, r, n) {
    return this._transport.request('send_edit_request', [t, r, n])
  }
  canSend(t, r) {
    return this._transport.request('can_send', [t, r])
  }
  saveMsgFile(t, r, n) {
    return this._transport.request('save_msg_file', [t, r, n])
  }
  removeDraft(t, r) {
    return this._transport.request('remove_draft', [t, r])
  }
  getDraft(t, r) {
    return this._transport.request('get_draft', [t, r])
  }
  sendVideochatInvitation(t, r) {
    return this._transport.request('send_videochat_invitation', [t, r])
  }
  miscGetStickerFolder(t) {
    return this._transport.request('misc_get_sticker_folder', [t])
  }
  miscSaveSticker(t, r, n) {
    return this._transport.request('misc_save_sticker', [t, r, n])
  }
  miscGetStickers(t) {
    return this._transport.request('misc_get_stickers', [t])
  }
  miscSendTextMessage(t, r, n) {
    return this._transport.request('misc_send_text_message', [t, r, n])
  }
  miscSendMsg(t, r, n, i, o, a, E) {
    return this._transport.request('misc_send_msg', [t, r, n, i, o, a, E])
  }
  miscSetDraft(t, r, n, i, o, a, E) {
    return this._transport.request('misc_set_draft', [t, r, n, i, o, a, E])
  }
  miscSendDraft(t, r) {
    return this._transport.request('misc_send_draft', [t, r])
  }
}
const x = {}
Bt(x, { BaseTransport: () => b, WebsocketTransport: () => j })
const O = class {
  static {
    _(this, 'Emitter')
  }
  constructor() {
    this.e = new Map()
  }
  on(t, r, n) {
    return this._on(t, r, n)
  }
  _on(t, r, n) {
    const i = { callback: r, ctx: n }
    return this.e.has(t) || this.e.set(t, []), this.e.get(t).push(i), this
  }
  once(t, r, n) {
    const i = _((...o) => {
      this.off(t, r), r.apply(n, o)
    }, 'listener')
    this._on(t, i, n)
  }
  emit(t, ...r) {
    if (this.e.has(t))
      return (
        this.e.get(t).forEach(n => {
          n.callback.apply(n.ctx, r)
        }),
        this
      )
  }
  off(t, r) {
    if (!this.e.has(t)) return
    const i = this.e.get(t).filter(o => o.callback !== r)
    return i.length ? this.e.set(t, i) : this.e.delete(t), this
  }
}
var b = class extends O {
  static {
    _(this, 'BaseTransport')
  }
  constructor() {
    super(...arguments), (this._requests = new Map()), (this._requestId = 0)
  }
  _send(t) {
    throw new Error('_send method not implemented')
  }
  close() {}
  _onmessage(t) {
    if (t.method) {
      const i = t
      this.emit('request', i)
    }
    if (!t.id) return
    const r = t
    if (!r.id) return
    const n = this._requests.get(r.id)
    n &&
      (this._requests.delete(r.id),
      r.error ? n.reject(r.error) : n.resolve(r.result))
  }
  notification(t, r) {
    const n = { jsonrpc: '2.0', method: t, id: 0, params: r }
    this._send(n)
  }
  request(t, r) {
    const n = ++this._requestId,
      i = { jsonrpc: '2.0', method: t, id: n, params: r }
    return (
      this._send(i),
      new Promise((o, a) => {
        this._requests.set(n, { resolve: o, reject: a })
      })
    )
  }
}
const wt = ct(Ct(), 1)
var j = class extends b {
    static {
      _(this, 'WebsocketTransport')
    }
    get reconnectAttempts() {
      return this._socket.reconnectAttempts
    }
    get connected() {
      return this._socket.connected
    }
    constructor(t, r) {
      super(), (this.url = t)
      const n = _(i => {
        const o = JSON.parse(i.data)
        this._onmessage(o)
      }, 'onmessage')
      ;(this._socket = new $(t, n, r)),
        this._socket.on('connect', () => this.emit('connect')),
        this._socket.on('disconnect', () => this.emit('disconnect')),
        this._socket.on('error', i => this.emit('error', i))
    }
    _send(t) {
      const r = JSON.stringify(t)
      this._socket.send(r)
    }
    close() {
      this._socket.close()
    }
  },
  $ = class extends O {
    static {
      _(this, 'ReconnectingWebsocket')
    }
    constructor(t, r, n) {
      super(),
        (this.url = t),
        (this.preopenQueue = []),
        (this._connected = !1),
        (this._reconnectAttempts = 0),
        (this.closed = !1),
        (this.options = Object.assign(
          {
            reconnectDecay: 1.5,
            reconnectInterval: 1e3,
            maxReconnectInterval: 1e4,
          },
          n
        )),
        (this.onmessage = r),
        this._reconnect()
    }
    get reconnectAttempts() {
      return this._reconnectAttempts
    }
    _reconnect() {
      if (this.closed) return
      let t
      ;(this.ready = new Promise(r => (t = r))),
        (this.socket = new wt.default(this.url)),
        (this.socket.onmessage = this.onmessage.bind(this)),
        (this.socket.onopen = r => {
          for (
            this._reconnectAttempts = 0, this._connected = !0;
            this.preopenQueue.length;

          )
            this.socket.send(this.preopenQueue.shift())
          this.emit('connect'), t()
        }),
        (this.socket.onerror = r => {
          this.emit('error', r)
        }),
        (this.socket.onclose = r => {
          ;(this._connected = !1), this.emit('disconnect')
          const n = Math.min(
            this.options.reconnectInterval *
              Math.pow(this.options.reconnectDecay, this._reconnectAttempts),
            this.options.maxReconnectInterval
          )
          setTimeout(() => {
            ;(this._reconnectAttempts += 1), this._reconnect()
          }, n)
        })
    }
    get connected() {
      return this._connected
    }
    send(t) {
      this.connected ? this.socket.send(t) : this.preopenQueue.push(t)
    }
    close() {
      ;(this.closed = !0), this.socket.close()
    }
  }
const tt = ct(Ot(), 1)
const k = class extends tt.TinyEmitter {
  static {
    _(this, 'BaseDeltaChat')
  }
  constructor(t, r) {
    super(),
      (this.transport = t),
      (this.contextEmitters = {}),
      (this.rpc = new v(this.transport)),
      r && (this.eventTask = this.eventLoop())
  }
  async eventLoop() {
    for (;;) {
      const t = await this.rpc.getNextEvent()
      this.emit(t.event.kind, t.contextId, t.event),
        this.emit('ALL', t.contextId, t.event),
        this.contextEmitters[t.contextId] &&
          (this.contextEmitters[t.contextId].emit(t.event.kind, t.event),
          this.contextEmitters[t.contextId].emit('ALL', t.event))
    }
  }
  async listAccounts() {
    return await this.rpc.getAllAccounts()
  }
  getContextEvents(t) {
    return this.contextEmitters[t]
      ? this.contextEmitters[t]
      : ((this.contextEmitters[t] = new tt.TinyEmitter()),
        this.contextEmitters[t])
  }
}
let et
;(function (e) {
  ;(e[(e.DC_CERTCK_ACCEPT_INVALID = 2)] = 'DC_CERTCK_ACCEPT_INVALID'),
    (e[(e.DC_CERTCK_ACCEPT_INVALID_CERTIFICATES = 3)] =
      'DC_CERTCK_ACCEPT_INVALID_CERTIFICATES'),
    (e[(e.DC_CERTCK_AUTO = 0)] = 'DC_CERTCK_AUTO'),
    (e[(e.DC_CERTCK_STRICT = 1)] = 'DC_CERTCK_STRICT'),
    (e[(e.DC_CHAT_ID_ALLDONE_HINT = 7)] = 'DC_CHAT_ID_ALLDONE_HINT'),
    (e[(e.DC_CHAT_ID_ARCHIVED_LINK = 6)] = 'DC_CHAT_ID_ARCHIVED_LINK'),
    (e[(e.DC_CHAT_ID_LAST_SPECIAL = 9)] = 'DC_CHAT_ID_LAST_SPECIAL'),
    (e[(e.DC_CHAT_ID_TRASH = 3)] = 'DC_CHAT_ID_TRASH'),
    (e[(e.DC_CHAT_TYPE_BROADCAST = 160)] = 'DC_CHAT_TYPE_BROADCAST'),
    (e[(e.DC_CHAT_TYPE_GROUP = 120)] = 'DC_CHAT_TYPE_GROUP'),
    (e[(e.DC_CHAT_TYPE_MAILINGLIST = 140)] = 'DC_CHAT_TYPE_MAILINGLIST'),
    (e[(e.DC_CHAT_TYPE_SINGLE = 100)] = 'DC_CHAT_TYPE_SINGLE'),
    (e[(e.DC_CHAT_TYPE_UNDEFINED = 0)] = 'DC_CHAT_TYPE_UNDEFINED'),
    (e[(e.DC_CONNECTIVITY_CONNECTED = 4e3)] = 'DC_CONNECTIVITY_CONNECTED'),
    (e[(e.DC_CONNECTIVITY_CONNECTING = 2e3)] = 'DC_CONNECTIVITY_CONNECTING'),
    (e[(e.DC_CONNECTIVITY_NOT_CONNECTED = 1e3)] =
      'DC_CONNECTIVITY_NOT_CONNECTED'),
    (e[(e.DC_CONNECTIVITY_WORKING = 3e3)] = 'DC_CONNECTIVITY_WORKING'),
    (e[(e.DC_CONTACT_ID_DEVICE = 5)] = 'DC_CONTACT_ID_DEVICE'),
    (e[(e.DC_CONTACT_ID_INFO = 2)] = 'DC_CONTACT_ID_INFO'),
    (e[(e.DC_CONTACT_ID_LAST_SPECIAL = 9)] = 'DC_CONTACT_ID_LAST_SPECIAL'),
    (e[(e.DC_CONTACT_ID_SELF = 1)] = 'DC_CONTACT_ID_SELF'),
    (e[(e.DC_GCL_ADD_ALLDONE_HINT = 4)] = 'DC_GCL_ADD_ALLDONE_HINT'),
    (e[(e.DC_GCL_ADD_SELF = 2)] = 'DC_GCL_ADD_SELF'),
    (e[(e.DC_GCL_ARCHIVED_ONLY = 1)] = 'DC_GCL_ARCHIVED_ONLY'),
    (e[(e.DC_GCL_FOR_FORWARDING = 8)] = 'DC_GCL_FOR_FORWARDING'),
    (e[(e.DC_GCL_NO_SPECIALS = 2)] = 'DC_GCL_NO_SPECIALS'),
    (e[(e.DC_GCL_VERIFIED_ONLY = 1)] = 'DC_GCL_VERIFIED_ONLY'),
    (e[(e.DC_GCM_ADDDAYMARKER = 1)] = 'DC_GCM_ADDDAYMARKER'),
    (e[(e.DC_GCM_INFO_ONLY = 2)] = 'DC_GCM_INFO_ONLY'),
    (e[(e.DC_LP_AUTH_NORMAL = 4)] = 'DC_LP_AUTH_NORMAL'),
    (e[(e.DC_LP_AUTH_OAUTH2 = 2)] = 'DC_LP_AUTH_OAUTH2'),
    (e[(e.DC_MEDIA_QUALITY_BALANCED = 0)] = 'DC_MEDIA_QUALITY_BALANCED'),
    (e[(e.DC_MEDIA_QUALITY_WORSE = 1)] = 'DC_MEDIA_QUALITY_WORSE'),
    (e[(e.DC_MSG_ID_DAYMARKER = 9)] = 'DC_MSG_ID_DAYMARKER'),
    (e[(e.DC_MSG_ID_LAST_SPECIAL = 9)] = 'DC_MSG_ID_LAST_SPECIAL'),
    (e[(e.DC_MSG_ID_MARKER1 = 1)] = 'DC_MSG_ID_MARKER1'),
    (e[(e.DC_PROVIDER_STATUS_BROKEN = 3)] = 'DC_PROVIDER_STATUS_BROKEN'),
    (e[(e.DC_PROVIDER_STATUS_OK = 1)] = 'DC_PROVIDER_STATUS_OK'),
    (e[(e.DC_PROVIDER_STATUS_PREPARATION = 2)] =
      'DC_PROVIDER_STATUS_PREPARATION'),
    (e[(e.DC_PUSH_CONNECTED = 2)] = 'DC_PUSH_CONNECTED'),
    (e[(e.DC_PUSH_HEARTBEAT = 1)] = 'DC_PUSH_HEARTBEAT'),
    (e[(e.DC_PUSH_NOT_CONNECTED = 0)] = 'DC_PUSH_NOT_CONNECTED'),
    (e[(e.DC_SHOW_EMAILS_ACCEPTED_CONTACTS = 1)] =
      'DC_SHOW_EMAILS_ACCEPTED_CONTACTS'),
    (e[(e.DC_SHOW_EMAILS_ALL = 2)] = 'DC_SHOW_EMAILS_ALL'),
    (e[(e.DC_SHOW_EMAILS_OFF = 0)] = 'DC_SHOW_EMAILS_OFF'),
    (e[(e.DC_SOCKET_AUTO = 0)] = 'DC_SOCKET_AUTO'),
    (e[(e.DC_SOCKET_PLAIN = 3)] = 'DC_SOCKET_PLAIN'),
    (e[(e.DC_SOCKET_SSL = 1)] = 'DC_SOCKET_SSL'),
    (e[(e.DC_SOCKET_STARTTLS = 2)] = 'DC_SOCKET_STARTTLS'),
    (e[(e.DC_STATE_IN_FRESH = 10)] = 'DC_STATE_IN_FRESH'),
    (e[(e.DC_STATE_IN_NOTICED = 13)] = 'DC_STATE_IN_NOTICED'),
    (e[(e.DC_STATE_IN_SEEN = 16)] = 'DC_STATE_IN_SEEN'),
    (e[(e.DC_STATE_OUT_DELIVERED = 26)] = 'DC_STATE_OUT_DELIVERED'),
    (e[(e.DC_STATE_OUT_DRAFT = 19)] = 'DC_STATE_OUT_DRAFT'),
    (e[(e.DC_STATE_OUT_FAILED = 24)] = 'DC_STATE_OUT_FAILED'),
    (e[(e.DC_STATE_OUT_MDN_RCVD = 28)] = 'DC_STATE_OUT_MDN_RCVD'),
    (e[(e.DC_STATE_OUT_PENDING = 20)] = 'DC_STATE_OUT_PENDING'),
    (e[(e.DC_STATE_OUT_PREPARING = 18)] = 'DC_STATE_OUT_PREPARING'),
    (e[(e.DC_STATE_UNDEFINED = 0)] = 'DC_STATE_UNDEFINED'),
    (e[(e.DC_STR_AC_SETUP_MSG_BODY = 43)] = 'DC_STR_AC_SETUP_MSG_BODY'),
    (e[(e.DC_STR_AC_SETUP_MSG_SUBJECT = 42)] = 'DC_STR_AC_SETUP_MSG_SUBJECT'),
    (e[(e.DC_STR_ADD_MEMBER_BY_OTHER = 129)] = 'DC_STR_ADD_MEMBER_BY_OTHER'),
    (e[(e.DC_STR_ADD_MEMBER_BY_YOU = 128)] = 'DC_STR_ADD_MEMBER_BY_YOU'),
    (e[(e.DC_STR_AEAP_ADDR_CHANGED = 122)] = 'DC_STR_AEAP_ADDR_CHANGED'),
    (e[(e.DC_STR_AEAP_EXPLANATION_AND_LINK = 123)] =
      'DC_STR_AEAP_EXPLANATION_AND_LINK'),
    (e[(e.DC_STR_ARCHIVEDCHATS = 40)] = 'DC_STR_ARCHIVEDCHATS'),
    (e[(e.DC_STR_AUDIO = 11)] = 'DC_STR_AUDIO'),
    (e[(e.DC_STR_BACKUP_TRANSFER_MSG_BODY = 163)] =
      'DC_STR_BACKUP_TRANSFER_MSG_BODY'),
    (e[(e.DC_STR_BACKUP_TRANSFER_QR = 162)] = 'DC_STR_BACKUP_TRANSFER_QR'),
    (e[(e.DC_STR_BAD_TIME_MSG_BODY = 85)] = 'DC_STR_BAD_TIME_MSG_BODY'),
    (e[(e.DC_STR_BROADCAST_LIST = 115)] = 'DC_STR_BROADCAST_LIST'),
    (e[(e.DC_STR_CANNOT_LOGIN = 60)] = 'DC_STR_CANNOT_LOGIN'),
    (e[(e.DC_STR_CANTDECRYPT_MSG_BODY = 29)] = 'DC_STR_CANTDECRYPT_MSG_BODY'),
    (e[(e.DC_STR_CHAT_PROTECTION_DISABLED = 171)] =
      'DC_STR_CHAT_PROTECTION_DISABLED'),
    (e[(e.DC_STR_CHAT_PROTECTION_ENABLED = 170)] =
      'DC_STR_CHAT_PROTECTION_ENABLED'),
    (e[(e.DC_STR_CONFIGURATION_FAILED = 84)] = 'DC_STR_CONFIGURATION_FAILED'),
    (e[(e.DC_STR_CONNECTED = 107)] = 'DC_STR_CONNECTED'),
    (e[(e.DC_STR_CONNTECTING = 108)] = 'DC_STR_CONNTECTING'),
    (e[(e.DC_STR_CONTACT = 200)] = 'DC_STR_CONTACT'),
    (e[(e.DC_STR_CONTACT_NOT_VERIFIED = 36)] = 'DC_STR_CONTACT_NOT_VERIFIED'),
    (e[(e.DC_STR_CONTACT_SETUP_CHANGED = 37)] = 'DC_STR_CONTACT_SETUP_CHANGED'),
    (e[(e.DC_STR_CONTACT_VERIFIED = 35)] = 'DC_STR_CONTACT_VERIFIED'),
    (e[(e.DC_STR_DEVICE_MESSAGES = 68)] = 'DC_STR_DEVICE_MESSAGES'),
    (e[(e.DC_STR_DEVICE_MESSAGES_HINT = 70)] = 'DC_STR_DEVICE_MESSAGES_HINT'),
    (e[(e.DC_STR_DOWNLOAD_AVAILABILITY = 100)] =
      'DC_STR_DOWNLOAD_AVAILABILITY'),
    (e[(e.DC_STR_DRAFT = 3)] = 'DC_STR_DRAFT'),
    (e[(e.DC_STR_E2E_AVAILABLE = 25)] = 'DC_STR_E2E_AVAILABLE'),
    (e[(e.DC_STR_E2E_PREFERRED = 34)] = 'DC_STR_E2E_PREFERRED'),
    (e[(e.DC_STR_ENCRYPTEDMSG = 24)] = 'DC_STR_ENCRYPTEDMSG'),
    (e[(e.DC_STR_ENCR_NONE = 28)] = 'DC_STR_ENCR_NONE'),
    (e[(e.DC_STR_ENCR_TRANSP = 27)] = 'DC_STR_ENCR_TRANSP'),
    (e[(e.DC_STR_EPHEMERAL_DAY = 79)] = 'DC_STR_EPHEMERAL_DAY'),
    (e[(e.DC_STR_EPHEMERAL_DAYS = 95)] = 'DC_STR_EPHEMERAL_DAYS'),
    (e[(e.DC_STR_EPHEMERAL_DISABLED = 75)] = 'DC_STR_EPHEMERAL_DISABLED'),
    (e[(e.DC_STR_EPHEMERAL_FOUR_WEEKS = 81)] = 'DC_STR_EPHEMERAL_FOUR_WEEKS'),
    (e[(e.DC_STR_EPHEMERAL_HOUR = 78)] = 'DC_STR_EPHEMERAL_HOUR'),
    (e[(e.DC_STR_EPHEMERAL_HOURS = 94)] = 'DC_STR_EPHEMERAL_HOURS'),
    (e[(e.DC_STR_EPHEMERAL_MINUTE = 77)] = 'DC_STR_EPHEMERAL_MINUTE'),
    (e[(e.DC_STR_EPHEMERAL_MINUTES = 93)] = 'DC_STR_EPHEMERAL_MINUTES'),
    (e[(e.DC_STR_EPHEMERAL_SECONDS = 76)] = 'DC_STR_EPHEMERAL_SECONDS'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_DAY_BY_OTHER = 147)] =
      'DC_STR_EPHEMERAL_TIMER_1_DAY_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_DAY_BY_YOU = 146)] =
      'DC_STR_EPHEMERAL_TIMER_1_DAY_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_HOUR_BY_OTHER = 145)] =
      'DC_STR_EPHEMERAL_TIMER_1_HOUR_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_HOUR_BY_YOU = 144)] =
      'DC_STR_EPHEMERAL_TIMER_1_HOUR_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_MINUTE_BY_OTHER = 143)] =
      'DC_STR_EPHEMERAL_TIMER_1_MINUTE_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_MINUTE_BY_YOU = 142)] =
      'DC_STR_EPHEMERAL_TIMER_1_MINUTE_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_WEEK_BY_OTHER = 149)] =
      'DC_STR_EPHEMERAL_TIMER_1_WEEK_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_1_WEEK_BY_YOU = 148)] =
      'DC_STR_EPHEMERAL_TIMER_1_WEEK_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_DAYS_BY_OTHER = 155)] =
      'DC_STR_EPHEMERAL_TIMER_DAYS_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_DAYS_BY_YOU = 154)] =
      'DC_STR_EPHEMERAL_TIMER_DAYS_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_DISABLED_BY_OTHER = 139)] =
      'DC_STR_EPHEMERAL_TIMER_DISABLED_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_DISABLED_BY_YOU = 138)] =
      'DC_STR_EPHEMERAL_TIMER_DISABLED_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_HOURS_BY_OTHER = 153)] =
      'DC_STR_EPHEMERAL_TIMER_HOURS_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_HOURS_BY_YOU = 152)] =
      'DC_STR_EPHEMERAL_TIMER_HOURS_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_MINUTES_BY_OTHER = 151)] =
      'DC_STR_EPHEMERAL_TIMER_MINUTES_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_MINUTES_BY_YOU = 150)] =
      'DC_STR_EPHEMERAL_TIMER_MINUTES_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_SECONDS_BY_OTHER = 141)] =
      'DC_STR_EPHEMERAL_TIMER_SECONDS_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_SECONDS_BY_YOU = 140)] =
      'DC_STR_EPHEMERAL_TIMER_SECONDS_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_WEEKS_BY_OTHER = 157)] =
      'DC_STR_EPHEMERAL_TIMER_WEEKS_BY_OTHER'),
    (e[(e.DC_STR_EPHEMERAL_TIMER_WEEKS_BY_YOU = 156)] =
      'DC_STR_EPHEMERAL_TIMER_WEEKS_BY_YOU'),
    (e[(e.DC_STR_EPHEMERAL_WEEK = 80)] = 'DC_STR_EPHEMERAL_WEEK'),
    (e[(e.DC_STR_EPHEMERAL_WEEKS = 96)] = 'DC_STR_EPHEMERAL_WEEKS'),
    (e[(e.DC_STR_ERROR = 112)] = 'DC_STR_ERROR'),
    (e[(e.DC_STR_ERROR_NO_NETWORK = 87)] = 'DC_STR_ERROR_NO_NETWORK'),
    (e[(e.DC_STR_FAILED_SENDING_TO = 74)] = 'DC_STR_FAILED_SENDING_TO'),
    (e[(e.DC_STR_FILE = 12)] = 'DC_STR_FILE'),
    (e[(e.DC_STR_FINGERPRINTS = 30)] = 'DC_STR_FINGERPRINTS'),
    (e[(e.DC_STR_FORWARDED = 97)] = 'DC_STR_FORWARDED'),
    (e[(e.DC_STR_GIF = 23)] = 'DC_STR_GIF'),
    (e[(e.DC_STR_GROUP_IMAGE_CHANGED_BY_OTHER = 127)] =
      'DC_STR_GROUP_IMAGE_CHANGED_BY_OTHER'),
    (e[(e.DC_STR_GROUP_IMAGE_CHANGED_BY_YOU = 126)] =
      'DC_STR_GROUP_IMAGE_CHANGED_BY_YOU'),
    (e[(e.DC_STR_GROUP_IMAGE_DELETED_BY_OTHER = 135)] =
      'DC_STR_GROUP_IMAGE_DELETED_BY_OTHER'),
    (e[(e.DC_STR_GROUP_IMAGE_DELETED_BY_YOU = 134)] =
      'DC_STR_GROUP_IMAGE_DELETED_BY_YOU'),
    (e[(e.DC_STR_GROUP_LEFT_BY_OTHER = 133)] = 'DC_STR_GROUP_LEFT_BY_OTHER'),
    (e[(e.DC_STR_GROUP_LEFT_BY_YOU = 132)] = 'DC_STR_GROUP_LEFT_BY_YOU'),
    (e[(e.DC_STR_GROUP_NAME_CHANGED_BY_OTHER = 125)] =
      'DC_STR_GROUP_NAME_CHANGED_BY_OTHER'),
    (e[(e.DC_STR_GROUP_NAME_CHANGED_BY_YOU = 124)] =
      'DC_STR_GROUP_NAME_CHANGED_BY_YOU'),
    (e[(e.DC_STR_IMAGE = 9)] = 'DC_STR_IMAGE'),
    (e[(e.DC_STR_INCOMING_MESSAGES = 103)] = 'DC_STR_INCOMING_MESSAGES'),
    (e[(e.DC_STR_INVALID_UNENCRYPTED_MAIL = 174)] =
      'DC_STR_INVALID_UNENCRYPTED_MAIL'),
    (e[(e.DC_STR_LAST_MSG_SENT_SUCCESSFULLY = 111)] =
      'DC_STR_LAST_MSG_SENT_SUCCESSFULLY'),
    (e[(e.DC_STR_LOCATION = 66)] = 'DC_STR_LOCATION'),
    (e[(e.DC_STR_LOCATION_ENABLED_BY_OTHER = 137)] =
      'DC_STR_LOCATION_ENABLED_BY_OTHER'),
    (e[(e.DC_STR_LOCATION_ENABLED_BY_YOU = 136)] =
      'DC_STR_LOCATION_ENABLED_BY_YOU'),
    (e[(e.DC_STR_MESSAGES = 114)] = 'DC_STR_MESSAGES'),
    (e[(e.DC_STR_MESSAGE_ADD_MEMBER = 173)] = 'DC_STR_MESSAGE_ADD_MEMBER'),
    (e[(e.DC_STR_MSGACTIONBYME = 63)] = 'DC_STR_MSGACTIONBYME'),
    (e[(e.DC_STR_MSGACTIONBYUSER = 62)] = 'DC_STR_MSGACTIONBYUSER'),
    (e[(e.DC_STR_MSGADDMEMBER = 17)] = 'DC_STR_MSGADDMEMBER'),
    (e[(e.DC_STR_MSGDELMEMBER = 18)] = 'DC_STR_MSGDELMEMBER'),
    (e[(e.DC_STR_MSGGROUPLEFT = 19)] = 'DC_STR_MSGGROUPLEFT'),
    (e[(e.DC_STR_MSGGRPIMGCHANGED = 16)] = 'DC_STR_MSGGRPIMGCHANGED'),
    (e[(e.DC_STR_MSGGRPIMGDELETED = 33)] = 'DC_STR_MSGGRPIMGDELETED'),
    (e[(e.DC_STR_MSGGRPNAME = 15)] = 'DC_STR_MSGGRPNAME'),
    (e[(e.DC_STR_MSGLOCATIONDISABLED = 65)] = 'DC_STR_MSGLOCATIONDISABLED'),
    (e[(e.DC_STR_MSGLOCATIONENABLED = 64)] = 'DC_STR_MSGLOCATIONENABLED'),
    (e[(e.DC_STR_NEW_GROUP_SEND_FIRST_MESSAGE = 172)] =
      'DC_STR_NEW_GROUP_SEND_FIRST_MESSAGE'),
    (e[(e.DC_STR_NOMESSAGES = 1)] = 'DC_STR_NOMESSAGES'),
    (e[(e.DC_STR_NOT_CONNECTED = 121)] = 'DC_STR_NOT_CONNECTED'),
    (e[(e.DC_STR_NOT_SUPPORTED_BY_PROVIDER = 113)] =
      'DC_STR_NOT_SUPPORTED_BY_PROVIDER'),
    (e[(e.DC_STR_ONE_MOMENT = 106)] = 'DC_STR_ONE_MOMENT'),
    (e[(e.DC_STR_OUTGOING_MESSAGES = 104)] = 'DC_STR_OUTGOING_MESSAGES'),
    (e[(e.DC_STR_PARTIAL_DOWNLOAD_MSG_BODY = 99)] =
      'DC_STR_PARTIAL_DOWNLOAD_MSG_BODY'),
    (e[(e.DC_STR_PART_OF_TOTAL_USED = 116)] = 'DC_STR_PART_OF_TOTAL_USED'),
    (e[(e.DC_STR_QUOTA_EXCEEDING_MSG_BODY = 98)] =
      'DC_STR_QUOTA_EXCEEDING_MSG_BODY'),
    (e[(e.DC_STR_REACTED_BY = 177)] = 'DC_STR_REACTED_BY'),
    (e[(e.DC_STR_READRCPT = 31)] = 'DC_STR_READRCPT'),
    (e[(e.DC_STR_READRCPT_MAILBODY = 32)] = 'DC_STR_READRCPT_MAILBODY'),
    (e[(e.DC_STR_REMOVE_MEMBER_BY_OTHER = 131)] =
      'DC_STR_REMOVE_MEMBER_BY_OTHER'),
    (e[(e.DC_STR_REMOVE_MEMBER_BY_YOU = 130)] = 'DC_STR_REMOVE_MEMBER_BY_YOU'),
    (e[(e.DC_STR_REPLY_NOUN = 90)] = 'DC_STR_REPLY_NOUN'),
    (e[(e.DC_STR_SAVED_MESSAGES = 69)] = 'DC_STR_SAVED_MESSAGES'),
    (e[(e.DC_STR_SECUREJOIN_TAKES_LONGER = 192)] =
      'DC_STR_SECUREJOIN_TAKES_LONGER'),
    (e[(e.DC_STR_SECUREJOIN_WAIT = 190)] = 'DC_STR_SECUREJOIN_WAIT'),
    (e[(e.DC_STR_SECUREJOIN_WAIT_TIMEOUT = 191)] =
      'DC_STR_SECUREJOIN_WAIT_TIMEOUT'),
    (e[(e.DC_STR_SECURE_JOIN_GROUP_QR_DESC = 120)] =
      'DC_STR_SECURE_JOIN_GROUP_QR_DESC'),
    (e[(e.DC_STR_SECURE_JOIN_REPLIES = 118)] = 'DC_STR_SECURE_JOIN_REPLIES'),
    (e[(e.DC_STR_SECURE_JOIN_STARTED = 117)] = 'DC_STR_SECURE_JOIN_STARTED'),
    (e[(e.DC_STR_SELF = 2)] = 'DC_STR_SELF'),
    (e[(e.DC_STR_SELF_DELETED_MSG_BODY = 91)] = 'DC_STR_SELF_DELETED_MSG_BODY'),
    (e[(e.DC_STR_SENDING = 110)] = 'DC_STR_SENDING'),
    (e[(e.DC_STR_SERVER_TURNED_OFF = 92)] = 'DC_STR_SERVER_TURNED_OFF'),
    (e[(e.DC_STR_SETUP_CONTACT_QR_DESC = 119)] =
      'DC_STR_SETUP_CONTACT_QR_DESC'),
    (e[(e.DC_STR_STICKER = 67)] = 'DC_STR_STICKER'),
    (e[(e.DC_STR_STORAGE_ON_DOMAIN = 105)] = 'DC_STR_STORAGE_ON_DOMAIN'),
    (e[(e.DC_STR_SUBJECT_FOR_NEW_CONTACT = 73)] =
      'DC_STR_SUBJECT_FOR_NEW_CONTACT'),
    (e[(e.DC_STR_SYNC_MSG_BODY = 102)] = 'DC_STR_SYNC_MSG_BODY'),
    (e[(e.DC_STR_SYNC_MSG_SUBJECT = 101)] = 'DC_STR_SYNC_MSG_SUBJECT'),
    (e[(e.DC_STR_UNKNOWN_SENDER_FOR_CHAT = 72)] =
      'DC_STR_UNKNOWN_SENDER_FOR_CHAT'),
    (e[(e.DC_STR_UPDATE_REMINDER_MSG_BODY = 86)] =
      'DC_STR_UPDATE_REMINDER_MSG_BODY'),
    (e[(e.DC_STR_UPDATING = 109)] = 'DC_STR_UPDATING'),
    (e[(e.DC_STR_VIDEO = 10)] = 'DC_STR_VIDEO'),
    (e[(e.DC_STR_VIDEOCHAT_INVITATION = 82)] = 'DC_STR_VIDEOCHAT_INVITATION'),
    (e[(e.DC_STR_VIDEOCHAT_INVITE_MSG_BODY = 83)] =
      'DC_STR_VIDEOCHAT_INVITE_MSG_BODY'),
    (e[(e.DC_STR_VOICEMESSAGE = 7)] = 'DC_STR_VOICEMESSAGE'),
    (e[(e.DC_STR_WELCOME_MESSAGE = 71)] = 'DC_STR_WELCOME_MESSAGE'),
    (e[(e.DC_STR_YOU_REACTED = 176)] = 'DC_STR_YOU_REACTED'),
    (e[(e.DC_TEXT1_DRAFT = 1)] = 'DC_TEXT1_DRAFT'),
    (e[(e.DC_TEXT1_SELF = 3)] = 'DC_TEXT1_SELF'),
    (e[(e.DC_TEXT1_USERNAME = 2)] = 'DC_TEXT1_USERNAME'),
    (e[(e.DC_VIDEOCHATTYPE_BASICWEBRTC = 1)] = 'DC_VIDEOCHATTYPE_BASICWEBRTC'),
    (e[(e.DC_VIDEOCHATTYPE_JITSI = 2)] = 'DC_VIDEOCHATTYPE_JITSI'),
    (e[(e.DC_VIDEOCHATTYPE_UNKNOWN = 0)] = 'DC_VIDEOCHATTYPE_UNKNOWN')
})(et || (et = {}))
let rt = !1,
  bt = new M(),
  Nt = new M()
s('set_main_window_channels', { jsonrpc: Nt, events: bt })
const nt = class extends x.BaseTransport {
    constructor(r) {
      super()
      this.callCounterFunction = r
      Nt.onmessage = n => {
        rt &&
          console.debug('%c\u25BC %c[JSONRPC]', 'color: red', 'color:grey', n),
          this._onmessage(n)
      }
    }
    static {
      _(this, 'TauriTransport')
    }
    _send(r) {
      s('deltachat_jsonrpc_request', { message: r }),
        rt &&
          (console.debug(
            '%c\u25B2 %c[JSONRPC]',
            'color: green',
            'color:grey',
            r
          ),
          r.method &&
            (this.callCounterFunction(r.method),
            this.callCounterFunction('total')))
    }
  },
  st = class extends k {
    static {
      _(this, 'TauriDeltaChat')
    }
    constructor(t) {
      super(new nt(t), !0)
    }
  },
  xt = navigator.userAgent.includes('Win'),
  it = class {
    constructor() {
      this.currentLogFileLocation = null
      this.rc_config = null
      this.runtime_info = null
      this.getActiveTheme = this.getActiveTheme.bind(this)
    }
    static {
      _(this, 'TauriRuntime')
    }
    emitUIFullyReady() {
      s('ui_frontend_ready')
    }
    emitUIReady() {
      s('ui_ready')
    }
    createDeltaChatConnection(t) {
      return new st(t)
    }
    openMessageHTML(t, r, n, i, o, a, E) {
      s('open_html_window', {
        accountId: t,
        messageId: r,
        isContactRequest: n,
        subject: i,
        sender: o,
        receiveTime: a,
        content: E,
      })
    }
    async getDesktopSettings() {
      const r = {
          ...{ credentials: void 0, lastAccount: void 0, lastChats: {} },
          bounds: {},
          HTMLEmailWindowBounds: void 0,
        },
        n = {
          zoomFactor: 1,
          minimizeToTray: !0,
          lastSaveDialogLocation: void 0,
          enableWebxdcDevTools: !1,
          HTMLEmailAskForRemoteLoadingConfirmation: !0,
          HTMLEmailAlwaysLoadRemoteContent: !1,
          contentProtectionEnabled: !1,
          activeTheme: 'system',
          locale: null,
          notifications: !0,
          syncAllAccounts: !0,
          autostart: !0,
        },
        i = {
          showNotificationContent: !0,
          enterKeySends: !1,
          enableAVCalls: !1,
          enableBroadcastLists: !1,
          enableChatAuditLog: !1,
          enableOnDemandLocationStreaming: !1,
          chatViewBgImg: void 0,
          experimentalEnableMarkdownInMessages: !1,
          enableRelatedChats: !1,
          galleryImageKeepAspectRatio: !1,
          isMentionsEnabled: !1,
          useSystemUIFont: !1,
        },
        o = (await this.store.entries()).reduce(
          (a, [E, l]) => ((a[E] = l), a),
          {}
        )
      return { ...r, ...n, ...i, ...o }
    }
    async setDesktopSetting(t, r) {
      typeof r > 'u' ? await this.store.delete(t) : await this.store.set(t, r),
        await s('change_desktop_settings_apply_side_effects', { key: t })
    }
    async initialize(t, r) {
      const n = await s('get_frontend_run_config'),
        i = {
          'log-debug': n.log_debug,
          'log-to-console': n.log_to_console,
          devmode: n.dev_mode,
          minimized: n.forced_tray_icon,
          theme: n.theme || void 0,
          'theme-watch': n.theme_watch,
          'translation-watch': !1,
          'allow-unsafe-core-replacement': !1,
          'machine-readable-stacktrace': !0,
          version: !1,
          v: !1,
          help: !1,
          h: !1,
        }
      ;(this.rc_config = i), i['log-debug'] && (rt = !0)
      const o = await s('get_runtime_info')
      this.runtime_info = o
      const a = { DEBUG: 2, INFO: 3, WARNING: 4, ERROR: 5, CRITICAL: 5 }
      t((l, A, _t, ...yt) => {
        let Mt = yt
            .map(D => (typeof D == 'object' ? JSON.stringify(D) : D))
            .join(', '),
          ot = new Error().stack
            ?.split(
              `
`
            )
            .map(D => D.split('@'))
            .slice(3),
          y = ot
            ?.filter(([D, Lt]) => D.length > 0 && Lt !== '[native code]')?.[0]
            ?.filter(D => D.length > 0)
            .join('@')
        y === 'Error' && (y = 'webview::unknown')
        const at = y?.split('@')[0]
        y = `:JS::${l.replace(/\//g, '::')}${at ? `::${at}` : ''}`
        const lt = a[A]
        s('plugin:log|log', {
          level: lt,
          message: Mt,
          location: y,
          file: void 0,
          line: void 0,
          keyValues:
            lt <= a.ERROR ? { stack_trace: JSON.stringify(ot) } : void 0,
        })
      }, i),
        (this.log = r('runtime/tauri'))
      const E = await St('config.json')
      if (!E) throw new Error('Configuration Store was not loaded')
      ;(this.store = E),
        (this.currentLogFileLocation = await s('get_current_logfile')),
        (bt.onmessage = l => {
          if (l.event === 'sendToChat') {
            const { options: A, account: _t } = l.data
            this.onWebxdcSendToChat?.(
              A.file
                ? {
                    file_name: A.file.fileName,
                    file_content: A.file.fileContent,
                  }
                : null,
              A.text || null,
              _t || void 0
            )
          } else
            l.event === 'localeReloaded'
              ? this.onChooseLanguage?.(l.data || window.localeData.locale)
              : l.event === 'showAboutDialog'
                ? this.onShowDialog?.('about')
                : l.event === 'showSettingsDialog'
                  ? this.onShowDialog?.('settings')
                  : l.event === 'showKeybindingsDialog'
                    ? this.onShowDialog?.('keybindings')
                    : l.event === 'resumeFromSleep'
                      ? this.onResumeFromSleep?.()
                      : l.event === 'toggleNotifications'
                        ? this.onToggleNotifications?.()
                        : l.event === 'onThemeUpdate'
                          ? (this.log.debug('on theme update'),
                            this.onThemeUpdate?.())
                          : l.event === 'deepLinkOpened'
                            ? this.onOpenQrUrl?.(l.data)
                            : l.event === 'notificationClick' &&
                              this.notificationCallback?.(l.data)
        }),
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', l => {
            this.log.debug('system theme changed:', { dark_theme: l.matches }),
              this.onThemeUpdate?.()
          })
    }
    reloadWebContent() {
      location.reload()
    }
    openLogFile() {
      Q(this.getCurrentLogLocation())
    }
    getCurrentLogLocation() {
      if (this.currentLogFileLocation === null)
        throw new Error('this.currentLogFileLocation is not set')
      return this.currentLogFileLocation
    }
    openHelpWindow(t) {
      s('open_help_window', { locale: window.localeData.locale, anchor: t })
    }
    getRC_Config() {
      if (this.rc_config === null) throw new Error('this.rc_config is not set')
      return this.rc_config
    }
    getRuntimeInfo() {
      if (this.runtime_info === null)
        throw new Error('this.runtime_info is not set')
      return this.runtime_info
    }
    openLink(t) {
      t.startsWith('http:') || t.startsWith('https:')
        ? mt(t)
        : this.log.error('tried to open a non http/https external link', {
            link: t,
          })
    }
    async showOpenFileDialog(t) {
      return await s('show_open_file_dialog', {
        title: t.title,
        filters: t.filters,
        properties: t.properties,
        defaultPath: t.defaultPath,
      })
    }
    async downloadFile(t, r) {
      await s('download_file', { pathToSource: t, filename: r })
    }
    transformBlobURL(t) {
      const r = t.match(/.*(:?\\|\/)(.+?)\1dc.db-blobs\1(.*)/)
      if (r) {
        const n = encodeURIComponent(r[3])
        return `${this.runtime_info?.tauriSpecific?.scheme.blobs}${r[2]}/${n}`
      }
      return (
        t !== ''
          ? this.log.error('transformBlobURL wrong url format', t)
          : this.log.debug(
              'transformBlobURL called with empty string for blob_path'
            ),
        ''
      )
    }
    transformStickerURL(t) {
      const r = t.match(/.*(:?\\|\/)(.+?)\1stickers\1(.+?)\1(.+)/)
      if (r) {
        const n = encodeURIComponent(r[3]),
          i = encodeURIComponent(r[4])
        return `${this.runtime_info?.tauriSpecific?.scheme.stickers}${r[2]}/${n}/${i}`
      }
      return (
        t !== ''
          ? this.log.error('transformStickerURL wrong url format', t)
          : this.log.debug(
              'transformStickerURL called with empty string for sticker_path'
            ),
        ''
      )
    }
    readClipboardText() {
      return ft()
    }
    readClipboardImage() {
      return s('get_clipboard_image_as_data_uri')
    }
    writeClipboardText(t) {
      return At(t)
    }
    writeClipboardImage(t) {
      return s('copy_image_to_clipboard', { path: t })
    }
    getAppPath(t) {
      return s('get_app_path', { name: t })
    }
    openMapsWebxdc(t, r) {
      throw new Error('Method not implemented.22')
    }
    async openPath(t) {
      try {
        return await Q(t), ''
      } catch (r) {
        return this.log.error('openPath', t, r), r?.message || r.toString()
      }
    }
    getConfigPath() {
      throw new Error('Method not implemented.24')
    }
    openWebxdc(t, r) {
      s('open_webxdc', { messageId: t, accountId: r.accountId, href: r.href })
    }
    getWebxdcIconURL(t, r) {
      return `${this.runtime_info?.tauriSpecific?.scheme.webxdcIcon}${t}/${r}`
    }
    deleteWebxdcAccountData(t) {
      return s('delete_webxdc_account_data', { accountId: t })
    }
    closeAllWebxdcInstances() {
      s('close_all_webxdc_instances')
    }
    notifyWebxdcStatusUpdate(t, r) {
      s('on_webxdc_status_update', { accountId: t, instanceId: r })
    }
    notifyWebxdcRealtimeData(t, r, n) {
      s('on_webxdc_realtime_data', { accountId: t, instanceId: r, payload: n })
    }
    notifyWebxdcMessageChanged(t, r) {
      s('on_webxdc_message_changed', { accountId: t, instanceId: r })
    }
    notifyWebxdcInstanceDeleted(t, r) {
      s('on_webxdc_message_deleted', { accountId: t, instanceId: r })
    }
    restartApp() {
      this.log.error('Method not implemented: restartApp')
    }
    async getLocaleData(t) {
      return await s('get_locale_data', {
        locale: t || (await this.getDesktopSettings()).locale || 'en',
      })
    }
    setLocale(t) {
      return s('change_lang', { locale: t })
    }
    setBadgeCounter(t) {
      const r = z()
      r.setBadgeCount(t === 0 ? void 0 : t),
        xt &&
          r.setOverlayIcon?.(t === 0 ? void 0 : 'images/tray/unread-badge.png'),
        s('update_tray_icon_badge', { counter: t })
    }
    showNotification({
      title: t,
      body: r,
      icon: n,
      iconIsAvatar: i,
      chatId: o,
      messageId: a,
      accountId: E,
    }) {
      s('show_notification', {
        title: t,
        body: r,
        icon: n,
        iconIsAvatar: i || !1,
        chatId: o,
        messageId: a,
        accountId: E,
      })
    }
    clearAllNotifications() {
      s('clear_all_notifications')
    }
    clearNotifications(t, r) {
      s('clear_notifications', { accountId: t, chatId: r })
    }
    setNotificationCallback(t) {
      this.notificationCallback = t
    }
    writeTempFileFromBase64(t, r) {
      return s('write_temp_file_from_base64', { name: t, content: r })
    }
    writeTempFile(t, r) {
      return s('write_temp_file', { name: t, content: r })
    }
    copyFileToInternalTmpDir(t, r) {
      return s('copy_blob_file_to_internal_tmp_dir', {
        fileName: t,
        sourcePath: r,
      })
    }
    removeTempFile(t) {
      return s('remove_temp_file', { path: t })
    }
    getWebxdcDiskUsage(t) {
      throw new Error('Method not implemented: runtime.getWebxdcDiskUsage')
    }
    clearWebxdcDOMStorage(t) {
      throw new Error('Method not implemented.46')
    }
    getAvailableThemes() {
      return s('get_available_themes')
    }
    async getActiveTheme() {
      let t = await s('get_current_active_theme_address')
      t === 'system' &&
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? (t = 'dc:dark')
          : (t = 'dc:light'))
      try {
        const [r, n] = await s('get_theme', { themeAddress: t })
        return { theme: r, data: n }
      } catch (r) {
        return this.log.error('failed to getActiveTheme:', r), null
      }
    }
    saveBackgroundImage(t, r) {
      return s('copy_background_image_file', {
        srcPath: t,
        isDefaultPicture: r,
      })
    }
    onDragFileOut(t) {
      throw new Error('Method not implemented.50')
    }
    isDroppedFileFromOutside(t) {
      throw new Error('Method not implemented.51')
    }
    async debug_get_datastore_ids() {
      return await s('debug_get_datastore_ids')
    }
    getAutostartState() {
      return s('get_autostart_state')
    }
    checkMediaAccess(t) {
      throw new Error('Method not implemented.')
    }
    askForMediaAccess(t) {
      throw new Error('Method not implemented.')
    }
  }
window.r = new it()
export { st as TauriDeltaChat }
//# sourceMappingURL=runtime.js.map
