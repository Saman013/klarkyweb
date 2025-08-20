function randomShape() {
    const keys = Object.keys(shapes);
    return keys[Math.floor(Math.random() * keys.length)];
  }
const shapes = {
    I: [
      [[1], [1], [1], [1]],
      [[1, 1, 1, 1]],
    ],
    O: [
      [[1, 1],
       [1, 1]],
    ],
    T: [
      [[0, 1, 0],
       [1, 1, 1]],
      [[1, 0],
       [1, 1],
       [1, 0]],
      [[1, 1, 1],
       [0, 1, 0]],
      [[0, 1],
       [1, 1],
       [0, 1]]
    ],
    L: [
      [[1, 0],
       [1, 0],
       [1, 1]],
      [[1, 1, 1],
       [1, 0, 0]],
      [[1, 1],
       [0, 1],
       [0, 1]],
      [[0, 0, 1],
       [1, 1, 1]]
    ],
    J: [
      [[0, 1],
       [0, 1],
       [1, 1]],
      [[1, 0, 0],
       [1, 1, 1]],
      [[1, 1],
       [1, 0],
       [1, 0]],
      [[1, 1, 1],
       [0, 0, 1]]
    ],
    S: [
      [[0, 1, 1],
       [1, 1, 0]],
      [[1, 0],
       [1, 1],
       [0, 1]]
    ],
    Z: [
      [[1, 1, 0],
       [0, 1, 1]],
      [[0, 1],
       [1, 1],
       [1, 0]]
    ]
  };
  
  // Matrix dimensions for sidebar/header
  const WIDTH = 200;
  const HEIGHT = 60;
  
  const mLeft = createMatrix(WIDTH, HEIGHT);
//const mRight = createMatrix(WIDTH, HEIGHT);
  const mHeader = createMatrix(100, 6);

  // Create a 2D grid (all 0)
  function createMatrix(width, height) {
    return Array.from({ length: height }, () => Array(width).fill(0));
  }
  
  // Try placing a shape into matrix at a position
  function canPlace(matrix, shape, x, y) {
    const rows = shape.length;
    const cols = shape[0].length;
  
    if (y + rows > matrix.length || x + cols > matrix[0].length) {
      return false;
    }
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (shape[i][j]) {
          const xi = x + j;
          const yi = y + i;
  
          if (matrix[yi][xi]) return false;
        }
      }
    }
    return true;
  }
  
  
  function placeShape(matrix, shape, x, y, color) {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].length; j++) {
        if (shape[i][j]) {
          matrix[y + i][x + j] = color;
        }
      }
    }
  }
  
  function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 60%)`;
  }
  
  // Fill matrix with random tetriminos
  function fillMatrix(matrix) {
    const usedColors = new Set();
  
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
  
        if (matrix[y][x]) continue; // already filled
  
        const shapeKey = randomShape();
        const shapeVariants = shapes[shapeKey];
  
        // Try all rotations of a shape
        for (let shape of shuffleArray(shapeVariants)) {
          const rows = shape.length;
          const cols = shape[0].length;
  
          if (x + cols > matrix[0].length || y + rows > matrix.length) {
            continue; // shape would overflow
          }
  
          if (canPlace(matrix, shape, x, y)) {
            let color;
            let tries = 0;
  
            // Ensure new color isn't next to same color
            do {
              color = randomColor();
              tries++;
            } while (hasSameColorNeighbor(matrix, shape, x, y, color) && tries < 10);
  
            placeShape(matrix, shape, x, y, color);
            break; // break out of shape loop
          }
        }
      }
    }
  }
  
  function hasSameColorNeighbor(matrix, shape, x, y, color) {
    const rows = shape.length;
    const cols = shape[0].length;
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!shape[i][j]) continue;
  
        const xi = x + j;
        const yi = y + i;
  
        const neighbors = [
          [yi - 1, xi],
          [yi + 1, xi],
          [yi, xi - 1],
          [yi, xi + 1]
        ];
  
        for (const [ny, nx] of neighbors) {
          if (
            ny >= 0 &&
            ny < matrix.length &&
            nx >= 0 &&
            nx < matrix[0].length &&
            matrix[ny][nx] === color
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function shuffleArray(array) {
    return array.slice().sort(() => Math.random() - 0.5);
  }
  
  function renderMatrix(matrix, container) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${matrix[0].length}, 10px)`;
    container.style.gridTemplateRows = `repeat(${matrix.length}, 10px)`;
    container.style.gap = '0';
  
    for (let row of matrix) {
      for (let cell of row) {
        const div = document.createElement('div');
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.backgroundColor = cell ? cell : 'transparent';
        container.appendChild(div);
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const left = document.getElementById("left-sidebar");
    const right = document.getElementById("right-sidebar");
    const header = document.getElementById("tetris-header");
  
    const mLeft = createMatrix(WIDTH, HEIGHT);
    const mRight = createMatrix(WIDTH, HEIGHT);
    const mHeader = createMatrix(30, 6); // Wider header
  
    fillMatrix(mLeft);
    fillMatrix(mRight);
    fillMatrix(mHeader);
  
    renderMatrix(mLeft, left);
    renderMatrix(mRight, right);
    renderMatrix(mHeader, header);
  });
  /* ---------- 2.1 COUNTDOWN (to next Aug 20, local time) ---------- */
(function countdownModule(){
  const el = document.getElementById('countdown-timer');
  if (!el) return;

  function nextAug20(now=new Date()){
    const y = now.getFullYear();
    const aug20ThisYear = new Date(y, 7, 20, 0, 0, 0);
    if (now <= aug20ThisYear) return aug20ThisYear;
    return new Date(y + 1, 7, 20, 0, 0, 0);
  }

  function pad(n){ return String(n).padStart(2,'0'); }

  function render(){
    const now = new Date();
    const target = nextAug20(now);
    const diffMs = target - now;
    if (diffMs <= 0) { el.textContent = "It's August 20 — happy birthday! 🎉"; return; }

    const totalSec = Math.floor(diffMs/1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    el.textContent = `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  }

  render();
  setInterval(render, 1000);
})();

/* ---------- 2.2 WEATHER — Faro, Portugal (OpenWeatherMap) ---------- */

(function weatherModule(){
  const API_KEY = "8918e9b866b3018eb244b50fd2e4c7e3"; // <-- key
  const CITY = "Faro,PT";
  const currentEl = document.getElementById('weather-current');
  const forecastEl = document.getElementById('weather-forecast');
  if (!currentEl || !forecastEl) return;

  function iconUrl(code){ return `https://openweathermap.org/img/wn/${code}@2x.png`; }

  async function fetchJSON(url){
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadWeather(){
    try {
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric`;

      const [current, forecast] = await Promise.all([fetchJSON(currentUrl), fetchJSON(forecastUrl)]);

      // Current
      const c = current;
      const temp = Math.round(c.main.temp);
      const feels = Math.round(c.main.feels_like);
      const desc = c.weather?.[0]?.description ?? '—';
      const icon = c.weather?.[0]?.icon ?? '01d';
      const wind = Math.round(c.wind?.speed ?? 0);
      currentEl.innerHTML = `
        <img alt="${desc}" src="${iconUrl(icon)}" />
        <div><strong>${temp}°C</strong> (feels ${feels}°C) — ${desc}<br/>
        💨 ${wind} m/s • 🌡️ min ${Math.round(c.main.temp_min)}° / max ${Math.round(c.main.temp_max)}°</div>
      `;

      // Forecast: pick one reading around 12:00 each day (clean daily view)
      const byDay = new Map();
      for (const item of forecast.list) {
        const dt = new Date(item.dt * 1000);
        const dayKey = dt.toISOString().slice(0,10);
        const hour = dt.getUTCHours();
        // Prefer midday-ish entries (11–14 UTC), else first occurrence
        const currentBest = byDay.get(dayKey);
        const score = Math.abs(hour - 12);
        if (!currentBest || score < currentBest.score) {
          byDay.set(dayKey, {item, score});
        }
      }
      const days = Array.from(byDay.values())
        .slice(0, 5) // next 5 days
        .map(({item}) => item);

      forecastEl.innerHTML = days.map(d => {
        const dt = new Date(d.dt * 1000);
        const label = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const icon = d.weather?.[0]?.icon ?? '01d';
        const desc = d.weather?.[0]?.main ?? '';
        const temp = Math.round(d.main.temp);
        return `
          <div class="day">
            <div>${label}</div>
            <img alt="${desc}" src="${iconUrl(icon)}" />
            <div>${temp}°C</div>
            <div>${desc}</div>
          </div>
        `;
      }).join('');

    } catch (err) {
      currentEl.textContent = "Couldn’t load weather. Check API key / network.";
      console.error(err);
    }
  }

  loadWeather();
})();

/* ---------- 2.3 JEWISH HOLIDAYS (Hebcal API) ---------- */
/* We’ll fetch current + next year, then show upcoming holidays for 12 months. */
(function jewishCalendarModule(){
  const listEl = document.getElementById('calendar-list');
  if (!listEl) return;

  function hebcalUrl(year){
    // Major + minor + modern holidays; JSON format
    return `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&year=${year}`;
  }

  async function fetchJSON(url){
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function isHolidayItem(it){
    // Filter out candle lighting, havdalah, parashat, daf yomi, etc.
    const cat = (it.category || '').toLowerCase();
    if (['candles','havdalah','parashat','dafyomi','omer'].includes(cat)) return false;
    return true;
  }

  function upcomingInNext12Months(items){
    const now = new Date();
    const limit = new Date(now);
    limit.setMonth(limit.getMonth() + 12);
    return items
      .map(it => ({...it, dateObj: new Date(it.date)}))
      .filter(it => it.dateObj >= now && it.dateObj <= limit && isHolidayItem(it))
      .sort((a,b) => a.dateObj - b.dateObj);
  }

  function fmtDate(d){
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  async function loadHolidays(){
    try {
      const y = new Date().getFullYear();
      const [a, b] = await Promise.all([fetchJSON(hebcalUrl(y)), fetchJSON(hebcalUrl(y+1))]);
      const items = [...(a.items||[]), ...(b.items||[])];
      const upcoming = upcomingInNext12Months(items);

      if (!upcoming.length){
        listEl.innerHTML = `<li>No upcoming holidays found.</li>`;
        return;
      }

      listEl.innerHTML = upcoming.map(it => `
        <li>
          <span>${it.title}</span>
          <span class="date">${fmtDate(it.dateObj)}</span>
        </li>
      `).join('');
    } catch (err) {
      listEl.innerHTML = `<li>Couldn’t load holidays. Please check your internet connection.</li>`;
      console.error(err);
    }
  }

  loadHolidays();
})();
document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: async function(fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch(
          'https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&ss=on&mf=on&c=on&geo=none'
        );
        const data = await response.json();

        // convert Hebcal API response into FullCalendar events
        const events = data.items.map(item => ({
          title: item.title,
          start: item.date
        }));

        successCallback(events);
      } catch (error) {
        failureCallback(error);
      }
    }
  });

  calendar.render();
});


/* ---------- 2.4 QUEER BOOK GENERATOR (curated + Open Library covers) ---------- */
(function queerBookModule(){
  const btn = document.getElementById('book-btn');
  const out = document.getElementById('book-result');
  if (!btn || !out) return;

  const BOOKS = [
    { title: "Stone Butch Blues", author: "Leslie Feinberg" },
    { title: "Giovanni's Room", author: "James Baldwin" },
    { title: "Maurice", author: "E. M. Forster" },
    { title: "The Color Purple", author: "Alice Walker" },
    { title: "Rubyfruit Jungle", author: "Rita Mae Brown" },
    { title: "Oranges Are Not the Only Fruit", author: "Jeanette Winterson" },
    { title: "Fun Home", author: "Alison Bechdel" },
    { title: "Call Me by Your Name", author: "André Aciman" },
    { title: "Detransition, Baby", author: "Torrey Peters" },
    { title: "On Earth We’re Briefly Gorgeous", author: "Ocean Vuong" },
    { title: "Carmilla", author: "J. Sheridan Le Fanu" },
    { title: "An Unkindness of Ghosts", author: "Rivers Solomon" },
    { title: "Nevada", author: "Imogen Binnie" },
    { title: "We Have Always Been Here", author: "Samra Habib" },
    { title: "The Miseducation of Cameron Post", author: "Emily M. Danforth" },
    { title: "Red, White & Royal Blue", author: "Casey McQuiston" },
    { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid" },
    { title: "The Song of Achilles", author: "Madeline Miller" },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde" },
    { title: "Paul Takes the Form of a Mortal Girl", author: "Andrea Lawlor" }
  ];

  let lastIndex = -1;

  function pickBook(){
    if (BOOKS.length === 1) return 0;
    let i;
    do { i = Math.floor(Math.random() * BOOKS.length); } while (i === lastIndex);
    lastIndex = i;
    return i;
  }

  async function searchOpenLibraryCover(title, author){
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const doc = data?.docs?.[0];
      if (!doc) return null;
      const cover = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null;
      const link = doc.key ? `https://openlibrary.org${doc.key}` : null;
      const year = doc.first_publish_year || null;
      return { cover, link, year };
    } catch {
      return null;
    }
  }

  async function showRandomBook(){
    const idx = pickBook();
    const b = BOOKS[idx];
    out.innerHTML = `<div>Loading…</div>`;

    const ol = await searchOpenLibraryCover(b.title, b.author);

    const img = ol?.cover ?? 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="92" height="138"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#666">No cover</text></svg>`);
    const year = ol?.year ? `<div class="book-year">First published ${ol.year}</div>` : '';
    const link = ol?.link ? `<div class="book-links"><a href="${ol.link}" target="_blank" rel="noopener">Open Library</a></div>` : '';

    out.innerHTML = `
      <img alt="Book cover" src="${img}" />
      <div class="book-meta">
        <div class="book-title">${b.title}</div>
        <div class="book-author">by ${b.author}</div>
        ${year}
        ${link}
      </div>
    `;
  }

  btn.addEventListener('click', showRandomBook);
})();

const people = [
  {
    "name": "Karel Gott",
    "image": "People/people1.jpg",
    "bio": "Nejlepší zpěvák všech dob s vysokým cé a s dámou ve trezoru"
  },
  {
    "name": "Bobby Brocoli",
    "image": "People/people2.jpg",
    "bio": "Něco mezi youtuberem a bohem"
  },
  {
    "name": "Thomas Lipton",
    "image": "People/people3.jpg",
    "bio": "Zakladatel oblíbeného řetězce slazených nápojů"
  },
  {
    "name": "Tetris kid",
    "image": "People/people5.jpg",
    "bio": "Třináctiletý chlapec z Oklahomy, který dohrál tetris?"
  },
  {
    "name": "Hank Green",
    "image": "People/people4.jpg",
    "bio": "Expert na tuberkulózu, letadla a nevimcoještě"
  },
  {
    "name": "Lukáš Krtek Koucký",
    "image": "People/people6.jpg",
    "bio": "Uznávaný odborník na ortopedii"
  },
  {
    "name": "Daniel Šamánek",
    "image": "People/people7.jpg",
    "bio": "Umí zpívat limonádového joea a doesnt give a fuck"
  },
  {
    "name": "Vít Sosík Hromas",
    "image": "People/people8.jpg",
    "bio": "Příští sekretářka v bílém domě, nikdo nezná tabulky lépe než on"
  },
  {
    "name": "John Green",
    "image": "People/people9.jpg",
    "bio": "Píše o antropologii lidstva a taky o problémech teenagerů"
  },
  {
    "name": "Robert Oppenheimer",
    "image": "People/people10.jpg",
    "bio": "Jeho kariéra byla on fire"
  },
  {
    "name": "Willy Fog",
    "image": "People/people11.jpg",
    "bio": "Za osmdesát dnů si získal slávu a srdce všech žen"
  },
  {
    "name": "Martin Kapoun",
    "image": "People/people12.jpg",
    "bio": "Z jeho zrzavé kštice zbyly čtyři vlasy posvátné krávy"
  },
  {
    "name": "Tereza? Lišková",
    "image": "People/people13.jpg",
    "bio": "Dáma s hranostajem to úplně není, ale umí štěkat"
  },
  {
    "name": "Josef Maršálek",
    "image": "People/people14.jpg",
    "bio": "Prostě borec idk"
  },
  {
    "name": "Tereza Kostková",
    "image": "People/people15.jpg",
    "bio": "Má vždycky tak krásné šaty!"
  },
];

function loadPerson() {
  const person = people[Math.floor(Math.random() * people.length)];
  document.getElementById("person-name").textContent = person.name;
  document.getElementById("person-image").src = person.image;
  document.getElementById("person-bio").textContent = person.bio;
}

window.addEventListener("DOMContentLoaded", loadPerson);

