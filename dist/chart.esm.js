import * as d3 from 'd3';
import { selection } from 'd3';
import 'd3-selection-multi';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import hexRgb from 'hex-rgb';
import merge from 'lodash/merge';
import pullAll from 'lodash/pullAll';

selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;

    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
}; // ... and the important addition. ⬇️⬇️⬇️

/**
 * appendSelect either selects a matching child element of your current
 * selection if one exists or appends that child and selects it. It's useful
 * for writing idempotent chart functions.
 *
 * Use it like this:
 *
 * selection.appendSelect(<element selector>, <class string>)
 *
 * It can be chained like any normal d3 selection:
 *
 * const g = d3.select(myNode).appendSelect('g', 'viz-group');
 * g.appendSelect('rect')
 *   .attr('x', 0); etc.
 *
 * @param  {string} el  String representation of element to be appended/selected.
 * @param  {string} cls Class string (w/out dots) of element to be appended/
 *                      selected. Can pass none or multiple separated by whitespace.
 * @return {object}     d3 selection of child element
 */


selection.prototype.appendSelect = function (el, cls) {
  var selected = cls ? this.select("".concat(el, ".").concat(cls.split(' ').join('.'))) : this.select(el);

  if (selected.size() === 0) {
    return cls ? this.append(el).classed(cls, true) : this.append(el);
  }

  return selected;
};

var Header = function Header(props) {
  return React.createElement("header", null, React.createElement("h5", {
    className: "text-center"
  }, props.subhed), React.createElement("h1", null, props.title));
};

Header.defaultProps = {
  subhed: 'Welcome to',
  title: null
};
Header.propTypes = {
  subhed: PropTypes.string,
  title: PropTypes.string.isRequired
};

var InstructionsList = function InstructionsList(props) {
  return React.createElement("section", null, React.createElement("ol", {
    className: "instructions"
  }, props.children));
};

var Button = function Button(props) {
  var outline = props.outline,
      type = props.type;
  var classes = classNames('btn', {
    'btn-primary': !outline && type === 'primary',
    'btn-outline-primary': outline && type === 'primary',
    'btn-secondary': !outline && type === 'secondary',
    'btn-outline-secondary': outline && type === 'secondary',
    'btn-dark': !outline && type === 'dark',
    'btn-outline-dark': outline && type === 'dark'
  });
  return React.createElement("button", {
    type: "button",
    className: classes,
    onClick: props.onClick
  }, props.children);
};

Button.defaultProps = {
  outline: false,
  type: 'primary'
};
Button.propTypes = {
  outline: PropTypes.bool,
  type: PropTypes.oneOf(['primary', 'secondary', 'dark']),
  onClick: PropTypes.func
};

var Checkbox = function Checkbox(props) {
  return React.createElement("div", {
    className: "custom-control custom-checkbox"
  }, React.createElement("input", {
    type: "checkbox",
    className: "custom-control-input",
    id: 'checkbox_' + props.name,
    name: props.name,
    checked: props.checked,
    onChange: props.onChange
  }), React.createElement("label", {
    className: "custom-control-label",
    htmlFor: 'checkbox_' + props.name
  }, props.children));
};

Checkbox.defaultProps = {
  checked: false,
  name: null
};
Checkbox.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var RadioButton = function RadioButton(props) {
  return React.createElement("div", {
    className: "custom-control custom-radio"
  }, React.createElement("input", {
    name: props.name,
    id: props.id,
    type: "radio",
    className: "custom-control-input",
    checked: props.checked,
    onChange: props.onChange
  }), React.createElement("label", {
    className: "custom-control-label",
    htmlFor: props.id
  }, props.children));
};

RadioButton.defaultProps = {
  checked: false,
  name: null,
  id: null
};
RadioButton.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
var RadioGroup = function RadioGroup(name) {
  return function (props) {
    return React.createElement(RadioButton, _extends({
      name: name
    }, props));
  };
};

var ActiveBadge = function ActiveBadge() {
  return React.createElement("span", {
    className: "badge badge-light"
  }, "\u2713");
};

var PillFilter = function PillFilter(props) {
  var active = props.active;
  var classes = classNames('filter', 'btn', {
    active: active
  });
  return React.createElement("button", {
    type: "button",
    className: classes,
    onClick: props.onClick
  }, props.children, active && React.createElement(ActiveBadge, null));
};

PillFilter.defaultProps = {
  active: false
};
PillFilter.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func
};

var Home = function Home() {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    x: "0px",
    y: "0px",
    viewBox: "0 0 100 100",
    enableBackground: "new 0 0 100 100",
    xmlSpace: "preserve"
  }, React.createElement("path", {
    d: "M79.5,81.458h-57V41.27L51,16.729L79.5,41.27V81.458z M25.5,78.458h51V42.646L51,20.688L25.5,42.646V78.458z"
  }));
};

var Nav = function Nav(props) {
  return React.createElement("nav", {
    className: "global"
  }, React.createElement("div", {
    className: "header-left bt-icon--house"
  }, React.createElement("a", {
    href: props.homeLink
  }, React.createElement(Home, null))), React.createElement("b", {
    className: "bt-icon bt-icon--politico"
  }), React.createElement("span", {
    className: "project-name"
  }, "/ ", React.createElement("a", {
    href: props.appLink
  }, props.appName)), React.createElement("div", {
    className: "float-right"
  }, props.children));
};

Nav.defaultProps = {
  appLink: './',
  appName: 'New project',
  homeLink: './../'
};

var Footer = function Footer(props) {
  return React.createElement("footer", null, React.createElement("p", {
    className: "text-center"
  }, " Brought to you by the POLITICO Interactive News Team"));
};



var index = /*#__PURE__*/Object.freeze({
  Header: Header,
  InstructionsList: InstructionsList,
  Button: Button,
  Checkbox: Checkbox,
  RadioButton: RadioButton,
  RadioGroup: RadioGroup,
  PillFilter: PillFilter,
  Nav: Nav,
  Footer: Footer
});

/**
 * Create a color values object with hex value and two funcs
 * to return RGBA values as either a string or an array of values.
 *
 * @param  {Str} hex Hexadecimal color value.
 * @return {Object}     Color value.
 */

function createColorValues(hex) {
  return {
    hex: hex,
    rgba: function rgba(alpha) {
      var a = alpha || 255;
      var rgb = hexRgb(hex);
      return "rgba(".concat(rgb.red, ", ").concat(rgb.green, ", ").concat(rgb.blue, ", ").concat(a, ")");
    },
    rgbaArray: function rgbaArray(alpha) {
      var a = alpha || 255;
      var rgb = hexRgb(hex);
      return [rgb.red, rgb.green, rgb.blue, a];
    }
  };
}
/**
 * Convert kebob-case SCSS variable to camel-case prop.
 * @param  {Str} s
 * @return {Str}
 */


function camelCaser(s) {
  return s.replace('$', '').replace(/-\w/g, function (m) {
    return m[1].toUpperCase();
  });
}
/**
 * Separate variables into array of camel-cased props.
 * @param  {[type]} variables [description]
 * @return {[type]}           [description]
 */


function separateVariables(variables) {
  return variables.trim().split(' ').map(function (v) {
    return camelCaser(v);
  });
}

function createColorAliasObjects(row) {
  var values = createColorValues(row.hex);
  var variables = separateVariables(row.variables);
  var objects = variables.map(function (v) {
    var colorObject = {};
    colorObject[v] = values;
    return colorObject;
  });
  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(objects)));
}

function createColorScheme(rows) {
  var aliasObjects = rows.map(function (row) {
    return createColorAliasObjects(row);
  });
  var aliasScheme = Object.assign.apply(Object, [{}].concat(_toConsumableArray(aliasObjects)));
  return Object.assign({}, aliasScheme, {
    all: rows.map(function (row) {
      return Object.assign({
        variables: row.variables.trim()
      }, createColorValues(row.hex));
    })
  });
}

var brand = [{
  hex: "#DC0228",
  variables: " $politico-red"
}, {
  hex: "#AC0825",
  variables: " $politico-dark-red"
}, {
  hex: "#F4F5F7",
  variables: " $politico-light-background"
}, {
  hex: "#E5E7EB",
  variables: " $politico-line"
}, {
  hex: "#B1B4BD",
  variables: " $politico-light-gray-type"
}, {
  hex: "#6E7381",
  variables: " $politico-dark-gray-type"
}, {
  hex: "#282D40",
  variables: " $politico-black"
}, {
  hex: "#121522",
  variables: " $politico-magazine"
}, {
  hex: "#007BC7",
  variables: " $link $politico-blue"
}, {
  hex: "#0E9AF3",
  variables: " $link-hover"
}, {
  hex: "#F86F00",
  variables: " $politico-orange"
}, {
  hex: "#3B5998",
  variables: " $facebook"
}, {
  hex: "#00ACED",
  variables: " $twitter"
}, {
  hex: "#121522",
  variables: " $mail $politico-magazine"
}];

var base = [{
  hex: "#FFF1DF",
  variables: " $annotation"
}, {
  hex: "#FFF9F1",
  variables: " $annotation-hover"
}, {
  hex: "#FFFAB7",
  variables: " $highlighter-yellow"
}, {
  hex: "#FFFFFF",
  variables: " $white"
}, {
  hex: "#000000",
  variables: " $black"
}, {
  hex: "#666666",
  variables: " $satan"
}, {
  hex: "#B1B4BD",
  variables: " $gray $politico-light-type-gray"
}, {
  hex: "#E5E7EB",
  variables: " $light-gray $politico-line $button"
}, {
  hex: "#312B41",
  variables: " $midnight"
}, {
  hex: "#75CCCA",
  variables: " $positive $yes"
}, {
  hex: "#EF8B67",
  variables: " $negative $no"
}];

var party = [{
  hex: "#3571C0",
  variables: " $dem"
}, {
  hex: "#FE5C40",
  variables: " $gop"
}];

var gop = [{
  hex: "#FE5C40",
  variables: " $gop $gop0"
}, {
  hex: "#B8948E",
  variables: " $gop1"
}, {
  hex: "#FBA723",
  variables: " $gop2"
}, {
  hex: "#FFB2CB",
  variables: " $gop3 $gop-light"
}, {
  hex: "#B41E61",
  variables: " $gop4"
}, {
  hex: "#433E76",
  variables: " $gop5"
}, {
  hex: "#AC5141",
  variables: " $gop6"
}, {
  hex: "#7957B4",
  variables: " $gop7"
}, {
  hex: "#FEE0C2",
  variables: " $gop8"
}, {
  hex: "#FD87F7",
  variables: " $gop9"
}];

var dem = [{
  hex: "#3571C0",
  variables: " $dem $dem0"
}, {
  hex: "#D9C3A5",
  variables: " $dem1"
}, {
  hex: "#8998AB",
  variables: " $dem2"
}, {
  hex: "#9AD3FC",
  variables: " $dem3 $dem-light"
}, {
  hex: "#C3F4CD",
  variables: " $dem4"
}, {
  hex: "#5DAED4",
  variables: " $dem5"
}, {
  hex: "#8ABDC0",
  variables: " $dem6"
}, {
  hex: "#775180",
  variables: " $dem7"
}, {
  hex: "#FFD682",
  variables: " $dem8"
}, {
  hex: "#948064",
  variables: " $dem9"
}];

var demgop = [{
  hex: "#3571C0",
  variables: " $dem $demgop0"
}, {
  hex: "#7392d0",
  variables: " $demgop1"
}, {
  hex: "#A4B5E0",
  variables: " $demgop2"
}, {
  hex: "#D2D9F0",
  variables: " $demgop3"
}, {
  hex: "#FFFFFF",
  variables: " $white $demgop"
}, {
  hex: "#FFD8CD",
  variables: " $gopdem3"
}, {
  hex: "#FFB19C",
  variables: " $gopdem2"
}, {
  hex: "#FF896D",
  variables: " $gopdem1"
}, {
  hex: "#FE5C40",
  variables: " $gop $gopdem0"
}];

var four = [{
  hex: "#4FC1E7",
  variables: " $q4-aqua"
}, {
  hex: "#6BAE80",
  variables: " $q4-green"
}, {
  hex: "#3D284D",
  variables: " $q4-gray"
}, {
  hex: "#694ED6",
  variables: " $q7-purple"
}];

var six = [{
  hex: "#0D3C73",
  variables: " $q6-teal"
}, {
  hex: "#329CAC",
  variables: " $q6-darkblue"
}, {
  hex: "#47BEF8",
  variables: " $q6-aqua"
}, {
  hex: "#F95100",
  variables: " $q6-orange"
}, {
  hex: "#F7A12D",
  variables: " $q6-gold"
}, {
  hex: "#AB9F8F",
  variables: " $q6-dirt"
}];

var pairs = [{
  hex: "#3D284D",
  variables: " $qp-gray"
}, {
  hex: "#8E8E98",
  variables: " $qp-lightgray"
}, {
  hex: "#7C7CE0",
  variables: " $qp-purple"
}, {
  hex: "#9D9DEA",
  variables: " $qp-lightpurple"
}, {
  hex: "#9B9B52",
  variables: " $qp-green"
}, {
  hex: "#C6C677",
  variables: " $qp-lightgreen"
}];

var maps = [{
  hex: "#3D284D",
  variables: " $q7-gray"
}, {
  hex: "#2F6CBA",
  variables: " $q7-blue"
}, {
  hex: "#88C2B2",
  variables: " $q7-green"
}, {
  hex: "#FFCAB3",
  variables: " $q7-peach"
}, {
  hex: "#DFA486",
  variables: " $q7-camel"
}, {
  hex: "#BD3232",
  variables: " $q7-red"
}, {
  hex: "#EBEB35",
  variables: " $q7-yellow"
}];

var moneyFoam = [{
  hex: "#46825A",
  variables: " $moneyfoam1"
}, {
  hex: "#5D926D",
  variables: " $moneyfoam2"
}, {
  hex: "#73A281",
  variables: " $moneyfoam3"
}, {
  hex: "#88B395",
  variables: " $moneyfoam4"
}, {
  hex: "#9FC4AA",
  variables: " $moneyfoam5"
}, {
  hex: "#B6D4BF",
  variables: " $moneyfoam6"
}, {
  hex: "#CCE6D5",
  variables: " $moneyfoam7"
}, {
  hex: "#E4F7EB",
  variables: " $moneyfoam8"
}];

var redYellow = [{
  hex: "#E53516",
  variables: " $redyellow1"
}, {
  hex: "#EC5624",
  variables: " $redyellow2"
}, {
  hex: "#F17233",
  variables: " $redyellow3"
}, {
  hex: "#F68A41",
  variables: " $redyellow4"
}, {
  hex: "#FAA050",
  variables: " $redyellow5"
}, {
  hex: "#FDB75F",
  variables: " $redyellow6"
}, {
  hex: "#FECD6F",
  variables: " $redyellow7"
}, {
  hex: "#FFE37E",
  variables: " $redyellow8"
}];

var sangriaPeach = [{
  hex: "#7A0001",
  variables: " $sangriapeach1"
}, {
  hex: "#972516",
  variables: " $sangriapeach2"
}, {
  hex: "#B2422C",
  variables: " $sangriapeach3"
}, {
  hex: "#CC5F44",
  variables: " $sangriapeach4"
}, {
  hex: "#E37E61",
  variables: " $sangriapeach5"
}, {
  hex: "#F59E82",
  variables: " $sangriapeach6"
}, {
  hex: "#FFC1AA",
  variables: " $sangriapeach7"
}, {
  hex: "#FFE5D8",
  variables: " $sangriapeach8"
}];

var mossSaphire = [{
  hex: "#959632",
  variables: " $moss1"
}, {
  hex: "#A8A74E",
  variables: " $moss2"
}, {
  hex: "#BCB968",
  variables: " $moss3"
}, {
  hex: "#CFCB83",
  variables: " $moss4"
}, {
  hex: "#E3DD9E",
  variables: " $moss5"
}, {
  hex: "#F6F0B9",
  variables: " $mosssapphire"
}, {
  hex: "#D6D2BD",
  variables: " $sapphire5"
}, {
  hex: "#B4B5C0",
  variables: " $sapphire4"
}, {
  hex: "#909AC2",
  variables: " $sapphire3"
}, {
  hex: "#667FC3",
  variables: " $sapphire2"
}, {
  hex: "#2166C3",
  variables: " $sapphire1"
}];

var tealDirt = [{
  hex: "#196B66",
  variables: " $teal1"
}, {
  hex: "#218C86",
  variables: " $teal2"
}, {
  hex: "#26B1AA",
  variables: " $teal3"
}, {
  hex: "#8CD1CE",
  variables: " $teal4"
}, {
  hex: "#BCDEDD",
  variables: " $teal5"
}, {
  hex: "#E9F0EC",
  variables: " $dirtteal"
}, {
  hex: "#D2D3C4",
  variables: " $dirt5"
}, {
  hex: "#BBA88F",
  variables: " $dirt4"
}, {
  hex: "#9E7A4C",
  variables: " $dirt3"
}, {
  hex: "#784C11",
  variables: " $dirt2"
}, {
  hex: "#5D3B0F",
  variables: " $dirt1"
}];

var index$1 = {
  brand: createColorScheme(brand),
  base: createColorScheme(base),
  elections: {
    party: createColorScheme(party),
    gop: createColorScheme(gop),
    dem: createColorScheme(dem),
    demgop: createColorScheme(demgop)
  },
  qualitative: {
    four: createColorScheme(four),
    six: createColorScheme(six),
    pairs: createColorScheme(pairs),
    maps: createColorScheme(maps)
  },
  sequential: {
    moneyFoam: createColorScheme(moneyFoam),
    redYellow: createColorScheme(redYellow),
    sangriaPeach: createColorScheme(sangriaPeach)
  },
  diverging: {
    mossSapphire: createColorScheme(mossSaphire),
    tealDirt: createColorScheme(tealDirt)
  }
};

var defaultData = [{
  "party": "dem",
  "seats": 138
}, {
  "party": "undecided",
  "seats": 0
}, {
  "party": "gop",
  "seats": 45
}];

var demgop$1 = index$1.elections.demgop;
var defaultColorScale = d3.scaleOrdinal().domain(['dem', 'gop', 'undecided']).range([demgop$1.demgop0.hex, demgop$1.gopdem0.hex, 'lightgrey']);
var chart = (function () {
  return {
    /**
     * Develop your chart in this render function.
     *
     * For more details about this pattern, see Mike Bostock's proposal for
     * reusable charts: https://bost.ocks.org/mike/chart/
     */
    render: function render() {
      /**
       * Set default chart properties in this object. Users can overwrite them
       * by passing a props object through the module's create or update methods.
       */
      var props = {
        radiusCoef: 0.4,
        margin: {
          top: 10,
          right: 5,
          bottom: 10,
          left: 5
        },
        seatsAccessor: function seatsAccessor(d) {
          return d.seats;
        },
        attrs: function attrs(d) {
          return {
            class: d.data.party
          };
        },
        styles: function styles(d) {
          return {
            fill: defaultColorScale(d.data.party)
          };
        }
      };

      function chart(selection$$1) {
        selection$$1.each(function (data, i, elements) {
          /**
           * YOUR D3 CODE HERE 📈 📊 🌐
           */
          var node = elements[i]; // the selected element

          var _node$getBoundingClie = node.getBoundingClientRect(),
              width = _node$getBoundingClie.width;

          var innerWidth = width - props.margin.left - props.margin.right;
          var innerHeight = innerWidth / 2; // Must be square;

          var outerParliamentRadius = innerWidth / 2;
          var innerParliamentRadius = outerParliamentRadius * props.radiusCoef; // Remove any groups with zero seats

          pullAll(data, data.filter(function (d) {
            return props.seatsAccessor(d) === 0;
          }));
          var nSeats = data.reduce(function (a, b) {
            return a + props.seatsAccessor(b);
          }, 0);
          var nRows = 0;
          var maxSeatNumber = 0;
          var b = 0.5;

          var series = function series(s, n) {
            var r = 0;

            for (var _i = 0; _i <= n; _i++) {
              r += s(_i);
            }

            return r;
          };

          var inverseRadiusCoef = props.radiusCoef / (1 - props.radiusCoef);

          while (maxSeatNumber < nSeats) {
            nRows++;
            b += inverseRadiusCoef;
            maxSeatNumber = series(function (i) {
              return Math.floor(Math.PI * (b + i));
            }, nRows - 1);
          }
          var rowWidth = (outerParliamentRadius - innerParliamentRadius) / nRows;
          var seats = [];
          var seatsToRemove = maxSeatNumber - nSeats;

          for (var _i2 = 0; _i2 < nRows; _i2++) {
            var rowRadius = innerParliamentRadius + rowWidth * (_i2 + 0.5);
            var rowSeats = Math.floor(Math.PI * (b + _i2)) - Math.floor(seatsToRemove / nRows) - (seatsToRemove % nRows > _i2 ? 1 : 0);
            var anglePerSeat = Math.PI / rowSeats;

            for (var j = 0; j < rowSeats; j++) {
              var s = {};
              s.polar = {
                r: rowRadius,
                teta: -Math.PI + anglePerSeat * (j + 0.5)
              };
              s.cartesian = {
                x: s.polar.r * Math.cos(s.polar.teta),
                y: s.polar.r * Math.sin(s.polar.teta)
              };
              seats.push(s);
            }
          }

          seats.sort(function (a, b) {
            return a.polar.teta - b.polar.teta || b.polar.r - a.polar.r;
          });
          var partyIndex = 0;
          var seatIndex = 0;
          seats.forEach(function (s) {
            var party = data[partyIndex];

            if (seatIndex >= props.seatsAccessor(party)) {
              partyIndex++;
              seatIndex = 0;
              party = data[partyIndex];
            }

            var partyData = Object.assign({}, party);
            s.data = partyData;
            seatIndex++;
          });

          var seatX = function seatX(d) {
            return d.cartesian.x;
          };

          var seatY = function seatY(d) {
            return d.cartesian.y;
          };

          var seatRadius = function seatRadius(d) {
            return props.radiusCoef * rowWidth;
          };

          var g = d3.select(node).appendSelect('svg') // see docs in ./utils/d3.js
          .attr('width', width).attr('height', width / 2).appendSelect('g').attr('transform', "translate(".concat(innerWidth / 2 + 5, ", ").concat(innerHeight, ")"));
          var circles = g.selectAll('circle').data(seats);
          circles.attrs({
            cx: seatX,
            cy: seatY,
            r: seatRadius
          }).attrs(props.attrs).styles(props.styles).classed('seat', true); // Always class "seat"

          circles.enter().append('circle').merge(circles).attrs({
            cx: seatX,
            cy: seatY,
            r: seatRadius
          }).attrs(props.attrs).styles(props.styles).classed('seat', true); // Always class "seat"

          circles.exit().remove();
        });
      }
      /**
       * Getter-setters merge any user-provided properties with the defaults.
       */


      chart.props = function (obj) {
        if (!obj) return props;
        props = merge(props, obj);
        return chart;
      };

      return chart;
    },

    /**
     * Draws the chart by calling the idempotent render function with
     * a selected element.
     */
    draw: function draw() {
      var chart = this.render().props(this._props);
      d3.select(this._selection).datum(this._data).call(chart);
    },

    /**
     * The following methods represent the external API of this chart module.
     *
     * See ../preview/App.jsx for an example of how they are used.
     */

    /**
     * Creates the chart initially.
     */
    create: function create(selection$$1, data) {
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._selection = selection$$1;
      this._data = data || defaultData;
      this._props = props;
      this.draw();
    },

    /**
     * Updates the chart with new data and/or props.
     */
    update: function update(data) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this._data = data || this._data;
      this._props = Object.assign({}, this._props, props);
      this.draw();
    },

    /**
     * Resizes the chart.
     */
    resize: function resize() {
      this.draw();
    }
  };
});

export default chart;
