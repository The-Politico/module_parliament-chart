import d3 from './utils/d3';
import merge from 'lodash/merge';
import { Colors } from 'politico-style';

import defaultData from './data/house.json';

const { demgop } = Colors.elections;

const defaultColorScale = d3.scaleOrdinal()
  .domain([
    'solid-d',
    'likely-d',
    'lean-d',
    'toss-up',
    'lean-r',
    'likely-r',
    'solid-r',
  ]).range([
    demgop.demgop0.hex,
    demgop.demgop2.hex,
    demgop.demgop3.hex,
    'lightgrey',
    '#FFD8CD',
    '#FFB19C',
    '#FE5C40',
  ]);

export default () => ({

  /**
   * Develop your chart in this render function.
   *
   * For more details about this pattern, see Mike Bostock's proposal for
   * reusable charts: https://bost.ocks.org/mike/chart/
   */
  render() {
    /**
     * Set default chart properties in this object. Users can overwrite them
     * by passing a props object through the module's create or update methods.
     */
    let props = {
      radiusCoef: 0.4,
      margin: {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5,
      },
      seatsAccessor: d => d.seats,
      attrs: (d) => ({
        class: d.data.party,
      }),
      styles: (d) => ({
        fill: defaultColorScale(d.data.party),
      }),
    };

    function chart(selection) {
      selection.each((data, i, elements) => {
        /**
         * YOUR D3 CODE HERE 📈 📊 🌐
         */
        const node = elements[i]; // the selected element
        const { width } = node.getBoundingClientRect();

        const innerWidth = width - props.margin.left - props.margin.right;
        const innerHeight = innerWidth / 2; // Must be square;
        const outerParliamentRadius = innerWidth / 2;
        const innerParliamentRadius = outerParliamentRadius * props.radiusCoef;

        const nSeats = data.reduce((a, b) => a + props.seatsAccessor(b), 0);

        let nRows = 0;
        let maxSeatNumber = 0;
        let b = 0.5;

        const series = (s, n) => {
          let r = 0;
          for (let i = 0; i <= n; i++) {
            r += s(i);
          }
          return r;
        };

        const inverseRadiusCoef = props.radiusCoef / (1 - props.radiusCoef);
        while (maxSeatNumber < nSeats) {
          nRows++;
          b += inverseRadiusCoef;
          maxSeatNumber = series((i) => Math.floor(Math.PI * (b + i)), nRows - 1);
        };

        const rowWidth = (outerParliamentRadius - innerParliamentRadius) / nRows;
        let seats = [];

        const seatsToRemove = maxSeatNumber - nSeats;
        for (let i = 0; i < nRows; i++) {
          const rowRadius = innerParliamentRadius + rowWidth * (i + 0.5);
          const rowSeats =
            Math.floor(Math.PI * (b + i)) -
            Math.floor(seatsToRemove / nRows) -
            (seatsToRemove % nRows > i ? 1 : 0);

          const anglePerSeat = Math.PI / rowSeats;

          for (let j = 0; j < rowSeats; j++) {
            const s = {};
            s.polar = {
              r: rowRadius,
              teta: -Math.PI + anglePerSeat * (j + 0.5),
            };
            s.cartesian = {
              x: s.polar.r * Math.cos(s.polar.teta),
              y: s.polar.r * Math.sin(s.polar.teta),
            };
            seats.push(s);
          }
        }

        seats.sort((a, b) => a.polar.teta - b.polar.teta || b.polar.r - a.polar.r);

        let partyIndex = 0;
        let seatIndex = 0;
        seats.forEach((s) => {
          let party = data[partyIndex];
          if (seatIndex >= props.seatsAccessor(party)) {
            partyIndex++;
            seatIndex = 0;
            party = data[partyIndex];
          }

          const partyData = Object.assign({}, party);

          s.data = partyData;
          seatIndex++;
        });

        const seatX = d => d.cartesian.x;
        const seatY = d => d.cartesian.y;
        const seatRadius = d => props.radiusCoef * rowWidth;

        const g = d3.select(node)
          .appendSelect('svg') // see docs in ./utils/d3.js
          .attr('width', width)
          .attr('height', width / 2)
          .appendSelect('g')
          .attr('transform', `translate(${(innerWidth / 2) + 5}, ${innerHeight})`);

        const circles = g.selectAll('circle')
          .data(seats);

        circles
          .attrs({
            cx: seatX,
            cy: seatY,
            r: seatRadius,
          })
          .attrs(props.attrs)
          .styles(props.styles)
          .classed('seat', true); // Always class "seat"

        circles.enter().append('circle')
          .merge(circles)
          .attrs({
            cx: seatX,
            cy: seatY,
            r: seatRadius,
          })
          .attrs(props.attrs)
          .styles(props.styles)
          .classed('seat', true); // Always class "seat"

        circles.exit().remove();
      });
    }

    /**
     * Getter-setters merge any user-provided properties with the defaults.
     */
    chart.props = (obj) => {
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
  draw() {
    const chart = this.render()
      .props(this._props);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  /**
   * The following methods represent the external API of this chart module.
   *
   * See ../preview/App.jsx for an example of how they are used.
   */

  /**
   * Creates the chart initially.
   */
  create(selection, data, props = {}) {
    this._selection = selection;
    this._data = data || defaultData;
    this._props = props;

    this.draw();
  },

  /**
   * Updates the chart with new data and/or props.
   */
  update(data, props = {}) {
    this._data = data || this._data;
    this._props = Object.assign({}, this._props, props);
    this.draw();
  },

  /**
   * Resizes the chart.
   */
  resize() {
    this.draw();
  },
});
