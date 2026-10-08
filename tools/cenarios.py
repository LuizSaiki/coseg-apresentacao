"""Executa cenários reais contra o sistema COSEG (modo demonstração) e salva as respostas."""
import json, os, sys
sys.path.insert(0, "repo")
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
os.environ["COSEG_PERMITIR_DATA_PASSADA"] = "True"
import django; django.setup()
from django.conf import settings; settings.ALLOWED_HOSTS.append("testserver")
from django.core.management import call_command
from django.test import Client
from django.contrib.auth import get_user_model
call_command("migrate", verbosity=0)
call_command("seed_dados", verbosity=0)
U = get_user_model()
U.objects.filter(username="demo").delete()
U.objects.create_user("demo", password="Demo#2026xyz", is_staff=True)
c = Client(); c.post("/api/login/", json.dumps({"username":"demo","password":"Demo#2026xyz"}), content_type="application/json")
base = dict(solicitante="Maria Souza", setor="Operações", atividade="Reunião externa", origem="Porto do Itaqui", destino="Centro", observacoes="")
def post(nome, **kw):
    d = {**base, **kw}
    r = c.post("/api/reservas/", json.dumps(d), content_type="application/json")
    return {"cenario": nome, "envio": kw, "status": r.status_code, "resposta": r.json()}
out = []
out.append(post("Conflito (9h-11h vs 8h-10h)", veiculo=U and __import__("reservas.models",fromlist=["Veiculo"]).Veiculo.objects.get(codigo="VL-01").id, data="2026-08-18", hora_saida="09:00", hora_retorno="11:00", passageiros=2))
V = __import__("reservas.models",fromlist=["Veiculo"]).Veiculo
out.append(post("Sem conflito (10h30-12h)", veiculo=V.objects.get(codigo="VL-01").id, data="2026-08-18", hora_saida="10:30", hora_retorno="12:00", passageiros=2))
out.append(post("Capacidade (7 pessoas em leve)", veiculo=V.objects.get(codigo="VL-02").id, data="2026-08-18", hora_saida="08:00", hora_retorno="09:00", passageiros=7))
out.append(post("Acima de 18", categoria_pretendida="COLETIVO", data="2026-08-21", hora_saida="08:00", hora_retorno="09:00", passageiros=19))
out.append(post("Retorno antes da saída", veiculo=V.objects.get(codigo="VL-02").id, data="2026-08-21", hora_saida="10:00", hora_retorno="09:00", passageiros=2))
out.append(post("Atribuição automática por categoria", categoria_pretendida="LEVE", data="2026-08-18", hora_saida="08:30", hora_retorno="09:30", passageiros=3))
out.append(post("Campos obrigatórios", data="2026-08-21"))
r = c.get("/api/disponibilidade/?data=2026-08-18&saida=09:00&retorno=11:00&passageiros=3")
out.append({"cenario":"Disponibilidade 9h-11h, 3 pax","status":r.status_code,"resposta":r.json()})
json.dump(out, open("tools/cenarios.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
for o in out: print(o["cenario"], o["status"], json.dumps(o["resposta"], ensure_ascii=False)[:230])
