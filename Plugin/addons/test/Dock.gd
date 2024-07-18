@tool
extends Control

@onready var http_request = $HTTPRequest
var UserID = ""
var url = "https://bpmwatch.onrender.com/heart"
	
var queue = []
var max_queue_size = 10

var averageBPM = 0;
var count = 0;


func _ready():
	pass

func _process(delta):
	pass

func _on_line_edit_text_submitted(new_text):
	UserID = new_text.to_lower( )

	url =  "https://bpmwatch.onrender.com/heart/" + UserID

func getBPM():
		if(UserID != ""):
			var http_request = HTTPRequest.new()
			add_child(http_request)
			http_request.request_completed.connect(self._http_request_completed)
			var error = http_request.request(url)
			if error != OK:
				push_error("An error occurred in the HTTP request.")
		else:
			print("Please enter User ID")

func _on_button_pressed():
	getBPM()
	

func _http_request_completed(result, response_code, headers, body):

	var json = JSON.new()
	json.parse(body.get_string_from_utf8())
	var response = json.get_data()

	if ($Timer.time_left > 0):
		averageBPM += response["bpm"]
	else:
		add_to_queue(response["bpm"])
		print(response["bpm"])


func add_to_queue(item):
	while len(queue) >= max_queue_size:
		queue.pop_front()
	if len(queue) < max_queue_size:
		queue.push_back(item)


func _on_button_2_pressed():
	print(queue)


func _on_button_3_pressed():
	averageBPM = 0
	count = 0

	$Timer.start()

	while $Timer.time_left > 1 && UserID != "":
		count += 1
		await get_tree().create_timer(1).timeout
		getBPM()
		print(round($Timer.time_left))
		

func _on_timer_timeout():
	print(count)
	averageBPM = round(averageBPM/count)
	print("The average BPM is " ,averageBPM)
