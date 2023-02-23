.DEFAULT_GOAL := deploy

deploy:
	@echo "Building and deploying the app..."

	@echo "Installing cert-manager..."
	kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml

	docker build -t node-app:1.0.0 .

	@echo "load image to k3d cluster..."
	k3d image import node-app:1.0.0 -c Edge
	
	@echo "Restarting app..."
	kubectl apply -f k8s/redis.yaml
	kubectl apply -f k8s/node-app.yaml

	@echo "Done!"

# delete kubernetes cluster
del:
	k3d cluster delete Edge

# create kubernetes cluster
cluster:
	k3d cluster create Edge --agents 4

# load image to k3d cluster
load:
	k3d image import node-app:1.0.0 -c Edge

restart:
	kubectl rollout restart deployment node-app -n app