const educationData = {
  ALB: 9, // Албанія
  AUT: 9, // Австрія
  BEL: 13, // Бельгія
  BIH: 9, // Боснія і Герцеговина
  BGR: 11, // Болгарія
  HRV: 8, // Хорватія
  CYP: 10, // Кіпр
  CZE: 10, // Чехія
  DNK: 10, // Данія
  EST: 9, // Естонія
  FIN: 12, // Фінляндія
  FRA: 15, // Франція
  DEU: 12, // Німеччина
  GRC: 11, // Греція
  HUN: 13, // Угорщина
  ISL: 10, // Ісландія
  IRL: 10, // Ірландія
  ITA: 10, // Італія
  LVA: 11, // Латвія
  LTU: 10, // Литва
  LUX: 12, // Люксембург
  MDA: 11, // Молдова
  MNE: 9, // Чорногорія
  NLD: 11, // Нідерланди
  MKD: 11, // Північна Македонія
  NOR: 10, // Норвегія
  POL: 9, // Польща
  PRT: 12, // Португалія
  ROU: 13, // Румунія
  SRB: 9, // Сербія
  SVK: 11, // Словаччина
  SVN: 9, // Словенія
  ESP: 10, // Іспанія
  SWE: 10, // Швеція
  CHE: 11, // Швейцарія
  TUR: 12, // Туреччина
  UKR: 9, // Україна
  GBR: 12, // Велика Британія
  MKD: 11, // Північна Македонія
  OSA: 9, // Kosovo
};

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
      return educationData[code] ? colorScale(educationData[code]) : '#ccc';
    });

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
      return educationData[code] ? educationData[code] : '';
    })
    .attr('font-size', '9px')
    .attr('font-weight', '700')
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
});
