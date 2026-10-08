"""Demonstração para o vídeo: dispara pedidos de reserva reais contra o sistema (modo demonstração)."""
import json, os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.path.insert(0, os.getcwd())
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
os.environ["COSEG_PERMITIR_DATA_PASSADA"] = "True"
import django; django.setup()
from django.conf import settings; settings.ALLOWED_HOSTS.append("testserver")
from django.core.management import call_command
from django.test import Client
from django.contrib.auth import get_user_model
from reservas.models import Veiculo, Reserva
import logging; logging.disable(logging.CRITICAL)
call_command("migrate", verbosity=0); call_command("seed_dados", verbosity=0)
Reserva.objects.exclude(solicitante__startswith="COSEG").delete()
U = get_user_model(); U.objects.filter(username="demo").delete()
U.objects.create_user("demo", password="Demo#2026xyz", is_staff=True)
c = Client(); c.post("/api/login/", json.dumps({"username": "demo", "password": "Demo#2026xyz"}), content_type="application/json")
vid = lambda cod: Veiculo.objects.get(codigo=cod).id
base = dict(solicitante="Maria Souza", setor="Operacoes", atividade="Reuniao externa", origem="Porto do Itaqui", destino="Centro")
def pedido(titulo, **kw):
    r = c.post("/api/reservas/", json.dumps({**base, **kw}), content_type="application/json"); j = r.json()
    if j.get("sucesso"): m = j["mensagem"] + f" Veiculo: {j['reserva']['veiculo']['codigo']}"
    else: m = next(iter(j["erros"].values()))[0]["message"]
    print(f"[{r.status_code}] {titulo:<30} {m[:100]}"); sys.stdout.flush()
print("Reserva existente: VL-01, 18/08/2026, 08h-10h (carga inicial do enunciado)\n")
pedido("VL-01 das 09h as 11h", veiculo=vid("VL-01"), data="2026-08-18", hora_saida="09:00", hora_retorno="11:00", passageiros=2)
pedido("VL-01 das 10h30 as 12h", veiculo=vid("VL-01"), data="2026-08-18", hora_saida="10:30", hora_retorno="12:00", passageiros=2)
pedido("VL-02 com 7 passageiros", veiculo=vid("VL-02"), data="2026-08-18", hora_saida="08:00", hora_retorno="09:00", passageiros=7)
pedido("Coletivo com 19 passageiros", categoria_pretendida="COLETIVO", data="2026-08-21", hora_saida="08:00", hora_retorno="09:00", passageiros=19)
pedido("Retorno antes da saida", veiculo=vid("VL-02"), data="2026-08-21", hora_saida="10:00", hora_retorno="09:00", passageiros=2)
pedido("So categoria LEVE, 3 pessoas", categoria_pretendida="LEVE", data="2026-08-18", hora_saida="08:30", hora_retorno="09:30", passageiros=3)
