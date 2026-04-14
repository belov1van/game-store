.PHONY: help \
        up up-build down down-volumes restart \
        logs logs-backend logs-frontend logs-db ps \
        migrate migrate-deploy seed db-push studio \
        install install-backend install-frontend \
        dev-backend dev-frontend

# ─── Colors ───────────────────────────────────────────────────────────────────
CYAN  = \033[0;36m
RESET = \033[0m

# ──────────────────────────────────────────────────────────────────────────────
help: ## Show this help
	@echo ""
	@echo "  Game Store — available commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ─── Docker ───────────────────────────────────────────────────────────────────
up: ## Start all containers (detached)
	docker compose up -d

up-build: ## Rebuild images and start all containers
	docker compose up -d --build

down: ## Stop and remove containers (keep volumes)
	docker compose down

down-volumes: ## Stop and remove containers AND volumes (⚠ deletes DB data)
	docker compose down -v

restart: ## Recreate all containers (picks up env/config changes)
	docker compose up -d --force-recreate

ps: ## Show status of all containers
	docker compose ps -a

# ─── Logs ─────────────────────────────────────────────────────────────────────
logs: ## Tail logs from all services
	docker compose logs -f

logs-backend: ## Tail backend logs
	docker compose logs -f backend

logs-frontend: ## Tail frontend logs
	docker compose logs -f frontend

logs-db: ## Tail database logs
	docker compose logs -f db

# ─── Database / Prisma ────────────────────────────────────────────────────────
migrate: ## Create and apply a new migration (usage: make migrate name=init)
	docker compose exec backend npx prisma migrate dev --name $(name)

migrate-deploy: ## Apply all pending migrations (production-style)
	docker compose exec backend npx prisma migrate deploy

seed: ## Seed the database with sample games
	docker compose exec -T backend npx ts-node prisma/seed.ts

db-push: ## Push schema to DB without migrations (quick dev sync)
	docker compose exec backend npx prisma db push

studio: ## Open Prisma Studio in the browser (port 5555)
	docker compose exec backend npx prisma studio --port 5555 --browser none & \
	sleep 2 && open http://localhost:5555 || xdg-open http://localhost:5555

# ─── Local development (without Docker) ──────────────────────────────────────
install: install-backend install-frontend ## Install dependencies for both services

install-backend: ## Install backend dependencies
	cd backend && npm install

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

dev-backend: ## Run backend locally (requires local Postgres via DATABASE_URL)
	cd backend && npm run dev

dev-frontend: ## Run frontend locally
	cd frontend && npm run dev
