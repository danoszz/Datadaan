var logoDevign;



function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    logoDevign = loadModel('assets/img/logo_devign.obj', true);
    //Create random object
    bug = new Boxed();

}

function draw() {
    background(255, 239, 239);
    bug.move();
    bug.display();
}

function Boxed() {

    this.move = function () {
        //Automatic movement
        rotateZ(frameCount * 0.005);
        rotateX(frameCount * 0.005);
        rotateY(frameCount * 0.005);
//        //Mousemovement
        rotateY(map(mouseX, 0, width, 0, PI));
        rotateX(map(mouseY, 0, height, 0, PI));

        //Position object

        orbitControl();
    };

    this.display = function () {
        //Create object
        model(logoDevign);

        //Create lightning
        ambientLight(0, 0, 239);
        directionalLight(255, 177, 177, 0.1, -1, 0, sin(1 / 2));
        directionalLight(255, 177, 177, 0.1, 1, 0, sin(1));
    }
}
