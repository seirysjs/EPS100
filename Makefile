VERSION = 0.0.1

run:
	npm run migrate
	npm run start

build-dev:
	docker build -t sheirys/putu-sandelys:dev \
		-f deploy/production/Dockerfile \
		--platform linux/amd64 .

push-dev:
	docker push sheirys/putu-sandelys:dev


build-prod:
	docker build -t sheirys/putu-sandelys:prod \
		-f deploy/production/Dockerfile \
		--platform linux/amd64 .

push-prod:
	docker push sheirys/putu-sandelys:prod


