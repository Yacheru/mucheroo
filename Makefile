docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
	docker system prune -fa
