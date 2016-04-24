/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';


function startWebcam(videoSelector, errorSelector) {
	var videoElement = $(videoSelector)[0];

	var constraints = {
		audio: false,
		video: true
	};

	navigator.mediaDevices.getUserMedia(constraints)
	.then(function(stream) {

		var videoTracks = stream.getVideoTracks();
		console.log('Got stream with constraints:', constraints);
		console.log('Using video device: ' + videoTracks[0].label);
		stream.onended = function() {
			console.log('Stream ended');
		};
		videoElement.srcObject = stream;
	})
	.catch(function(error) {
		if (error.name === 'ConstraintNotSatisfiedError') {
			errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
					constraints.video.width.exact + ' px is not supported by your device.');
		} else if (error.name === 'PermissionDeniedError') {
			errorMsg('Permissions have not been granted to use your camera and ' +
				'microphone, you need to allow the page access to your devices in ' +
				'order for the demo to work.');
		}
		errorMsg('getUserMedia error: ' + error.name, error);
	});

	function errorMsg(msg, error) {
		$(errorSelector).append('<p>' + msg + '</p>');
		if (typeof error !== 'undefined') {
			console.error(error);
		}
	}
}



function captureImage(videoSelector, errorSelector, zoomFactor, stillSelector, inputSelector ) {
	// videoSelector: The VIDEO element with the stream
	// errorSelector: Error messages are dropped here
	// zoomFactor: 1 = original, 0.5 = half size
	// stillSelector: IMG element for captured image
	// inputSelector: INPUT element for form

	var videoElement = $(videoSelector)[0];

	var canvas = $('<canvas></canvas')[0];
	var ctx = canvas.getContext('2d');

	// Hier Größe einstellen
	canvas.width = videoElement.videoWidth * zoomFactor;
	canvas.height = videoElement.videoHeight * zoomFactor;
	// canvas.width = videoElement.videoWidth;
	// canvas.height = videoElement.videoHeight;

	ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
	//save canvas image as data url
	var dataURL = canvas.toDataURL('image/jpeg');
	console.log('Data length:', dataURL.length);
	//set preview image src to dataURL

	$(stillSelector).attr('src', dataURL);
	$(inputSelector).val(dataURL);
}

$(function() {
	startWebcam('#capturevideo', '#errorMsg');

	//Bind a click to a button to capture an image from the video stream
	$('#shutterbutton').click(function(){
		console.log("Shutter pressed.");
		captureImage('#capturevideo', '#errorMsg', 0.5, '#capture_result', '#capture_input' );
	});
});
