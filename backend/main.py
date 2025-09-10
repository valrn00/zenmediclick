from fastapi import FastAPI
from routers import usuarios, citas, soporte

app = FastAPI(title="ZenMediClick API")

# Rutas
app.include_router(usuarios.router)
app.include_router(citas.router)
app.include_router(soporte.router)

@app.get("/")
def home():
    return {"mensaje": "API ZenMediClick funcionando"}
