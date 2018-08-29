import React from 'react';
import debounce from 'lodash/debounce';

import { Colors } from 'politico-style';

import Chart from '../lib/chart.js';

const { brand } = Colors;

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    // Create a new instance of our chart and attach it to this component
    this.chart = new Chart();
  }
  componentDidMount() {
    // Create the chart on mount
    this.createChart(null, { fill: brand.politicoBlue.hex });
    // Add a listener to resize chart with the window
    window.addEventListener('resize', debounce(this.resizeChart, 250));
  }

  componentDidUpdate() {
    // Update the chart with the component
    this.updateChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.resizeChart, 250));
  }

  createChart = (data = null, props = null) => {
    this.chart.create('#chart', data, props);
  }

  updateChart = (data = null, props = null) => {
    this.chart.update(data, props);
  }

  resizeChart = () => {
    this.chart.resize();
  }

  render() {
    return (
      <div id='chart' />
    );
  }
}

export default ChartContainer;
