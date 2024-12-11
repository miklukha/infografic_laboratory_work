let educationData = {};

fetch('./educationData.json')
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    educationData = data;
  })
  .catch(error => console.error('Error loading JSON:', error));

const width = 1200;
const height = 800;

const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([8, 15]);

const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json('world.geojson').then(geoData => {
  const europe = geoData.features.filter(d =>
    [
      'ALB',
      'AUT',
      'BEL',
      'BGR',
      'BIH',
      'CHE',
      'CYP',
      'CZE',
      'DEU',
      'DNK',
      'ESP',
      'EST',
      'FIN',
      'FRA',
      'GRC',
      'HRV',
      'HUN',
      'IRL',
      'ISL',
      'ITA',
      'LTU',
      'LUX',
      'LVA',
      'MDA',
      'MNE',
      'NLD',
      'NOR',
      'POL',
      'PRT',
      'ROU',
      'SVK',
      'SVN',
      'SWE',
      'TUR',
      'UKR',
      'GBR',
      'SRB',
      'HRV',
      'MKD',
      'OSA',
      'MNE',
    ].includes(d.id),
  );

  const projection = d3
    .geoMercator()
    .fitSize([width + 400, height + 400], {
      type: 'FeatureCollection',
      features: europe,
    })
    .translate([100, height / 0.9]);

  const path = d3.geoPath().projection(projection);

  svg
    .selectAll('.country')
    .data(europe)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', d => {
      const code = d.id;
      return educationData[code]
        ? colorScale(educationData[code].years)
        : '#ccc';
    });

  svg
    .selectAll('.grading')
    .data(europe)
    .enter()
    .append('text')
    .attr('class', 'grading')
    // .attr('x', d => path.centroid(d)[0])
    .attr('x', d => {
      const code = d.id;
      if (code === 'FRA') return path.centroid(d)[0] + 36; // Франція
      if (code === 'NOR') return path.centroid(d)[0] + 20; // Норвегія
      if (code === 'GBR') return path.centroid(d)[0] + 10; // Великобританія
      if (code === 'GRC') return path.centroid(d)[0] - 8; // Греція
      return path.centroid(d)[0];
    })
    // .attr('y', d => path.centroid(d)[1] + 10)
    .attr('y', d => {
      const code = d.id;
      if (code === 'FRA') return path.centroid(d)[1] - 10; // Франція
      if (code === 'NOR') return path.centroid(d)[1] + 136; // Норвегія
      if (code === 'GBR') return path.centroid(d)[1] + 35; // Великобританія
      if (code === 'GRC') return path.centroid(d)[1] + 15;
      return path.centroid(d)[1] + 10;
    })
    .text(d => {
      const code = d.id;
      return educationData[code] ? educationData[code].grading : '';
    })
    .attr('font-size', '9px')
    .attr('fill', 'red')
    .attr('font-weight', '700')
    .attr('text-anchor', 'middle');

  svg
    .selectAll('.label')
    .data(europe)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => {
      const code = d.id;
      if (code === 'FRA') return path.centroid(d)[0] + 36; // Франція
      if (code === 'NOR') return path.centroid(d)[0] + 20; // Норвегія
      if (code === 'GBR') return path.centroid(d)[0] + 10; // Великобританія
      if (code === 'GRC') return path.centroid(d)[0] - 8; // Греція
      return path.centroid(d)[0];
    })
    .attr('y', d => {
      const code = d.id;
      if (code === 'FRA') return path.centroid(d)[1] - 20; // Франція
      if (code === 'NOR') return path.centroid(d)[1] + 126; // Норвегія
      if (code === 'GBR') return path.centroid(d)[1] + 25; // Великобританія
      if (code === 'GRC') return path.centroid(d)[1] + 5;
      return path.centroid(d)[1];
    })
    .text(d => {
      const code = d.id;
      return educationData[code] ? educationData[code].years : '';
    })
    .attr('font-size', '8px')
    // .attr('font-weight', '700')
    .attr('fill', 'black')
    .attr('text-anchor', 'middle');

  const legend = svg
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(560,460)`);

  const legendHeight = 100;

  const legendScale = d3.scaleLinear().domain([8, 15]).range([legendHeight, 0]);

  const legendAxis = d3.axisRight(legendScale).ticks(8);

  legend
    .selectAll('rect')
    .data(d3.range(8, 15.01, 0.01))
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d => legendScale(d))
    .attr('width', 20)
    .attr('height', 1)
    .attr('fill', d => colorScale(d));

  legend.append('g').attr('transform', 'translate(20,0)').call(legendAxis);

  legend
    .append('text')
    .attr('x', -25)
    .attr('y', 105)
    .attr('text-anchor', 'middle')
    .text('Роки');

  svg
    .append('text')
    .attr('x', 518)
    .attr('y', 590)
    .attr('class', 'grading-legend')
    .text('Червоним позначено систему оцінювання (A, 100, 5 тощо)')
    .attr('font-size', '12px')
    .attr('fill', 'red')
    .attr('font-weight', 'bold');
});
