const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 200
const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 900
const cars = generateCars(N)
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01)
    }
  }
} else {
  // Melhor carro do percurso
  localStorage.setItem(
    "bestBrain",
    `{"levels":[{"inputs":[0,0,0,0.10831534980321866,0.4975403059755672],"outputs":[0,1,0,0,0,1],"biases":[0.120309617395194,-0.34129103312084147,-0.037985627887856185,0.13452974915147908,0.35390646383676805,0.12129272011259966],"weights":[[0.08225145498047075,-0.28303530839926455,0.19062424586064172,-0.08024370703477599,0.08574191813425248,-0.1354287105049907],[0.24176521808837156,0.04620737433037027,0.23796874416245906,-0.22545903993593416,0.07516468785153034,0.1309925852478583],[0.20871682352541848,-0.23886424624832545,-0.1910718716899538,-0.4175630315343972,0.13829433195653035,0.1826226108475104],[0.3892142327225433,-0.19702492189000165,-0.30579838559509603,0.22121774679111408,0.021560950556929834,0.06071829056308328],[-0.16972084508773666,-0.04438705050801913,-0.16436221760184191,-0.008212350808962413,-0.23799216133610923,0.24629971407939452]]},{"inputs":[0,1,0,0,0,1],"outputs":[1,1,0,0],"biases":[-0.03069300716270504,0.0260303086773769,0.1981865623490301,0.21340912540611737],"weights":[[0.0236664649855031,-0.07954228965502894,-0.2206189290001149,0.21672217790571707],[0.1386017731115231,0.015134478132699062,0.38400465194250527,0.12516770637392602],[-0.12485383049231849,-0.1551903314326227,0.21870530867703342,-0.2691780241031123],[-0.02453043092385999,0.27299483225845705,0.24371163386806338,-0.018065591951714064],[0.2552395744406107,0.17932675318471822,0.04425106472633123,0.30752473920224893],[-0.10123792550036147,0.17807461204818745,-0.21538550334247406,0.006979420474936004]]}]}`
  )
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1050, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1030, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1145, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1600, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1600, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1800, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1684, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1820, 30, 50, "DUMMY", 2, getRandomColor()),
]

animate()

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem("bestBrain")
}

function generateCars(N) {
  const cars = []
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
  }
  return cars
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [])
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic)
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

  road.draw(carCtx)
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx)
  }
  carCtx.globalAlpha = 0.2
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx)
  }
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, true)

  carCtx.restore()

  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  requestAnimationFrame(animate)
}
