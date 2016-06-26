chrome.app.runtime.onLaunched.addListener(function() {
 	chrome.app.window.create('index.html', {
    		'bounds': {
      			'width': 1000,
      			'height': 700
    			},
		state: 'normal', //maximized or fullscreen possible
		minWidth: 1000,
		minHeight: 700
  	});
});
