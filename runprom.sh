docker rm prometheus && docker run --network host --name prometheus -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml -p 127.0.0.1:9090:9090 prom/prometheus
