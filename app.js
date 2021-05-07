(function init(){
	const form = document.getElementById('inputField');
	form.addEventListener("submit",  e => {handleSubmit(e)}, {once: true})

	function handleSubmit(e){
		//const eventName = document.getElementById('eventName');	
		const eventDate = document.getElementById('startDate');
		const eventTargetDate = Date.parse(eventDate.value);
		e.preventDefault();
		//form.style.display = 'none'
		document.getElementById('countdownDisplay').style.display = "block";

		let startCountdown = setInterval(processEvent, 1000, eventTargetDate, stopCountdown);
	}

	function processEvent(eventTargetDate, stopCountdown){
		const date = Date.now(); //holds the elapsed time since 1/1/1970 in milliseconds
		const UTCoffset = new Date().getTimezoneOffset()
		/**** evaluate if an optional event start time (ex. 3:00pm, 5:09pm, etc.) was added.
			  Otherwise, event start time defaults to 00:00:00 UTC on the specified date.
		 ****/
		const startTime = document.getElementById('startTime').value
		if(startTime)
			eventTargetDate += calculateOptionalStart(startTime)
		/**** Compares the difference in hours between the system timezone and UTC time.
			  (Ex. New York is UTC+4 or UTC+5 depending on daylight savings time, without
			  adjusting for the difference in time zone, the date 4/28/2021 UTC actually occurs at
			  8:00 PM on 4/27/2021 for a person currently in New York.)
		****/
		if (UTCoffset > 0)
			eventTargetDate = ((UTCoffset / 60) * 60 * 60 * 1000) + eventTargetDate 
		else
			eventTargetDate = eventTargetDate - (Math.abs(UTCoffset/60) * 60 *60 * 1000)

		//calculate the time in milliseconds until event starts
		let timeDifference = eventTargetDate - date
		const countdownDays = Math.floor( timeDifference/(1000*60*60*24) ) //convert milliseconds(ms) to days
		let countdownHours = Math.floor( (timeDifference/(1000*60*60) % 24) ) //convert ms to hours
		let countdownMinutes = Math.floor( (timeDifference/(1000*60) % 60) ) //convert ms to minutes
		let countdownSeconds = Math.floor( (timeDifference/(1000) % 60) )	//convert ms to seconds
		
		//add zeroes to the start of the number if necessary
		countdownHours < 10 ? countdownHours = countdownHours.toString().padStart(2, '0') : null
		countdownMinutes < 10 ? countdownMinutes = countdownMinutes.toString().padStart(2, '0') : null
		countdownSeconds < 10 ? countdownSeconds = countdownSeconds.toString().padStart(2, '0') : null  

		//update the DOM with the countdown results
		document.getElementById('dayCounter').innerText = `${eventName.value} starts in ${countdownDays} days`
		document.getElementById('clockCountdown').innerText = `${countdownHours} : ${countdownMinutes} : ${countdownSeconds}`
		document.getElementById('newEvent').style.display = "block"
		
		//check if the event has just started or already passed.
		//update the output if true and stops the countdown.
		if (eventTargetDate <= date){
			document.getElementById('dayCounter').innerText =`${eventName.value} has begun`
			document.getElementById('clockCountdown').innerText = ` `
			stopCountdown()
		}
	}
	
	function stopCountdown(){
		clearInterval(startCountdown)
	}

	/****	This function will calculate how many additional milliseconds(ms) to add
			if an optional start time was added to the event form. ****/
	function calculateOptionalStart(startTime){
		// destructuring the time to the format hh : mm
		let [x, y] = startTime.split(':')
		x = x * 60 * 60 * 1000 //converting the number of hours into milliseconds(ms)
		y = y * 60 * 1000	//coverting the number of seconds into ms
		return x + y //returning the additional time to add to the countdown in ms.
	}
 }())
