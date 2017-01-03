folder=$(date '+%d-%b-%Y-%R')
mkdir $folder
cd $folder
mongodump -u techconnect -p techconnect --authenticationMechanism SCRAM-SHA-1 --authenticationDatabase admin --host 52.34.42.94 --port 5000