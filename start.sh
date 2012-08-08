#!/bash/sh
DIR="logs"
START=`date '+%Y_%m_%d'`
LOG_FILE="$DIR/log_$START.log"
mkdir $DIR 2>/dev/null
echo "Logging to: #$LOG_FILE";
node retweet.js >> $LOG_FILE &
echo "Started..."
ps ax | grep node
