chrome.app.runtime.onLaunched.addListener(function() {
 	chrome.app.window.create('index.html', {
    		'bounds': {
      			'width': 800,
      			'height': 600
    			},
		state: 'normal', //maximized or fullscreen possible
		minWidth: 800,
		minHeight: 600
  	});
});
