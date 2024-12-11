const educationData = {
  ALB: { years: 9, grading: '5' }, // Албанія
  AUT: { years: 9, grading: '5' }, // Австрія
  BEL: { years: 13, grading: 'A' }, // Бельгія
  BIH: { years: 9, grading: '5' }, // Боснія і Герцеговина
  BGR: { years: 11, grading: '6' }, // Болгарія
  HRV: { years: 8, grading: '5' }, // Хорватія
  CYP: { years: 10, grading: '100' }, // Кіпр
  CZE: { years: 10, grading: '5' }, // Чехія
  DNK: { years: 10, grading: '12' }, // Данія
  EST: { years: 9, grading: '5' }, // Естонія
  FIN: { years: 12, grading: '5' }, // Фінляндія
  FRA: { years: 15, grading: '20' }, // Франція
  DEU: { years: 12, grading: '6' }, // Німеччина
  GRC: { years: 11, grading: '20' }, // Греція
  HUN: { years: 13, grading: '5' }, // Угорщина
  ISL: { years: 10, grading: '10' }, // Ісландія
  IRL: { years: 10, grading: '100' }, // Ірландія
  ITA: { years: 10, grading: '10' }, // Італія
  LVA: { years: 11, grading: '10' }, // Латвія
  LTU: { years: 10, grading: '10' }, // Литва
  LUX: { years: 12, grading: '60' }, // Люксембург
  MDA: { years: 11, grading: '10' }, // Молдова
  MNE: { years: 9, grading: '5' }, // Чорногорія
  NLD: { years: 11, grading: '10' }, // Нідерланди
  MKD: { years: 11, grading: '5' }, // Північна Македонія
  NOR: { years: 10, grading: '6' }, // Норвегія
  POL: { years: 9, grading: '6' }, // Польща
  PRT: { years: 12, grading: '20' }, // Португалія
  ROU: { years: 13, grading: '10' }, // Румунія
  SRB: { years: 9, grading: '5' }, // Сербія
  SVK: { years: 11, grading: '5' }, // Словаччина
  SVN: { years: 9, grading: '5' }, // Словенія
  ESP: { years: 10, grading: '10' }, // Іспанія
  SWE: { years: 10, grading: 'A' }, // Швеція
  CHE: { years: 11, grading: '6' }, // Швейцарія
  TUR: { years: 12, grading: '100' }, // Туреччина
  UKR: { years: 9, grading: '12' }, // Україна
  GBR: { years: 12, grading: 'A' }, // Велика Британія
  OSA: { years: 9, grading: '5' }, // Косово
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
