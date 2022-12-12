let img_input = document.getElementById('input_image');
let file_input = document.getElementById('file_input');
let resultsDiv = document.getElementById('resultsDiv');

file_input.addEventListener('change', (e) => {
    img_input.src = URL.createObjectURL(e.target.files[0])
}, false);

img_input.onload = function(){
    detectObjects();
}

function getSimulatedImage(){
    let a = Math.floor(Math.random() * 110);
    let path = '../SimulatedImages/' + a + '.jpg';
    img_input.src = path;
}

function detectObjects(){
    let imgDiv = document.getElementById('softwareDiv');
    let resultsDiv = document.getElementById('resultsDiv');
    imgDiv.style.display='none';
    resultsDiv.style.display='initial';

    let original_img = cv.imread(img_input);

    //
    cv.imshow('originalImage', original_img);

    let gray_img = new cv.Mat();
    let thresh_img = new cv.Mat();
    cv.cvtColor(original_img, gray_img, cv.COLOR_BGR2GRAY);
    cv.threshold(gray_img, thresh_img, 0,255,cv.THRESH_BINARY_INV+cv.THRESH_OTSU);
    let kernel = cv.Mat.ones(3,3,cv.CV_8U);


    let closing = new cv.Mat();
    cv.morphologyEx(thresh_img, closing, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    let sure_bg = new cv.Mat();
    cv.dilate(closing, sure_bg, kernel);

    //
    cv.imshow('sure_bg', sure_bg);
    
    let dist_transform = new cv.Mat();
    
    cv.distanceTransform(closing, dist_transform, cv.DIST_L2, 0);
    cv.normalize(dist_transform, dist_transform, 1, 0, cv.NORM_INF);

    //
    cv.imshow('distance_transform', dist_transform);

    let sure_fg = new cv.Mat();

    cv.threshold(dist_transform, sure_fg, 0.5, 255, 0)

    sure_fg.convertTo(sure_fg, cv.CV_8U, 1, 0);

    //
    cv.imshow('sure_fg', sure_fg);

    let unknown = new cv.Mat();
    
    cv.subtract(sure_bg, sure_fg, unknown);

    //
    cv.imshow('unknown', unknown);

    let markers = new cv.Mat();

    cv.connectedComponents(sure_fg, markers);

    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
            if (unknown.ucharPtr(i, j)[0] == 255) {
                markers.intPtr(i, j)[0] = 0;
            }
        }
    }

    let markers_norm = new cv.Mat();
    cv.normalize(markers, markers_norm, 0, 255, cv.NORM_MINMAX, cv.CV_8UC1, new cv.Mat());

    //
    cv.imshow('markers', markers_norm);

    cv.cvtColor(original_img, original_img, cv.COLOR_RGBA2RGB, 0);
    cv.watershed(original_img, markers);

    // draw barriers
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            if (markers.intPtr(i, j)[0] == -1) {
                original_img.ucharPtr(i, j)[0] = 255; // R
                original_img.ucharPtr(i, j)[1] = 0; // G
                original_img.ucharPtr(i, j)[2] = 0; // B
            }
        }
    }

    // get unique markers labels
    let markers_labels = new Set()
    for (let i = 0; i < markers.rows; i++) {
        for (let j = 0; j < markers.cols; j++) {
            markers_labels.add(markers.intPtr(i, j)[0]);
        }
    }

    
    var item;
    for (item of markers_labels.values()){
        document.getElementById("result").innerHTML = item-1;
    }

    //
    cv.imshow('outputImage', original_img);
}