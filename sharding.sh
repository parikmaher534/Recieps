#!/bin/bash

INSTANCE_PATH="/data/instance"
INSTANCES_AMOUNT=2
PORTS_OFFSET=27005
COUNTER=0

run_mongod() {
	while [ $COUNTER -lt $INSTANCES_AMOUNT ]; do
		INSTANCE=$INSTANCE_PATH$COUNTER

		if [ -a "$INSTANCE" ]
		then
			echo "instance"$COUNTER" already exist"
		else
			sudo mkdir $INSTANCE
			echo "Created $INSTANCE."
		fi

		# Kill mongod process if it was running
		MONGOD_PID=$(<$INSTANCE/mongod.lock)
		sudo kill $MONGOD_PID
		sleep 2

		# Run mongod on current port
		sudo mongod --dbpath $INSTANCE --port $PORTS_OFFSET &
		echo "mongod at $PORTS_OFFSET port was running."

		let COUNTER=COUNTER+1
		let PORTS_OFFSET=PORTS_OFFSET+1
	done
}

run_mongod
