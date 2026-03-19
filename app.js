const TRANSFER_MINUTES = 4.5;

const LINE_DATA = [
  {
    id: "L1",
    name: "Linea 1",
    color: "#d32633",
    segmentMinutes: 2.15,
    stations: [
      "San Pablo",
      "Neptuno",
      "Pajaritos",
      "Las Rejas",
      "Ecuador",
      "San Alberto Hurtado",
      "Universidad de Santiago",
      "Estacion Central",
      "Union Latinoamericana",
      "Republica",
      "Los Heroes",
      "La Moneda",
      "Universidad de Chile",
      "Santa Lucia",
      "Universidad Catolica",
      "Baquedano",
      "Salvador",
      "Manuel Montt",
      "Pedro de Valdivia",
      "Los Leones",
      "Tobalaba",
      "El Golf",
      "Alcantara",
      "Escuela Militar",
      "Manquehue",
      "Hernando de Magallanes",
      "Los Dominicos"
    ]
  },
  {
    id: "L2",
    name: "Linea 2",
    color: "#f2c305",
    segmentMinutes: 2.05,
    stations: [
      "Vespucio Norte",
      "Zapadores",
      "Dorsal",
      "Einstein",
      "Cementerios",
      "Cerro Blanco",
      "Patronato",
      "Puente Cal y Canto",
      "Santa Ana",
      "Los Heroes",
      "Toesca",
      "Parque O'Higgins",
      "Rondizzoni",
      "Franklin",
      "El Llano",
      "San Miguel",
      "Lo Vial",
      "Departamental",
      "Ciudad del Nino",
      "Lo Ovalle",
      "El Parron",
      "La Cisterna",
      "El Bosque",
      "Observatorio",
      "Copa Lo Martinez",
      "Hospital El Pino"
    ]
  },
  {
    id: "L3",
    name: "Linea 3",
    color: "#8a959b",
    segmentMinutes: 1.95,
    stations: [
      "Plaza Quilicura",
      "Lo Cruzat",
      "Ferrocarril",
      "Los Libertadores",
      "Cardenal Caro",
      "Vivaceta",
      "Conchali",
      "Plaza Chacabuco",
      "Hospitales",
      "Puente Cal y Canto",
      "Plaza de Armas",
      "Universidad de Chile",
      "Parque Almagro",
      "Matta",
      "Irarrazaval",
      "Monsenor Eyzaguirre",
      "Nunoa",
      "Chile Espana",
      "Villa Frei",
      "Plaza Egana",
      "Fernando Castillo Velasco"
    ]
  },
  {
    id: "L4",
    name: "Linea 4",
    color: "#2b56a5",
    segmentMinutes: 2.25,
    stations: [
      "Tobalaba",
      "Cristobal Colon",
      "Francisco Bilbao",
      "Principe de Gales",
      "Simon Bolivar",
      "Plaza Egana",
      "Los Orientales",
      "Grecia",
      "Los Presidentes",
      "Quilin",
      "Las Torres",
      "Macul",
      "Vicuna Mackenna",
      "Vicente Valdes",
      "Rojas Magallanes",
      "Trinidad",
      "San Jose de la Estrella",
      "Los Quillayes",
      "Elisa Correa",
      "Hospital Sotero del Rio",
      "Protectora de la Infancia",
      "Las Mercedes",
      "Plaza de Puente Alto"
    ]
  },
  {
    id: "L4A",
    name: "Linea 4A",
    color: "#5aa33d",
    segmentMinutes: 2.1,
    stations: [
      "Vicuna Mackenna",
      "Santa Julia",
      "La Granja",
      "Santa Rosa",
      "San Ramon",
      "La Cisterna"
    ]
  },
  {
    id: "L5",
    name: "Linea 5",
    color: "#289f58",
    segmentMinutes: 2.0,
    stations: [
      "Plaza de Maipu",
      "Santiago Bueras",
      "Del Sol",
      "Monte Tabor",
      "Las Parcelas",
      "Laguna Sur",
      "Barrancas",
      "Pudahuel",
      "San Pablo",
      "Lo Prado",
      "Blanqueado",
      "Gruta de Lourdes",
      "Quinta Normal",
      "Cumming",
      "Santa Ana",
      "Plaza de Armas",
      "Bellas Artes",
      "Baquedano",
      "Parque Bustamante",
      "Santa Isabel",
      "Irarrazaval",
      "Nuble",
      "Rodrigo de Araya",
      "Carlos Valdovinos",
      "Camino Agricola",
      "San Joaquin",
      "Pedrero",
      "Mirador",
      "Bellavista de La Florida",
      "Vicente Valdes"
    ]
  },
  {
    id: "L6",
    name: "Linea 6",
    color: "#a84c99",
    segmentMinutes: 1.85,
    stations: [
      "Cerrillos",
      "Lo Valledor",
      "Presidente Pedro Aguirre Cerda",
      "Franklin",
      "Bio Bio",
      "Nuble",
      "Estadio Nacional",
      "Nunoa",
      "Ines de Suarez",
      "Los Leones"
    ]
  }
];

const nodes = new Map();
const adjacency = new Map();
const stationNodeMap = new Map();
const stationDisplayMap = new Map();
const lineById = new Map(LINE_DATA.map((line) => [line.id, line]));

const routeForm = document.querySelector("#routeForm");
const stationsList = document.querySelector("#stationsList");
const lineFilters = document.querySelector("#lineFilters");
const originInput = document.querySelector("#originInput");
const destinationInput = document.querySelector("#destinationInput");
const timeInput = document.querySelector("#timeInput");
const dayTypeSelect = document.querySelector("#dayType");
const swapBtn = document.querySelector("#swapBtn");
const resetBtn = document.querySelector("#resetBtn");
const emptyState = document.querySelector("#emptyState");
const resultState = document.querySelector("#resultState");
const statsCards = document.querySelector("#statsCards");
const bestRouteSteps = document.querySelector("#bestRouteSteps");
const altRouteSteps = document.querySelector("#altRouteSteps");
const networkStatus = document.querySelector("#networkStatus");
const installBtn = document.querySelector("#installBtn");
const openMapBtn = document.querySelector("#openMapBtn");
const mapDialog = document.querySelector("#mapDialog");

let deferredPrompt;

init();

function init() {
  buildNetwork();
  populateStations();
  renderLineFilters();
  setDefaultDateTime();
  updateNetworkStatus();
  wireEvents();
  registerServiceWorker();
}

function normalizeStation(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function nodeId(lineId, stationName) {
  return `${lineId}|${stationName}`;
}

function createEdge(from, to, type, minutes) {
  adjacency.get(from).push({ to, type, minutes });
}

function buildNetwork() {
  LINE_DATA.forEach((line) => {
    line.stations.forEach((station, index) => {
      const id = nodeId(line.id, station);
      const canonical = normalizeStation(station);

      nodes.set(id, {
        id,
        lineId: line.id,
        lineName: line.name,
        color: line.color,
        station,
        canonical,
        index
      });

      adjacency.set(id, []);

      if (!stationNodeMap.has(canonical)) {
        stationNodeMap.set(canonical, []);
        stationDisplayMap.set(canonical, station);
      }

      stationNodeMap.get(canonical).push(id);
    });

    for (let i = 0; i < line.stations.length - 1; i += 1) {
      const a = nodeId(line.id, line.stations[i]);
      const b = nodeId(line.id, line.stations[i + 1]);
      createEdge(a, b, "ride", line.segmentMinutes);
      createEdge(b, a, "ride", line.segmentMinutes);
    }
  });

  for (const [, nodeIds] of stationNodeMap.entries()) {
    if (nodeIds.length < 2) {
      continue;
    }

    for (let i = 0; i < nodeIds.length - 1; i += 1) {
      for (let j = i + 1; j < nodeIds.length; j += 1) {
        const from = nodeIds[i];
        const to = nodeIds[j];
        createEdge(from, to, "transfer", TRANSFER_MINUTES);
        createEdge(to, from, "transfer", TRANSFER_MINUTES);
      }
    }
  }
}

function populateStations() {
  const stationNames = [...stationDisplayMap.values()].sort((a, b) => a.localeCompare(b, "es"));

  stationsList.innerHTML = "";
  stationNames.forEach((station) => {
    const option = document.createElement("option");
    option.value = station;
    stationsList.append(option);
  });
}

function renderLineFilters() {
  lineFilters.innerHTML = "";

  LINE_DATA.forEach((line) => {
    const label = document.createElement("label");
    label.className = "line-chip";

    label.innerHTML = `
      <input type="checkbox" name="line" value="${line.id}" checked>
      <span class="dot" style="background:${line.color}"></span>
      <span>${line.id}</span>
    `;

    lineFilters.append(label);
  });
}

function setDefaultDateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  timeInput.value = `${hh}:${mm}`;

  if (now.getDay() === 0) {
    dayTypeSelect.value = "sunday";
    return;
  }

  if (now.getDay() === 6) {
    dayTypeSelect.value = "saturday";
    return;
  }

  dayTypeSelect.value = "weekday";
}

function wireEvents() {
  routeForm.addEventListener("submit", onSubmit);

  swapBtn.addEventListener("click", () => {
    const temp = originInput.value;
    originInput.value = destinationInput.value;
    destinationInput.value = temp;
  });

  resetBtn.addEventListener("click", () => {
    routeForm.reset();
    setDefaultDateTime();
    clearResults();

    const checks = lineFilters.querySelectorAll("input[type='checkbox']");
    checks.forEach((input) => {
      input.checked = true;
    });
  });

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);

  openMapBtn.addEventListener("click", () => {
    if (typeof mapDialog.showModal === "function") {
      mapDialog.showModal();
      return;
    }

    window.open(
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Mapa_Metro_de_Santiago.png",
      "_blank",
      "noopener"
    );
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = undefined;
    installBtn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = undefined;
    installBtn.hidden = true;
  });
}

function updateNetworkStatus() {
  if (navigator.onLine) {
    networkStatus.textContent = "En linea: puedes ver el plano remoto y la app seguira funcionando offline para rutas.";
    return;
  }

  networkStatus.textContent = "Sin conexion: modo offline activo para planificar rutas con los datos locales.";
}

function getAllowedLines() {
  const selected = [...lineFilters.querySelectorAll("input[type='checkbox']:checked")]
    .map((input) => input.value);
  return new Set(selected);
}

function resolveStation(value) {
  const canonical = normalizeStation(value);
  if (!canonical) {
    return null;
  }

  if (stationDisplayMap.has(canonical)) {
    return {
      canonical,
      display: stationDisplayMap.get(canonical)
    };
  }

  const startsWith = [...stationDisplayMap.entries()]
    .find(([key]) => key.startsWith(canonical));

  if (startsWith) {
    return {
      canonical: startsWith[0],
      display: startsWith[1]
    };
  }

  return null;
}

function onSubmit(event) {
  event.preventDefault();

  const origin = resolveStation(originInput.value);
  const destination = resolveStation(destinationInput.value);
  const dayType = dayTypeSelect.value;
  const departureTime = timeInput.value;
  const allowedLines = getAllowedLines();

  if (!origin || !destination) {
    renderError("No encuentro una o ambas estaciones. Elige una opcion valida del listado.");
    return;
  }

  if (origin.canonical === destination.canonical) {
    renderError("Origen y destino son iguales. Selecciona estaciones diferentes.");
    return;
  }

  if (allowedLines.size === 0) {
    renderError("Debes habilitar al menos una linea para calcular ruta.");
    return;
  }

  const best = findRoute({
    fromCanonical: origin.canonical,
    toCanonical: destination.canonical,
    allowedLines,
    transferPenalty: TRANSFER_MINUTES
  });

  const lowTransfer = findRoute({
    fromCanonical: origin.canonical,
    toCanonical: destination.canonical,
    allowedLines,
    transferPenalty: 11
  });

  if (!best) {
    renderError("No hay ruta con las lineas seleccionadas. Prueba activando mas lineas.");
    return;
  }

  const bestPlan = buildPlan(best.path);
  const altPlan = lowTransfer ? buildPlan(lowTransfer.path) : null;
  const travelMinutes = Math.max(1, Math.round(best.minutes));
  const crowd = getCrowdSuggestion(dayType, departureTime);

  renderResult({
    origin: origin.display,
    destination: destination.display,
    departureTime,
    travelMinutes,
    arrivalTime: addMinutesToTime(departureTime, travelMinutes),
    bestPlan,
    altPlan,
    crowd,
    altIsEqual: lowTransfer ? pathSignature(lowTransfer.path) === pathSignature(best.path) : true
  });
}

function findRoute({ fromCanonical, toCanonical, allowedLines, transferPenalty }) {
  const starts = (stationNodeMap.get(fromCanonical) || [])
    .filter((id) => allowedLines.has(nodes.get(id).lineId));
  const ends = new Set(
    (stationNodeMap.get(toCanonical) || [])
      .filter((id) => allowedLines.has(nodes.get(id).lineId))
  );

  if (starts.length === 0 || ends.size === 0) {
    return null;
  }

  const dist = new Map();
  const prev = new Map();
  const queue = [];

  starts.forEach((id) => {
    dist.set(id, 0);
    queue.push({ id, cost: 0 });
  });

  let bestEnd = null;

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();

    if (!current) {
      break;
    }

    if (current.cost > (dist.get(current.id) ?? Infinity)) {
      continue;
    }

    if (ends.has(current.id)) {
      bestEnd = current.id;
      break;
    }

    const edges = adjacency.get(current.id) || [];

    edges.forEach((edge) => {
      const currentNode = nodes.get(current.id);
      const nextNode = nodes.get(edge.to);

      if (!currentNode || !nextNode) {
        return;
      }

      if (!allowedLines.has(nextNode.lineId)) {
        return;
      }

      const edgeCost = edge.type === "transfer" ? transferPenalty : edge.minutes;
      const nextCost = current.cost + edgeCost;

      if (nextCost < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, nextCost);
        prev.set(edge.to, current.id);
        queue.push({ id: edge.to, cost: nextCost });
      }
    });
  }

  if (!bestEnd) {
    return null;
  }

  const path = [];
  let current = bestEnd;
  while (current) {
    path.push(current);
    current = prev.get(current);
  }

  path.reverse();

  return {
    path,
    minutes: dist.get(bestEnd) ?? 0
  };
}

function buildPlan(path) {
  const steps = [];
  let transferCount = 0;
  let rideStops = 0;

  const routeNodes = path.map((id) => nodes.get(id)).filter(Boolean);
  if (routeNodes.length < 2) {
    return {
      steps,
      transferCount,
      stationCount: 0
    };
  }

  let rideStart = routeNodes[0];

  for (let i = 1; i < routeNodes.length; i += 1) {
    const prevNode = routeNodes[i - 1];
    const currentNode = routeNodes[i];

    if (prevNode.lineId === currentNode.lineId) {
      rideStops += 1;
      continue;
    }

    if (prevNode.station !== rideStart.station) {
      steps.push(createRideStep(rideStart, prevNode));
    }

    steps.push({
      type: "transfer",
      station: prevNode.station,
      fromLine: prevNode.lineId,
      toLine: currentNode.lineId
    });

    transferCount += 1;
    rideStart = currentNode;
  }

  const finalNode = routeNodes[routeNodes.length - 1];
  if (finalNode.station !== rideStart.station) {
    steps.push(createRideStep(rideStart, finalNode));
  }

  return {
    steps,
    transferCount,
    stationCount: rideStops
  };
}

function createRideStep(fromNode, toNode) {
  const line = lineById.get(fromNode.lineId);
  const direction = getDirection(line, fromNode.index, toNode.index);
  return {
    type: "ride",
    lineId: line.id,
    lineName: line.name,
    color: line.color,
    from: fromNode.station,
    to: toNode.station,
    direction,
    stops: Math.abs(toNode.index - fromNode.index)
  };
}

function getDirection(line, fromIndex, toIndex) {
  if (toIndex > fromIndex) {
    return line.stations[line.stations.length - 1];
  }

  return line.stations[0];
}

function getCrowdSuggestion(dayType, timeValue) {
  const minutes = parseTimeToMinutes(timeValue);

  if (Number.isNaN(minutes)) {
    return {
      level: "Media",
      note: "Si puedes, evita picos de 07:00-09:30 y 17:30-20:30 en dias laborales."
    };
  }

  if (dayType === "weekday") {
    if (isRange(minutes, 420, 570) || isRange(minutes, 1050, 1230)) {
      return {
        level: "Alta",
        note: "Hora punta laboral. Si puedes, mueve el viaje entre 10:00-12:30 o despues de 20:30."
      };
    }

    if (isRange(minutes, 570, 660) || isRange(minutes, 930, 1050) || isRange(minutes, 1230, 1320)) {
      return {
        level: "Media",
        note: "Congestion intermedia. Te conviene salir 15-20 minutos antes para ir con margen."
      };
    }

    return {
      level: "Baja",
      note: "Buen horario para viajar con menos saturacion."
    };
  }

  if (dayType === "saturday") {
    if (isRange(minutes, 720, 930)) {
      return {
        level: "Media",
        note: "En sabado, evita entre 12:00 y 15:30 si quieres menos espera."
      };
    }

    return {
      level: "Baja",
      note: "Horario comodo para moverse el sabado."
    };
  }

  if (isRange(minutes, 780, 960)) {
    return {
      level: "Media",
      note: "Domingo al mediodia suele tener mayor movimiento en zonas comerciales."
    };
  }

  return {
    level: "Baja",
    note: "Domingo con flujo estable en la mayoria de tramos."
  };
}

function parseTimeToMinutes(value) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return NaN;
  }

  return h * 60 + m;
}

function addMinutesToTime(value, addMinutes) {
  const minutes = parseTimeToMinutes(value);
  if (Number.isNaN(minutes)) {
    return "--:--";
  }

  const total = (minutes + addMinutes + 1440) % 1440;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isRange(value, min, max) {
  return value >= min && value <= max;
}

function pathSignature(path) {
  return path.join(" > ");
}

function renderResult({
  origin,
  destination,
  departureTime,
  travelMinutes,
  arrivalTime,
  bestPlan,
  altPlan,
  crowd,
  altIsEqual
}) {
  emptyState.hidden = true;
  resultState.hidden = false;

  statsCards.innerHTML = "";
  createStat("Trayecto", `${origin} -> ${destination}`);
  createStat("Duracion estimada", `${travelMinutes} min`);
  createStat("Salida / llegada", `${departureTime} -> ${arrivalTime}`);
  createStat("Combinaciones", `${bestPlan.transferCount}`);
  createStat("Estaciones aprox.", `${bestPlan.stationCount}`);
  createStat("Flujo esperado", `${crowd.level}`);

  renderSteps(bestRouteSteps, bestPlan.steps, false);

  if (!altPlan || altIsEqual) {
    altRouteSteps.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = "La alternativa coincide con la ruta recomendada para los filtros actuales.";
    altRouteSteps.append(li);
  } else {
    renderSteps(altRouteSteps, altPlan.steps, true);
  }

  const note = document.createElement("p");
  note.className = "small";
  note.textContent = `Sugerencia horaria: ${crowd.note}`;

  const oldNote = resultState.querySelector(".small");
  if (oldNote) {
    oldNote.remove();
  }

  resultState.append(note);
}

function createStat(key, value) {
  const card = document.createElement("article");
  card.className = "stat";
  card.innerHTML = `<div class="k">${key}</div><div class="v">${value}</div>`;
  statsCards.append(card);
}

function renderSteps(container, steps, showLabel) {
  container.innerHTML = "";

  if (steps.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay suficientes datos para describir pasos detallados.";
    container.append(li);
    return;
  }

  steps.forEach((step) => {
    const li = document.createElement("li");

    if (step.type === "ride") {
      const prefix = showLabel ? "Alternativa · " : "";
      li.innerHTML = `<span class="line-pill" style="background:${step.color}">${step.lineId}</span>${prefix}Tomar ${step.lineName} en ${step.from} hacia ${step.direction} y bajar en ${step.to} (${step.stops} estaciones).`;
      container.append(li);
      return;
    }

    li.textContent = `Combinar en ${step.station} de ${step.fromLine} a ${step.toLine}.`;
    container.append(li);
  });
}

function renderError(message) {
  clearResults();
  emptyState.hidden = false;
  emptyState.innerHTML = `<p>${message}</p>`;
}

function clearResults() {
  resultState.hidden = true;
  emptyState.hidden = false;
  emptyState.innerHTML = "<p>Ingresa origen y destino para obtener la mejor alternativa de viaje.</p>";
  statsCards.innerHTML = "";
  bestRouteSteps.innerHTML = "";
  altRouteSteps.innerHTML = "";
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // En desarrollo local puede fallar por contexto no seguro.
    });
  });
}