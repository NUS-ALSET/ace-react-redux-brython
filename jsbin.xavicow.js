'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var userCode = function userCode(state, action) {
  if (state === undefined) state = "//No code yet";

  switch (action.type) {
    case 'UPDATE_CODE':
      return action.code;
    default:
      return state;
  }
};
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/');
var editorOptions = ['minLines', 'maxLines', 'readOnly', 'highlightActiveLine', 'tabSize', 'enableBasicAutocompletion', 'enableLiveAutocompletion', 'enableSnippets'];

var editorEvents = ['onChange', 'onFocus', 'onBlur', 'onCopy', 'onPaste', 'onSelectionChange', 'onScroll', 'handleOptions', 'updateRef'];

var PropTypes = React.PropTypes;
var isEqual = _.isEqual;

var _ace$acequire = ace.acequire('ace/range');

var Ranger = _ace$acequire.Range;

var AceEditor = (function (_React$Component) {
  _inherits(AceEditor, _React$Component);

  function AceEditor(props) {
    var _this = this;

    _classCallCheck(this, AceEditor);

    _get(Object.getPrototypeOf(AceEditor.prototype), 'constructor', this).call(this, props);
    editorEvents.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });
  }

  _createClass(AceEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props;
      var className = _props.className;
      var onBeforeLoad = _props.onBeforeLoad;
      var onValidate = _props.onValidate;
      var mode = _props.mode;
      var focus = _props.focus;
      var theme = _props.theme;
      var fontSize = _props.fontSize;
      var value = _props.value;
      var defaultValue = _props.defaultValue;
      var cursorStart = _props.cursorStart;
      var showGutter = _props.showGutter;
      var wrapEnabled = _props.wrapEnabled;
      var showPrintMargin = _props.showPrintMargin;
      var _props$scrollMargin = _props.scrollMargin;
      var scrollMargin = _props$scrollMargin === undefined ? [0, 0, 0, 0] : _props$scrollMargin;
      var keyboardHandler = _props.keyboardHandler;
      var onLoad = _props.onLoad;
      var commands = _props.commands;
      var annotations = _props.annotations;
      var markers = _props.markers;

      this.editor = ace.edit(this.refEditor);

      if (onBeforeLoad) {
        onBeforeLoad(ace);
      }

      var editorProps = Object.keys(this.props.editorProps);
      for (var i = 0; i < editorProps.length; i++) {
        this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]];
      }

      this.editor.renderer.setScrollMargin(scrollMargin[0], scrollMargin[1], scrollMargin[2], scrollMargin[3]);
      this.editor.getSession().setMode('ace/mode/' + mode);
      this.editor.setTheme('ace/theme/' + theme);
      this.editor.setFontSize(fontSize);
      this.editor.setValue(defaultValue === undefined ? value : defaultValue, cursorStart);
      this.editor.renderer.setShowGutter(showGutter);
      this.editor.getSession().setUseWrapMode(wrapEnabled);
      this.editor.setShowPrintMargin(showPrintMargin);
      this.editor.on('focus', this.onFocus);
      this.editor.on('blur', this.onBlur);
      this.editor.on('copy', this.onCopy);
      this.editor.on('paste', this.onPaste);
      this.editor.on('change', this.onChange);
      this.editor.getSession().selection.on('changeSelection', this.onSelectionChange);
      if (onValidate) {
        this.editor.getSession().on('changeAnnotation', function () {
          var annotations = _this2.editor.getSession().getAnnotations();
          _this2.props.onValidate(annotations);
        });
      }
      this.editor.session.on('changeScrollTop', this.onScroll);
      this.editor.getSession().setAnnotations(annotations || []);
      if (markers && markers.length > 0) {
        this.handleMarkers(markers);
      }

      // get a list of possible options to avoid 'misspelled option errors'
      var availableOptions = this.editor.$options;
      for (var i = 0; i < editorOptions.length; i++) {
        var option = editorOptions[i];
        if (availableOptions.hasOwnProperty(option)) {
          this.editor.setOption(option, this.props[option]);
        } else if (this.props[option]) {
          console.warn('ReaceAce: editor option ' + option + ' was activated but not found. Did you need to import a related tool or did you possibly mispell the option?');
        }
      }
      this.handleOptions(this.props);

      if (Array.isArray(commands)) {
        commands.forEach(function (command) {
          if (typeof command.exec == 'string') {
            _this2.editor.commands.bindKey(command.bindKey, command.exec);
          } else {
            _this2.editor.commands.addCommand(command);
          }
        });
      }

      if (keyboardHandler) {
        this.editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);
      }

      if (className) {
        this.refEditor.className += ' ' + className;
      }

      if (focus) {
        this.editor.focus();
      }

      if (onLoad) {
        onLoad(this.editor);
      }

      this.editor.resize();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var oldProps = this.props;

      for (var i = 0; i < editorOptions.length; i++) {
        var option = editorOptions[i];
        if (nextProps[option] !== oldProps[option]) {
          this.editor.setOption(option, nextProps[option]);
        }
      }

      if (nextProps.className !== oldProps.className) {
        (function () {
          var appliedClasses = _this3.refEditor.className;
          var appliedClassesArray = appliedClasses.trim().split(' ');
          var oldClassesArray = oldProps.className.trim().split(' ');
          oldClassesArray.forEach(function (oldClass) {
            var index = appliedClassesArray.indexOf(oldClass);
            appliedClassesArray.splice(index, 1);
          });
          _this3.refEditor.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
        })();
      }

      if (nextProps.mode !== oldProps.mode) {
        this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
      }
      if (nextProps.theme !== oldProps.theme) {
        this.editor.setTheme('ace/theme/' + nextProps.theme);
      }
      if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
        if (nextProps.keyboardHandler) {
          this.editor.setKeyboardHandler('ace/keyboard/' + nextProps.keyboardHandler);
        } else {
          this.editor.setKeyboardHandler(null);
        }
      }
      if (nextProps.fontSize !== oldProps.fontSize) {
        this.editor.setFontSize(nextProps.fontSize);
      }
      if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
        this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
      }
      if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
        this.editor.setShowPrintMargin(nextProps.showPrintMargin);
      }
      if (nextProps.showGutter !== oldProps.showGutter) {
        this.editor.renderer.setShowGutter(nextProps.showGutter);
      }
      if (!isEqual(nextProps.setOptions, oldProps.setOptions)) {
        this.handleOptions(nextProps);
      }
      if (!isEqual(nextProps.annotations, oldProps.annotations)) {
        this.editor.getSession().setAnnotations(nextProps.annotations || []);
      }
      if (!isEqual(nextProps.markers, oldProps.markers) && Array.isArray(nextProps.markers)) {
        this.handleMarkers(nextProps.markers);
      }

      // this doesn't look like it works at all....
      if (!isEqual(nextProps.scrollMargin, oldProps.scrollMargin)) {
        this.handleScrollMargins(nextProps.scrollMargin);
      }
      if (this.editor && this.editor.getValue() !== nextProps.value) {
        // editor.setValue is a synchronous function call, change event is emitted before setValue return.
        this.silent = true;
        var pos = this.editor.session.selection.toJSON();
        this.editor.setValue(nextProps.value, nextProps.cursorStart);
        this.editor.session.selection.fromJSON(pos);
        this.silent = false;
      }

      if (nextProps.focus && !oldProps.focus) {
        this.editor.focus();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
        this.editor.resize();
      }
    }
  }, {
    key: 'handleScrollMargins',
    value: function handleScrollMargins() {
      var margins = arguments.length <= 0 || arguments[0] === undefined ? [0, 0, 0, 0] : arguments[0];

      this.editor.renderer.setScrollMargins(margins[0], margins[1], margins[2], margins[3]);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.editor.destroy();
      this.editor = null;
    }
  }, {
    key: 'onChange',
    value: function onChange(event) {
      if (this.props.onChange && !this.silent) {
        var value = this.editor.getValue();
        this.props.onChange(value, event);
      }
    }
  }, {
    key: 'onSelectionChange',
    value: function onSelectionChange(event) {
      if (this.props.onSelectionChange) {
        var value = this.editor.getSelection();
        this.props.onSelectionChange(value, event);
      }
    }
  }, {
    key: 'onFocus',
    value: function onFocus(event) {
      if (this.props.onFocus) {
        this.props.onFocus(event);
      }
    }
  }, {
    key: 'onBlur',
    value: function onBlur(event) {
      if (this.props.onBlur) {
        this.props.onBlur(event);
      }
    }
  }, {
    key: 'onCopy',
    value: function onCopy(text) {
      if (this.props.onCopy) {
        this.props.onCopy(text);
      }
    }
  }, {
    key: 'onPaste',
    value: function onPaste(text) {
      if (this.props.onPaste) {
        this.props.onPaste(text);
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (this.props.onScroll) {
        this.props.onScroll(this.editor);
      }
    }
  }, {
    key: 'handleOptions',
    value: function handleOptions(props) {
      var setOptions = Object.keys(props.setOptions);
      for (var y = 0; y < setOptions.length; y++) {
        this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
      }
    }
  }, {
    key: 'handleMarkers',
    value: function handleMarkers(markers) {
      var _this4 = this;

      // remove foreground markers
      var currentMarkers = this.editor.getSession().getMarkers(true);
      for (var i in currentMarkers) {
        if (currentMarkers.hasOwnProperty(i)) {
          this.editor.getSession().removeMarker(currentMarkers[i].id);
        }
      }
      // remove background markers
      currentMarkers = this.editor.getSession().getMarkers(false);
      for (var i in currentMarkers) {
        if (currentMarkers.hasOwnProperty(i)) {
          this.editor.getSession().removeMarker(currentMarkers[i].id);
        }
      }
      // add new markers
      markers.forEach(function (_ref) {
        var startRow = _ref.startRow;
        var startCol = _ref.startCol;
        var endRow = _ref.endRow;
        var endCol = _ref.endCol;
        var className = _ref.className;
        var type = _ref.type;
        var _ref$inFront = _ref.inFront;
        var inFront = _ref$inFront === undefined ? false : _ref$inFront;

        var range = new Ranger(startRow, startCol, endRow, endCol);
        _this4.editor.getSession().addMarker(range, className, type, inFront);
      });
    }
  }, {
    key: 'updateRef',
    value: function updateRef(item) {
      this.refEditor = item;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var name = _props2.name;
      var width = _props2.width;
      var height = _props2.height;
      var style = _props2.style;

      var divStyle = _extends({ width: width, height: height }, style);
      return React.createElement('div', { ref: this.updateRef, id: name, style: divStyle });
    }
  }]);

  return AceEditor;
})(React.Component);

AceEditor.propTypes = {
  mode: PropTypes.string,
  focus: PropTypes.bool,
  theme: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showGutter: PropTypes.bool,
  onChange: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onScroll: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onLoad: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onBeforeLoad: PropTypes.func,
  onValidate: PropTypes.func,
  minLines: PropTypes.number,
  maxLines: PropTypes.number,
  readOnly: PropTypes.bool,
  highlightActiveLine: PropTypes.bool,
  tabSize: PropTypes.number,
  showPrintMargin: PropTypes.bool,
  cursorStart: PropTypes.number,
  editorProps: PropTypes.object,
  setOptions: PropTypes.object,
  style: PropTypes.object,
  scrollMargin: PropTypes.array,
  annotations: PropTypes.array,
  markers: PropTypes.array,
  keyboardHandler: PropTypes.string,
  wrapEnabled: PropTypes.bool,
  enableBasicAutocompletion: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  enableLiveAutocompletion: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  commands: PropTypes.array
};

AceEditor.defaultProps = {
  name: 'brace-editor',
  focus: false,
  mode: '',
  theme: '',
  height: '500px',
  width: '500px',
  value: '',
  fontSize: 12,
  showGutter: true,
  onChange: null,
  onPaste: null,
  onLoad: null,
  onScroll: null,
  minLines: null,
  maxLines: null,
  readOnly: false,
  highlightActiveLine: true,
  showPrintMargin: true,
  tabSize: 4,
  cursorStart: 1,
  editorProps: {},
  style: {},
  scrollMargin: [0, 0, 0, 0],
  setOptions: {},
  wrapEnabled: false,
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false
};

var _Redux = Redux;
var combineReducers = _Redux.combineReducers;

var editorApp = combineReducers({
  userCode: userCode
});
var store = Redux.createStore(editorApp);

var ReactAce2 = ReactAce['default'];

var CodeApp = (function (_React$Component2) {
  _inherits(CodeApp, _React$Component2);

  function CodeApp(props) {
    _classCallCheck(this, CodeApp);

    _get(Object.getPrototypeOf(CodeApp.prototype), 'constructor', this).call(this, props);
    this.state = {
      code: `for i in range(10):
      print(i)`
    };
    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
  }

  _createClass(CodeApp, [{
    key: 'onChange',
    value: function onChange(event) {
      this.setState({ code: event });
    }
  }, {
    key: 'save',
    value: function save() {
      store.dispatch({ code: this.state.code, type: 'UPDATE_CODE' });
    }
  }, {
    key: 'render',
    value: function render() {
      var userCode = this.props.userCode;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'col-lg-6' },
          React.createElement(
            'p',
            null,
            'Live code'
          ),
          React.createElement(AceEditor, {
            mode: 'python',
            theme: 'monokai',
            value: this.state.code,
            onChange: this.onChange,
            editorProps: { $blockScrolling: true }
          })
        ),
        React.createElement(
          'div',
          { className: 'col-lg-1' },
          React.createElement(
            'button',
            { className: 'btn btn-primary', onClick: this.save },
            'Save code'
          )
        ),
        React.createElement(
          'div',
          { className: 'col-lg-5' },
          React.createElement(
            'p',
            null,
            'Current code in Redux store'
          ),
          React.createElement(AceEditor, {
            mode: 'python',
            theme: 'monokai',
            value: userCode,
            readOnly: true,
            editorProps: { $blockScrolling: true }
          })
        )
      );
    }
  }]);

  return CodeApp;
})(React.Component);

var render = function render() {
  ReactDOM.render(React.createElement(CodeApp, store.getState()), document.getElementById('root'));
};

store.subscribe(render);
render();